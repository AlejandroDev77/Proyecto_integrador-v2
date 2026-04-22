package com.changuitostudio.backend.infrastructure.persistence.repository.dashboard;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;
import com.changuitostudio.backend.application.gateway.dashboard.DashboardGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class DashboardRepositoryImpl implements DashboardGateway {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public DashboardResponse getDashboardData(DashboardRequest request) {
        Integer yearActual = request.getYear();
        Integer mesActual = request.getMonth();
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        String monthFilter = request.getMonthFilter();

        // Parameter builder for date filters
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("year", yearActual);
        params.addValue("month", mesActual);
        params.addValue("startDate", startDate);
        params.addValue("endDate", endDate);

        // Date Filter Logic for SQL
        String dateFilterSql;
        String dateFilterColumn = "fec_ven"; // Will be replaced in queries as needed

        if (startDate != null && endDate != null) {
            dateFilterSql = " AND #COL >= :startDate AND #COL <= :endDate";
        } else if ("specific".equals(monthFilter)) {
            dateFilterSql = " AND EXTRACT(YEAR FROM #COL) = :year AND EXTRACT(MONTH FROM #COL) = :month";
        } else {
            dateFilterSql = " AND EXTRACT(YEAR FROM #COL) = :year";
        }

        // --- Metrics Básicas ---
        Integer totalClientes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM clientes WHERE est_cli = true", params, Integer.class);
        Integer totalEmpleados = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM empleados WHERE est_emp = true", params, Integer.class);
        
        Integer totalUsuariosActivos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuarios WHERE est_usu = true", params, Integer.class);
        Integer totalUsuariosInactivos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuarios WHERE est_usu = false", params, Integer.class);
        Double porcentajeActivos = (totalUsuariosActivos + totalUsuariosInactivos) > 0
                ? Math.round(((double) totalUsuariosActivos / (totalUsuariosActivos + totalUsuariosInactivos)) * 1000.0) / 10.0
                : 0.0;

        // Ventas
        Double ventasDelMes = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(total_ven), 0) FROM ventas WHERE EXTRACT(YEAR FROM fec_ven) = :year AND EXTRACT(MONTH FROM fec_ven) = :month AND LOWER(est_ven) IN ('completado', 'pendiente')",
                params, Double.class);

        Double ventasDelAno = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(total_ven), 0) FROM ventas WHERE EXTRACT(YEAR FROM fec_ven) = :year AND LOWER(est_ven) IN ('completado', 'pendiente')",
                params, Double.class);

        Double ventasDelPeriodo;
        if (startDate != null && endDate != null) {
            ventasDelPeriodo = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(SUM(total_ven), 0) FROM ventas WHERE fec_ven >= :startDate AND fec_ven <= :endDate AND LOWER(est_ven) IN ('completado', 'pendiente')",
                    params, Double.class);
        } else if ("specific".equals(monthFilter)) {
            ventasDelPeriodo = ventasDelMes;
        } else {
            ventasDelPeriodo = ventasDelAno;
        }

        Integer cotizacionesPendientes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM cotizaciones WHERE LOWER(est_cot) = 'pendiente'", params, Integer.class);
        Integer produccionesActivas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM produccion WHERE LOWER(est_pro) IN ('en proceso', 'en_proceso', 'pendiente')", params, Integer.class);

        // Stock
        Integer materialesStockBajo = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM materiales WHERE stock_mat <= stock_min AND est_mat = true", params, Integer.class);
        Integer mueblesStockBajo = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM muebles WHERE stock <= stock_min AND est_mue = true", params, Integer.class);
        Integer totalStockBajo = (materialesStockBajo != null ? materialesStockBajo : 0) + (mueblesStockBajo != null ? mueblesStockBajo : 0);

        // --- Ganancias Mensuales ---
        String gananciasSql = "SELECT EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total FROM ventas WHERE LOWER(est_ven) = 'completado'" + dateFilterSql.replace("#COL", "fec_ven") + " GROUP BY mes ORDER BY mes";
        List<Map<String, Object>> gananciasRows = jdbcTemplate.queryForList(gananciasSql, params);
        List<Double> gananciasMensuales = new ArrayList<>(Collections.nCopies(12, 0.0));
        gananciasRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            gananciasMensuales.set(mes, ((Number) row.get("total")).doubleValue());
        });

        // Ganancias Año Anterior
        MapSqlParameterSource prevYearParams = new MapSqlParameterSource(params.getValues());
        prevYearParams.addValue("prevYear", yearActual - 1);
        String gananciasAntSql = "SELECT EXTRACT(MONTH FROM fec_ven) as mes, SUM(total_ven) as total FROM ventas WHERE EXTRACT(YEAR FROM fec_ven) = :prevYear AND LOWER(est_ven) = 'completado' GROUP BY mes ORDER BY mes";
        List<Map<String, Object>> gananciasAntRows = jdbcTemplate.queryForList(gananciasAntSql, prevYearParams);
        List<Double> gananciasAnterior = new ArrayList<>(Collections.nCopies(12, 0.0));
        gananciasAntRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            gananciasAnterior.set(mes, ((Number) row.get("total")).doubleValue());
        });

        // --- Cotizaciones Mensuales ---
        String cotizacionesSql = "SELECT EXTRACT(MONTH FROM fec_cot) as mes, LOWER(est_cot) as tipo, COUNT(*) as total FROM cotizaciones WHERE 1=1" + dateFilterSql.replace("#COL", "fec_cot") + " GROUP BY mes, tipo ORDER BY mes";
        List<Map<String, Object>> cotizacionesRows = jdbcTemplate.queryForList(cotizacionesSql, params);
        
        List<Integer> cotAprobado = new ArrayList<>(Collections.nCopies(12, 0));
        List<Integer> cotRechazado = new ArrayList<>(Collections.nCopies(12, 0));
        List<Integer> cotPendiente = new ArrayList<>(Collections.nCopies(12, 0));
        
        cotizacionesRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            String tipo = (String) row.get("tipo");
            int total = ((Number) row.get("total")).intValue();
            if ("aprobado".equals(tipo)) cotAprobado.set(mes, total);
            else if ("rechazado".equals(tipo)) cotRechazado.set(mes, total);
            else if ("pendiente".equals(tipo)) cotPendiente.set(mes, total);
        });

        // --- Ventas vs Compras ---
        String comprasSql = "SELECT EXTRACT(MONTH FROM fec_comp) as mes, SUM(total_comp) as total FROM compras_materiales WHERE 1=1" + dateFilterSql.replace("#COL", "fec_comp") + " GROUP BY mes ORDER BY mes";
        List<Map<String, Object>> comprasRows = jdbcTemplate.queryForList(comprasSql, params);
        
        List<Double> comprasMensuales = new ArrayList<>(Collections.nCopies(12, 0.0));
        comprasRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            comprasMensuales.set(mes, ((Number) row.get("total")).doubleValue());
        });

        // --- Ventas por Categoría ---
        String ventasCatSql = "SELECT cm.nom_cat as categoria, SUM(dv.subtotal) as total " +
                "FROM detalles_venta dv JOIN muebles m ON dv.id_mue = m.id_mue " +
                "JOIN categorias_muebles cm ON m.id_cat = cm.id_cat " +
                "JOIN ventas v ON dv.id_ven = v.id_ven " +
                "WHERE LOWER(v.est_ven) = 'completado'" + dateFilterSql.replace("#COL", "v.fec_ven") + " " +
                "GROUP BY cm.nom_cat ORDER BY total DESC";
        List<DashboardResponse.CategoriaVentaDto> ventasCategoria = jdbcTemplate.query(ventasCatSql, params, (rs, rowNum) -> 
            DashboardResponse.CategoriaVentaDto.builder()
                .categoria(rs.getString("categoria"))
                .total(rs.getDouble("total"))
                .build()
        );

        // --- Estado de Producciones ---
        String estProdSql = "SELECT LOWER(est_pro) as estado, COUNT(*) as total FROM produccion WHERE 1=1" + dateFilterSql.replace("#COL", "fec_ini") + " GROUP BY estado";
        List<DashboardResponse.EstadoProduccionDto> estadoProducciones = jdbcTemplate.query(estProdSql, params, (rs, rowNum) ->
            DashboardResponse.EstadoProduccionDto.builder()
                .estado(rs.getString("estado"))
                .total(rs.getInt("total"))
                .build()
        );

        // --- Top Muebles ---
        String topMueblesSql = "SELECT m.nom_mue as nombre, SUM(dv.cantidad) as cantidad, SUM(dv.subtotal) as total " +
                "FROM detalles_venta dv JOIN muebles m ON dv.id_mue = m.id_mue " +
                "JOIN ventas v ON dv.id_ven = v.id_ven " +
                "WHERE LOWER(v.est_ven) = 'completado'" + dateFilterSql.replace("#COL", "v.fec_ven") + " " +
                "GROUP BY m.nom_mue ORDER BY total DESC LIMIT 5";
        List<DashboardResponse.TopMuebleDto> topMuebles = jdbcTemplate.query(topMueblesSql, params, (rs, rowNum) ->
            DashboardResponse.TopMuebleDto.builder()
                .nombre(rs.getString("nombre"))
                .cantidad(rs.getInt("cantidad"))
                .total(rs.getDouble("total"))
                .build()
        );

        // --- Alertas Stock ---
        String alertasMatSql = "SELECT nom_mat as nombre, stock_mat as stock, stock_min, unidad_medida FROM materiales WHERE stock_mat <= stock_min AND est_mat = true ORDER BY (stock_mat - stock_min) ASC LIMIT 10";
        List<DashboardResponse.MaterialAlertaDto> alertasMateriales = jdbcTemplate.query(alertasMatSql, params, (rs, rowNum) ->
            DashboardResponse.MaterialAlertaDto.builder()
                .nombre(rs.getString("nombre"))
                .stock(rs.getDouble("stock"))
                .stock_min(rs.getDouble("stock_min"))
                .unidad_medida(rs.getString("unidad_medida"))
                .build()
        );

        String alertasMueSql = "SELECT nom_mue as nombre, stock, stock_min FROM muebles WHERE stock <= stock_min AND est_mue = true ORDER BY (stock - stock_min) ASC LIMIT 10";
        List<DashboardResponse.MuebleAlertaDto> alertasMuebles = jdbcTemplate.query(alertasMueSql, params, (rs, rowNum) ->
            DashboardResponse.MuebleAlertaDto.builder()
                .nombre(rs.getString("nombre"))
                .stock(rs.getInt("stock"))
                .stock_min(rs.getInt("stock_min"))
                .build()
        );

        // --- Producciones Mensuales ---
        String prodMensualesSql = "SELECT EXTRACT(MONTH FROM fec_ini) as mes, COUNT(*) as total FROM produccion WHERE 1=1" + dateFilterSql.replace("#COL", "fec_ini") + " GROUP BY mes ORDER BY mes";
        List<Map<String, Object>> prodMensualesRows = jdbcTemplate.queryForList(prodMensualesSql, params);
        List<Integer> produccionesMensuales = new ArrayList<>(Collections.nCopies(12, 0));
        prodMensualesRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            produccionesMensuales.set(mes, ((Number) row.get("total")).intValue());
        });

        // --- Compras por Proveedor ---
        String compProvSql = "SELECT p.nom_prov as proveedor, SUM(cm.total_comp) as total, COUNT(*) as cantidad " +
                "FROM compras_materiales cm JOIN proveedores p ON cm.id_prov = p.id_prov " +
                "WHERE 1=1" + dateFilterSql.replace("#COL", "cm.fec_comp") + " " +
                "GROUP BY p.nom_prov ORDER BY total DESC LIMIT 5";
        List<DashboardResponse.CompraProveedorDto> comprasProveedor = jdbcTemplate.query(compProvSql, params, (rs, rowNum) ->
            DashboardResponse.CompraProveedorDto.builder()
                .proveedor(rs.getString("proveedor"))
                .total(rs.getDouble("total"))
                .cantidad(rs.getInt("cantidad"))
                .build()
        );

        // --- Stock Muebles ---
        String stockMueblesSql = "SELECT nom_mue as nombre, stock, stock_min FROM muebles WHERE est_mue = true ORDER BY stock DESC LIMIT 8";
        List<DashboardResponse.StockMuebleDto> stockMuebles = jdbcTemplate.query(stockMueblesSql, params, (rs, rowNum) ->
            DashboardResponse.StockMuebleDto.builder()
                .nombre(rs.getString("nombre"))
                .stock(rs.getInt("stock"))
                .stock_min(rs.getInt("stock_min"))
                .build()
        );

        // --- Ventas Cantidad Mensual ---
        String ventasCantSql = "SELECT EXTRACT(MONTH FROM fec_ven) as mes, COUNT(*) as cantidad FROM ventas WHERE LOWER(est_ven) = 'completado'" + dateFilterSql.replace("#COL", "fec_ven") + " GROUP BY mes ORDER BY mes";
        List<Map<String, Object>> ventasCantRows = jdbcTemplate.queryForList(ventasCantSql, params);
        List<Integer> ventasCantidad = new ArrayList<>(Collections.nCopies(12, 0));
        ventasCantRows.forEach(row -> {
            int mes = ((Number) row.get("mes")).intValue() - 1;
            ventasCantidad.set(mes, ((Number) row.get("cantidad")).intValue());
        });

        // --- Conversión Cotizaciones ---
        String totalCotSql = "SELECT COUNT(*) FROM cotizaciones WHERE 1=1" + dateFilterSql.replace("#COL", "fec_cot");
        Integer totalCotizaciones = jdbcTemplate.queryForObject(totalCotSql, params, Integer.class);
        
        String aprobCotSql = "SELECT COUNT(*) FROM cotizaciones WHERE LOWER(est_cot) = 'aprobado'" + dateFilterSql.replace("#COL", "fec_cot");
        Integer aprobadasCotizaciones = jdbcTemplate.queryForObject(aprobCotSql, params, Integer.class);
        
        Double tasaConversion = (totalCotizaciones != null && totalCotizaciones > 0)
                ? Math.round(((double) aprobadasCotizaciones / totalCotizaciones) * 1000.0) / 10.0
                : 0.0;

        // --- BUILD RESPONSE ---
        return DashboardResponse.builder()
                .metrics(DashboardResponse.MetricsDto.builder()
                        .customers(DashboardResponse.MetricDetailDto.builder().total(totalClientes).percentage(0.0).build())
                        .employees(DashboardResponse.MetricDetailDto.builder().total(totalEmpleados).percentage(0.0).build())
                        .ventasDelMes(ventasDelMes)
                        .ventasDelPeriodo(ventasDelPeriodo)
                        .cotizacionesPendientes(cotizacionesPendientes)
                        .produccionesActivas(produccionesActivas)
                        .stockBajo(totalStockBajo)
                        .build())
                .usuarios(DashboardResponse.UsuariosDto.builder()
                        .percentage(porcentajeActivos)
                        .activeUsers(totalUsuariosActivos)
                        .inactiveUsers(totalUsuariosInactivos)
                        .build())
                .ganancias_mensuales(gananciasMensuales)
                .ganancias_ano_anterior(gananciasAnterior)
                .cotizaciones_mensuales(DashboardResponse.CotizacionesMensualesDto.builder()
                        .aprobado(cotAprobado)
                        .rechazado(cotRechazado)
                        .pendiente(cotPendiente)
                        .build())
                .ventas_vs_compras(DashboardResponse.VentasVsComprasDto.builder()
                        .ventas(gananciasMensuales) // in laravel code, it re-used the same values
                        .compras(comprasMensuales)
                        .build())
                .ventas_por_categoria(ventasCategoria)
                .estado_producciones(estadoProducciones)
                .top_muebles(topMuebles)
                .alertas_stock(DashboardResponse.AlertasStockDto.builder()
                        .materiales(alertasMateriales)
                        .muebles(alertasMuebles)
                        .build())
                .conversion_cotizaciones(DashboardResponse.ConversionCotizacionesDto.builder()
                        .tasa(tasaConversion)
                        .total(totalCotizaciones)
                        .aprobadas(aprobadasCotizaciones)
                        .build())
                .producciones_mensuales(produccionesMensuales)
                .compras_por_proveedor(comprasProveedor)
                .stock_muebles(stockMuebles)
                .ventas_cantidad(ventasCantidad)
                .build();
    }
}
