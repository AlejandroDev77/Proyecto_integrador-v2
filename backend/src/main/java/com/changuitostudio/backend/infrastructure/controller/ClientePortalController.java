package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.interactor.negocio.CodigoGeneratorService;
import com.changuitostudio.backend.infrastructure.persistence.entity.*;
import com.changuitostudio.backend.infrastructure.persistence.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/cliente")
public class ClientePortalController {

    private final ClienteJpaRepository clienteJpaRepository;
    private final VentaJpaRepository ventaJpaRepository;
    private final DetalleVentaJpaRepository detalleVentaJpaRepository;
    private final MuebleJpaRepository muebleJpaRepository;
    private final PagoJpaRepository pagoJpaRepository;
    private final MovimientoInventarioJpaRepository movimientoInventarioJpaRepository;
    private final EmpleadoJpaRepository empleadoJpaRepository;
    private final CodigoGeneratorService codigoGenerator;

    public ClientePortalController(
            ClienteJpaRepository clienteJpaRepository,
            VentaJpaRepository ventaJpaRepository,
            DetalleVentaJpaRepository detalleVentaJpaRepository,
            MuebleJpaRepository muebleJpaRepository,
            PagoJpaRepository pagoJpaRepository,
            MovimientoInventarioJpaRepository movimientoInventarioJpaRepository,
            EmpleadoJpaRepository empleadoJpaRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.ventaJpaRepository = ventaJpaRepository;
        this.detalleVentaJpaRepository = detalleVentaJpaRepository;
        this.muebleJpaRepository = muebleJpaRepository;
        this.pagoJpaRepository = pagoJpaRepository;
        this.movimientoInventarioJpaRepository = movimientoInventarioJpaRepository;
        this.empleadoJpaRepository = empleadoJpaRepository;
        this.codigoGenerator = codigoGenerator;
    }

