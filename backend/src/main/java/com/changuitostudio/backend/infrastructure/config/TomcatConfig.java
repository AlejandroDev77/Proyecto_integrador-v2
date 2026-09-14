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
            // Aumentar el límite de parámetros que aplica a las partes multipart
            connector.setMaxParameterCount(10000);
            
            // Si el método setMaxPartCount existe en esta versión de Tomcat, también lo configuramos usando reflexión.
            try {
                connector.getClass().getMethod("setMaxPartCount", int.class).invoke(connector, 10000);
            } catch (Exception e) {
                System.out.println("No se pudo configurar setMaxPartCount en Connector: " + e.getMessage());
            }
        });
    }

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatContextCustomizer() {
        return factory -> factory.addContextCustomizers(context -> {
            // El atributo maxFileCount (introducido por CVE-2023-28709) está en el Context.
            try {
                context.getClass().getMethod("setMaxFileCount", int.class).invoke(context, 10000);
            } catch (Exception e) {
                System.out.println("No se pudo configurar setMaxFileCount en Context: " + e.getMessage());
            }
        });
    }
}
