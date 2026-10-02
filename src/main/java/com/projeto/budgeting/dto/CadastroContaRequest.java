package com.projeto.budgeting.dto;

import java.math.BigDecimal;

import com.projeto.budgeting.model.TipoConta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CadastroContaRequest {
    
    private String nome;
    private TipoConta tipo;
    private BigDecimal saldoInicial;

}
