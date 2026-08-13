package com.projeto.budgeting.services;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatModel chatModel;

    public ChatResponse chamarChatModel(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();
        String respostaDaIa = chatModel.call(userMessage);

        return new ChatResponse(respostaDaIa);
    }

}
