<?php

namespace App\Services;

use App\Models\Mueble;
use App\Models\Material;
use App\Models\MovimientoInventario;
use App\Models\MuebleMaterial;
use Illuminate\Support\Facades\DB;

class InventarioService
{
    /**
     * Descontar stock de un mueble (usado en ventas)
     * 
     * @param int $idMueble
     * @param int $cantidad
     * @param int $idEmpleado
     * @param int|null $idVenta
     * @param string|null $motivo
     * @return bool
     * @throws \Exception
     */
    public function descontarStockMueble(
        int $idMueble, 
        int $cantidad, 
        int $idEmpleado,
        ?int $idVenta = null,
        ?string $motivo = null
    ): bool {
        $mueble = Mueble::findOrFail($idMueble);
        
        if ($mueble->stock < $cantidad) {
            throw new \Exception("Stock insuficiente para el mueble {$mueble->nom_mue}. Stock disponible: {$mueble->stock}, Requerido: {$cantidad}");
        }

        $stockAnterior = $mueble->stock;
        $stockPosterior = $stockAnterior - $cantidad;

        DB::transaction(function () use ($mueble, $cantidad, $stockAnterior, $stockPosterior, $idEmpleado, $idVenta, $motivo) {
            // Actualizar stock del mueble
            $mueble->stock = $stockPosterior;
            $mueble->save();

            // Registrar movimiento de inventario
            $this->registrarMovimiento(
                tipoMov: 'SALIDA',
                cantidad: $cantidad,
                stockAnterior: $stockAnterior,
                stockPosterior: $stockPosterior,
                idEmpleado: $idEmpleado,
                idMueble: $mueble->id_mue,
                idVenta: $idVenta,
                motivo: $motivo ?? 'Venta de mueble'
            );
        });

        return true;
    }

    /**
     * Incrementar stock de un mueble (usado en devoluciones y producción)
     * 
     * @param int $idMueble
     * @param int $cantidad
     * @param int $idEmpleado
     * @param int|null $idDevolucion
     * @param int|null $idProduccion
     * @param string|null $motivo
     * @return bool
     */
    public function incrementarStockMueble(
        int $idMueble,
        int $cantidad,
        int $idEmpleado,
        ?int $idDevolucion = null,
        ?int $idProduccion = null,
        ?string $motivo = null
    ): bool {
        $mueble = Mueble::findOrFail($idMueble);
        
        $stockAnterior = $mueble->stock;
        $stockPosterior = $stockAnterior + $cantidad;

        DB::transaction(function () use ($mueble, $cantidad, $stockAnterior, $stockPosterior, $idEmpleado, $idDevolucion, $idProduccion, $motivo) {
            // Actualizar stock del mueble
            $mueble->stock = $stockPosterior;
            $mueble->save();

            // Registrar movimiento de inventario
            $this->registrarMovimiento(
                tipoMov: 'ENTRADA',
                cantidad: $cantidad,
                stockAnterior: $stockAnterior,
                stockPosterior: $stockPosterior,
                idEmpleado: $idEmpleado,
                idMueble: $mueble->id_mue,
                idDevolucion: $idDevolucion,
                idProduccion: $idProduccion,
                motivo: $motivo ?? ($idDevolucion ? 'Devolución de mueble' : 'Producción de mueble')
            );
        });

        return true;
    }

    /**
     * Incrementar stock de un material (usado en compras)
     * 
     * @param int $idMaterial
     * @param float $cantidad
     * @param int $idEmpleado
     * @param int|null $idCompra
     * @param string|null $motivo
     * @return bool
     */
    public function incrementarStockMaterial(
        int $idMaterial,
        float $cantidad,
        int $idEmpleado,
        ?int $idCompra = null,
        ?string $motivo = null
    ): bool {
        $material = Material::findOrFail($idMaterial);
        
        $stockAnterior = $material->stock_mat;
        $stockPosterior = $stockAnterior + $cantidad;

        DB::transaction(function () use ($material, $cantidad, $stockAnterior, $stockPosterior, $idEmpleado, $idCompra, $motivo) {
            // Actualizar stock del material
            $material->stock_mat = $stockPosterior;
            $material->save();

            // Registrar movimiento de inventario
            $this->registrarMovimiento(
                tipoMov: 'ENTRADA',
                cantidad: $cantidad,
                stockAnterior: $stockAnterior,
                stockPosterior: $stockPosterior,
                idEmpleado: $idEmpleado,
                idMaterial: $material->id_mat,
                idCompra: $idCompra,
                motivo: $motivo ?? 'Compra de material'
            );
        });

        return true;
    }

    /**
     * Descontar stock de un material (usado en producción)
     * 
     * @param int $idMaterial
     * @param float $cantidad
     * @param int $idEmpleado
     * @param int|null $idProduccion
     * @param string|null $motivo
     * @return bool
     * @throws \Exception
     */
    public function descontarStockMaterial(
        int $idMaterial,
        float $cantidad,
        int $idEmpleado,
        ?int $idProduccion = null,
        ?string $motivo = null
    ): bool {
        $material = Material::findOrFail($idMaterial);
        
        if ($material->stock_mat < $cantidad) {
            throw new \Exception("Stock insuficiente para el material {$material->nom_mat}. Stock disponible: {$material->stock_mat}, Requerido: {$cantidad}");
        }

        $stockAnterior = $material->stock_mat;
        $stockPosterior = $stockAnterior - $cantidad;

        DB::transaction(function () use ($material, $cantidad, $stockAnterior, $stockPosterior, $idEmpleado, $idProduccion, $motivo) {
            // Actualizar stock del material
            $material->stock_mat = $stockPosterior;
            $material->save();

            // Registrar movimiento de inventario
            $this->registrarMovimiento(
                tipoMov: 'SALIDA',
                cantidad: $cantidad,
                stockAnterior: $stockAnterior,
                stockPosterior: $stockPosterior,
                idEmpleado: $idEmpleado,
                idMaterial: $material->id_mat,
                idProduccion: $idProduccion,
                motivo: $motivo ?? 'Uso de material en producción'
            );
        });

        return true;
    }

