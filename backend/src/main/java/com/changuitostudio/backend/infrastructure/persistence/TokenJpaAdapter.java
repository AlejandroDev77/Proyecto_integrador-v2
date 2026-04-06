package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.gateway.TokenRepository;
import com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.persistence.entity.VerificationTokenEntity;
import com.changuitostudio.backend.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.changuitostudio.backend.infrastructure.persistence.repository.VerificationTokenJpaRepository;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class TokenJpaAdapter implements TokenRepository {

    private final VerificationTokenJpaRepository tokenJpaRepository;
    private final UsuarioJpaRepository usuarioJpaRepository;

    public TokenJpaAdapter(VerificationTokenJpaRepository tokenJpaRepository,
                           UsuarioJpaRepository usuarioJpaRepository) {
        this.tokenJpaRepository = tokenJpaRepository;
        this.usuarioJpaRepository = usuarioJpaRepository;
    }

    @Override
    public void guardarToken(String token, Long usuarioId, String tokenType, int horasExpiracion) {
        UsuarioEntity usuario = usuarioJpaRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        VerificationTokenEntity tokenEntity = new VerificationTokenEntity(
                token, usuario, LocalDateTime.now().plusHours(horasExpiracion), tokenType);
        tokenJpaRepository.save(tokenEntity);
    }

    @Override
    public Optional<TokenData> buscarPorToken(String token) {
        return tokenJpaRepository.findByToken(token)
                .map(entity -> new TokenData(
                        entity.getToken(),
                        entity.getUsuario().getIdUsu(),
                        entity.getTokenType(),
                        entity.isExpired()
                ));
    }

    @Override
    public void eliminarToken(String token) {
        tokenJpaRepository.findByToken(token).ifPresent(tokenJpaRepository::delete);
    }
}

