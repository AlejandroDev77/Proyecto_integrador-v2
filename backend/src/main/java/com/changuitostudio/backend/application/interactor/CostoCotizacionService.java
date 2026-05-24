package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CostoCotizacionRepository;
import com.changuitostudio.backend.application.usecase.ManageCostoCotizacionUseCase;
import com.changuitostudio.backend.domain.exception.CostoCotizacionNoEncontradoException;
import com.changuitostudio.backend.domain.model.CostoCotizacion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CostoCotizacionService implements ManageCostoCotizacionUseCase {

    private final CostoCotizacionRepository repository;

    public CostoCotizacionService(CostoCotizacionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<CostoCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<CostoCotizacion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public CostoCotizacion crear(CostoCotizacion costocotizacion) {
        return repository.guardar(costocotizacion);
    }

    @Override
    public CostoCotizacion actualizar(Long id, CostoCotizacion costocotizacion) {
        return repository.obtenerPorId(id).map(existing -> {
            costocotizacion.setId(id);
            return repository.guardar(costocotizacion);
        }).orElseThrow(() -> new CostoCotizacionNoEncontradoException("CostoCotizacion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new CostoCotizacionNoEncontradoException("CostoCotizacion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
