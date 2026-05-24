package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleVentaRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleVentaUseCase;
import com.changuitostudio.backend.domain.exception.DetalleVentaNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleVenta;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleVentaService implements ManageDetalleVentaUseCase {

    private final DetalleVentaRepository repository;

    public DetalleVentaService(DetalleVentaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleVenta> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<DetalleVenta> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public DetalleVenta crear(DetalleVenta detalleventa) {
        return repository.guardar(detalleventa);
    }

    @Override
    public DetalleVenta actualizar(Long id, DetalleVenta detalleventa) {
        return repository.obtenerPorId(id).map(existing -> {
            detalleventa.setId(id);
            return repository.guardar(detalleventa);
        }).orElseThrow(() -> new DetalleVentaNoEncontradoException("DetalleVenta no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DetalleVentaNoEncontradoException("DetalleVenta no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
