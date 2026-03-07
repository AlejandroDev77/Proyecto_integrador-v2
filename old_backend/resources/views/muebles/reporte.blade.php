@extends('layouts.reporte_base')

@section('title', 'Reporte de Muebles')

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
            <h1>Reporte de Muebles</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de muebles registrados: {{ count($muebles) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Venta</th>
            <th>Stock</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($muebles as $mueble)
        <tr>
            <td>{{ $mueble->cod_mue }}</td>
            <td>{{ $mueble->nom_mue }}</td>
            <td>{{ $mueble->desc_mue }}</td>
            <td>{{ $mueble->precio_venta }}</td>
            <td>{{ $mueble->stock }}</td>
            <td>
                <span class="estado {{ $mueble->est_mue ? 'estado-activo' : 'estado-inactivo' }}">
                    {{ $mueble->est_mue ? 'Activo' : 'Inactivo' }}
                </span>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
