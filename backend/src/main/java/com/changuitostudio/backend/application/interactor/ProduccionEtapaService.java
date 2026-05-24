package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProduccionEtapaRepository;
import com.changuitostudio.backend.application.usecase.ManageProduccionEtapaUseCase;
import com.changuitostudio.backend.domain.exception.ProduccionEtapaNoEncontradoException;
import com.changuitostudio.backend.domain.model.ProduccionEtapa;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ProduccionEtapaService implements ManageProduccionEtapaUseCase {

    private final ProduccionEtapaRepository repository;

    public ProduccionEtapaService(ProduccionEtapaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<ProduccionEtapa> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<ProduccionEtapa> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public ProduccionEtapa crear(ProduccionEtapa produccionetapa) {
        return repository.guardar(produccionetapa);
    }

    @Override
    public ProduccionEtapa actualizar(Long id, ProduccionEtapa produccionetapa) {
        return repository.obtenerPorId(id).map(existing -> {
            produccionetapa.setId(id);
            return repository.guardar(produccionetapa);
        }).orElseThrow(() -> new ProduccionEtapaNoEncontradoException("ProduccionEtapa no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new ProduccionEtapaNoEncontradoException("ProduccionEtapa no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
