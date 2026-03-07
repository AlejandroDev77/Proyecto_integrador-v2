@extends('layouts.reporte_base')

@section('title', 'Reporte de Clientes')

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
            <h1>Reporte de Clientes</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de clientes registrados: {{ count($clientes) }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Celular</th>
            <th>Dirección</th>
        </tr>
    </thead>
    <tbody>
        @foreach($clientes as $cliente)
        <tr>
            <td>{{ $cliente->cod_cli }}</td>
            <td>{{ $cliente->nom_cli }}</td>
            <td>{{ $cliente->ap_pat_cli }}</td>
            <td>{{ $cliente->ap_mat_cli }}</td>
            <td>{{ $cliente->cel_cli }}</td>
            <td>{{ $cliente->dir_cli }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
