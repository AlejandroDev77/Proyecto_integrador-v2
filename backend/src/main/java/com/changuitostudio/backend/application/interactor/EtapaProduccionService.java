package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EtapaProduccionRepository;
import com.changuitostudio.backend.application.usecase.ManageEtapaProduccionUseCase;
import com.changuitostudio.backend.domain.exception.EtapaProduccionNoEncontradoException;
import com.changuitostudio.backend.domain.model.EtapaProduccion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class EtapaProduccionService implements ManageEtapaProduccionUseCase {

    private final EtapaProduccionRepository repository;

    public EtapaProduccionService(EtapaProduccionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<EtapaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<EtapaProduccion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public EtapaProduccion crear(EtapaProduccion etapaproduccion) {
        return repository.guardar(etapaproduccion);
    }

    @Override
    public EtapaProduccion actualizar(Long id, EtapaProduccion etapaproduccion) {
        return repository.obtenerPorId(id).map(existing -> {
            etapaproduccion.setId(id);
            return repository.guardar(etapaproduccion);
        }).orElseThrow(() -> new EtapaProduccionNoEncontradoException("EtapaProduccion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new EtapaProduccionNoEncontradoException("EtapaProduccion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
