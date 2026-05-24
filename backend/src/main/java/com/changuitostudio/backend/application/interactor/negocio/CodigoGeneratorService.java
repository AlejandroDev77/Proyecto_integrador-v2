package com.changuitostudio.backend.application.interactor.negocio;

import org.springframework.stereotype.Service;

import java.util.function.Function;

/**
 * Service for generating unique codes for business entities
 */
@Service
public class CodigoGeneratorService {

    /**
     * Generate unique code with prefix
     * @param prefix Code prefix (e.g., "VEN", "COT", "PRO")
     * @param existsChecker Function to check if code already exists
     * @return Unique code
     */
    public String generateUniqueCode(String prefix, Function<String, Boolean> existsChecker) {
        int nextId = 1;
        String code;
        do {
            code = prefix + "-" + nextId;
            nextId++;
        } while (existsChecker.apply(code));
        return code;
    }
}
