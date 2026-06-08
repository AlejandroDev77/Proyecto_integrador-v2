package com.changuitostudio.backend.infrastructure.service;

import com.changuitostudio.backend.infrastructure.persistence.entity.*;
import com.changuitostudio.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QaRunnerService {

    private final TestExecutionJpaRepository executionRepo;
    private final TestExecutionStepJpaRepository stepRepo;
    private final TestCaseJpaRepository caseRepo;
    private final RestTemplate restTemplate;

    private static final String PYTHON_URL = "http://localhost:8081/qa/run";

    public Map<String, Object> ejecutarSuite(TestExecutionEntity execution, String baseUrl, Map<String, String> credenciales) {
        

        // 1. Obtener casos de la suite
        List<TestCaseEntity> casos = caseRepo.findBySuiteIdOrderByOrden(execution.getSuite().getId());
        if (casos.isEmpty()) {
        casos = crearCasosPorDefecto(execution.getSuite());
        }

        // 2. Armar request para Python
        Map<String, Object> request = new HashMap<>();
        request.put("execution_id", execution.getId().toString());
        request.put("suite_id", execution.getSuite().getId().toString());
        request.put("tipo", execution.getSuite().getTipo());
        request.put("base_url", baseUrl);
        request.put("credenciales", credenciales != null ? credenciales : new HashMap<>());
        request.put("email_destino", execution.getSuite().getEmailDestino());

        List<Map<String, String>> casosMap = new ArrayList<>();
        for (TestCaseEntity caso : casos) {
            Map<String, String> c = new HashMap<>();
            c.put("id", caso.getId().toString());
            c.put("nombre", caso.getNombre());
            c.put("descripcion", caso.getDescripcion() != null ? caso.getDescripcion() : "");
            casosMap.add(c);

        }
        request.put("casos", casosMap);

        // 3. Llamar al microservicio Python
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_URL, entity, Map.class);
        Map<String, Object> result = response.getBody();

        // 4. Persistir resultados en BD
        if (result != null && result.containsKey("steps")) {
            List<Map<String, Object>> steps = (List<Map<String, Object>>) result.get("steps");

            for (Map<String, Object> step : steps) {
                String caseIdStr = (String) step.get("case_id");
                UUID caseId = UUID.fromString(caseIdStr);

                caseRepo.findById(caseId).ifPresent(testCase -> {
                    TestExecutionStepEntity stepEntity = TestExecutionStepEntity.builder()
                            .execution(execution)
                            .testCase(testCase)
                            .resultadoEsperado((String) step.get("resultado_esperado"))
                            .resultadoObtenido((String) step.get("resultado_obtenido"))
                            .estado((String) step.get("estado"))
                            .observaciones((String) step.get("observaciones"))
                            .screenshotPath((String) step.get("screenshot_path"))
                            .tiempoMs(step.get("tiempo_ms") != null ? (Integer) step.get("tiempo_ms") : null)
                            .build();
                    stepRepo.save(stepEntity);
                });
            }

            // 5. Marcar ejecución como completada
            execution.setEstado("completado");
            execution.setFinalizadoEn(LocalDateTime.now());
            executionRepo.save(execution);
        }

        return result;
    }
    private List<TestCaseEntity> crearCasosPorDefecto(TestSuiteEntity suite) {
    List<TestCaseEntity> casos = new ArrayList<>();

    List<String[]> defaultCasos = new ArrayList<>();

    switch (suite.getTipo()) {
        case "regresion" -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
            defaultCasos.add(new String[]{"Verificar login", "El formulario de login debe estar visible"});
            defaultCasos.add(new String[]{"Verificar navegación principal", "El menú principal debe estar disponible"});
        }
        case "unitario" -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
            defaultCasos.add(new String[]{"Verificar formularios", "Los formularios deben estar visibles"});
        }
        case "e2e" -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
            defaultCasos.add(new String[]{"Verificar flujo completo", "El flujo principal debe completarse sin errores"});
            defaultCasos.add(new String[]{"Verificar respuesta del servidor", "El servidor debe responder correctamente"});
        }
        case "integracion" -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
            defaultCasos.add(new String[]{"Verificar conexión con API", "La API debe responder correctamente"});
        }
        case "sistema" -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
            defaultCasos.add(new String[]{"Verificar rendimiento", "El sistema debe responder en tiempo aceptable"});
            defaultCasos.add(new String[]{"Verificar navegación", "La navegación debe funcionar correctamente"});
        }
        default -> {
            defaultCasos.add(new String[]{"Verificar carga del sistema", "El sistema debe cargar correctamente"});
        }
    }

    int orden = 1;
    for (String[] c : defaultCasos) {
        TestCaseEntity caso = TestCaseEntity.builder()
                .suite(suite)
                .nombre(c[0])
                .descripcion(c[1])
                .orden(orden++)
                .build();
        casos.add(caseRepo.save(caso));
    }

    return casos;
}
}