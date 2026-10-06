package com.projeto.budgeting.services;

import com.projeto.budgeting.dto.UsuarioResponse;
import com.projeto.budgeting.entity.UsuarioEntity;
import com.projeto.budgeting.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obterPerfilLogado() {
        // Autenticação ainda não existe; mantém o usuário de desenvolvimento atual.
        Long idUsuarioLogado = 1L;
        return buscarPorId(idUsuarioLogado);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário com ID " + id + " não encontrado no sistema."));
        return new UsuarioResponse(usuario);
    }
}
