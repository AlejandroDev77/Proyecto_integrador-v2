package com.changuitostudio.backend.application.gateway;

public interface PasswordEncoderGateway {
    String encode(String rawPassword);
    boolean matches(String rawPassword, String encodedPassword);
}
