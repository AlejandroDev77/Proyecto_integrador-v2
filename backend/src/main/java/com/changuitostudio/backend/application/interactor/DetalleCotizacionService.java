package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleCotizacionRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleCotizacionUseCase;
import com.changuitostudio.backend.domain.exception.DetalleCotizacionNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleCotizacion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleCotizacionService implements ManageDetalleCotizacionUseCase {

    private final DetalleCotizacionRepository repository;

    public DetalleCotizacionService(DetalleCotizacionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<DetalleCotizacion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public DetalleCotizacion crear(DetalleCotizacion detallecotizacion) {
        return repository.guardar(detallecotizacion);
    }

    @Override
    public DetalleCotizacion actualizar(Long id, DetalleCotizacion detallecotizacion) {
        return repository.obtenerPorId(id).map(existing -> {
            detallecotizacion.setId(id);
            return repository.guardar(detallecotizacion);
        }).orElseThrow(() -> new DetalleCotizacionNoEncontradoException("DetalleCotizacion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DetalleCotizacionNoEncontradoException("DetalleCotizacion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
