package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.dto.negocio.VentaCompletaRequest;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.*;
import com.changuitostudio.backend.domain.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Service for complete sale processing
 */
@Service
public class VentaNegocioService {

    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final MuebleRepository muebleRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final PagoRepository pagoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public VentaNegocioService(
            VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            MuebleRepository muebleRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            PagoRepository pagoRepository,
            ClienteRepository clienteRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.ventaRepository = ventaRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.muebleRepository = muebleRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.pagoRepository = pagoRepository;
        this.clienteRepository = clienteRepository;
        this.empleadoRepository = empleadoRepository;
        this.codigoGenerator = codigoGenerator;
    }

    @Transactional
    public Map<String, Object> procesarVentaCompleta(VentaCompletaRequest request) {
        // 1. Validate cliente and empleado
        Cliente cliente = clienteRepository.findById(request.getVenta().getIdCli())
                .orElseThrow(() -> new ClienteNoEncontradoException("Cliente no encontrado"));
        Empleado empleado = empleadoRepository.findById(request.getVenta().getIdEmp())
                .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

        // 2. Generate unique code
        String codVen = codigoGenerator.generateUniqueCode("VEN", ventaRepository::existsByCodigo);

        // 3. Create Venta
        Venta venta = new Venta();
        venta.setCodVen(codVen);
        venta.setFecVen(LocalDate.parse(request.getVenta().getFecVen()));
        venta.setEstVen(request.getVenta().getEstVen());
        venta.setTotalVen(request.getVenta().getTotalVen());
        venta.setDescuento(request.getVenta().getDescuento() != null ? request.getVenta().getDescuento() : 0.0);
        venta.setCliente(cliente);
        venta.setEmpleado(empleado);
        venta.setNotas(request.getVenta().getNotas());
        
        venta = ventaRepository.save(venta);

        List<DetalleVenta> detallesCreados = new ArrayList<>();
        int movimientosCount = 0;

        // 4. Process each detail
        for (VentaCompletaRequest.DetalleVentaData detalleData : request.getDetalles()) {
            Mueble mueble = muebleRepository.findById(detalleData.getIdMue())
                    .orElseThrow(() -> new MuebleNoEncontradoException("Mueble no encontrado"));

            // Verify stock
            if (mueble.getStock() < detalleData.getCantidad()) {
                throw new IllegalStateException(
                        String.format("Stock insuficiente para '%s'. Disponible: %d, Solicitado: %d",
                                mueble.getNombre(), mueble.getStock(), detalleData.getCantidad())
                );
            }

            // Generate detail code
            String codDetVen = codigoGenerator.generateUniqueCode("DVEN", detalleVentaRepository::existsByCodigo);

            // Calculate subtotal
            double precioUnit = detalleData.getPrecioUnitario() != null ? detalleData.getPrecioUnitario() : 0.0;
            double descuentoItem = detalleData.getDescuentoItem() != null ? detalleData.getDescuentoItem() : 0.0;
            int cantidad = detalleData.getCantidad() != null ? detalleData.getCantidad() : 0;
            
            double subtotal = (cantidad * precioUnit) - (cantidad * descuentoItem);

            // Create DetalleVenta
            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setCodDetVen(codDetVen);
            detalleVenta.setVenta(venta);
            detalleVenta.setMueble(mueble);
            detalleVenta.setCantidad(cantidad);
            detalleVenta.setPrecioUnitario(precioUnit);
            detalleVenta.setDescuentoItem(descuentoItem);
            detalleVenta.setSubtotal(subtotal);

            detalleVenta = detalleVentaRepository.save(detalleVenta);
            detallesCreados.add(detalleVenta);

            // Register inventory movement (SALIDA)
            int stockAnterior = mueble.getStock();
            int stockPosterior = stockAnterior - cantidad;

            String codMov = codigoGenerator.generateUniqueCode("MOV", movimientoInventarioRepository::existsByCodigo);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setCodMov(codMov);
            movimiento.setTipoMov("SALIDA");
            movimiento.setCantidad((double) cantidad);
            movimiento.setFechaMov(LocalDateTime.now());
            movimiento.setMueble(mueble);
            movimiento.setVenta(venta);
            movimiento.setEmpleado(empleado);
            movimiento.setMotivo(String.format("Venta %s - %s", codVen, mueble.getNombre()));
            movimiento.setStockAnterior((double) stockAnterior);
            movimiento.setStockPosterior((double) stockPosterior);

            movimientoInventarioRepository.save(movimiento);
            movimientosCount++;

            // Update mueble stock
            mueble.setStock(stockPosterior);
            muebleRepository.save(mueble);
        }

        // 5. Register payment (optional)
        Pago pagoCreado = null;
        if (request.getPago() != null && request.getPago().getMonto() != null) {
            String codPag = codigoGenerator.generateUniqueCode("PAG", pagoRepository::existsByCodigo);

            pagoCreado = new Pago();
            pagoCreado.setCodPag(codPag);
            pagoCreado.setMonto(request.getPago().getMonto());
            pagoCreado.setFecPag(venta.getFecVen());
            pagoCreado.setMetodoPag(request.getPago().getMetodoPag());
            pagoCreado.setReferenciaPag(request.getPago().getReferenciaPag());
            pagoCreado.setVenta(venta);

            pagoCreado = pagoRepository.save(pagoCreado);
        }

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Venta procesada correctamente");
        
        Map<String, Object> data = new HashMap<>();
        data.put("venta", venta);
        data.put("detalles", detallesCreados);
        data.put("movimientos", movimientosCount);
        data.put("pago", pagoCreado);
        response.put("data", data);

        return response;
    }
}
