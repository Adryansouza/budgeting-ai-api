package com.projeto.budgeting.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.projeto.budgeting.model.Lancamento;
import com.projeto.budgeting.model.TipoLancamento;
import com.projeto.budgeting.repository.RepositorioLancamento;

@ExtendWith(MockitoExtension.class)
class ServicoLancamentoTest {

    @Mock
    private RepositorioLancamento repository;

    @Test
    void deveNormalizarCategoriaAoRegistrarDespesa() {
        ServicoLancamento service = new ServicoLancamento(repository);
        when(repository.save(org.mockito.ArgumentMatchers.any(Lancamento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Lancamento saved = service.registrarDespesa(" Mercado ", new BigDecimal("25.50"), " Alimentacao ");

        assertThat(saved.getDescricao()).isEqualTo("Mercado");
        assertThat(saved.getCategoria()).isEqualTo("alimentacao");
        assertThat(saved.getTipo()).isEqualTo(TipoLancamento.DESPESA);
    }

    @Test
    void deveRegistrarReceitaComTipoReceita() {
        ServicoLancamento service = new ServicoLancamento(repository);
        when(repository.save(org.mockito.ArgumentMatchers.any(Lancamento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Lancamento salvo = service.registrarReceita(" Salario ", new BigDecimal("2600.00"), " Renda ");

        assertThat(salvo.getDescricao()).isEqualTo("Salario");
        assertThat(salvo.getCategoria()).isEqualTo("renda");
        assertThat(salvo.getTipo()).isEqualTo(TipoLancamento.RECEITA);
    }

    @Test
    void deveConsultarPeriodoIncluindoTodoODiaFinal() {
        ServicoLancamento service = new ServicoLancamento(repository);
        LocalDate start = LocalDate.of(2026, 8, 1);
        LocalDate end = LocalDate.of(2026, 8, 31);
        when(repository.somarPorTipoEPeriodo(TipoLancamento.DESPESA, start.atStartOfDay(), end.plusDays(1).atStartOfDay()))
                .thenReturn(new BigDecimal("120.00"));

        assertThat(service.calcularTotalDespesasPorPeriodo(start, end)).isEqualByComparingTo("120.00");
        verify(repository).somarPorTipoEPeriodo(TipoLancamento.DESPESA, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
    }
}
