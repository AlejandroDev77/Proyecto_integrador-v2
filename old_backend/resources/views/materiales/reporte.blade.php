@extends('layouts.reporte_base')

@section('title', 'Reporte de Materiales')

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
            <h1>Reporte de Materiales</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de materiales registrados: {{ count($materiales) }}</p>
    <p>Materiales activos: {{ $materiales->where('est_mat', true)->count() }}</p>
    <p>Materiales inactivos: {{ $materiales->where('est_mat', false)->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Unidad de Medida</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($materiales as $material)
        <tr>
            <td>{{ $material->cod_mat }}</td>
            <td>{{ $material->nom_mat }}</td>
            <td>{{ $material->desc_mat }}</td>
            <td>{{ $material->stock_mat }}</td>
            <td>{{ $material->unidad_medida }}</td>
            <td>
                <span class="estado {{ $material->est_mat ? 'estado-activo' : 'estado-inactivo' }}">
                    {{ $material->est_mat ? 'Activo' : 'Inactivo' }}
                </span>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
