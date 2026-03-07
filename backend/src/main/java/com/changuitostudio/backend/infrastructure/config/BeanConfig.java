package com.changuitostudio.backend.infrastructure.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuración de beans personalizados.
 * Aquí se registran beans manualmente con @Bean cuando no se pueden
 * anotar directamente las clases (ej: librerías externas).
 */
@Configuration
public class BeanConfig {

    // Ejemplo: si necesitas registrar un bean de una librería externa:
    //
    // @Bean
    // public AlgunServicioExterno servicioExterno() {
    // return new AlgunServicioExterno();
    // }
}
