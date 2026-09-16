package com.changuitostudio.backend.infrastructure.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class SecurityAbuseProtectionFilter extends OncePerRequestFilter {
    private static final long WINDOW_SECONDS = 60;
    private static final Set<String> SENSITIVE_PATHS = Set.of(
            "/api/login", "/api/login/2fa", "/api/login/oauth2/google", "/api/register",
            "/api/forgot-password", "/api/reset-password", "/api/chat/message");
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String perPage = request.getParameter("per_page");
        if (perPage != null) {
            try {
                int value = Integer.parseInt(perPage);
                if (value < 1 || value > 100) {
                    reject(response, 400, "per_page debe estar entre 1 y 100.");
                    return;
                }
            } catch (NumberFormatException e) {
                reject(response, 400, "per_page inválido.");
                return;
            }
        }
        String page = request.getParameter("page");
        if (page != null) {
            try {
                if (Integer.parseInt(page) < 1) {
                    reject(response, 400, "page debe ser mayor o igual a 1.");
                    return;
                }
            } catch (NumberFormatException e) {
                reject(response, 400, "page inválido.");
                return;
            }
        }

        if ((SENSITIVE_PATHS.contains(path) || path.startsWith("/api/generaciones-ia")) && !allow(request, path)) {
            response.setHeader("Retry-After", String.valueOf(WINDOW_SECONDS));
            reject(response, 429, "Demasiadas solicitudes. Intenta nuevamente en un minuto.");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean allow(HttpServletRequest request, String path) {
        long window = Instant.now().getEpochSecond() / WINDOW_SECONDS;
        String key = request.getRemoteAddr() + ':' + path + ':' + window;
        int limit = path.startsWith("/api/generaciones-ia") ? 5 : 10;
        Counter counter = counters.computeIfAbsent(key, ignored -> new Counter(window));
        if (counters.size() > 10_000) counters.entrySet().removeIf(e -> e.getValue().window < window - 1);
        return counter.count.incrementAndGet() <= limit;
    }

    private void reject(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    private static final class Counter {
        private final long window;
        private final AtomicInteger count = new AtomicInteger();
        private Counter(long window) { this.window = window; }
    }
}
