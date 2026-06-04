package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.dto.negocio.ProduccionCompletaRequest;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.*;
import com.changuitostudio.backend.domain.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class ProduccionNegocioService {

    private final ProduccionRepository produccionRepository;
    private final DetalleProduccionRepository detalleProduccionRepository;
    private final ProduccionEtapaRepository produccionEtapaRepository;
    private final EtapaProduccionRepository etapaProduccionRepository;
    private final VentaRepository ventaRepository;
    private final CotizacionRepository cotizacionRepository;
    private final MuebleRepository muebleRepository;
    private final EmpleadoRepository empleadoRepository;
    private final CodigoGeneratorService codigoGenerator;

    public ProduccionNegocioService(
            ProduccionRepository produccionRepository,
            DetalleProduccionRepository detalleProduccionRepository,
            ProduccionEtapaRepository produccionEtapaRepository,
            EtapaProduccionRepository etapaProduccionRepository,
            VentaRepository ventaRepository,
            CotizacionRepository cotizacionRepository,
            MuebleRepository muebleRepository,
            EmpleadoRepository empleadoRepository,
            CodigoGeneratorService codigoGenerator
    ) {
        this.produccionRepository = produccionRepository;
        this.detalleProduccionRepository = detalleProduccionRepository;
        this.produccionEtapaRepository = produccionEtapaRepository;
        this.etapaProduccionRepository = etapaProduccionRepository;
        this.ventaRepository = ventaRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.muebleRepository = muebleRepository;
        this.empleadoRepository = empleadoRepository;
        this.codigoGenerator = codigoGenerator;
    }

    @Transactional
    public Map<String, Object> procesarProduccionCompleta(ProduccionCompletaRequest request) {
        Empleado empleado = empleadoRepository.findById(request.getProduccion().getIdEmp())
                .orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado"));

        Venta venta = null;
        if (request.getProduccion().getIdVen() != null) {
            venta = ventaRepository.findById(request.getProduccion().getIdVen()).orElse(null);
        }

        Cotizacion cotizacion = null;
        if (request.getProduccion().getIdCot() != null) {
            cotizacion = cotizacionRepository.findById(request.getProduccion().getIdCot()).orElse(null);
        }

        String codPro = codigoGenerator.generateUniqueCode("PRO", produccionRepository::existsByCodigo);

        Produccion produccion = new Produccion();
        produccion.setCodPro(codPro);
        produccion.setFecIni(LocalDate.parse(request.getProduccion().getFecIni()));
        produccion.setFecFinEstimada(LocalDate.parse(request.getProduccion().getFecFinEstimada()));
        produccion.setEstPro("Pendiente");
        produccion.setPrioridad(request.getProduccion().getPrioridad() != null ? request.getProduccion().getPrioridad() : "5");
        produccion.setVenta(venta);
        produccion.setCotizacion(cotizacion);
        produccion.setEmpleado(empleado);
        produccion.setNotas(request.getProduccion().getNotas());

        produccion = produccionRepository.save(produccion);

        List<DetalleProduccion> detallesCreados = new ArrayList<>();

        for (ProduccionCompletaRequest.DetalleProduccionData detalleData : request.getDetalles()) {
            Mueble mueble = null;
            if (detalleData.getIdMue() != null) {
                mueble = muebleRepository.findById(detalleData.getIdMue()).orElse(null);
            }

            String codDetPro = codigoGenerator.generateUniqueCode("DPRO", detalleProduccionRepository::existsByCodigo);

            DetalleProduccion detalleProduccion = new DetalleProduccion();
            detalleProduccion.setCodDetPro(codDetPro);
            detalleProduccion.setProduccion(produccion);
            detalleProduccion.setMueble(mueble);
            detalleProduccion.setCantidad(detalleData.getCantidad());
            detalleProduccion.setEstDetPro("Pendiente");

            detalleProduccion = detalleProduccionRepository.save(detalleProduccion);
            detallesCreados.add(detalleProduccion);
        }

        List<ProduccionEtapa> etapasCreadas = new ArrayList<>();
        LocalDate fechaInicioEtapa = LocalDate.parse(request.getProduccion().getFecIni());

        List<EtapaProduccion> etapasOrdenadas = new ArrayList<>();
        for (Long idEta : request.getEtapas()) {
            etapaProduccionRepository.findById(idEta).ifPresent(etapasOrdenadas::add);
        }
        etapasOrdenadas.sort(Comparator.comparing(EtapaProduccion::getOrdenSecuencia));

        for (EtapaProduccion etapa : etapasOrdenadas) {
            String codProEta = codigoGenerator.generateUniqueCode("PET", produccionEtapaRepository::existsByCodigo);

            int duracionDias = etapa.getDuracionEstimada() != null ? etapa.getDuracionEstimada() : 1;
            LocalDate fechaFinEtapa = fechaInicioEtapa.plusDays(duracionDias);

            ProduccionEtapa produccionEtapa = new ProduccionEtapa();
            produccionEtapa.setCodProEta(codProEta);
            produccionEtapa.setProduccion(produccion);
            produccionEtapa.setEtapaProduccion(etapa);
            produccionEtapa.setEmpleado(empleado);
            produccionEtapa.setEstEta("Pendiente");
            produccionEtapa.setFecIni(fechaInicioEtapa);
            produccionEtapa.setFecFin(fechaFinEtapa);

            produccionEtapa = produccionEtapaRepository.save(produccionEtapa);
            etapasCreadas.add(produccionEtapa);

            fechaInicioEtapa = fechaFinEtapa;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Orden de producción creada correctamente");
        
        Map<String, Object> data = new HashMap<>();
        data.put("produccion", produccion);
        data.put("detalles", detallesCreados);
        data.put("etapas", etapasCreadas.size());
        response.put("data", data);

        return response;
    }
}
