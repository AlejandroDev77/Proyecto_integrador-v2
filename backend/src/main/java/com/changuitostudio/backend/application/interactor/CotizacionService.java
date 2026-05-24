package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CotizacionRepository;
import com.changuitostudio.backend.application.usecase.ManageCotizacionUseCase;
import com.changuitostudio.backend.domain.exception.CotizacionNoEncontradoException;
import com.changuitostudio.backend.domain.model.Cotizacion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CotizacionService implements ManageCotizacionUseCase {

    private final CotizacionRepository repository;

    public CotizacionService(CotizacionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Cotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Cotizacion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Cotizacion crear(Cotizacion cotizacion) {
        return repository.guardar(cotizacion);
    }

    @Override
    public Cotizacion actualizar(Long id, Cotizacion cotizacion) {
        return repository.obtenerPorId(id).map(existing -> {
            cotizacion.setId(id);
            return repository.guardar(cotizacion);
        }).orElseThrow(() -> new CotizacionNoEncontradoException("Cotizacion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new CotizacionNoEncontradoException("Cotizacion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
