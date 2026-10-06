package com.projeto.budgeting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.budgeting.dto.ResumoFinanceiroResponse;
import com.projeto.budgeting.services.ServicoLancamento;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/resumo")
@RequiredArgsConstructor
public class ResumoController {

    private final ServicoLancamento servicoLancamento;

    @GetMapping
    public ResumoFinanceiroResponse obterResumo() {
        return new ResumoFinanceiroResponse(
                servicoLancamento.calcularSaldoGeral(),
                servicoLancamento.calcularTotalReceitas(),
                servicoLancamento.calcularTotalDespesas()
        );
    }
}