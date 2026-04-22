package com.changuitostudio.backend.application.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private MetricsDto metrics;
    private UsuariosDto usuarios;
    private List<Double> ganancias_mensuales;
    private List<Double> ganancias_ano_anterior;
    private CotizacionesMensualesDto cotizaciones_mensuales;
    private VentasVsComprasDto ventas_vs_compras;
    private List<CategoriaVentaDto> ventas_por_categoria;
    private List<EstadoProduccionDto> estado_producciones;
    private List<TopMuebleDto> top_muebles;
    private AlertasStockDto alertas_stock;
    private ConversionCotizacionesDto conversion_cotizaciones;
    private List<Integer> producciones_mensuales;
    private List<CompraProveedorDto> compras_por_proveedor;
    private List<StockMuebleDto> stock_muebles;
    private List<Integer> ventas_cantidad;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricsDto {
        private MetricDetailDto customers;
        private MetricDetailDto employees;
        @JsonProperty("ventasDelMes")
        private Double ventasDelMes;
        @JsonProperty("ventasDelPeriodo")
        private Double ventasDelPeriodo;
        @JsonProperty("cotizacionesPendientes")
        private Integer cotizacionesPendientes;
        @JsonProperty("produccionesActivas")
        private Integer produccionesActivas;
        @JsonProperty("stockBajo")
        private Integer stockBajo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricDetailDto {
        private Integer total;
        private Double percentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuariosDto {
        private Double percentage;
        @JsonProperty("activeUsers")
        private Integer activeUsers;
        @JsonProperty("inactiveUsers")
        private Integer inactiveUsers;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CotizacionesMensualesDto {
        private List<Integer> aprobado;
        private List<Integer> rechazado;
        private List<Integer> pendiente;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VentasVsComprasDto {
        private List<Double> ventas;
        private List<Double> compras;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoriaVentaDto {
        private String categoria;
        private Double total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstadoProduccionDto {
        private String estado;
        private Integer total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopMuebleDto {
        private String nombre;
        private Integer cantidad;
        private Double total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertasStockDto {
        private List<MaterialAlertaDto> materiales;
        private List<MuebleAlertaDto> muebles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialAlertaDto {
        private String nombre;
        private Double stock;
        private Double stock_min;
        private String unidad_medida;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MuebleAlertaDto {
        private String nombre;
        private Integer stock;
        private Integer stock_min;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversionCotizacionesDto {
        private Double tasa;
        private Integer total;
        private Integer aprobadas;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompraProveedorDto {
        private String proveedor;
        private Double total;
        private Integer cantidad;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockMuebleDto {
        private String nombre;
        private Integer stock;
        private Integer stock_min;
    }
}
