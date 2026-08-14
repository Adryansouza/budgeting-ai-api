package com.projeto.budgeting.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descricao", nullable = false)
    private String description;

    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TransactionType type;

    @Column(name = "categoria", nullable = false)
    private String category;

    @Column(name = "data_ocorrencia", nullable = false)
    private LocalDateTime occurredAt;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime createdAt;

    public Transaction(String description, BigDecimal amount, String category) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.type = TransactionType.DESPESA;
        this.occurredAt = LocalDateTime.now();
    }

    @PrePersist
    void prePersist() {
        if (type == null) {
            type = TransactionType.DESPESA;
        }

        if (occurredAt == null) {
            occurredAt = LocalDateTime.now();
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

}
