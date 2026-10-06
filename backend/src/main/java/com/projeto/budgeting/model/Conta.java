package com.projeto.budgeting.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Conta {

    private Long id;

    private String nome;

    private TipoConta tipo;

    private BigDecimal saldoInicial;

    private LocalDateTime dataCriacao;

    private LocalDateTime dataAtualizacao;
}
