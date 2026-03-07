@extends('layouts.reporte_base')

@section('title', 'Reporte de Devoluciones')

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
            <h1>Reporte de Devoluciones</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de devoluciones registradas: {{ count($devoluciones) }}</p>
    <p>Devoluciones pendientes: {{ $devoluciones->where('est_dev', 'Pendiente')->count() }}</p>
    <p>Devoluciones completadas: {{ $devoluciones->where('est_dev', 'Completada')->count() }}</p>
    <p>Devoluciones canceladas: {{ $devoluciones->where('est_dev', 'Cancelada')->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Venta</th>
            <th>Empleado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($devoluciones as $devolucion)
        <tr>
            <td>{{ $devolucion->cod_dev }}</td>
            <td>{{ $devolucion->fec_dev }}</td>
            <td>{{ $devolucion->est_dev }}</td>
            <td>{{ $devolucion->desc_dev }}</td>
            <td>{{ str_pad($devolucion->venta->id_ven, 4, '0', STR_PAD_LEFT) }}</td>
            <td>{{ $devolucion->empleado->nom_emp }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
