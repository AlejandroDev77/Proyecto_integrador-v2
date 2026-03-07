@extends('layouts.reporte_base')

@section('title', 'Reporte de Ventas')

@section('content')
<div class="header">
    <div class="header-info">
        <div class="company-info">
            <div class="fecha">
                <strong>Fecha de generación:</strong> {{ now()->setTimezone('America/La_Paz')->format('d/m/Y H:i:s') }}
            </div>
            <strong>Muebles Bolivia</strong><br>
            Av. América #1234<br>
            La Paz, Bolivia<br>
            Tel: (+591) 2-1234567
        </div>
    </div>
    <div class="header-content">
        <div class="logo-container">
            <img src="{{ public_path('images/logo.png') }}" alt="Logo">
        </div>
        <div class="report-info">
            <h1>Reporte de Ventas</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de ventas realizadas: {{ count($ventas) }}</p>
    <p>Ventas completadas: {{ $ventas->where('est_ven', 'Completado')->count() }}</p>
    <p>Ventas canceladas: {{ $ventas->where('est_ven', 'Cancelada')->count() }}</p>
    <p>Ventas pendientes: {{ $ventas->where('est_ven', 'Pendiente')->count() }}</p>
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
        @foreach($ventas as $venta)
        <tr>
            <td>{{ $venta->cod_ven }}</td>
            <td>{{ $venta->fec_ven }}</td>
            <td>{{ $venta->est_ven }}</td>
            <td>{{ $venta->total_ven }}</td>
            <td>{{ $venta->cliente?->nom_cli ?? 'N/A' }}</td>
            <td>{{ $venta->empleado?->nom_emp ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
