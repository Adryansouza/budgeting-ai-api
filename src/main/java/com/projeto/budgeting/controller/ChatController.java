package com.projeto.budgeting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;
import com.projeto.budgeting.services.ChatService;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/chat")
    public ChatResponse userMessage(@RequestBody ChatRequest chatRequest) {
        return chatService.chamarChatModel(chatRequest);
    }

}
