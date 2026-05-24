package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MovimientoInventarioRepository;
import com.changuitostudio.backend.application.usecase.ManageMovimientoInventarioUseCase;
import com.changuitostudio.backend.domain.exception.MovimientoInventarioNoEncontradoException;
import com.changuitostudio.backend.domain.model.MovimientoInventario;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class MovimientoInventarioService implements ManageMovimientoInventarioUseCase {

    private final MovimientoInventarioRepository repository;

    public MovimientoInventarioService(MovimientoInventarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<MovimientoInventario> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<MovimientoInventario> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public MovimientoInventario crear(MovimientoInventario movimientoinventario) {
        return repository.guardar(movimientoinventario);
    }

    @Override
    public MovimientoInventario actualizar(Long id, MovimientoInventario movimientoinventario) {
        return repository.obtenerPorId(id).map(existing -> {
            movimientoinventario.setId(id);
            return repository.guardar(movimientoinventario);
        }).orElseThrow(() -> new MovimientoInventarioNoEncontradoException("MovimientoInventario no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new MovimientoInventarioNoEncontradoException("MovimientoInventario no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
