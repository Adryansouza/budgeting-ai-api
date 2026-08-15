package com.projeto.budgeting.tools;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.projeto.budgeting.services.TransactionService;

@ExtendWith(MockitoExtension.class)
class FinanceToolsTest {

    @Mock
    private TransactionService transactionService;

    @Test
    void naoDeveRegistrarValorNegativo() {
        FinanceTools tools = new FinanceTools(transactionService);

        String response = tools.registrarDespesas("Mercado", new BigDecimal("-10"), "alimentacao");

        assertThat(response).contains("maior que zero");
        verify(transactionService, never()).registerExpense(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void deveRejeitarIntervaloInvertido() {
        FinanceTools tools = new FinanceTools(transactionService);

        String response = tools.calcularTotalPorPeriodo("2026-08-31", "2026-08-01");

        assertThat(response).contains("data final");
    }
}
