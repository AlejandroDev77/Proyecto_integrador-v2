@extends('layouts.reporte_base')

@section('title', 'Reporte de Producción por Etapas')

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
            <h1>Reporte de Producción por Etapas</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de registros de producción por etapas: {{ count($produccionesetapas) }}</p>
    <p>Etapas En Proceso: {{ $produccionesetapas->where('est_prod_eta', 'En Proceso')->count() }}</p>
    <p>Etapas Completadas: {{ $produccionesetapas->where('est_prod_eta', 'Completada')->count() }}</p>
    <p>Etapas Pendientes: {{ $produccionesetapas->where('est_prod_eta', 'Pendiente')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Producción</th>
            <th>Etapa</th>
            <th>Empleado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Observaciones</th>
        </tr>
    </thead>
    <tbody>
        @foreach($produccionesetapas as $produccionEtapa)
        <tr>
            <td>{{ $produccionEtapa->cod_pro_eta }}</td>
            <td>{{ $produccionEtapa->etapa?->nom_eta ?? 'N/A' }}</td>
            <td>{{ $produccionEtapa->empleado?->nom_emp ?? 'N/A' }}</td>
            <td>{{ $produccionEtapa->fec_ini_eta }}</td>
            <td>{{ $produccionEtapa->fec_fin_eta }}</td>
            <td>{{ $produccionEtapa->est_prod_eta }}</td>
            <td>{{ $produccionEtapa->observaciones }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
