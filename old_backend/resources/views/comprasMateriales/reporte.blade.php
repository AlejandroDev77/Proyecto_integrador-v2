@extends('layouts.reporte_base')

@section('title', 'Reporte de Compras de Materiales')

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
            <h1>Reporte de Compras de Materiales</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de compras realizadas: {{ count($comprasMateriales) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Proveedor</th>
            <th>Empleado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($comprasMateriales as $compra)
        <tr>
            <td>{{ $compra->cod_comp }}</td>
            <td>{{ $compra->fec_comp }}</td>
            <td>{{ $compra->est_comp }}</td>
            <td>{{ $compra->total_comp }}</td>
            <td>{{ $compra->proveedor->nom_prov }}</td>
            <td>{{ $compra->empleado->nom_emp }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
