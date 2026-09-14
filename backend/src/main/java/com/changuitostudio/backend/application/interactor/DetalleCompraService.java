package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleCompraRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleCompraUseCase;
import com.changuitostudio.backend.domain.exception.DetalleCompraNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleCompra;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleCompraService implements ManageDetalleCompraUseCase {

    private final DetalleCompraRepository repository;

    public DetalleCompraService(DetalleCompraRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleCompra> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<DetalleCompra> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public DetalleCompra crear(DetalleCompra detallecompra) {
        DetalleCompra guardado = repository.guardar(detallecompra);
        if (guardado.getCodDetComp() == null || guardado.getCodDetComp().trim().isEmpty()) {
            guardado.setCodDetComp("DTC-" + guardado.getId());
            return repository.guardar(guardado);
        }
        return guardado;
    }

    @Override
    public DetalleCompra actualizar(Long id, DetalleCompra detallecompra) {
        return repository.obtenerPorId(id).map(existing -> {
            existing.setCompra(detallecompra.getCompra());
            existing.setMaterial(detallecompra.getMaterial());
            existing.setCantidad(detallecompra.getCantidad());
            existing.setPrecioUnitario(detallecompra.getPrecioUnitario());
            existing.setSubtotal(detallecompra.getSubtotal());
            return repository.guardar(existing);
        }).orElseThrow(() -> new DetalleCompraNoEncontradoException("DetalleCompra no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DetalleCompraNoEncontradoException("DetalleCompra no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
