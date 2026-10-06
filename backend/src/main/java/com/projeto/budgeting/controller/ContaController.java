package com.projeto.budgeting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.projeto.budgeting.dto.CadastroContaRequest;
import com.projeto.budgeting.dto.CadastroContaResponse;
import com.projeto.budgeting.services.ServicoConta;

import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor


@RequestMapping("/contas")
public class ContaController {

    private final ServicoConta servicoConta;

    
     @PostMapping
    public CadastroContaResponse cadastrarConta(@RequestBody CadastroContaRequest request) {
        return servicoConta.criarConta(request);
    }

    @GetMapping
    public List<CadastroContaResponse> listarContas() {
        return servicoConta.listarContas();
    }
    
}
