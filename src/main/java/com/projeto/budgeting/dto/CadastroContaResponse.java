package com.projeto.budgeting.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.projeto.budgeting.model.TipoConta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CadastroContaResponse {


    private Long id;
    private String nome;
    private TipoConta tipo;
    private BigDecimal saldoInicial;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    
}