    /**
     * GET /api/cliente/por-usuario/{idUsu}
     * Get client data by user ID (replicates old Laravel endpoint)
     */
    @GetMapping("/por-usuario/{idUsu}")
    public ResponseEntity<?> getClienteByUsuario(@PathVariable Long idUsu) {
        return clienteJpaRepository.findByUsuarioIdUsu(idUsu)
                .map(entity -> {
                    Map<String, Object> data = new LinkedHashMap<>();
                    data.put("id_cli", entity.getId());
                    data.put("nom_cli", entity.getNomCli());
                    data.put("ap_pat_cli", entity.getApPatCli());
                    data.put("ap_mat_cli", entity.getApMatCli());
                    data.put("cel_cli", entity.getCelCli());
                    data.put("dir_cli", entity.getDirCli());
                    data.put("img_cli", entity.getImgCli());
                    data.put("cod_cli", entity.getCodCli());
                    return ResponseEntity.ok((Object) data);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "No se encontró perfil de cliente asociado")));
    }

    /**
     * POST /api/cliente/compra-directa
     * Client purchases items from cart (replicates old Laravel endpoint)
     */
    @PostMapping("/compra-directa")
    @Transactional
    public ResponseEntity<?> compraDirecta(@RequestBody Map<String, Object> body) {
        try {
            // Validate required fields
            Long idCli = toLong(body.get("id_cli"));
            String metodoPago = (String) body.get("metodo_pago");
            String direccionEntrega = (String) body.get("direccion_entrega");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> detalles = (List<Map<String, Object>>) body.get("detalles");

            if (idCli == null) {
                return badRequest("Cliente es requerido.");
            }
            if (metodoPago == null || metodoPago.isBlank()) {
                return badRequest("Método de pago es requerido.");
            }
            if (direccionEntrega == null || direccionEntrega.length() < 5) {
                return badRequest("Dirección de entrega es requerida.");
            }
            if (detalles == null || detalles.isEmpty()) {
                return badRequest("Debe incluir al menos un producto.");
            }

            // Find client
            ClienteEntity cliente = clienteJpaRepository.findById(idCli)
                    .orElse(null);
            if (cliente == null) {
                return badRequest("Cliente no encontrado.");
            }

            // Find a default employee (required by database constraint in movimientos_inventario)
            // We try ID 1 first (usually admin), if not, the first one found.
            EmpleadoEntity defaultEmpleado = empleadoJpaRepository.findById(1L)
                    .orElseGet(() -> empleadoJpaRepository.findAll().stream().findFirst().orElse(null));

            if (defaultEmpleado == null) {
                return badRequest("No se puede procesar la compra: No hay empleados registrados para autorizar el movimiento de inventario.");
            }

            // Verify stock for all items first
            for (Map<String, Object> det : detalles) {
                Long idMue = toLong(det.get("id_mue"));
                int cantidad = toInt(det.get("cantidad"));
                MuebleEntity mueble = muebleJpaRepository.findById(idMue)
                        .orElseThrow(() -> new RuntimeException("Mueble no encontrado: " + idMue));
                if (mueble.getStock() < cantidad) {
                    return badRequest("Stock insuficiente para " + mueble.getNomMue() + ". Disponible: " + mueble.getStock());
                }
            }

            // Calculate total
            double total = 0;
            for (Map<String, Object> det : detalles) {
                double precioUnitario = toDouble(det.get("precio_unitario"));
                int cantidad = toInt(det.get("cantidad"));
                total += precioUnitario * cantidad;
            }

            // Generate sale code
            String codVen = codigoGenerator.generateUniqueCode("VEN", ventaJpaRepository::existsByCodVen);

            // Create Venta
            VentaEntity venta = new VentaEntity();
            venta.setCodVen(codVen);
            venta.setFecVen(LocalDate.now());
            venta.setTotalVen(total);
            venta.setEstVen("Pendiente");
            venta.setDescuento(0.0);
            venta.setCliente(cliente);
            // No employee for client portal purchases
            venta.setEmpleado(null);
            venta.setNotas("Compra directa desde portal cliente. Entrega: " + direccionEntrega);

            venta = ventaJpaRepository.save(venta);

            // Create DetalleVenta entries
            for (Map<String, Object> det : detalles) {
                Long idMue = toLong(det.get("id_mue"));
                int cantidad = toInt(det.get("cantidad"));
                double precioUnitario = toDouble(det.get("precio_unitario"));
                double subtotal = precioUnitario * cantidad;

                MuebleEntity mueble = muebleJpaRepository.findById(idMue).orElseThrow();

                String codDetVen = codigoGenerator.generateUniqueCode("DVEN", detalleVentaJpaRepository::existsByCodDetVen);

                DetalleVentaEntity detalleVenta = new DetalleVentaEntity();
                detalleVenta.setCodDetVen(codDetVen);
                detalleVenta.setVenta(venta);
                detalleVenta.setMueble(mueble);
                detalleVenta.setCantidad(cantidad);
                detalleVenta.setPrecioUnitario(precioUnitario);
                detalleVenta.setDescuentoItem(0.0);
                detalleVenta.setSubtotal(subtotal);

                detalleVentaJpaRepository.save(detalleVenta);

                // Decrease stock + inventory movement
                int stockAnterior = mueble.getStock();
                int stockPosterior = stockAnterior - cantidad;

                String codMov = codigoGenerator.generateUniqueCode("MOV", movimientoInventarioJpaRepository::existsByCodMov);

                MovimientoInventarioEntity movimiento = new MovimientoInventarioEntity();
                movimiento.setCodMov(codMov);
                movimiento.setTipoMov("SALIDA");
                movimiento.setCantidad((double) cantidad);
                movimiento.setFechaMov(LocalDateTime.now());
                movimiento.setMueble(mueble);
                movimiento.setVenta(venta);
                movimiento.setEmpleado(defaultEmpleado);
                movimiento.setMotivo(String.format("Venta %s - %s", codVen, mueble.getNomMue()));
                movimiento.setStockAnterior((double) stockAnterior);
                movimiento.setStockPosterior((double) stockPosterior);

                movimientoInventarioJpaRepository.save(movimiento);

                // Update stock
                mueble.setStock(stockPosterior);
                muebleJpaRepository.save(mueble);
            }

            // Create Pago
            String metPago = switch (metodoPago) {
                case "efectivo" -> "Efectivo";
                case "transferencia" -> "Transferencia";
                case "qr" -> "QR";
                default -> "Efectivo";
            };

            String codPag = codigoGenerator.generateUniqueCode("PAG", pagoJpaRepository::existsByCodPag);

            PagoEntity pago = new PagoEntity();
            pago.setCodPag(codPag);
            pago.setMonto(total);
            pago.setFecPag(LocalDate.now());
            pago.setMetodoPag(metPago);
            pago.setReferenciaPag("Compra portal cliente - " + direccionEntrega);
            pago.setVenta(venta);

            pagoJpaRepository.save(pago);

            // Success response (same shape as old Laravel)
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", true);
            response.put("message", "Compra registrada exitosamente");
            response.put("id_ven", venta.getId());
            response.put("cod_ven", venta.getCodVen());
            response.put("total", total);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- Helpers ---

    private ResponseEntity<?> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", message));
    }

    private Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        try { return Long.parseLong(val.toString()); } catch (NumberFormatException e) { return null; }
    }

    private int toInt(Object val) {
        if (val == null) return 0;
        if (val instanceof Number) return ((Number) val).intValue();
        try { return Integer.parseInt(val.toString()); } catch (NumberFormatException e) { return 0; }
    }

    private double toDouble(Object val) {
        if (val == null) return 0.0;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try { return Double.parseDouble(val.toString()); } catch (NumberFormatException e) { return 0.0; }
    }
}