    /**
     * Descontar materiales necesarios para producir un mueble
     * 
     * @param int $idMueble
     * @param int $cantidadMuebles
     * @param int $idEmpleado
     * @param int $idProduccion
     * @return array Lista de materiales descontados
     * @throws \Exception
     */
    public function descontarMaterialesParaProduccion(
        int $idMueble,
        int $cantidadMuebles,
        int $idEmpleado,
        int $idProduccion
    ): array {
        $materialesUsados = [];
        
        // Obtener los materiales necesarios para el mueble
        $muebleMateriales = MuebleMaterial::where('id_mue', $idMueble)->get();

        if ($muebleMateriales->isEmpty()) {
            throw new \Exception("No hay materiales definidos para este mueble. Configure la receta en mueble_material.");
        }

        // Verificar stock de todos los materiales primero
        foreach ($muebleMateriales as $mm) {
            $cantidadNecesaria = $mm->cantidad * $cantidadMuebles;
            $material = Material::find($mm->id_mat);
            
            if (!$material) {
                throw new \Exception("Material con ID {$mm->id_mat} no encontrado.");
            }
            
            if ($material->stock_mat < $cantidadNecesaria) {
                throw new \Exception(
                    "Stock insuficiente de {$material->nom_mat}. " .
                    "Disponible: {$material->stock_mat} {$material->unidad_medida}, " .
                    "Necesario: {$cantidadNecesaria} {$material->unidad_medida}"
                );
            }
        }

        // Descontar cada material
        DB::transaction(function () use ($muebleMateriales, $cantidadMuebles, $idEmpleado, $idProduccion, &$materialesUsados) {
            foreach ($muebleMateriales as $mm) {
                $cantidadNecesaria = $mm->cantidad * $cantidadMuebles;
                
                $this->descontarStockMaterial(
                    idMaterial: $mm->id_mat,
                    cantidad: $cantidadNecesaria,
                    idEmpleado: $idEmpleado,
                    idProduccion: $idProduccion,
                    motivo: "Uso en producción (x{$cantidadMuebles} muebles)"
                );

                $materialesUsados[] = [
                    'id_mat' => $mm->id_mat,
                    'cantidad_usada' => $cantidadNecesaria
                ];
            }
        });

        return $materialesUsados;
    }

    /**
     * Registrar un movimiento de inventario
     */
    private function registrarMovimiento(
        string $tipoMov,
        float $cantidad,
        float $stockAnterior,
        float $stockPosterior,
        int $idEmpleado,
        ?int $idMueble = null,
        ?int $idMaterial = null,
        ?int $idVenta = null,
        ?int $idProduccion = null,
        ?int $idCompra = null,
        ?int $idDevolucion = null,
        ?string $motivo = null
    ): MovimientoInventario {
        // Generar código automáticamente
        $nextId = 1;
        do {
            $codMov = 'MOV-' . $nextId;
            $nextId++;
        } while (MovimientoInventario::where('cod_mov', $codMov)->exists());

        return MovimientoInventario::create([
            'cod_mov' => $codMov,
            'tipo_mov' => $tipoMov,
            'fecha_mov' => now(),
            'cantidad' => $cantidad,
            'stock_anterior' => $stockAnterior,
            'stock_posterior' => $stockPosterior,
            'id_emp' => $idEmpleado,
            'id_mue' => $idMueble,
            'id_mat' => $idMaterial,
            'id_ven' => $idVenta,
            'id_pro' => $idProduccion,
            'id_comp' => $idCompra,
            'id_dev' => $idDevolucion,
            'motivo' => $motivo,
        ]);
    }

    /**
     * Verificar si hay stock suficiente de un mueble
     */
    public function verificarStockMueble(int $idMueble, int $cantidad): bool
    {
        $mueble = Mueble::find($idMueble);
        return $mueble && $mueble->stock >= $cantidad;
    }

    /**
     * Verificar si hay stock suficiente de un material
     */
    public function verificarStockMaterial(int $idMaterial, float $cantidad): bool
    {
        $material = Material::find($idMaterial);
        return $material && $material->stock_mat >= $cantidad;
    }

    /**
     * Verificar si hay materiales suficientes para producir muebles
     */
    public function verificarMaterialesParaProduccion(int $idMueble, int $cantidadMuebles): array
    {
        $muebleMateriales = MuebleMaterial::where('id_mue', $idMueble)->get();
        $resultado = ['disponible' => true, 'faltantes' => []];

        foreach ($muebleMateriales as $mm) {
            $cantidadNecesaria = $mm->cantidad * $cantidadMuebles;
            $material = Material::find($mm->id_mat);
            
            if (!$material || $material->stock_mat < $cantidadNecesaria) {
                $resultado['disponible'] = false;
                $resultado['faltantes'][] = [
                    'material' => $material ? $material->nom_mat : "Material ID: {$mm->id_mat}",
                    'disponible' => $material ? $material->stock_mat : 0,
                    'necesario' => $cantidadNecesaria,
                    'faltante' => $cantidadNecesaria - ($material ? $material->stock_mat : 0)
                ];
            }
        }

        return $resultado;
    }
}
