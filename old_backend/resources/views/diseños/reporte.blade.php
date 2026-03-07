@extends('layouts.reporte_base')

@section('title', 'Reporte de Diseños')

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
            <h1>Reporte de Diseños</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de diseños registrados: {{ count($diseños) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Cotización</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($diseños as $diseño)
        <tr>
            <td>{{ $diseño->cod_dis }}</td>
            <td>{{ $diseño->nom_dis }}</td>
            <td>{{ $diseño->desc_dis }}</td>
            <td>{{ $diseño->img_dis }}</td>
            <td>{{ str_pad($diseño->cotizacion->id_cot, 4, '0', STR_PAD_LEFT) }}</td>
            <td>{{ $diseño->est_dis ? 'Activo' : 'Inactivo' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
