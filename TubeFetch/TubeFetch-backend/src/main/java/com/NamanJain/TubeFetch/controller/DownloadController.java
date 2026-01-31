package com.NamanJain.TubeFetch.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.NamanJain.TubeFetch.service.DownloadService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://tubefetch-yt.netlify.app/")
public class DownloadController {

    private final DownloadService downloadService;
    // Tracks progress using the URL as a key
    private final Map<String, Double> progressCache = new ConcurrentHashMap<>();

    @Autowired
    public DownloadController(DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    @PostMapping("/video-info")
    public ResponseEntity<Map<String, Object>> getVideoInfo(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        try {
            Map<String, Object> videoInfo = downloadService.getVideoInfo(url);
            return ResponseEntity.ok(videoInfo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/progress")
    public SseEmitter streamProgress(@RequestParam String url) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout
        String urlId = String.valueOf(url.hashCode());

        Thread thread = new Thread(() -> {
            try {
                Double lastSent = -1.0;
                while (true) {
                    Double progress = progressCache.getOrDefault(urlId, 0.0);
                    if (!progress.equals(lastSent)) {
                        emitter.send(SseEmitter.event().name("progress").data(progress));
                        lastSent = progress;
                    }
                    if (progress >= 100.0) break;
                    Thread.sleep(400); 
                }
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });
        thread.start();
        return emitter;
    }

    @PostMapping("/download")
    public void downloadVideo(@RequestBody Map<String, String> body, HttpServletResponse response) throws Exception {
        String url = body.get("url");
        String formatId = body.get("format");
        String title = body.getOrDefault("title", "video");
        String urlId = String.valueOf(url.hashCode());

        Path filePath = null;
        try {
            progressCache.put(urlId, 0.0);
            
            // Pass a listener to update the progressCache
            filePath = downloadService.downloadToTempFile(url, formatId, (p) -> {
                try {
                    progressCache.put(urlId, Double.parseDouble(p));
                } catch (Exception ignored) {}
            });

            String actualExtension = filePath.getFileName().toString()
                    .substring(filePath.getFileName().toString().lastIndexOf(".") + 1);
            String filename = title.replaceAll("[^a-zA-Z0-9.-]", "_") + "." + actualExtension;
            
            response.setContentType("application/octet-stream");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            response.setContentLengthLong(Files.size(filePath));

            Files.copy(filePath, response.getOutputStream());
            response.getOutputStream().flush();

        } finally {
            progressCache.remove(urlId);
            if (filePath != null) {
                Files.deleteIfExists(filePath);
                Files.deleteIfExists(filePath.getParent());
            }
        }
    }
}

