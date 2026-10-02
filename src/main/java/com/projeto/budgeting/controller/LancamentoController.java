package com.projeto.budgeting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.projeto.budgeting.model.Lancamento;
import com.projeto.budgeting.services.ServicoLancamento;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/lancamentos") 
@RequiredArgsConstructor 

public class LancamentoController {
    
    private final ServicoLancamento servicoLancamento;

    @GetMapping
    public List<Lancamento> listar() {
        return servicoLancamento.listarDespesas();
    }

    

}


