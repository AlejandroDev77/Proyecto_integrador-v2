package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleVentaRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleVentaUseCase;
import com.changuitostudio.backend.application.gateway.MuebleRepository;
import com.changuitostudio.backend.domain.exception.DetalleVentaNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleVenta;
import com.changuitostudio.backend.domain.model.Mueble;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleVentaService implements ManageDetalleVentaUseCase {

    private final DetalleVentaRepository repository;
    private final MuebleRepository muebleRepository;

    public DetalleVentaService(DetalleVentaRepository repository, MuebleRepository muebleRepository) {
        this.repository = repository;
        this.muebleRepository = muebleRepository;
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
        if (detalleventa.getCodDetVen() == null || detalleventa.getCodDetVen().trim().isEmpty()) {
            detalleventa.setCodDetVen("TEMP-" + System.currentTimeMillis());
            DetalleVenta guardado = repository.guardar(detalleventa);
            guardado.setCodDetVen("DVE-" + guardado.getId());
            detalleventa = repository.guardar(guardado);
        } else {
            detalleventa = repository.guardar(detalleventa);
        }

        if (detalleventa.getMueble() != null && detalleventa.getMueble().getId() != null) {
            Optional<Mueble> muebleOpt = muebleRepository.buscarPorId(detalleventa.getMueble().getId());
            if (muebleOpt.isPresent()) {
                Mueble mueble = muebleOpt.get();
                int currentStock = mueble.getStock() != null ? mueble.getStock() : 0;
                int amountToDeduct = detalleventa.getCantidad() != null ? detalleventa.getCantidad() : 0;
                mueble.setStock(currentStock - amountToDeduct);
                muebleRepository.guardar(mueble);
            }
        }
        return detalleventa;
    }

    @Override
    public DetalleVenta actualizar(Long id, DetalleVenta detalleventa) {
        return repository.obtenerPorId(id).map(existing -> {
            existing.setCantidad(detalleventa.getCantidad());
            existing.setPrecioUnitario(detalleventa.getPrecioUnitario());
            existing.setDescuentoItem(detalleventa.getDescuentoItem());
            existing.setSubtotal(detalleventa.getSubtotal());
            existing.setVenta(detalleventa.getVenta());
            existing.setMueble(detalleventa.getMueble());
            return repository.guardar(existing);
        }).orElseThrow(() -> new DetalleVentaNoEncontradoException("DetalleVenta no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        Optional<DetalleVenta> opt = repository.obtenerPorId(id);
        if (opt.isEmpty()) {
            throw new DetalleVentaNoEncontradoException("DetalleVenta no encontrado con ID: " + id);
        }
        DetalleVenta detalle = opt.get();
        if (detalle.getMueble() != null && detalle.getMueble().getId() != null) {
            Optional<Mueble> muebleOpt = muebleRepository.buscarPorId(detalle.getMueble().getId());
            if (muebleOpt.isPresent()) {
                Mueble mueble = muebleOpt.get();
                int currentStock = mueble.getStock() != null ? mueble.getStock() : 0;
                int amountToRestore = detalle.getCantidad() != null ? detalle.getCantidad() : 0;
                mueble.setStock(currentStock + amountToRestore);
                muebleRepository.guardar(mueble);
            }
        }
        repository.eliminar(id);
    }
}
