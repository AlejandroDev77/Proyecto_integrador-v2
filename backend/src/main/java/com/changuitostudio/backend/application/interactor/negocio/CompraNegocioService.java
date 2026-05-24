package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.dto.negocio.CompraCompletaRequest;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.*;
import com.changuitostudio.backend.domain.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class CompraNegocioService {

    private final CompraMaterialRepository compraMaterialRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final MaterialRepository materialRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final ProveedorRepository proveedorRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public CompraNegocioService(
            CompraMaterialRepository compraMaterialRepository,
            DetalleCompraRepository detalleCompraRepository,
            MaterialRepository materialRepository,
            MovimientoInventarioRepository movimientoInventarioRepository,
            ProveedorRepository proveedorRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.compraMaterialRepository = compraMaterialRepository;
        this.detalleCompraRepository = detalleCompraRepository;
        this.materialRepository = materialRepository;
        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.proveedorRepository = proveedorRepository;
        this.empleadoRepository = empleadoRepository;
        this.codigoGenerator = codigoGenerator;
    }

    @Transactional
    public Map<String, Object> procesarCompraCompleta(CompraCompletaRequest request) {
        try {
            Proveedor proveedor = proveedorRepository.findById(request.getCompra().getIdProv())
                    .orElseThrow(() -> new ProveedorNoEncontradoException("Proveedor no encontrado"));
            Empleado empleado = empleadoRepository.findById(request.getCompra().getIdEmp())
                    .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

            double totalComp = request.getDetalles().stream()
                    .mapToDouble(det -> det.getCantidad() * det.getPrecioUnitario())
                    .sum();

            String codComp = codigoGenerator.generateUniqueCode("COMP", compraMaterialRepository::existsByCodigo);

            CompraMaterial compra = new CompraMaterial();
            compra.setCodComp(codComp);
            compra.setFecComp(LocalDate.parse(request.getCompra().getFecComp()));
            compra.setEstComp("Completada");
            compra.setTotalComp(totalComp);
            compra.setProveedor(proveedor);
            compra.setEmpleado(empleado);

            compra = compraMaterialRepository.save(compra);

            List<DetalleCompra> detallesCreados = new ArrayList<>();

            for (CompraCompletaRequest.DetalleCompraData detalleData : request.getDetalles()) {
                Material material = materialRepository.findById(detalleData.getIdMat())
                        .orElseThrow(() -> new MaterialNoEncontradoException("Material no encontrado"));

                String codDetComp = codigoGenerator.generateUniqueCode("DCOMP", detalleCompraRepository::existsByCodigo);

                DetalleCompra detalleCompra = new DetalleCompra();
                detalleCompra.setCodDetComp(codDetComp);
                detalleCompra.setCompra(compra);
                detalleCompra.setMaterial(material);
                detalleCompra.setCantidad(detalleData.getCantidad());
                detalleCompra.setPrecioUnitario(detalleData.getPrecioUnitario());
                detalleCompra.setSubtotal(detalleData.getCantidad() * detalleData.getPrecioUnitario());

                detalleCompra = detalleCompraRepository.save(detalleCompra);
                detallesCreados.add(detalleCompra);

                double stockAnterior = material.getStockMat();
                double stockPosterior = stockAnterior + detalleData.getCantidad();

                String codMov = codigoGenerator.generateUniqueCode("MOV", movimientoInventarioRepository::existsByCodigo);

                MovimientoInventario movimiento = new MovimientoInventario();
                movimiento.setCodMov(codMov);
                movimiento.setTipoMov("ENTRADA");
                movimiento.setCantidad(detalleData.getCantidad());
                movimiento.setFechaMov(LocalDateTime.now());
                movimiento.setMaterial(material);
                movimiento.setCompra(compra);
                movimiento.setEmpleado(empleado);
                movimiento.setMotivo(String.format("Compra %s - %s", codComp, material.getNomMat()));
                movimiento.setStockAnterior(stockAnterior);
                movimiento.setStockPosterior(stockPosterior);

                movimientoInventarioRepository.save(movimiento);

                material.setStockMat(stockPosterior);
                materialRepository.save(material);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compra procesada correctamente");
            
            Map<String, Object> data = new HashMap<>();
            data.put("compra", compra);
            data.put("detalles", detallesCreados);
            response.put("data", data);

            return response;

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al procesar compra: " + e.getMessage());
            return errorResponse;
        }
    }
}
