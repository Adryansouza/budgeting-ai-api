package com.projeto.budgeting.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;
import com.projeto.budgeting.tools.FinanceTools;

@Service
public class ChatService {

    private static final String SYSTEM_PROMPT = """
            Voce e um assistente financeiro pessoal.

            Regras:
            - Responda sempre em portugues brasileiro.
            - Use linguagem simples, clara e direta.
            - Nao invente gastos, valores, datas ou transacoes.
            - Se faltar valor, categoria ou descricao, faca uma pergunta curta.
            - Quando o usuario pedir para registrar uma despesa e informar descricao, valor e categoria, chame obrigatoriamente a ferramenta registrarDespesas.
            - Quando o usuario pedir para listar despesas, chame a ferramenta listarDespesas.
            - Quando o usuario perguntar o total gasto, chame a ferramenta calcularTotalDespesas.
            - Quando o usuario perguntar o total gasto em uma categoria, chame a ferramenta calcularTotalPorCategoria.
            - Nao peca confirmacao se descricao, valor e categoria ja estiverem presentes.
            - Nao diga que precisa do valor, descricao ou categoria quando eles ja estiverem na mensagem do usuario.
            - Quando a ferramenta registrarDespesas retornar sucesso, confirme a despesa registrada.
            - Nao diga que salvou no banco de dados se isso ainda nao existir.
            - Quando falar de dinheiro, deixe claro que voce nao substitui um consultor financeiro profissional.
            """;

    private final ChatClient chatClient;
    private final FinanceTools financeTools;

    public ChatService(ChatClient.Builder chatClientBuilder, FinanceTools financeTools) {
        this.chatClient = chatClientBuilder.build();
        this.financeTools = financeTools;
    }

    public ChatResponse chamarChatClient(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();

        String respostaDaIa = chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userMessage)
                .tools(financeTools)
                .call()
                .content();

        return new ChatResponse(respostaDaIa);
    }

}
