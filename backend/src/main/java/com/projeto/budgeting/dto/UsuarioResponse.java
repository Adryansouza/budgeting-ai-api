package com.projeto.budgeting.dto;

import com.projeto.budgeting.entity.UsuarioEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;

    public UsuarioResponse(UsuarioEntity usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
    }
}
