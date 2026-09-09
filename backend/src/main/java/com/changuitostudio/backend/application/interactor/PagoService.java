package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.PagoRepository;
import com.changuitostudio.backend.application.gateway.VentaRepository;
import com.changuitostudio.backend.application.usecase.ManagePagoUseCase;
import com.changuitostudio.backend.domain.exception.PagoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Pago;
import com.changuitostudio.backend.domain.model.Venta;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PagoService implements ManagePagoUseCase {

    private final PagoRepository repository;
    private final VentaRepository ventaRepository;

    public PagoService(PagoRepository repository, VentaRepository ventaRepository) {
        this.repository = repository;
        this.ventaRepository = ventaRepository;
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
        Pago guardadoFinal;
        if (pago.getCodPag() == null || pago.getCodPag().trim().isEmpty()) {
            pago.setCodPag("TEMP-" + System.currentTimeMillis());
            Pago guardado = repository.guardar(pago);
            guardado.setCodPag("PAG-" + guardado.getId());
            guardadoFinal = repository.guardar(guardado);
        } else {
            guardadoFinal = repository.guardar(pago);
        }

        if (guardadoFinal.getVenta() != null && guardadoFinal.getVenta().getId() != null) {
            ventaRepository.obtenerPorId(guardadoFinal.getVenta().getId()).ifPresent(venta -> {
                venta.setEstVen("Completado");
                ventaRepository.guardar(venta);
            });
        }
        return guardadoFinal;
    }

    @Override
    public Pago actualizar(Long id, Pago pago) {
        return repository.obtenerPorId(id).map(existing -> {
            existing.setMonto(pago.getMonto());
            existing.setFecPag(pago.getFecPag());
            existing.setMetodoPag(pago.getMetodoPag());
            existing.setReferenciaPag(pago.getReferenciaPag());
            existing.setVenta(pago.getVenta());
            return repository.guardar(existing);
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
