package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EvidenciaProduccionRepository;
import com.changuitostudio.backend.application.usecase.ManageEvidenciaProduccionUseCase;
import com.changuitostudio.backend.domain.exception.EvidenciaProduccionNoEncontradoException;
import com.changuitostudio.backend.domain.model.*;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.application.interactor.negocio.CodigoGeneratorService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.Map;
import java.util.Optional;

@Service
public class EvidenciaProduccionService implements ManageEvidenciaProduccionUseCase {

    private final EvidenciaProduccionRepository repository;
    private final StorageGateway storageGateway;
    private final ProduccionEtapaRepository produccionEtapaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public EvidenciaProduccionService(
            EvidenciaProduccionRepository repository,
            StorageGateway storageGateway,
            ProduccionEtapaRepository produccionEtapaRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.repository = repository;
        this.storageGateway = storageGateway;
        this.produccionEtapaRepository = produccionEtapaRepository;
        this.empleadoRepository = empleadoRepository;
        this.codigoGenerator = codigoGenerator;
    }

    @Override
    public PageResult<EvidenciaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<EvidenciaProduccion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public EvidenciaProduccion crear(EvidenciaProduccion evidenciaproduccion) {
        return repository.guardar(evidenciaproduccion);
    }

    @Override
    @Transactional
    public EvidenciaProduccion subirEvidencia(MultipartFile archivo, Long idProEta, String tipoEvi, String descripcion, Long idEmp) {
        // 1. Validar existencia de dependencias
        ProduccionEtapa etapa = produccionEtapaRepository.obtenerPorId(idProEta)
                .orElseThrow(() -> new RuntimeException("Etapa de producción no encontrada con ID: " + idProEta));
        
        Empleado empleado = empleadoRepository.obtenerPorId(idEmp)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + idEmp));

        // 2. Determinar carpeta y subir archivo
        String folder = tipoEvi.equalsIgnoreCase("foto") ? "images" : (tipoEvi.equalsIgnoreCase("video") ? "videos" : "documents");
        String fileUrl = storageGateway.save(archivo, "evidencias/" + folder);

        // 3. Generar código único
        String codEvi = codigoGenerator.generateUniqueCode("EVI", repository::existsByCodigo);

        // 4. Crear modelo de evidencia
        EvidenciaProduccion evidencia = new EvidenciaProduccion();
        evidencia.setProduccionEtapa(etapa);
        evidencia.setEmpleado(empleado);
        evidencia.setTipoEvi(tipoEvi);
        evidencia.setArchivoEvi(fileUrl);
        evidencia.setDescripcion(descripcion);
        evidencia.setFecEvi(LocalDateTime.now());
        evidencia.setCodEvi(codEvi);

        // 5. Guardar en repositorio
        return repository.guardar(evidencia);
    }

    @Override
    public EvidenciaProduccion actualizar(Long id, EvidenciaProduccion evidenciaproduccion) {
        return repository.obtenerPorId(id).map(existing -> {
            evidenciaproduccion.setId(id);
            return repository.guardar(evidenciaproduccion);
        }).orElseThrow(() -> new EvidenciaProduccionNoEncontradoException("EvidenciaProduccion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new EvidenciaProduccionNoEncontradoException("EvidenciaProduccion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
