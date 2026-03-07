@extends('layouts.reporte_base')

@section('title', 'Reporte de Detalles de Cotizaciones')

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
            <h1>Reporte de Detalles de Cotizaciones</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de detalles de cotización registrados: {{ count($detallesCotizaciones) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Cotización</th>
            <th>Estado</th>
            <th>Mueble</th>
        </tr>
    </thead>
    <tbody>
        @foreach($detallesCotizaciones as $detalle)
        <tr>
            <td>{{ $detalle->cod_det_cot }}</td>
            <td>{{ $detalle->cantidad }}</td>
            <td>{{ $detalle->precio_unitario }}</td>
            <td>{{ $detalle->subtotal }}</td>
            <td>{{ $detalle->cotizacion->fec_cot }}</td>
            <td>{{ $detalle->cotizacion->est_cot }}</td>
            <td>{{ $detalle->mueble->nom_mue }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
