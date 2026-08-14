package com.projeto.budgeting.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.projeto.budgeting.dto.AudioChatResult;
import com.projeto.budgeting.dto.AudioMessageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AudioChatService {

    private final TranscriptionService transcriptionService;
    private final SpeechService speechService;

    public AudioChatResult processAudioMessage(MultipartFile audioMessage) {
        AudioMessageResponse audioMessageResponse = transcriptionService.receiveAudio(audioMessage);
        byte[] audio = speechService.generateAudio(audioMessageResponse.getMessage());

        return new AudioChatResult(
                audioMessageResponse.getTranscription(),
                audioMessageResponse.getMessage(),
                audio);
    }

}
