package com.projeto.budgeting.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.projeto.budgeting.dto.AudioMessageResponse;
import com.projeto.budgeting.services.TranscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TranscriptionController {

    private final TranscriptionService transcriptionService;

    @PostMapping("/transcriptions")
    public AudioMessageResponse audioMessage(@RequestParam("audioMessage") MultipartFile audioMessage) {
        return transcriptionService.receiveAudio(audioMessage);
    }

}
