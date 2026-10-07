package com.projeto.budgeting.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import com.projeto.budgeting.model.TipoLancamento;

class InterpretadorFinanceiroRapidoTest {

    private final InterpretadorFinanceiroRapido interpretador = new InterpretadorFinanceiroRapido();

    @Test
    void deveInterpretarDespesaSimplesComDataRelativa() {
        LancamentoRapido resultado = interpretador.interpretar("gastei 77 reais na pizzaria ontem").orElseThrow();

        assertThat(resultado.tipo()).isEqualTo(TipoLancamento.DESPESA);
        assertThat(resultado.valor()).isEqualByComparingTo("77.00");
        assertThat(resultado.descricao()).isEqualTo("Pizzaria");
        assertThat(resultado.categoria()).isEqualTo("alimentacao");
        assertThat(resultado.dataOcorrencia()).isEqualTo(LocalDate.now().minusDays(1));
    }

    @Test
    void deveInterpretarDespesaSemPalavraReais() {
        LancamentoRapido resultado = interpretador.interpretar("paguei 35 no uber").orElseThrow();

        assertThat(resultado.tipo()).isEqualTo(TipoLancamento.DESPESA);
        assertThat(resultado.valor()).isEqualByComparingTo("35.00");
        assertThat(resultado.categoria()).isEqualTo("transporte");
    }

    @Test
    void deveInterpretarReceitaComMilharEDecimais() {
        LancamentoRapido resultado = interpretador.interpretar("recebi 2.500,50 de salario").orElseThrow();

        assertThat(resultado.tipo()).isEqualTo(TipoLancamento.RECEITA);
        assertThat(resultado.valor()).isEqualByComparingTo("2500.50");
        assertThat(resultado.categoria()).isEqualTo("renda");
    }

    @Test
    void deveDeixarMensagemAmbiguaParaOllama() {
        assertThat(interpretador.interpretar("gastei 77 numa coisa")).isEmpty();
    }
}
