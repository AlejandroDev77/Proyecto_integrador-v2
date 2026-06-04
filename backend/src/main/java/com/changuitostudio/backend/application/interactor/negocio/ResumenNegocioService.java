package com.changuitostudio.backend.application.interactor.negocio;

import com.changuitostudio.backend.application.gateway.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for business summary and dashboard metrics
 */
@Service
public class ResumenNegocioService {

    private final VentaRepository ventaRepository;
    private final CotizacionRepository cotizacionRepository;
    private final DevolucionRepository devolucionRepository;
    private final CompraMaterialRepository compraMaterialRepository;

    public ResumenNegocioService(
            VentaRepository ventaRepository,
            CotizacionRepository cotizacionRepository,
            DevolucionRepository devolucionRepository,
            CompraMaterialRepository compraMaterialRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.devolucionRepository = devolucionRepository;
        this.compraMaterialRepository = compraMaterialRepository;
    }

    public Map<String, Object> obtenerResumen() {
        LocalDate hoy = LocalDate.now();
        int mesActual = hoy.getMonthValue();
        int anioActual = hoy.getYear();

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("ventasHoy", ventaRepository.countByFecVen(hoy));
        resumen.put("cotizacionesPendientes", cotizacionRepository.countByEstCot("Pendiente"));
        resumen.put("devolucionesMes", devolucionRepository.countByFecDevMonth(mesActual, anioActual));
        resumen.put("comprasMes", compraMaterialRepository.countByFecCompMonth(mesActual, anioActual));
        
        return resumen;
    }
}
