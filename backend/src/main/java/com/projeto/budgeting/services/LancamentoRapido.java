package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.projeto.budgeting.model.TipoLancamento;

public record LancamentoRapido(
        TipoLancamento tipo,
        String descricao,
        BigDecimal valor,
        String categoria,
        LocalDate dataOcorrencia) {
}
