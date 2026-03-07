@extends('layouts.reporte_base')

@section('title', 'Reporte de Producciones')

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
            <h1>Reporte de Producciones</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de producciones registradas: {{ count($producciones) }}</p>
    <p>Producciones En Proceso: {{ $producciones->where('est_prod', 'En Proceso')->count() }}</p>
    <p>Producciones Completadas: {{ $producciones->where('est_prod', 'Completada')->count() }}</p>
    <p>Producciones Canceladas: {{ $producciones->where('est_prod', 'Cancelada')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Notas</th>
            <th>Empleado</th>
            <th>Venta/Cotización</th>
        </tr>
    </thead>
    <tbody>
        @foreach($producciones as $produccion)
        <tr>
            <td>{{ $produccion->cod_pro }}</td>
            <td>{{ $produccion->fec_ini }}</td>
            <td>{{ $produccion->fec_fin }}</td>
            <td>{{ $produccion->est_prod }}</td>
            <td>{{ $produccion->notas }}</td>
            <td>{{ $produccion->empleado?->nom_emp ?? 'N/A' }}</td>
            <td>
                @if($produccion->id_ven)
                    Venta #{{ str_pad($produccion->id_ven, 4, '0', STR_PAD_LEFT) }}
                @elseif($produccion->id_cot)
                    Cotización #{{ str_pad($produccion->id_cot, 4, '0', STR_PAD_LEFT) }}
                @endif
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
