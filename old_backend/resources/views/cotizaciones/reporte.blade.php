@extends('layouts.reporte_base')

@section('title', 'Reporte de Cotizaciones')

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
            <h1>Reporte de Cotizaciones</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de cotizaciones registradas: {{ count($cotizaciones) }}</p>
    <p>Cotizaciones Pendientes: {{ $cotizaciones->where('est_cot', 'Pendiente')->count() }}</p>
    <p>Cotizaciones Aprobadas: {{ $cotizaciones->where('est_cot', 'Aprobada')->count() }}</p>
    <p>Cotizaciones Rechazadas: {{ $cotizaciones->where('est_cot', 'Rechazada')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Cliente</th>
            <th>Empleado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($cotizaciones as $cotizacion)
        <tr>
            <td>{{ $cotizacion->cod_cot }}</td>
            <td>{{ $cotizacion->fec_cot }}</td>
            <td>{{ $cotizacion->est_cot }}</td>
            <td>{{ $cotizacion->total_cot }}</td>
            <td>{{ $cotizacion->cliente->nom_cli }}</td>
            <td>{{ $cotizacion->empleado->nom_emp }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
