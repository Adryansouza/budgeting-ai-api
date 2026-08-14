package com.projeto.budgeting.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.projeto.budgeting.dto.AudioChatResult;
import com.projeto.budgeting.services.AudioChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AudioChatController {

    private final AudioChatService audioChatService;

    @PostMapping("/audio-chat")
    public ResponseEntity<byte[]> audioChat(@RequestParam("audioMessage") MultipartFile audioMessage) {
        AudioChatResult result = audioChatService.processAudioMessage(audioMessage);

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=audio-chat-response.mp3")
                .header("X-Transcription", encodeHeader(result.getTranscription()))
                .header("X-Assistant-Message", encodeHeader(result.getMessage()))
                .body(result.getAudio());
    }

    private String encodeHeader(String value) {
        if (value == null) {
            return "";
        }

        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

}
