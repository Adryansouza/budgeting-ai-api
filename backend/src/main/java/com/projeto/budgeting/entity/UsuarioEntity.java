package com.projeto.budgeting.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.projeto.budgeting.model.Lancamento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 254)
    private String email;

    /** Permanece nula até a implementação da autenticação. Nunca armazenar senha em texto puro. */
    @Column(name = "senha", nullable = true, length = 255)
    private String senha;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<ContaEntity> contas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Lancamento> lancamentos = new ArrayList<>();
}
