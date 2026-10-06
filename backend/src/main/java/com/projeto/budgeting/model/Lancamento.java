package com.projeto.budgeting.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projeto.budgeting.entity.UsuarioEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoLancamento tipo;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "data_ocorrencia", nullable = false)
    private LocalDateTime dataOcorrencia;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_transacoes_usuario"))
    private UsuarioEntity usuario;

    public Lancamento(String descricao, BigDecimal valor, String categoria) {
        this(descricao, valor, categoria, TipoLancamento.DESPESA);
    }

    public Lancamento(String descricao, BigDecimal valor, String categoria, TipoLancamento tipo) {
        this.descricao = descricao;
        this.valor = valor;
        this.categoria = categoria;
        this.tipo = tipo;
        this.dataOcorrencia = LocalDateTime.now();
    }

    @PrePersist
    void prePersist() {
        if (tipo == null) {
            tipo = TipoLancamento.DESPESA;
        }

        if (dataOcorrencia == null) {
            dataOcorrencia = LocalDateTime.now();
        }

        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
    }

}
