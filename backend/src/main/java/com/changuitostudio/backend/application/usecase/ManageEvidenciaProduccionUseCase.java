package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.EvidenciaProduccion;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

public interface ManageEvidenciaProduccionUseCase {
    PageResult<EvidenciaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<EvidenciaProduccion> obtenerPorId(Long id);
    EvidenciaProduccion crear(EvidenciaProduccion evidenciaproduccion);
    EvidenciaProduccion subirEvidencia(MultipartFile archivo, Long idProEta, String tipoEvi, String descripcion, Long idEmp);
    EvidenciaProduccion actualizar(Long id, EvidenciaProduccion evidenciaproduccion);
    void eliminar(Long id);
}
