package com.projeto.budgeting.dto;

import java.math.BigDecimal;

public record ResumoFinanceiroResponse(
        BigDecimal saldoGeral,
        BigDecimal totalReceitas,
        BigDecimal totalDespesas
) {
}