package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;
import com.projeto.budgeting.tools.FinanceTools;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final FinanceTools financeTools;
    private final String systemPrompt;

    public ChatService(
            ChatClient.Builder chatClientBuilder,
            FinanceTools financeTools,
            @Value("classpath:prompts/financial-assistant-prompt.txt") Resource promptResource) throws IOException {
        this.chatClient = chatClientBuilder.build();
        this.financeTools = financeTools;
        this.systemPrompt = readPrompt(promptResource);
    }

    public ChatResponse chamarChatClient(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();

        return chamarChatClient(userMessage);
    }

    public ChatResponse chamarChatClient(String userMessage) {
        String respostaDaIa = chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .tools(financeTools)
                .call()
                .content();

        return new ChatResponse(respostaDaIa);
    }

    private String readPrompt(Resource promptResource) throws IOException {
        byte[] promptBytes = FileCopyUtils.copyToByteArray(promptResource.getInputStream());
        return new String(promptBytes, StandardCharsets.UTF_8);
    }

}
