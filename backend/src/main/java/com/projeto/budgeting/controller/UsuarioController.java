
package com.projeto.budgeting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.budgeting.dto.UsuarioResponse;
import com.projeto.budgeting.services.UsuarioService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/perfil")
    public UsuarioResponse obterPerfilLogado() {
        return usuarioService.obterPerfilLogado();
    }
}
