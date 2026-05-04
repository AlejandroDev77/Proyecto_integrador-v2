package com.changuitostudio.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/login", "/api/login/2fa", "/api/login/oauth2/google", "/api/register",
                                "/api/forgot-password", "/api/reset-password")
                        .permitAll()

                        // Endpoints públicos de ecommerce
                        .requestMatchers(HttpMethod.GET, "/api/categoria", "/api/categoria/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/mueble", "/api/mueble/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cliente/favoritos", "/api/cliente/favoritos/ids").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cliente/favoritos/toggle").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/permisos").permitAll()
                        .requestMatchers("/api/chat/**").permitAll()
                        .requestMatchers("/api/reportes/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
