@extends('layouts.reporte_base')

@section('title', 'Reporte de Etapas de Producción')

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
            <h1>Reporte de Etapas de Producción</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de etapas de producción registradas: {{ count($etapasproducciones) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Duración Estimada (días)</th>
        </tr>
    </thead>
    <tbody>
        @foreach($etapasproducciones as $etapa)
        <tr>
            <td>{{ $etapa->cod_eta }}</td>
            <td>{{ $etapa->nom_eta }}</td>
            <td>{{ $etapa->desc_eta }}</td>
            <td>{{ $etapa->duracion_estimada }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
