package com.projeto.budgeting.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.projeto.budgeting.model.TipoConta;

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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contas")
@Getter
@Setter
@NoArgsConstructor
public class ContaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoConta tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoInicial;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private LocalDateTime dataAtualizacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_contas_usuario"))
    private UsuarioEntity usuario;

    @PrePersist
    void antesDeSalvar() {
        LocalDateTime agora = LocalDateTime.now();
        dataCriacao = agora;
        dataAtualizacao = agora;
    }

    @PreUpdate
    void antesDeAtualizar() {
        dataAtualizacao = LocalDateTime.now();
    }
}
