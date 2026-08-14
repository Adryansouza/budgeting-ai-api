package com.projeto.budgeting.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.budgeting.dto.SpeechRequest;
import com.projeto.budgeting.services.SpeechService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SpeechController {

    private final SpeechService speechService;

    @PostMapping("/speech")
    public ResponseEntity<byte[]> generateSpeech(@RequestBody SpeechRequest speechRequest) {
        byte[] audio = speechService.generateAudio(speechRequest.getText());

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=response.mp3")
                .body(audio);
    }

}
