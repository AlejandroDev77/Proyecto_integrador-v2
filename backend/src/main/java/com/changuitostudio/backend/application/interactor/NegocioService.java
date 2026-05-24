package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.negocio.*;
import com.changuitostudio.backend.application.interactor.negocio.*;
import com.changuitostudio.backend.application.usecase.NegocioUseCase;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NegocioService implements NegocioUseCase {

    private final VentaNegocioService ventaService;
    private final CotizacionNegocioService cotizacionService;
    private final DevolucionNegocioService devolucionService;
    private final CompraNegocioService compraService;
    private final ProduccionNegocioService produccionService;
    private final ResumenNegocioService resumenService;

    public NegocioService(
            VentaNegocioService ventaService,
            CotizacionNegocioService cotizacionService,
            DevolucionNegocioService devolucionService,
            CompraNegocioService compraService,
            ProduccionNegocioService produccionService,
            ResumenNegocioService resumenService
    ) {
        this.ventaService = ventaService;
        this.cotizacionService = cotizacionService;
        this.devolucionService = devolucionService;
        this.compraService = compraService;
        this.produccionService = produccionService;
        this.resumenService = resumenService;
    }

    @Override
    public Map<String, Object> procesarVentaCompleta(VentaCompletaRequest request) {
        return ventaService.procesarVentaCompleta(request);
    }

    @Override
    public Map<String, Object> procesarCotizacionCompleta(CotizacionCompletaRequest request) {
        return cotizacionService.procesarCotizacionCompleta(request);
    }

    @Override
    public Map<String, Object> cotizacionAVenta(Long idCot, CotizacionAVentaRequest request) {
        return cotizacionService.cotizacionAVenta(idCot, request);
    }

    @Override
    public Map<String, Object> procesarDevolucion(DevolucionRequest request) {
        return devolucionService.procesarDevolucion(request);
    }

    @Override
    public Map<String, Object> procesarCompraCompleta(CompraCompletaRequest request) {
        return compraService.procesarCompraCompleta(request);
    }

    @Override
    public Map<String, Object> procesarProduccionCompleta(ProduccionCompletaRequest request) {
        return produccionService.procesarProduccionCompleta(request);
    }

    @Override
    public Map<String, Object> aprobarCotizacion(Long idCot, AprobarCotizacionRequest request) {
        return cotizacionService.aprobarCotizacion(idCot, request);
    }

    @Override
    public Map<String, Object> rechazarCotizacion(Long idCot, String motivo) {
        return cotizacionService.rechazarCotizacion(idCot, motivo);
    }

    @Override
    public Map<String, Object> resumenProcesos() {
        return resumenService.obtenerResumen();
    }
}
