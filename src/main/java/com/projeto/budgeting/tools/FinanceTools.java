package com.projeto.budgeting.tools;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import com.projeto.budgeting.model.Transaction;
import com.projeto.budgeting.services.TransactionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FinanceTools {

    private final TransactionService transactionService;

    @Tool(description = "Registra uma despesa financeira quando o usuario informar descricao, valor e categoria.")
    public String registrarDespesas(
            @ToolParam(description = "Descricao curta da despesa. Exemplo: lanche, mercado, aluguel.") String descricao,
            @ToolParam(description = "Valor numerico da despesa em reais. Exemplo: 25.50") BigDecimal valor,
            @ToolParam(description = "Categoria da despesa. Exemplo: alimentacao, transporte, moradia.") String categoria) {
        String erroDescricao = validarDescricao(descricao);
        if (erroDescricao != null) {
            return erroDescricao;
        }

        String erroValor = validarValor(valor);
        if (erroValor != null) {
            return erroValor;
        }

        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        Transaction transaction = transactionService.registerExpense(descricao, valor, categoria);

        return "Despesa registrada com sucesso: " + transaction.getDescription()
                + " | Categoria: " + transaction.getCategory()
                + " | Valor: R$ " + transaction.getAmount();
    }

    @Tool(description = "Lista todas as despesas registradas ate o momento.")
    public String listarDespesas() {
        List<Transaction> transactions = transactionService.listExpenses();

        if (transactions.isEmpty()) {
            return "Nenhuma despesa foi registrada ate o momento.";
        }

        StringBuilder resposta = new StringBuilder("Despesas registradas:");

        for (int i = 0; i < transactions.size(); i++) {
            Transaction transaction = transactions.get(i);
            resposta.append("\n")
                    .append(i + 1)
                    .append(". ")
                    .append(transaction.getDescription())
                    .append(" | Categoria: ")
                    .append(transaction.getCategory())
                    .append(" | Valor: R$ ")
                    .append(transaction.getAmount());
        }

        return resposta.toString();
    }

    @Tool(description = "Calcula o valor total de todas as despesas registradas.")
    public String calcularTotalDespesas() {
        BigDecimal total = transactionService.calculateTotalExpenses();

        return "O total de despesas registradas e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas registradas em uma categoria especifica.")
    public String calcularTotalPorCategoria(
            @ToolParam(description = "Categoria que deve ser consultada. Exemplo: alimentacao, transporte, moradia.") String categoria) {
        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        BigDecimal total = transactionService.calculateTotalByCategory(categoria);

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return "Nao encontrei despesas registradas na categoria " + categoria.trim().toLowerCase() + ".";
        }

        return "O total de despesas na categoria " + categoria.trim().toLowerCase() + " e R$ " + total + ".";
    }

    private String validarDescricao(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            return "Nao consegui registrar a despesa porque a descricao nao foi informada.";
        }

        return null;
    }

    private String validarValor(BigDecimal valor) {
        if (valor == null) {
            return "Nao consegui registrar a despesa porque o valor nao foi informado.";
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            return "Nao consegui registrar a despesa porque o valor precisa ser maior que zero.";
        }

        return null;
    }

    private String validarCategoria(String categoria) {
        if (categoria == null || categoria.isBlank()) {
            return "Nao consegui continuar porque a categoria nao foi informada.";
        }

        return null;
    }

}
