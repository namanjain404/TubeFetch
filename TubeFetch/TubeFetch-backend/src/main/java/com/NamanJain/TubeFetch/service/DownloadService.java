package com.NamanJain.TubeFetch.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DownloadService {

	@Value("${yt-dlp.path}")
	private String ytDlpPath;
	
	@Value("${ffmpeg.path}")
	private String ffmpegPath;

	public String buildFilename(String title, String extension) {
		String safeTitle = title.replaceAll("[\\\\/:*?\"<>|]", "_");
		return safeTitle + "." + extension;
	}

	@Cacheable(value = "videoInfo")
	@SuppressWarnings("unchecked")
	public Map<String, Object> getVideoInfo(String url) throws IOException, InterruptedException {
		// Dump JSON info
		Process process = new ProcessBuilder(ytDlpPath, "--dump-json", "--no-playlist", "--no-warnings", url).start();

		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> fullInfo;

		try (InputStream is = process.getInputStream()) {
			fullInfo = mapper.readValue(is, Map.class);
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse yt-dlp output.");
		}

		Map<String, Object> info = new HashMap<>();
		info.put("title", fullInfo.get("title"));
		info.put("thumbnail", fullInfo.get("thumbnail"));

		// Duration Logic
		Object durationObj = fullInfo.get("duration");
		if (durationObj instanceof Number) {
			int totalSeconds = ((Number) durationObj).intValue();
			info.put("duration", String.format("%d:%02d", totalSeconds / 60, totalSeconds % 60));
		}

		// --- IMPROVED FORMAT FILTERING ---
		List<Map<String, Object>> allFormats = (List<Map<String, Object>>) fullInfo.get("formats");
		List<Map<String, Object>> filteredFormats = new ArrayList<>();
		Set<Integer> seenHeights = new HashSet<>();

		if (allFormats != null) {
			for (Map<String, Object> f : allFormats) {
				Object heightObj = f.get("height");
				Object vcodec = f.get("vcodec");
				
				// Ensure it is a video stream (vcodec != 'none')
				if (heightObj != null && vcodec != null && !vcodec.equals("none")) {
					int h = ((Number) heightObj).intValue();

					// Look for standard qualities. Note: We DO NOT filter by 'ext' here!
					if ((h == 360 || h == 720 || h == 1080) && !seenHeights.contains(h)) {
						Map<String, Object> cleanFormat = new HashMap<>();
						cleanFormat.put("formatId", f.get("format_id"));
						cleanFormat.put("quality", h + "p");
						cleanFormat.put("ext", "mp4"); // We tell frontend it WILL be mp4 after merging
						filteredFormats.add(cleanFormat);
						seenHeights.add(h);
					}
				}
			}
		}

		// Sort by quality descending (1080p first)
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

	    // CRITICAL: We use formatId + bestaudio to ensure high quality video gets sound
	    ProcessBuilder pb = new ProcessBuilder(
	    	    ytDlpPath,
	    	    "--ffmpeg-location", ffmpegPath,
	    	    "--newline",
	    	    "--progress",
	    	    "--extractor-args", "youtube:player_client=android,web;player_skip=web",
	    	    // This string says: "Try requested format + best audio, 
	    	    // if that fails try best video + best audio, 
	    	    // if that fails just get the best single file"
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
	            
	            // If it starts merging, jump progress to 99%
	            if (line.toLowerCase().contains("merging")) {
	                progressListener.accept("99.0");
	            }
	        }
	    }

	    int exitCode = process.waitFor();
	    if (exitCode != 0) {
	        throw new RuntimeException("yt-dlp failed with exit code " + exitCode);
	    }

	    return Files.list(tempDir)
	                .filter(p -> p.toString().endsWith(".mp4"))
	                .findFirst()
	                .orElseThrow(() -> new IOException("MP4 file not found in temp directory"));
	}
}
