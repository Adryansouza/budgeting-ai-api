package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.projeto.budgeting.model.TipoLancamento;

@Service
public class InterpretadorFinanceiroRapido {

    private static final String VALOR = "(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{1,2})?|\\d+(?:,\\d{1,2})?)";
    private static final Pattern VALOR_COM_ACAO = Pattern.compile(
            "(?iu)\\b(?:gastei|paguei|comprei|deixei|saiu|foi|registra(?:r)?|anota(?:r)?|lança(?:r)?|marca(?:r)?|recebi|ganhei|vendi|entrou|adiciona(?:r)?)\\s+(?:r\\$\\s*)?"
                    + VALOR + "(?:\\s*(?:reais?|contos?))?");
    private static final Pattern DATA_NUMERICA = Pattern.compile("\\b(\\d{1,2})/(\\d{1,2})(?:/(\\d{4}))?\\b");
    private static final Pattern RECEITA = Pattern.compile("(?iu)\\b(recebi|ganhei|vendi|entrou|sal[aá]rio)\\b");
    private static final Pattern DESPESA = Pattern.compile("(?iu)\\b(gastei|paguei|comprei|deixei|saiu|foi|registra|anota|lança|marca)\\b");

    private static final List<RegraCategoria> CATEGORIAS = List.of(
            new RegraCategoria("alimentacao", "Pizzaria", "pizzaria", "pizza", "restaurante", "lanche", "mercado", "ifood", "comida"),
            new RegraCategoria("transporte", "Uber", "uber", "onibus", "ônibus", "gasolina", "posto", "estacionamento"),
            new RegraCategoria("saude", "Farmácia", "farmacia", "farmácia", "remedio", "remédio", "consulta", "exame"),
            new RegraCategoria("moradia", "Internet", "aluguel", "internet", "luz", "agua", "água", "telefone"),
            new RegraCategoria("lazer", "Lazer", "cinema", "streaming", "jogo", "passeio"),
            new RegraCategoria("educacao", "Educação", "curso", "escola", "livro", "faculdade"),
            new RegraCategoria("compras", "Compras", "roupa", "tenis", "tênis", "acessorio", "acessório"),
            new RegraCategoria("renda", "Salário", "salario", "salário"),
            new RegraCategoria("freelance", "Freelance", "freela", "freelance"),
            new RegraCategoria("vendas", "Venda", "venda"));

    public Optional<LancamentoRapido> interpretar(String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            return Optional.empty();
        }

        TipoLancamento tipo = identificarTipo(mensagem);
        if (tipo == null) {
            return Optional.empty();
        }

        Matcher valorMatcher = VALOR_COM_ACAO.matcher(mensagem);
        if (!valorMatcher.find()) {
            return Optional.empty();
        }

        RegraCategoria regra = identificarCategoria(mensagem, tipo);
        if (regra == null) {
            return Optional.empty();
        }

        return Optional.of(new LancamentoRapido(
                tipo,
                regra.descricao(),
                converterValor(valorMatcher.group(1)),
                regra.categoria(),
                identificarData(mensagem)));
    }

    private TipoLancamento identificarTipo(String mensagem) {
        if (RECEITA.matcher(mensagem).find()) {
            return TipoLancamento.RECEITA;
        }
        return DESPESA.matcher(mensagem).find() ? TipoLancamento.DESPESA : null;
    }

    private RegraCategoria identificarCategoria(String mensagem, TipoLancamento tipo) {
        String mensagemNormalizada = mensagem.toLowerCase(Locale.ROOT);
        for (RegraCategoria regra : CATEGORIAS) {
            if (tipo == TipoLancamento.RECEITA && !regra.categoria().equals("renda")
                    && !regra.categoria().equals("freelance") && !regra.categoria().equals("vendas")) {
                continue;
            }
            if (tipo == TipoLancamento.DESPESA && (regra.categoria().equals("renda")
                    || regra.categoria().equals("freelance") || regra.categoria().equals("vendas"))) {
                continue;
            }
            if (Arrays.stream(regra.termos()).anyMatch(mensagemNormalizada::contains)) {
                return regra;
            }
        }
        return null;
    }

    private BigDecimal converterValor(String valor) {
        String valorNormalizado = valor.replace(".", "").replace(',', '.');
        return new BigDecimal(valorNormalizado);
    }

    private LocalDate identificarData(String mensagem) {
        String normalizada = mensagem.toLowerCase(Locale.ROOT);
        LocalDate hoje = LocalDate.now();
        if (normalizada.contains("anteontem")) {
            return hoje.minusDays(2);
        }
        if (normalizada.contains("ontem")) {
            return hoje.minusDays(1);
        }

        Matcher dataMatcher = DATA_NUMERICA.matcher(mensagem);
        if (dataMatcher.find()) {
            try {
                int dia = Integer.parseInt(dataMatcher.group(1));
                int mes = Integer.parseInt(dataMatcher.group(2));
                int ano = dataMatcher.group(3) == null ? hoje.getYear() : Integer.parseInt(dataMatcher.group(3));
                return LocalDate.of(ano, mes, dia);
            } catch (DateTimeException ignored) {
                // Datas inválidas não impedem um registro simples; usa a data atual.
            }
        }
        return hoje;
    }

    private record RegraCategoria(String categoria, String descricao, String... termos) {
    }
}
