package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.VentaRepository;
import com.changuitostudio.backend.application.gateway.DetalleVentaRepository;
import com.changuitostudio.backend.application.gateway.MuebleRepository;
import com.changuitostudio.backend.application.usecase.ManageVentaUseCase;
import com.changuitostudio.backend.domain.exception.VentaNoEncontradoException;
import com.changuitostudio.backend.domain.model.Venta;
import com.changuitostudio.backend.domain.model.DetalleVenta;
import com.changuitostudio.backend.domain.model.Mueble;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class VentaService implements ManageVentaUseCase {

    private final VentaRepository repository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final MuebleRepository muebleRepository;

    public VentaService(VentaRepository repository, DetalleVentaRepository detalleVentaRepository, MuebleRepository muebleRepository) {
        this.repository = repository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.muebleRepository = muebleRepository;
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
        if (venta.getCodVen() == null || venta.getCodVen().trim().isEmpty()) {
            venta.setCodVen("TEMP-" + System.currentTimeMillis());
            Venta guardado = repository.guardar(venta);
            guardado.setCodVen("VEN-" + guardado.getId());
            return repository.guardar(guardado);
        }
        return repository.guardar(venta);
    }

    @Override
    public Venta actualizar(Long id, Venta venta) {
        return repository.obtenerPorId(id).map(existing -> {
            boolean wasNotCancelled = existing.getEstVen() != null && !existing.getEstVen().equals("Cancelado");
            boolean isNowCancelled = venta.getEstVen() != null && venta.getEstVen().equals("Cancelado");

            if (wasNotCancelled && isNowCancelled) {
                // Restore stock for all associated details
                Map<String, String> filters = Map.of("venta.id", String.valueOf(id));
                PageResult<DetalleVenta> detailsPage = detalleVentaRepository.listar(1, 1000, filters, "-id");
                for (DetalleVenta detalle : detailsPage.getContent()) {
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
                }
            }

            existing.setFecVen(venta.getFecVen());
            existing.setEstVen(venta.getEstVen());
            existing.setTotalVen(venta.getTotalVen());
            existing.setDescuento(venta.getDescuento());
            existing.setCliente(venta.getCliente());
            existing.setEmpleado(venta.getEmpleado());
            existing.setNotas(venta.getNotas());
            return repository.guardar(existing);
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
