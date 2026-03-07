@extends('layouts.reporte_base')

@section('title', 'Reporte de Pagos')

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
            <h1>Reporte de Pagos</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de pagos registrados: {{ count($pagos) }}</p>
    <p>Pagos por Efectivo: {{ $pagos->where('metodo_pag', 'Efectivo')->count() }}</p>
    <p>Pagos por Tarjeta: {{ $pagos->where('metodo_pag', 'Tarjeta')->count() }}</p>
    <p>Pagos por Transferencia: {{ $pagos->where('metodo_pag', 'Transferencia')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha</th>
            <th>Método</th>
            <th>Referencia</th>
            <th>Estado Venta</th>

        </tr>
    </thead>
    <tbody>
        @foreach($pagos as $pago)
        <tr>
            <td>{{ $pago->cod_pag }}</td>
            <td>{{ $pago->fec_pag }}</td>
            <td>{{ $pago->monto_pag }}</td>
            <td>{{ $pago->metodo_pag }}</td>
            <td>{{ str_pad($pago->venta->id_ven, 4, '0', STR_PAD_LEFT) }}</td>

        </tr>
        @endforeach
    </tbody>
</table>
@endsection
