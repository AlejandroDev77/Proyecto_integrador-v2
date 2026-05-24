package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.VentaRepository;
import com.changuitostudio.backend.application.usecase.ManageVentaUseCase;
import com.changuitostudio.backend.domain.exception.VentaNoEncontradoException;
import com.changuitostudio.backend.domain.model.Venta;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class VentaService implements ManageVentaUseCase {

    private final VentaRepository repository;

    public VentaService(VentaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Venta> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Venta> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Venta crear(Venta venta) {
        return repository.guardar(venta);
    }

    @Override
    public Venta actualizar(Long id, Venta venta) {
        return repository.obtenerPorId(id).map(existing -> {
            venta.setId(id);
            return repository.guardar(venta);
        }).orElseThrow(() -> new VentaNoEncontradoException("Venta no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new VentaNoEncontradoException("Venta no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
