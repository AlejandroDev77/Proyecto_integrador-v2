@extends('layouts.reporte_base')

@section('title', 'Reporte de Proveedores')

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
            <h1>Reporte de Proveedores</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de proveedores registrados: {{ count($proveedores) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($proveedores as $proveedor)
        <tr>
            <td>{{ $proveedor->cod_prov }}</td>
            <td>{{ $proveedor->nom_prov }}</td>
            <td>{{ $proveedor->contacto_prov }}</td>
            <td>{{ $proveedor->tel_prov }}</td>
            <td>{{ $proveedor->email_prov }}</td>
            <td>{{ $proveedor->dir_prov }}</td>
            <td>
                <span class="estado {{ $proveedor->est_prov ? 'estado-activo' : 'estado-inactivo' }}">
                    {{ $proveedor->est_prov ? 'Activo' : 'Inactivo' }}
                </span>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
