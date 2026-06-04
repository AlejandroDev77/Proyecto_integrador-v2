package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.dto.negocio.DevolucionRequest;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.*;
import com.changuitostudio.backend.domain.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DevolucionNegocioService {

    private final DevolucionRepository devolucionRepository;
    private final DetalleDevolucionRepository detalleDevolucionRepository;
    private final VentaRepository ventaRepository;
    private final MuebleRepository muebleRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public DevolucionNegocioService(
            DevolucionRepository devolucionRepository,
            DetalleDevolucionRepository detalleDevolucionRepository,
            VentaRepository ventaRepository,
            MuebleRepository muebleRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.devolucionRepository = devolucionRepository;
        this.detalleDevolucionRepository = detalleDevolucionRepository;
        this.ventaRepository = ventaRepository;
        this.muebleRepository = muebleRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.empleadoRepository = empleadoRepository;
        this.codigoGenerator = codigoGenerator;
    }

    @Transactional
    public Map<String, Object> procesarDevolucion(DevolucionRequest request) {
        Venta venta = ventaRepository.findById(request.getDevolucion().getIdVen())
                .orElseThrow(() -> new VentaNoEncontradoException("Venta no encontrada"));
        Empleado empleado = empleadoRepository.findById(request.getDevolucion().getIdEmp())
                .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

        double totalDev = request.getDetalles().stream()
                .mapToDouble(det -> det.getCantidad() * det.getPrecioUnitario())
                .sum();

        String codDev = codigoGenerator.generateUniqueCode("DEV", devolucionRepository::existsByCodigo);

        Devolucion devolucion = new Devolucion();
        devolucion.setCodDev(codDev);
        devolucion.setFecDev(LocalDate.parse(request.getDevolucion().getFecDev()));
        devolucion.setMotivoDev(request.getDevolucion().getMotivoDev());
        devolucion.setTotalDev(totalDev);
        devolucion.setEstDev("Completada");
        devolucion.setVenta(venta);
        devolucion.setEmpleado(empleado);

        devolucion = devolucionRepository.save(devolucion);

        // Actualizar estado de la venta para que ya no sea elegible para devolución
        venta.setEstVen("Devuelta");
        ventaRepository.save(venta);

        List<DetalleDevolucion> detallesCreados = new ArrayList<>();

        for (DevolucionRequest.DetalleDevolucionData detalleData : request.getDetalles()) {
            Mueble mueble = muebleRepository.findById(detalleData.getIdMue())
                    .orElseThrow(() -> new MuebleNoEncontradoException("Mueble no encontrado"));

            String codDetDev = codigoGenerator.generateUniqueCode("DDEV", detalleDevolucionRepository::existsByCodigo);

            DetalleDevolucion detalleDevolucion = new DetalleDevolucion();
            detalleDevolucion.setCodDetDev(codDetDev);
            detalleDevolucion.setDevolucion(devolucion);
            detalleDevolucion.setMueble(mueble);
            detalleDevolucion.setCantidad(detalleData.getCantidad());
            detalleDevolucion.setPrecioUnitario(detalleData.getPrecioUnitario());
            detalleDevolucion.setSubtotal(detalleData.getCantidad() * detalleData.getPrecioUnitario());

            detalleDevolucion = detalleDevolucionRepository.save(detalleDevolucion);
            detallesCreados.add(detalleDevolucion);

            int stockAnterior = mueble.getStock();
            int stockPosterior = stockAnterior + detalleData.getCantidad();

            String codMov = codigoGenerator.generateUniqueCode("MOV", movimientoInventarioRepository::existsByCodigo);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setCodMov(codMov);
            movimiento.setTipoMov("ENTRADA");
            movimiento.setCantidad(detalleData.getCantidad().doubleValue());
            movimiento.setFechaMov(LocalDateTime.now());
            movimiento.setMueble(mueble);
            movimiento.setDevolucion(devolucion);
            movimiento.setEmpleado(empleado);
            movimiento.setMotivo(String.format("Devolución %s - %s", codDev, mueble.getNombre()));
            movimiento.setStockAnterior((double) stockAnterior);
            movimiento.setStockPosterior((double) stockPosterior);

            movimientoInventarioRepository.save(movimiento);

            mueble.setStock(stockPosterior);
            muebleRepository.save(mueble);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Devolución procesada correctamente");
        
        Map<String, Object> data = new HashMap<>();
        data.put("devolucion", devolucion);
        data.put("detalles", detallesCreados);
        response.put("data", data);

        return response;
    }
}
