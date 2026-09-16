package com.changuitostudio.backend.infrastructure.config;

import org.springframework.boot.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración del contenedor Tomcat embebido en Spring Boot.
 * Permite evitar el error FileCountLimitExceededException configurando
 * los límites máximos de partes y parámetros en el Connector de Tomcat 11.
 */
@Configuration
public class TomcatConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
        return factory -> factory.addConnectorCustomizers((TomcatConnectorCustomizer) connector -> {
            connector.setMaxParameterCount(1000);
            connector.setProperty("maxPartCount", "20");
        });
    }
}
