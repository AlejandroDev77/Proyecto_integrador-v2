package com.changuitostudio.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.config.Customizer;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final SecurityAbuseProtectionFilter abuseProtectionFilter;
    private final boolean secureCookie;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, SecurityAbuseProtectionFilter abuseProtectionFilter,
                          @Value("${app.auth.cookie-secure:false}") boolean secureCookie) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.abuseProtectionFilter = abuseProtectionFilter;
        this.secureCookie = secureCookie;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository())
                        // La SPA reenvía el valor sin máscara de la cookie XSRF-TOKEN en el encabezado.
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        // Estas rutas se usan antes de tener una sesión; las demás mutaciones sí requieren CSRF.
                        .ignoringRequestMatchers("/api/login", "/api/login/2fa", "/api/login/oauth2/google",
                                "/api/register", "/api/forgot-password", "/api/reset-password"))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) -> response.sendError(401))
                        .accessDeniedHandler((request, response, exception) -> response.sendError(403)))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/login", "/api/login/2fa", "/api/login/oauth2/google", "/api/register", "/api/csrf",
                                "/api/forgot-password", "/api/reset-password")
                        .permitAll()

                        // Endpoints públicos de ecommerce
                        .requestMatchers(HttpMethod.GET, "/api/categorias", "/api/categorias/*", "/api/categoria-mueble", "/api/categoria-mueble/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/muebles", "/api/muebles/*", "/api/mueble", "/api/mueble/*").permitAll()
                        .requestMatchers("/storage/evidencias/**").authenticated()
                        .requestMatchers("/api/backup", "/api/logs/**", "/api/reportes/**", "/api/dashboard/**",
                                "/api/usuarios/**", "/api/roles/**", "/api/permisos/**", "/api/roles-permisos/**")
                        .hasRole("ADMIN")
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/me", "/api/me/redirect-route", "/api/logout", "/api/2fa/**", "/api/cliente/**", "/api/favoritos/**", "/api/chat/**")
                        .authenticated()
                        .requestMatchers("/api/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        .anyRequest().permitAll())
                .addFilterBefore(abuseProtectionFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private CookieCsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieCustomizer(cookie -> cookie.path("/").sameSite("Strict").secure(secureCookie));
        return repository;
    }
}
