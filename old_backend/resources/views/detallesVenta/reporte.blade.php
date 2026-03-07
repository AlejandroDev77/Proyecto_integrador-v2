@extends('layouts.reporte_base')

@section('title', 'Reporte de Detalles de Venta')

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
            <h1>Reporte de Detalles de Venta</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de detalles de venta registrados: {{ count($detallesVenta) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Descuento</th>
            <th>Venta</th>
            <th>Estado Venta</th>
            <th>Mueble</th>
        </tr>
    </thead>
    <tbody>
        @foreach($detallesVenta as $detalle)
        <tr>
            <td>{{ $detalle->cod_det_ven }}</td>
            <td>{{ $detalle->cantidad }}</td>
            <td>{{ $detalle->precio_unitario }}</td>
            <td>{{ $detalle->subtotal }}</td>
            <td>{{ $detalle->descuento_item }}</td>
            <td>{{ $detalle->venta->fec_ven }}</td>
            <td>{{ $detalle->venta->est_ven }}</td>
            <td>{{ $detalle->mueble->nom_mue }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
