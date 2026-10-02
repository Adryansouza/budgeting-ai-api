package com.projeto.budgeting.tools;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import com.projeto.budgeting.model.Lancamento;
import com.projeto.budgeting.services.ServicoLancamento;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FerramentasFinanceiras {

    private final ServicoLancamento servicoLancamento;

    @Tool(description = "Registra imediatamente uma despesa financeira. Use quando o usuario informar um gasto com descricao e valor, mesmo que a categoria precise ser inferida pelo contexto, como farmacia=saude, mercado=alimentacao, uber=transporte.")
    public String registrarDespesas(
            @ToolParam(description = "Descricao curta da despesa. Exemplo: lanche, mercado, aluguel.") String descricao,
            @ToolParam(description = "Valor numerico da despesa em reais. Exemplo: 25.50") BigDecimal valor,
            @ToolParam(description = "Categoria da despesa. Exemplos: alimentacao, saude, transporte, moradia, compras, lazer, educacao.") String categoria) {
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

        Lancamento lancamento = servicoLancamento.registrarDespesa(descricao, valor, categoria);

        return "Despesa registrada com sucesso: " + lancamento.getDescricao()
                + " | Categoria: " + lancamento.getCategoria()
                + " | Valor: R$ " + lancamento.getValor();
    }

    @Tool(description = "Registra imediatamente uma receita financeira quando o usuario informar uma entrada com descricao e valor.")
    public String registrarReceita(
            @ToolParam(description = "Descricao curta da receita. Exemplos: salario, freelance, venda.") String descricao,
            @ToolParam(description = "Valor numerico da receita em reais. Exemplo: 2000.00") BigDecimal valor,
            @ToolParam(description = "Categoria da receita. Exemplos: renda, freelance, vendas.") String categoria) {
        
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

        Lancamento lancamento = servicoLancamento.registrarReceita(descricao, valor, categoria);

        return "Receita registrada com sucesso: " + lancamento.getDescricao()
                + " | Categoria: " + lancamento.getCategoria()
                + " | Valor: R$ " + lancamento.getValor();
    }

    @Tool(description = "Lista todas as despesas registradas ate o momento.")
    public String listarDespesas() {
        List<Lancamento> lancamentos = servicoLancamento.listarDespesas();

        if (lancamentos.isEmpty()) {
            return "Nenhuma despesa foi registrada ate o momento.";
        }

        StringBuilder resposta = new StringBuilder("Despesas registradas:");

        for (int i = 0; i < lancamentos.size(); i++) {
            Lancamento lancamento = lancamentos.get(i);
            resposta.append("\n")
                    .append(i + 1)
                    .append(". ")
                    .append(lancamento.getDescricao())
                    .append(" | Categoria: ")
                    .append(lancamento.getCategoria())
                    .append(" | Valor: R$ ")
                    .append(lancamento.getValor());
        }

        return resposta.toString();
    }

    @Tool(description = "Calcula o valor total de todas as despesas registradas.")
    public String calcularTotalDespesas() {
        BigDecimal total = servicoLancamento.calcularTotalDespesas();

        return "O total de despesas registradas e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas registradas em uma categoria especifica.")
    public String calcularTotalPorCategoria(
            @ToolParam(description = "Categoria que deve ser consultada. Exemplo: alimentacao, transporte, moradia.") String categoria) {
        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        BigDecimal total = servicoLancamento.calcularTotalPorCategoria(categoria);

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return "Nao encontrei despesas registradas na categoria " + categoria.trim().toLowerCase() + ".";
        }

        return "O total de despesas na categoria " + categoria.trim().toLowerCase() + " e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas do mes atual.")
    public String calcularTotalDespesasMesAtual() {
        BigDecimal total = servicoLancamento.calcularTotalDespesasNoMesAtual();

        return "O total de despesas deste mes e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas do mes atual em uma categoria especifica. Use para perguntas como: quanto gastei este mes com lazer?")
    public String calcularTotalPorCategoriaMesAtual(
            @ToolParam(description = "Categoria que deve ser consultada. Exemplo: lazer, alimentacao, transporte.") String categoria) {
        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        BigDecimal total = servicoLancamento.calcularTotalPorCategoriaNoMesAtual(categoria);

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return "Nao encontrei despesas deste mes na categoria " + categoria.trim().toLowerCase() + ".";
        }

        return "O total de despesas deste mes na categoria " + categoria.trim().toLowerCase() + " e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas do mes atual somando varias categorias. Informe as categorias separadas por virgula, como: lazer, alimentacao.")
    public String calcularTotalPorCategoriasMesAtual(
            @ToolParam(description = "Categorias separadas por virgula. Exemplo: lazer, alimentacao, transporte.") String categorias) {
        String erroCategorias = validarCategorias(categorias);
        if (erroCategorias != null) {
            return erroCategorias;
        }

        BigDecimal total = servicoLancamento.calcularTotalPorCategoriasNoMesAtual(categorias);

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return "Nao encontrei despesas deste mes nessas categorias.";
        }

        return "O total de despesas deste mes nas categorias " + categorias.trim().toLowerCase() + " e R$ " + total
                + ".";
    }

    @Tool(description = "Calcula o total de despesas entre duas datas. As datas devem estar no formato ISO yyyy-MM-dd.")
    public String calcularTotalPorPeriodo(
            @ToolParam(description = "Data inicial no formato yyyy-MM-dd. Exemplo: 2026-08-01.") String dataInicio,
            @ToolParam(description = "Data final no formato yyyy-MM-dd. Exemplo: 2026-08-31.") String dataFim) {
        DateRange dateRange = parseDateRange(dataInicio, dataFim);
        if (dateRange.errorMessage() != null) {
            return dateRange.errorMessage();
        }

        BigDecimal total = servicoLancamento.calcularTotalDespesasPorPeriodo(dateRange.start(), dateRange.end());

        return "O total de despesas entre " + dataInicio + " e " + dataFim + " e R$ " + total + ".";
    }

    @Tool(description = "Calcula o total de despesas de uma categoria entre duas datas. As datas devem estar no formato ISO yyyy-MM-dd.")
    public String calcularTotalPorCategoriaEPeriodo(
            @ToolParam(description = "Categoria que deve ser consultada. Exemplo: lazer, alimentacao, transporte.") String categoria,
            @ToolParam(description = "Data inicial no formato yyyy-MM-dd. Exemplo: 2026-08-01.") String dataInicio,
            @ToolParam(description = "Data final no formato yyyy-MM-dd. Exemplo: 2026-08-31.") String dataFim) {
        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        DateRange dateRange = parseDateRange(dataInicio, dataFim);
        if (dateRange.errorMessage() != null) {
            return dateRange.errorMessage();
        }

        BigDecimal total = servicoLancamento.calcularTotalPorCategoriaEPeriodo(
                categoria,
                dateRange.start(),
                dateRange.end());

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return "Nao encontrei despesas na categoria " + categoria.trim().toLowerCase()
                    + " entre " + dataInicio + " e " + dataFim + ".";
        }

        return "O total de despesas na categoria " + categoria.trim().toLowerCase()
                + " entre " + dataInicio + " e " + dataFim + " e R$ " + total + ".";
    }

    @Tool(description = "Lista as despesas do mes atual.")
    public String listarDespesasMesAtual() {
        List<Lancamento> transactions = servicoLancamento.listarDespesasNoMesAtual();

        return formatarListaDespesas(transactions, "Nenhuma despesa foi registrada neste mes.");
    }

    @Tool(description = "Lista as despesas do mes atual em uma categoria especifica.")
    public String listarDespesasPorCategoriaMesAtual(
            @ToolParam(description = "Categoria que deve ser consultada. Exemplo: lazer, alimentacao, transporte.") String categoria) {
        String erroCategoria = validarCategoria(categoria);
        if (erroCategoria != null) {
            return erroCategoria;
        }

        List<Lancamento> transactions = servicoLancamento.listarDespesasPorCategoriaNoMesAtual(categoria);

        return formatarListaDespesas(
                transactions,
                "Nenhuma despesa deste mes foi encontrada na categoria " + categoria.trim().toLowerCase() + ".");
    }

    private String validarDescricao(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            return "Nao consegui registrar o lancamento porque a descricao nao foi informada.";
        }

        return null;
    }

    private String validarValor(BigDecimal valor) {
        if (valor == null) {
            return "Nao consegui registrar o lancamento porque o valor nao foi informado.";
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            return "Nao consegui registrar o lancamento porque o valor precisa ser maior que zero.";
        }

        return null;
    }

    private String validarCategoria(String categoria) {
        if (categoria == null || categoria.isBlank()) {
            return "Nao consegui continuar porque a categoria nao foi informada.";
        }

        return null;
    }

    private String validarCategorias(String categorias) {
        if (categorias == null || categorias.isBlank()) {
            return "Nao consegui continuar porque as categorias nao foram informadas.";
        }

        return null;
    }

    private DateRange parseDateRange(String dataInicio, String dataFim) {
        if (dataInicio == null || dataInicio.isBlank() || dataFim == null || dataFim.isBlank()) {
            return new DateRange(null, null, "Nao consegui continuar porque as datas nao foram informadas.");
        }

        try {
            LocalDate start = LocalDate.parse(dataInicio.trim());
            LocalDate end = LocalDate.parse(dataFim.trim());

            if (end.isBefore(start)) {
                return new DateRange(null, null, "A data final precisa ser igual ou posterior a data inicial.");
            }

            return new DateRange(start, end, null);
        } catch (DateTimeParseException exception) {
            return new DateRange(null, null, "Nao consegui entender as datas. Use o formato yyyy-MM-dd.");
        }
    }

    private String formatarListaDespesas(List<Lancamento> transactions, String emptyMessage) {
        if (transactions.isEmpty()) {
            return emptyMessage;
        }

        StringBuilder resposta = new StringBuilder("Despesas encontradas:");

        for (int i = 0; i < transactions.size(); i++) {
            Lancamento transaction = transactions.get(i);
            resposta.append("\n")
                    .append(i + 1)
                    .append(". ")
                    .append(transaction.getDescricao())
                    .append(" | Categoria: ")
                    .append(transaction.getCategoria())
                    .append(" | Valor: R$ ")
                    .append(transaction.getValor());
        }

        return resposta.toString();
    }

    private record DateRange(LocalDate start, LocalDate end, String errorMessage) {
    }

}
