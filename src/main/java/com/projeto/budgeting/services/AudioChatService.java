package com.projeto.budgeting.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.projeto.budgeting.dto.AudioChatResult;
import com.projeto.budgeting.dto.ChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AudioChatService {

    private final TranscriptionService transcriptionService;
    private final ChatService chatService;
    private final SpeechService speechService;

    public AudioChatResult processAudioMessage(MultipartFile audioMessage) {
        String transcription = transcriptionService.transcribe(audioMessage);
        ChatResponse chatResponse = chatService.chamarChatClient(transcription);
        byte[] audio = speechService.generateAudio(chatResponse.getMessage());

        return new AudioChatResult(
                transcription,
                chatResponse.getMessage(),
                audio);
    }

}
