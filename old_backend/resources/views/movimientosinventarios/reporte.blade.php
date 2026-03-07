@extends('layouts.reporte_base')

@section('title', 'Reporte de Movimientos de Inventario')

@section('content')
<div class="header">
    <div class="header-info">
        <div class="company-info">
            <div class="fecha">
                <strong>Fecha de generación:</strong> {{ now()->setTimezone('America/La_Paz')->format('d/m/Y H:i:s') }}
            </div>
            <strong>Bosquejo</strong><br>
            Av. Principal Mallasa<br>
            La Paz, Bolivia<br>
            Tel: 69769286
        </div>
    </div>
    <div class="header-content">
        <div class="logo-container">
            <img src="{{ public_path('images/logo.png') }}" alt="Logo">
        </div>
        <div class="report-info">
            <h1>Reporte de Movimientos de Inventario</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de movimientos registrados: {{ count($movimientosinventarios) }}</p>
    <p>Entradas: {{ $movimientosinventarios->where('tipo_mov', 'Entrada')->count() }}</p>
    <p>Salidas: {{ $movimientosinventarios->where('tipo_mov', 'Salida')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Material/Mueble</th>
            <th>Referencia</th>
            <th>Empleado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($movimientosinventarios as $movimiento)
        <tr>
            <td>{{ $movimiento->cod_mov }}</td>
            <td>{{ $movimiento->fec_mov }}</td>
            <td>{{ $movimiento->tipo_mov }}</td>
            <td>{{ $movimiento->cantidad }}</td>
            <td>
                @if($movimiento->id_mat)
                    Material: {{ $movimiento->material->nom_mat }}
                @elseif($movimiento->id_mue)
                    Mueble: {{ $movimiento->mueble->nom_mue }}
                @endif
            </td>
            <td>
                @if($movimiento->id_ven)
                    Venta #{{ str_pad($movimiento->id_ven, 4, '0', STR_PAD_LEFT) }}
                @elseif($movimiento->id_prod)
                    Producción #{{ str_pad($movimiento->id_prod, 4, '0', STR_PAD_LEFT) }}
                @elseif($movimiento->id_comp)
                    Compra #{{ str_pad($movimiento->id_comp, 4, '0', STR_PAD_LEFT) }}
                @elseif($movimiento->id_dev)
                    Devolución #{{ str_pad($movimiento->id_dev, 4, '0', STR_PAD_LEFT) }}
                @endif
            </td>
            <td>{{ $movimiento->empleado?->nom_emp ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
