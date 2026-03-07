package com.changuitostudio.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*") // Permite que tu frontend se conecte sin problemas por ahora
public class TestController {

    @GetMapping("/hola")
    public Map<String, String> saludar() {
        return Map.of(
            "mensaje", "¡Hola Danil! El backend de ChanguitoStudios está en línea",
            "estado", "OK",
            "java_version", "25"
        );
    }
}