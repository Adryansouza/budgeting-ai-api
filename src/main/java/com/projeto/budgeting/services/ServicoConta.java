package com.projeto.budgeting.services;

import java.math.BigDecimal;
import java.util.List;

import com.projeto.budgeting.dto.CadastroContaRequest;
import com.projeto.budgeting.dto.CadastroContaResponse;
import com.projeto.budgeting.entity.ContaEntity;
import com.projeto.budgeting.repository.RepositorioConta;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicoConta {

    private final RepositorioConta repositorioConta;

    public CadastroContaResponse criarConta(CadastroContaRequest dados) {
        validarDados(dados);

        ContaEntity conta = new ContaEntity();
        conta.setNome(dados.getNome().trim());
        conta.setTipo(dados.getTipo());
        conta.setSaldoInicial(dados.getSaldoInicial());

        ContaEntity contaSalva = repositorioConta.save(conta);

        return transformarEmResponse(contaSalva);
    }

    public List<CadastroContaResponse> listarContas() {
        return repositorioConta.findAll().stream()
                .map(this::transformarEmResponse)
                .toList();
    }

    private CadastroContaResponse transformarEmResponse(ContaEntity conta) {
        return new CadastroContaResponse(
                conta.getId(),
                conta.getNome(),
                conta.getTipo(),
                conta.getSaldoInicial(),
                conta.getDataCriacao(),
                conta.getDataAtualizacao());
    }

    private void validarDados(CadastroContaRequest dados) {
        if (dados == null) {
            throw new IllegalArgumentException("Os dados da conta sao obrigatorios.");
        }

        if (dados.getNome() == null || dados.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da conta e obrigatorio.");
        }

        if (dados.getTipo() == null) {
            throw new IllegalArgumentException("O tipo da conta e obrigatorio.");
        }

        if (dados.getSaldoInicial() == null || dados.getSaldoInicial().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O saldo inicial deve ser zero ou maior.");
        }
    }
}
