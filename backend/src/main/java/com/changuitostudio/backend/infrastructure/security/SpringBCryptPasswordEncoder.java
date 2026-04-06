package com.changuitostudio.backend.infrastructure.security;

import com.changuitostudio.backend.application.gateway.PasswordEncoderGateway;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class SpringBCryptPasswordEncoder implements PasswordEncoderGateway {

    private final BCryptPasswordEncoder passwordEncoder;

    public SpringBCryptPasswordEncoder() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
