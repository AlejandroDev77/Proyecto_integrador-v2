<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #8b4513;
            background-image: linear-gradient(to right, #8b4513, #d2691e);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e1e8ed;
            border-top: none;
        }
        .project-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #8b4513;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .project-info p {
            margin: 10px 0;
            color: #2c3e50;
        }
        .project-info strong {
            color: #8b4513;
        }
        .contact-details {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e1e8ed;
            font-size: 0.9em;
            color: #7f8c8d;
        }
        .priority-tag {
            display: inline-block;
            background-color: #8b4513;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Bosquejo Muebles</h1>
        </div>
        
        <div class="content">
            <div class="priority-tag">Nuevo Proyecto Potencial</div>
            
            <p>Se ha recibido una nueva solicitud de proyecto de fabricación de muebles con los siguientes detalles:</p>
            
            <div class="contact-details">
                <p><strong>Cliente:</strong> {{ $nombre }}</p>
                <p><strong>Email:</strong> {{ $email }}</p>
                @if($telefono)
                <p><strong>Teléfono:</strong> {{ $telefono }}</p>
                @endif
                <p><strong>Fecha de contacto:</strong> {{ $fecha }}</p>
            </div>
            
            <div class="project-info">
                <h3 style="color: #8b4513; margin-top: 0;">Detalles del Proyecto</h3>
                <p style="white-space: pre-line;">{{ $mensaje }}</p>
            </div>
            
            <p><strong>Acciones recomendadas:</strong></p>
            <ul>
                <li>Revisar los detalles del proyecto y requisitos específicos</li>
                <li>Contactar al cliente dentro de las próximas 24 horas</li>
                <li>Preparar una propuesta inicial basada en la información proporcionada</li>
                <li>Agendar una reunión de consultoría si es necesario</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2025 Bosquejo Muebles - Fabricación de Muebles a Medida</p>
            <p>Este es un mensaje interno, por favor dar seguimiento prioritario.</p>
        </div>
    </div>
</body>
</html>