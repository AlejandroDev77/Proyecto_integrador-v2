@extends('layouts.reporte_base')

@section('title', 'Reporte de Usuarios')

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
            <h1>Reporte de Usuarios del Sistema</h1>
            <div class="subtitle">Sistema de Gestión de Muebles</div>
        </div>
    </div>
</div>

<div class="report-summary">
    <h2>Resumen del Reporte</h2>
    <p>Total de usuarios registrados: {{ count($usuarios) }}</p>
    <p>Usuarios activos: {{ $usuarios->where('est_usu', true)->count() }}</p>
    <p>Usuarios inactivos: {{ $usuarios->where('est_usu', false)->count() }}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Codigo</th>
            <th>Nombre de Usuario</th>
            <th>Correo Electrónico</th>
            <th>Rol Asignado</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        @foreach($usuarios as $usuario)
        <tr>
            <td>{{ $usuario->cod_usu }}</td>
            <td>{{ $usuario->nom_usu }}</td>
            <td>{{ $usuario->email_usu }}</td>
            <td>{{ $usuario->rol->nom_rol ?? 'Sin rol asignado' }}</td>
            <td>
                <span class="estado {{ $usuario->est_usu ? 'estado-activo' : 'estado-inactivo' }}">
                    {{ $usuario->est_usu ? 'Activo' : 'Inactivo' }}
                </span>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
