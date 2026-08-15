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

import com.projeto.budgeting.model.Transaction;
import com.projeto.budgeting.model.TransactionType;
import com.projeto.budgeting.repository.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Test
    void deveNormalizarCategoriaAoRegistrarDespesa() {
        TransactionService service = new TransactionService(repository);
        when(repository.save(org.mockito.ArgumentMatchers.any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Transaction saved = service.registerExpense(" Mercado ", new BigDecimal("25.50"), " Alimentacao ");

        assertThat(saved.getDescription()).isEqualTo("Mercado");
        assertThat(saved.getCategory()).isEqualTo("alimentacao");
        assertThat(saved.getType()).isEqualTo(TransactionType.DESPESA);
    }

    @Test
    void deveConsultarPeriodoIncluindoTodoODiaFinal() {
        TransactionService service = new TransactionService(repository);
        LocalDate start = LocalDate.of(2026, 8, 1);
        LocalDate end = LocalDate.of(2026, 8, 31);
        when(repository.sumByTypeAndPeriod(TransactionType.DESPESA, start.atStartOfDay(), end.plusDays(1).atStartOfDay()))
                .thenReturn(new BigDecimal("120.00"));

        assertThat(service.calculateTotalExpensesByPeriod(start, end)).isEqualByComparingTo("120.00");
        verify(repository).sumByTypeAndPeriod(TransactionType.DESPESA, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
    }
}
