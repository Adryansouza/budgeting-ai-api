package com.projeto.budgeting.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;

@Service
public class ChatService {

    private static final String SYSTEM_PROMPT = """
            Voce e um assistente financeiro pessoal.
            Responda sempre em portugues brasileiro.
            Explique de forma simples, como para uma pessoa leiga.
            Seja direto e pratico.
            Nao invente gastos, valores, datas ou transacoes.
            Quando faltarem informacoes, faca uma pergunta curta para esclarecer.
            Quando falar de dinheiro, deixe claro que voce nao substitui um consultor financeiro profissional.
            """;

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public ChatResponse chamarChatClient(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();

        String respostaDaIa = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userMessage)
                .call()
                .content();

        return new ChatResponse(respostaDaIa);
    }

}
