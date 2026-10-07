package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import com.projeto.budgeting.dto.ChatRequest;
import com.projeto.budgeting.dto.ChatResponse;
import com.projeto.budgeting.tools.FerramentasFinanceiras;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final FerramentasFinanceiras ferramentasFinanceiras;
    private final InterpretadorFinanceiroRapido interpretadorFinanceiroRapido;
    private final ServicoLancamento servicoLancamento;
    private final String systemPrompt;

    public ChatService(
            ChatClient.Builder chatClientBuilder,
            FerramentasFinanceiras ferramentasFinanceiras,
            InterpretadorFinanceiroRapido interpretadorFinanceiroRapido,
            ServicoLancamento servicoLancamento,
            @Value("classpath:prompts/financial-assistant-prompt.txt") Resource promptResource) throws IOException {
        this.chatClient = chatClientBuilder.build();
        this.ferramentasFinanceiras = ferramentasFinanceiras;
        this.interpretadorFinanceiroRapido = interpretadorFinanceiroRapido;
        this.servicoLancamento = servicoLancamento;
        this.systemPrompt = readPrompt(promptResource);
    }

    public ChatResponse chamarChatClient(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();

        return chamarChatClient(userMessage);
    }

    public ChatResponse chamarChatClient(String userMessage) {
        var interpretacaoRapida = interpretadorFinanceiroRapido.interpretar(userMessage);
        if (interpretacaoRapida.isPresent()) {
            LancamentoRapido lancamento = interpretacaoRapida.get();
            if (lancamento.tipo().name().equals("DESPESA")) {
                servicoLancamento.registrarDespesa(
                        lancamento.descricao(), lancamento.valor(), lancamento.categoria(), lancamento.dataOcorrencia());
            } else {
                servicoLancamento.registrarReceita(
                        lancamento.descricao(), lancamento.valor(), lancamento.categoria(), lancamento.dataOcorrencia());
            }
            return new ChatResponse(formatarConfirmacao(lancamento));
        }

        String respostaDaIa = chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .tools(ferramentasFinanceiras)
                .call()
                .content();

        return new ChatResponse(respostaDaIa);
    }

    private String formatarConfirmacao(LancamentoRapido lancamento) {
        String tipo = lancamento.tipo().name().equals("DESPESA") ? "Despesa" : "Receita";
        String valor = String.format(Locale.forLanguageTag("pt-BR"), "%.2f", lancamento.valor());
        return "%s registrada: %s | Categoria: %s | Valor: R$ %s."
                .formatted(tipo, lancamento.descricao(), lancamento.categoria(), valor);
    }

    private String readPrompt(Resource promptResource) throws IOException {
        byte[] promptBytes = FileCopyUtils.copyToByteArray(promptResource.getInputStream());
        return new String(promptBytes, StandardCharsets.UTF_8);
    }

}
