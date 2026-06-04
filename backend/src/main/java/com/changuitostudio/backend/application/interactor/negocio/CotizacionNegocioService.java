package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.dto.negocio.*;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.*;
import com.changuitostudio.backend.domain.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Service for quotation business operations
 */
@Service
public class CotizacionNegocioService {

    private final CotizacionRepository cotizacionRepository;
    private final DetalleCotizacionRepository detalleCotizacionRepository;
    private final CostoCotizacionRepository costoCotizacionRepository;
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final MuebleRepository muebleRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final PagoRepository pagoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public CotizacionNegocioService(
            CotizacionRepository cotizacionRepository,
            DetalleCotizacionRepository detalleCotizacionRepository,
            CostoCotizacionRepository costoCotizacionRepository,
            VentaRepository ventaRepository,
            DetalleVentaRepository detalleVentaRepository,
            MuebleRepository muebleRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            PagoRepository pagoRepository,
            ClienteRepository clienteRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.cotizacionRepository = cotizacionRepository;
        this.detalleCotizacionRepository = detalleCotizacionRepository;
        this.costoCotizacionRepository = costoCotizacionRepository;
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
    public Map<String, Object> procesarCotizacionCompleta(CotizacionCompletaRequest request) {
        // Validate cliente and empleado
        Cliente cliente = clienteRepository.findById(request.getCotizacion().getIdCli())
                .orElseThrow(() -> new ClienteNoEncontradoException("Cliente no encontrado"));
        Empleado empleado = empleadoRepository.findById(request.getCotizacion().getIdEmp())
                .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

        // Calculate total
        double totalCot = 0.0;
        for (CotizacionCompletaRequest.DetalleCotizacionData det : request.getDetalles()) {
            totalCot += det.getCantidad() * det.getPrecioUnitario();
        }
        double descuento = request.getCotizacion().getDescuento() != null ? request.getCotizacion().getDescuento() : 0.0;
        totalCot = totalCot - descuento;

        // Generate code
        String codCot = codigoGenerator.generateUniqueCode("COT", cotizacionRepository::existsByCodigo);

        // Create Cotizacion
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setCodCot(codCot);
        cotizacion.setFecCot(LocalDate.parse(request.getCotizacion().getFecCot()));
        cotizacion.setEstCot("Pendiente");
        cotizacion.setValidezDias(request.getCotizacion().getValidezDias() != null ? request.getCotizacion().getValidezDias() : 15);
        cotizacion.setTotalCot(totalCot);
        cotizacion.setDescuento(descuento);
        cotizacion.setNotas(request.getCotizacion().getNotas());
        cotizacion.setCliente(cliente);
        cotizacion.setEmpleado(empleado);
        cotizacion.setPresupuestoCliente(request.getCotizacion().getPresupuestoCliente());
        cotizacion.setPlazoEsperado(request.getCotizacion().getPlazoEsperado());
        cotizacion.setTiempoEntrega(request.getCotizacion().getTiempoEntrega());
        cotizacion.setDireccionInstalacion(request.getCotizacion().getDireccionInstalacion());
        cotizacion.setTipoProyecto(request.getCotizacion().getTipoProyecto());

        cotizacion = cotizacionRepository.save(cotizacion);

        List<DetalleCotizacion> detallesCreados = new ArrayList<>();

        // Process details
        for (CotizacionCompletaRequest.DetalleCotizacionData detalleData : request.getDetalles()) {
            Mueble mueble = null;
            if (detalleData.getIdMue() != null) {
                mueble = muebleRepository.findById(detalleData.getIdMue()).orElse(null);
            }

            String codDetCot = codigoGenerator.generateUniqueCode("DCOT", detalleCotizacionRepository::existsByCodigo);

            double subtotal = detalleData.getCantidad() * detalleData.getPrecioUnitario();

            DetalleCotizacion detalleCotizacion = new DetalleCotizacion();
            detalleCotizacion.setCodDetCot(codDetCot);
            detalleCotizacion.setCotizacion(cotizacion);
            detalleCotizacion.setMueble(mueble);
            detalleCotizacion.setCantidad(detalleData.getCantidad());
            detalleCotizacion.setPrecioUnitario(detalleData.getPrecioUnitario());
            detalleCotizacion.setSubtotal(subtotal);
            detalleCotizacion.setDescPersonalizacion(detalleData.getDescPersonalizacion());
            detalleCotizacion.setNombreMueble(detalleData.getNombreMueble());
            detalleCotizacion.setTipoMueble(detalleData.getTipoMueble());
            detalleCotizacion.setDimensiones(detalleData.getDimensiones());
            detalleCotizacion.setMaterialPrincipal(detalleData.getMaterialPrincipal());
            detalleCotizacion.setColorAcabado(detalleData.getColorAcabado());
            detalleCotizacion.setImgReferencia(detalleData.getImgReferencia());
            detalleCotizacion.setHerrajes(detalleData.getHerrajes());

            detalleCotizacion = detalleCotizacionRepository.save(detalleCotizacion);
            detallesCreados.add(detalleCotizacion);
        }

        // Create cost calculation (optional)
        CostoCotizacion costosCreados = null;
        if (request.getCostos() != null) {
            double costoMat = request.getCostos().getCostoMateriales() != null ? request.getCostos().getCostoMateriales() : 0.0;
            double costoMO = request.getCostos().getCostoManoObra() != null ? request.getCostos().getCostoManoObra() : 0.0;
            double costosInd = request.getCostos().getCostosIndirectos() != null ? request.getCostos().getCostosIndirectos() : 0.0;
            double margen = request.getCostos().getMargenGanancia() != null ? request.getCostos().getMargenGanancia() : 0.0;

            double costoTotal = costoMat + costoMO + costosInd;
            double precioSugerido = costoTotal > 0 ? costoTotal * (1 + (margen / 100)) : totalCot;

            costosCreados = new CostoCotizacion();
            costosCreados.setCotizacion(cotizacion);
            costosCreados.setCostoMateriales(costoMat);
            costosCreados.setCostoManoObra(costoMO);
            costosCreados.setCostosIndirectos(costosInd);
            costosCreados.setMargenGanancia(margen);
            costosCreados.setCostoTotal(costoTotal);
            costosCreados.setPrecioSugerido(precioSugerido);

            costosCreados = costoCotizacionRepository.save(costosCreados);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cotización creada correctamente");
        
        Map<String, Object> data = new HashMap<>();
        data.put("cotizacion", cotizacion);
        data.put("detalles", detallesCreados);
        data.put("costos", costosCreados);
        response.put("data", data);

        return response;
    }

    @Transactional
    public Map<String, Object> cotizacionAVenta(Long idCot, CotizacionAVentaRequest request) {
        Cotizacion cotizacion = cotizacionRepository.findById(idCot)
                .orElseThrow(() -> new CotizacionNoEncontradoException("Cotizacion no encontrada"));

        if ("Aprobada".equalsIgnoreCase(cotizacion.getEstCot()) || "Convertida".equalsIgnoreCase(cotizacion.getEstCot())) {
            throw new IllegalStateException("Esta cotización ya fue aprobada o convertida a venta");
        }

        List<DetalleCotizacion> detalles = detalleCotizacionRepository.findByCotizacionId(idCot);
        if (detalles.isEmpty()) {
            throw new IllegalStateException("La cotización no tiene detalles para convertir");
        }

        Empleado empleado = empleadoRepository.findById(request.getIdEmp())
                .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

        // Generate venta code
        String codVen = codigoGenerator.generateUniqueCode("VEN", ventaRepository::existsByCodigo);

        // Create Venta
        Venta venta = new Venta();
        venta.setCodVen(codVen);
        venta.setFecVen(LocalDate.now());
        venta.setEstVen("Completada");
        venta.setTotalVen(cotizacion.getTotalCot());
        venta.setDescuento(cotizacion.getDescuento() != null ? cotizacion.getDescuento() : 0.0);
        venta.setCliente(cotizacion.getCliente());
        venta.setEmpleado(empleado);
        venta.setNotas("Generada desde cotización " + cotizacion.getCodCot());

        venta = ventaRepository.save(venta);

        List<DetalleVenta> detallesCreados = new ArrayList<>();
        int movimientosCount = 0;

        // Copy details from cotizacion to venta
        for (DetalleCotizacion detalleCot : detalles) {
            if (detalleCot.getMueble() == null) {
                continue; // Skip custom furniture without mueble reference
            }

            Mueble mueble = detalleCot.getMueble();

            // Verify stock
            if (mueble.getStock() < detalleCot.getCantidad()) {
                throw new IllegalStateException(
                        String.format("Stock insuficiente para '%s'. Disponible: %d, Solicitado: %d",
                                mueble.getNombre(), mueble.getStock(), detalleCot.getCantidad())
                );
            }

            // Generate detail code
            String codDetVen = codigoGenerator.generateUniqueCode("DVEN", detalleVentaRepository::existsByCodigo);

            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setCodDetVen(codDetVen);
            detalleVenta.setVenta(venta);
            detalleVenta.setMueble(mueble);
            detalleVenta.setCantidad(detalleCot.getCantidad());
            detalleVenta.setPrecioUnitario(detalleCot.getPrecioUnitario());
            detalleVenta.setDescuentoItem(0.0);
            detalleVenta.setSubtotal(detalleCot.getSubtotal());

            detalleVenta = detalleVentaRepository.save(detalleVenta);
            detallesCreados.add(detalleVenta);

            // Register inventory movement
            int stockAnterior = mueble.getStock();
            int stockPosterior = stockAnterior - detalleCot.getCantidad();

            String codMov = codigoGenerator.generateUniqueCode("MOV", movimientoInventarioRepository::existsByCodigo);

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setCodMov(codMov);
            movimiento.setTipoMov("SALIDA");
            movimiento.setCantidad(detalleCot.getCantidad().doubleValue());
            movimiento.setFechaMov(LocalDateTime.now());
            movimiento.setMueble(mueble);
            movimiento.setVenta(venta);
            movimiento.setEmpleado(empleado);
            movimiento.setMotivo(String.format("Venta %s (desde cotización %s)", codVen, cotizacion.getCodCot()));
            movimiento.setStockAnterior((double) stockAnterior);
            movimiento.setStockPosterior((double) stockPosterior);

            movimientoInventarioRepository.save(movimiento);
            movimientosCount++;

            // Update stock
            mueble.setStock(stockPosterior);
            muebleRepository.save(mueble);
        }

        // Register payment (optional)
        Pago pagoCreado = null;
        if (request.isRegistrarPago() && request.getPago() != null) {
            String codPag = codigoGenerator.generateUniqueCode("PAG", pagoRepository::existsByCodigo);

            pagoCreado = new Pago();
            pagoCreado.setCodPag(codPag);
            pagoCreado.setMonto(request.getPago().getMonto());
            pagoCreado.setFecPag(LocalDate.now());
            pagoCreado.setMetodoPag(request.getPago().getMetodoPag());
            pagoCreado.setReferenciaPag(request.getPago().getReferenciaPag());
            pagoCreado.setVenta(venta);

            pagoCreado = pagoRepository.save(pagoCreado);
        }

        // Update cotizacion status
        cotizacion.setEstCot("Aprobada");
        cotizacionRepository.save(cotizacion);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cotización convertida a venta exitosamente");
        
        Map<String, Object> data = new HashMap<>();
        data.put("venta", venta);
        data.put("detalles", detallesCreados.size());
        data.put("movimientos", movimientosCount);
        data.put("pago", pagoCreado);
        data.put("cotizacion_actualizada", Map.of(
                "id", cotizacion.getId(),
                "cod_cot", cotizacion.getCodCot(),
                "est_cot", cotizacion.getEstCot()
        ));
        response.put("data", data);

        return response;
    }

    @Transactional
    public Map<String, Object> aprobarCotizacion(Long idCot, AprobarCotizacionRequest request) {
        Cotizacion cotizacion = cotizacionRepository.findById(idCot)
                .orElseThrow(() -> new CotizacionNoEncontradoException("Cotización no encontrada"));

        if (!"Pendiente".equalsIgnoreCase(cotizacion.getEstCot())) {
            throw new IllegalStateException("Solo se pueden aprobar cotizaciones pendientes");
        }

        // Update detail prices if provided
        if (request.getDetalles() != null && !request.getDetalles().isEmpty()) {
            for (AprobarCotizacionRequest.DetalleUpdate detData : request.getDetalles()) {
                DetalleCotizacion detalle = detalleCotizacionRepository.findById(detData.getIdDetCot()).orElse(null);
                if (detalle != null && detalle.getCotizacion().getId().equals(cotizacion.getId())) {
                    detalle.setPrecioUnitario(detData.getPrecioUnitario());
                    detalle.setSubtotal(detData.getPrecioUnitario() * detalle.getCantidad());
                    detalleCotizacionRepository.save(detalle);
                }
            }
        }

        // Recalculate total
        List<DetalleCotizacion> detalles = detalleCotizacionRepository.findByCotizacionId(idCot);
        double total = detalles.stream().mapToDouble(DetalleCotizacion::getSubtotal).sum();
        double descuento = request.getDescuento() != null ? request.getDescuento() : (cotizacion.getDescuento() != null ? cotizacion.getDescuento() : 0.0);

        // Update cotizacion
        cotizacion.setEstCot("Aprobado");
        cotizacion.setTotalCot(total - descuento);
        cotizacion.setDescuento(descuento);

        // Add admin note if provided
        if (request.getNotasAdmin() != null && !request.getNotasAdmin().isEmpty()) {
            String notasActuales = cotizacion.getNotas() != null ? cotizacion.getNotas() + "\n\n" : "";
            cotizacion.setNotas(notasActuales + "[Admin] " + request.getNotasAdmin());
        }

        cotizacion = cotizacionRepository.save(cotizacion);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cotización aprobada correctamente");
        response.put("cotizacion", cotizacion);

        return response;
    }

    @Transactional
    public Map<String, Object> rechazarCotizacion(Long idCot, String motivo) {
        Cotizacion cotizacion = cotizacionRepository.findById(idCot)
                .orElseThrow(() -> new CotizacionNoEncontradoException("Cotización no encontrada"));

        if (!"Pendiente".equalsIgnoreCase(cotizacion.getEstCot())) {
            throw new IllegalStateException("Solo se pueden rechazar cotizaciones pendientes");
        }

        cotizacion.setEstCot("Rechazado");

        if (motivo != null && !motivo.isEmpty()) {
            String notasActuales = cotizacion.getNotas() != null ? cotizacion.getNotas() + "\n\n" : "";
            cotizacion.setNotas(notasActuales + "[Rechazado] " + motivo);
        }

        cotizacion = cotizacionRepository.save(cotizacion);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cotización rechazada");
        response.put("cotizacion", cotizacion);

        return response;
    }
}
