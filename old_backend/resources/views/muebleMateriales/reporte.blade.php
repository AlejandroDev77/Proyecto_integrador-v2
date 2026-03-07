@extends('layouts.reporte_base')

@section('title', 'Reporte de Muebles y Materiales')

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
            <h1>Reporte de Muebles y Materiales</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de relaciones registradas: {{ count($muebleMateriales) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Mueble</th>
            <th>Material</th>
            <th>Cantidad</th>
        </tr>
    </thead>
    <tbody>
        @foreach($muebleMateriales as $relacion)
        <tr>
            <td>{{ $relacion->cod_rel }}</td>
            <td>{{ $relacion->mueble->nom_mue }}</td>
            <td>{{ $relacion->material->nom_mat }}</td>
            <td>{{ $relacion->cantidad }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
