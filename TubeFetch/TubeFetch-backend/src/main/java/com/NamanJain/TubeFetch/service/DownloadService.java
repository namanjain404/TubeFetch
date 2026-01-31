package com.NamanJain.TubeFetch.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DownloadService {

	@Value("${yt-dlp.path}")
	private String ytDlpPath;

	@Value("${ffmpeg.path}")
	private String ffmpegPath;

	// Common User-Agent to avoid immediate blocking
	private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

	public String buildFilename(String title, String extension) {
		String safeTitle = title.replaceAll("[\\\\/:*?\"<>|]", "_");
		return safeTitle + "." + extension;
	}

	@Cacheable(value = "videoInfo")
	@SuppressWarnings("unchecked")
	public Map<String, Object> getVideoInfo(String url) throws IOException, InterruptedException {

		// Use ProcessBuilder to capture both streams
		ProcessBuilder pb = new ProcessBuilder(
				ytDlpPath,
				"--dump-json",
				"--no-playlist",
				"--no-warnings",
				"--user-agent", USER_AGENT,
				url
		);

		Process process = pb.start();

		// Read Input Stream (Success data) and Error Stream (Failure data)
		String output;
		String error;
		try (InputStream is = process.getInputStream(); InputStream es = process.getErrorStream()) {
			output = StreamUtils.copyToString(is, StandardCharsets.UTF_8);
			error = StreamUtils.copyToString(es, StandardCharsets.UTF_8);
		}

		int exitCode = process.waitFor();

		if (exitCode != 0 || output.isEmpty()) {
			System.err.println("YT-DLP EXIT CODE: " + exitCode);
			System.err.println("YT-DLP ERROR: " + error);
			throw new RuntimeException("yt-dlp failed: " + (error.isEmpty() ? "No output" : error));
		}

		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> fullInfo;

		try {
			fullInfo = mapper.readValue(output, Map.class);
		} catch (Exception e) {
			System.err.println("JSON Parsing failed. Raw output: " + output);
			throw new RuntimeException("Failed to parse yt-dlp JSON response.");
		}

		Map<String, Object> info = new HashMap<>();
		info.put("title", fullInfo.get("title"));
		info.put("thumbnail", fullInfo.get("thumbnail"));

		Object durationObj = fullInfo.get("duration");
		if (durationObj instanceof Number) {
			int totalSeconds = ((Number) durationObj).intValue();
			info.put("duration", String.format("%d:%02d", totalSeconds / 60, totalSeconds % 60));
		}

		List<Map<String, Object>> allFormats = (List<Map<String, Object>>) fullInfo.get("formats");
		List<Map<String, Object>> filteredFormats = new ArrayList<>();
		Set<Integer> seenHeights = new HashSet<>();

		if (allFormats != null) {
			for (Map<String, Object> f : allFormats) {
				Object heightObj = f.get("height");
				Object vcodec = f.get("vcodec");

				if (heightObj != null && vcodec != null && !vcodec.equals("none")) {
					int h = ((Number) heightObj).intValue();
					if ((h == 360 || h == 720 || h == 1080) && !seenHeights.contains(h)) {
						Map<String, Object> cleanFormat = new HashMap<>();
						cleanFormat.put("formatId", f.get("format_id"));
						cleanFormat.put("quality", h + "p");
						cleanFormat.put("ext", "mp4");
						filteredFormats.add(cleanFormat);
						seenHeights.add(h);
					}
				}
			}
		}

		filteredFormats.sort((a, b) -> {
			int h1 = Integer.parseInt(((String) a.get("quality")).replace("p", ""));
			int h2 = Integer.parseInt(((String) b.get("quality")).replace("p", ""));
			return Integer.compare(h2, h1);
		});

		if (filteredFormats.isEmpty()) {
			Map<String, Object> best = new HashMap<>();
			best.put("formatId", "bestvideo+bestaudio/best");
			best.put("quality", "Best Quality");
			best.put("ext", "mp4");
			filteredFormats.add(best);
		}

		info.put("formats", filteredFormats);
		return info;
	}

	public Path downloadToTempFile(String url, String formatId, Consumer<String> progressListener) throws IOException, InterruptedException {
		Path tempDir = Files.createTempDirectory("tubefetch_" + UUID.randomUUID());
		String outputTemplate = tempDir.toAbsolutePath().toString() + "/video.%(ext)s";

		ProcessBuilder pb = new ProcessBuilder(
				ytDlpPath,
				"--ffmpeg-location", ffmpegPath,
				"--newline",
				"--progress",
				"--user-agent", USER_AGENT,
				"--extractor-args", "youtube:player_client=android,web;player_skip=web",
				"-f", formatId + "+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
				"--merge-output-format", "mp4",
				"-o", outputTemplate,
				url
		);

		pb.redirectErrorStream(true);
		Process process = pb.start();

		Pattern percentPattern = Pattern.compile("\\[download\\]\\s+([\\d\\.]+)%");

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
			String line;
			while ((line = reader.readLine()) != null) {
				System.out.println("YT-DLP LOG: " + line);
				Matcher matcher = percentPattern.matcher(line);
				if (matcher.find()) {
					progressListener.accept(matcher.group(1));
				}
				if (line.toLowerCase().contains("merging")) {
					progressListener.accept("99.0");
				}
			}
		}

		int exitCode = process.waitFor();
		if (exitCode != 0) {
			throw new RuntimeException("yt-dlp download failed with exit code " + exitCode);
		}

		return Files.list(tempDir)
				.filter(p -> p.toString().endsWith(".mp4"))
				.findFirst()
				.orElseThrow(() -> new IOException("MP4 file not found after download process completed."));
	}
}