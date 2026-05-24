package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.PagoRepository;
import com.changuitostudio.backend.application.usecase.ManagePagoUseCase;
import com.changuitostudio.backend.domain.exception.PagoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Pago;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PagoService implements ManagePagoUseCase {

    private final PagoRepository repository;

    public PagoService(PagoRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Pago> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Pago> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Pago crear(Pago pago) {
        return repository.guardar(pago);
    }

    @Override
    public Pago actualizar(Long id, Pago pago) {
        return repository.obtenerPorId(id).map(existing -> {
            pago.setId(id);
            return repository.guardar(pago);
        }).orElseThrow(() -> new PagoNoEncontradoException("Pago no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new PagoNoEncontradoException("Pago no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
