package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.interactor.negocio.CodigoGeneratorService;
import com.changuitostudio.backend.infrastructure.persistence.entity.*;
import com.changuitostudio.backend.infrastructure.persistence.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
    private final CotizacionJpaRepository cotizacionJpaRepository;
    private final DetalleCotizacionJpaRepository detalleCotizacionJpaRepository;
    private final ProduccionJpaRepository produccionJpaRepository;
    private final CodigoGeneratorService codigoGenerator;

    public ClientePortalController(
            ClienteJpaRepository clienteJpaRepository,
            VentaJpaRepository ventaJpaRepository,
            DetalleVentaJpaRepository detalleVentaJpaRepository,
            MuebleJpaRepository muebleJpaRepository,
            PagoJpaRepository pagoJpaRepository,
            MovimientoInventarioJpaRepository movimientoInventarioJpaRepository,
            EmpleadoJpaRepository empleadoJpaRepository,
            CotizacionJpaRepository cotizacionJpaRepository,
            DetalleCotizacionJpaRepository detalleCotizacionJpaRepository,
            ProduccionJpaRepository produccionJpaRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.ventaJpaRepository = ventaJpaRepository;
        this.detalleVentaJpaRepository = detalleVentaJpaRepository;
        this.muebleJpaRepository = muebleJpaRepository;
        this.pagoJpaRepository = pagoJpaRepository;
        this.movimientoInventarioJpaRepository = movimientoInventarioJpaRepository;
        this.empleadoJpaRepository = empleadoJpaRepository;
        this.cotizacionJpaRepository = cotizacionJpaRepository;
        this.detalleCotizacionJpaRepository = detalleCotizacionJpaRepository;
        this.produccionJpaRepository = produccionJpaRepository;
        this.codigoGenerator = codigoGenerator;
    }

    private ClienteEntity getAuthenticatedCliente() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        try {
            Long userId = Long.parseLong(auth.getName());
            return clienteJpaRepository.findByUsuarioIdUsu(userId).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // ==========================================
    // PERFIL
    // ==========================================

    @GetMapping("/me")
    public ResponseEntity<?> getClienteActual() {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no autenticado o no es cliente"));
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id_cli", cliente.getId());
        data.put("nom_cli", cliente.getNomCli());
        data.put("ap_pat_cli", cliente.getApPatCli());
        data.put("ap_mat_cli", cliente.getApMatCli());
        data.put("cel_cli", cliente.getCelCli());
        data.put("dir_cli", cliente.getDirCli());
        data.put("img_cli", cliente.getImgCli());
        data.put("cod_cli", cliente.getCodCli());
        if (cliente.getUsuario() != null) {
            data.put("email_usu", cliente.getUsuario().getEmailUsu());
        }

        return ResponseEntity.ok(data);
    }

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

    // ==========================================
    // COTIZACIONES
    // ==========================================

    @GetMapping("/cotizaciones")
    public ResponseEntity<?> getMisCotizaciones(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page) {
        
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        Pageable pageable = PageRequest.of(page - 1, per_page, Sort.by(Sort.Direction.DESC, "fecCot"));
        Page<CotizacionEntity> paginated = cotizacionJpaRepository.findByClienteId(cliente.getId(), pageable);
        
        return ResponseEntity.ok(formatPaginatedResponse(paginated));
    }

    @GetMapping("/cotizaciones/{id}")
    public ResponseEntity<?> verCotizacion(@PathVariable Long id) {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        return cotizacionJpaRepository.findById(id)
                .filter(c -> c.getCliente().getId().equals(cliente.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body((CotizacionEntity) null));
    }

    @PostMapping("/cotizaciones/solicitar")
    @Transactional
    public ResponseEntity<?> solicitarCotizacion(@RequestBody Map<String, Object> body) {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        try {
            String tipoProyecto = (String) body.get("tipo_proyecto");
            Double presupuesto = toDouble(body.get("presupuesto_cliente"));
            Integer plazo = toInt(body.get("plazo_esperado"));
            String direccion = (String) body.get("direccion_instalacion");
            String notas = (String) body.get("notas");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> productos = (List<Map<String, Object>>) body.get("productos");

            if (tipoProyecto == null || productos == null || productos.isEmpty()) {
                return badRequest("Faltan campos requeridos o productos.");
            }

            String codCot = codigoGenerator.generateUniqueCode("COT", cotizacionJpaRepository::existsByCodCot);

            EmpleadoEntity defaultEmpleado = empleadoJpaRepository.findById(1L)
                    .orElseGet(() -> empleadoJpaRepository.findAll().stream().findFirst().orElse(null));

            CotizacionEntity cotizacion = new CotizacionEntity();
            cotizacion.setCodCot(codCot);
            cotizacion.setFecCot(LocalDate.now());
            cotizacion.setEstCot("Pendiente");
            cotizacion.setValidezDias(15);
            cotizacion.setTotalCot(0.0);
            cotizacion.setDescuento(0.0);
            cotizacion.setCliente(cliente);
            cotizacion.setEmpleado(defaultEmpleado);
            cotizacion.setNotas(notas);
            cotizacion.setTipoProyecto(tipoProyecto);
            cotizacion.setPresupuestoCliente(presupuesto);
            cotizacion.setPlazoEsperado(plazo);
            cotizacion.setDireccionInstalacion(direccion);

            cotizacion = cotizacionJpaRepository.save(cotizacion);

            double total = 0;
            for (Map<String, Object> prod : productos) {
                Long idMue = toLong(prod.get("id_mue"));
                int cantidad = toInt(prod.get("cantidad"));
                String personalizacion = (String) prod.get("personalizacion");

                MuebleEntity mueble = (idMue != null && idMue > 0) ? muebleJpaRepository.findById(idMue).orElse(null) : null;
                
                String nombreMueble = mueble != null ? mueble.getNomMue() : "Mueble Personalizado";
                if (personalizacion != null && personalizacion.contains("[PERSONALIZADO]")) {
                    String[] parts = personalizacion.split("\\[PERSONALIZADO\\]");
                    if (parts.length > 1 && !parts[1].trim().isEmpty()) {
                        nombreMueble = parts[1].trim().split("\n")[0].trim();
                    }
                }

                double precioUnitario = mueble != null && mueble.getPrecioVenta() != null ? mueble.getPrecioVenta() : 0.0;
                double subtotal = precioUnitario * cantidad;
                total += subtotal;

                DetalleCotizacionEntity detalle = new DetalleCotizacionEntity();
                detalle.setCodDetCot(codigoGenerator.generateUniqueCode("DCOT", detalleCotizacionJpaRepository::existsByCodDetCot));
                detalle.setCotizacion(cotizacion);
                detalle.setMueble(mueble);
                detalle.setCantidad(cantidad);
                detalle.setPrecioUnitario(precioUnitario);
                detalle.setSubtotal(subtotal);
                detalle.setDescPersonalizacion(personalizacion);
                detalle.setNombreMueble(nombreMueble);

                detalleCotizacionJpaRepository.save(detalle);
            }

            cotizacion.setTotalCot(total);
            cotizacionJpaRepository.save(cotizacion);

            return ResponseEntity.status(201).body(Map.of(
                    "message", "Solicitud de cotización enviada correctamente",
                    "cotizacion", cotizacion
            ));
        } catch (Exception e) {
            return badRequest(e.getMessage());
        }
    }

    @PostMapping("/cotizaciones/{id}/cancelar")
    public ResponseEntity<?> cancelarCotizacion(@PathVariable Long id) {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        return cotizacionJpaRepository.findById(id)
                .filter(c -> c.getCliente().getId().equals(cliente.getId()))
                .map(cotizacion -> {
                    if (!"Pendiente".equalsIgnoreCase(cotizacion.getEstCot())) {
                        return badRequest("Solo se pueden cancelar cotizaciones pendientes");
                    }
                    cotizacion.setEstCot("Cancelado");
                    cotizacionJpaRepository.save(cotizacion);
                    return ResponseEntity.ok(Map.of("message", "Cotización cancelada", "cotizacion", cotizacion));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("message", "Cotización no encontrada")));
    }

    // ==========================================
    // PEDIDOS (VENTAS)
    // ==========================================

    @GetMapping("/pedidos")
    public ResponseEntity<?> getMisPedidos(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page) {
        
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        Pageable pageable = PageRequest.of(page - 1, per_page, Sort.by(Sort.Direction.DESC, "fecVen"));
        Page<VentaEntity> paginated = ventaJpaRepository.findByClienteId(cliente.getId(), pageable);
        
        return ResponseEntity.ok(formatPaginatedResponse(paginated));
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<?> verPedido(@PathVariable Long id) {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        return ventaJpaRepository.findById(id)
                .filter(v -> v.getCliente().getId().equals(cliente.getId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body((VentaEntity) null));
    }

    // ==========================================
    // COMPRA DIRECTA
    // ==========================================

    @PostMapping("/compra-directa")
    @Transactional
    public ResponseEntity<?> compraDirecta(@RequestBody Map<String, Object> body) {
        try {
            Long idCli = toLong(body.get("id_cli"));
            if (idCli == null) {
                ClienteEntity authCliente = getAuthenticatedCliente();
                if (authCliente != null) {
                    idCli = authCliente.getId();
                }
            }
            if (idCli == null) return badRequest("Cliente es requerido.");

            String metodoPago = (String) body.get("metodo_pago");
            String direccionEntrega = (String) body.get("direccion_entrega");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> detalles = (List<Map<String, Object>>) body.get("detalles");

            if (metodoPago == null || metodoPago.isBlank()) return badRequest("Método de pago es requerido.");
            if (direccionEntrega == null || direccionEntrega.length() < 5) return badRequest("Dirección de entrega es requerida.");
            if (detalles == null || detalles.isEmpty()) return badRequest("Debe incluir al menos un producto.");

            ClienteEntity cliente = clienteJpaRepository.findById(idCli).orElse(null);
            if (cliente == null) return badRequest("Cliente no encontrado.");

            EmpleadoEntity defaultEmpleado = empleadoJpaRepository.findById(1L)
                    .orElseGet(() -> empleadoJpaRepository.findAll().stream().findFirst().orElse(null));

            if (defaultEmpleado == null) return badRequest("No hay empleados registrados para autorizar.");

            for (Map<String, Object> det : detalles) {
                Long idMue = toLong(det.get("id_mue"));
                int cantidad = toInt(det.get("cantidad"));
                MuebleEntity mueble = muebleJpaRepository.findById(idMue).orElseThrow();
                if (mueble.getStock() < cantidad) return badRequest("Stock insuficiente para " + mueble.getNomMue());
            }

            double total = 0;
            for (Map<String, Object> det : detalles) {
                total += toDouble(det.get("precio_unitario")) * toInt(det.get("cantidad"));
            }

            String codVen = codigoGenerator.generateUniqueCode("VEN", ventaJpaRepository::existsByCodVen);

            VentaEntity venta = new VentaEntity();
            venta.setCodVen(codVen);
            venta.setFecVen(LocalDate.now());
            venta.setTotalVen(total);
            venta.setEstVen("Pendiente");
            venta.setDescuento(0.0);
            venta.setCliente(cliente);
            venta.setNotas("Compra portal cliente. Entrega: " + direccionEntrega);
            venta = ventaJpaRepository.save(venta);

            for (Map<String, Object> det : detalles) {
                Long idMue = toLong(det.get("id_mue"));
                int cantidad = toInt(det.get("cantidad"));
                double precio = toDouble(det.get("precio_unitario"));
                MuebleEntity mueble = muebleJpaRepository.findById(idMue).orElseThrow();
                
                DetalleVentaEntity detalleVenta = new DetalleVentaEntity();
                detalleVenta.setCodDetVen(codigoGenerator.generateUniqueCode("DVEN", detalleVentaJpaRepository::existsByCodDetVen));
                detalleVenta.setVenta(venta);
                detalleVenta.setMueble(mueble);
                detalleVenta.setCantidad(cantidad);
                detalleVenta.setPrecioUnitario(precio);
                detalleVenta.setSubtotal(precio * cantidad);
                detalleVenta.setDescuentoItem(0.0);
                detalleVentaJpaRepository.save(detalleVenta);

                int stockAnt = mueble.getStock();
                int stockPost = stockAnt - cantidad;

                MovimientoInventarioEntity mov = new MovimientoInventarioEntity();
                mov.setCodMov(codigoGenerator.generateUniqueCode("MOV", movimientoInventarioJpaRepository::existsByCodMov));
                mov.setTipoMov("SALIDA");
                mov.setCantidad((double) cantidad);
                mov.setFechaMov(LocalDateTime.now());
                mov.setMueble(mueble);
                mov.setVenta(venta);
                mov.setEmpleado(defaultEmpleado);
                mov.setMotivo(String.format("Venta %s", codVen));
                mov.setStockAnterior((double) stockAnt);
                mov.setStockPosterior((double) stockPost);
                movimientoInventarioJpaRepository.save(mov);

                mueble.setStock(stockPost);
                muebleJpaRepository.save(mueble);
            }

            String metPago = switch (metodoPago) {
                case "efectivo" -> "Efectivo";
                case "transferencia" -> "Transferencia";
                case "qr" -> "QR";
                default -> "Efectivo";
            };

            PagoEntity pago = new PagoEntity();
            pago.setCodPag(codigoGenerator.generateUniqueCode("PAG", pagoJpaRepository::existsByCodPag));
            pago.setMonto(total);
            pago.setFecPag(LocalDate.now());
            pago.setMetodoPag(metPago);
            pago.setReferenciaPag("Portal - " + direccionEntrega);
            pago.setVenta(venta);
            pagoJpaRepository.save(pago);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Compra registrada exitosamente",
                "id_ven", venta.getId(),
                "cod_ven", venta.getCodVen(),
                "total", total
            ));

        } catch (Exception e) {
            return badRequest(e.getMessage());
        }
    }

    // ==========================================
    // PRODUCCIONES
    // ==========================================

    @GetMapping("/producciones")
    public ResponseEntity<?> getMisProducciones(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page) {
        
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        Pageable pageable = PageRequest.of(page - 1, per_page, Sort.by(Sort.Direction.DESC, "fecIni"));
        Page<ProduccionEntity> paginated = produccionJpaRepository.findByClienteId(cliente.getId(), pageable);
        
        return ResponseEntity.ok(formatPaginatedResponse(paginated));
    }

    @GetMapping("/producciones/{id}")
    public ResponseEntity<?> verProduccion(@PathVariable Long id) {
        ClienteEntity cliente = getAuthenticatedCliente();
        if (cliente == null) return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));

        return produccionJpaRepository.findById(id)
                .filter(p -> (p.getCotizacion() != null && p.getCotizacion().getCliente().getId().equals(cliente.getId())) ||
                             (p.getVenta() != null && p.getVenta().getCliente().getId().equals(cliente.getId())))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body((ProduccionEntity) null));
    }

    // --- Helpers ---

    private ResponseEntity<?> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", message));
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

    private Map<String, Object> formatPaginatedResponse(Page<?> page) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("data", page.getContent());
        map.put("current_page", page.getNumber() + 1);
        map.put("last_page", page.getTotalPages());
        map.put("total", page.getTotalElements());
        return map;
    }
}
