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
        .credentials {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #8b4513;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .credentials p {
            margin: 10px 0;
            color: #2c3e50;
        }
        .credentials strong {
            color: #8b4513;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e1e8ed;
            font-size: 0.9em;
            color: #7f8c8d;
        }
        .important-note {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Bosquejo Muebles</h1>
        </div>
        
        <div class="content">
            <p>Estimado(a) <strong>{{ $name }}</strong>,</p>
            
            <p>¡Bienvenido a la familia de Bosquejo Muebles! Tu cuenta ha sido creada exitosamente. A continuación, encontrarás tus credenciales de acceso al sistema:</p>
            
            <div class="credentials">
                <p><strong>Usuario:</strong> {{ $name}}</p>
                <p><strong>Correo:</strong> {{ $email }}</p>
                <p><strong>Contraseña:</strong> {{ $password }}</p>
                <p><strong>Código de Usuario:</strong> {{ $codigo }}</p>
            </div>
            
            <div class="important-note">
                <p><strong>¡Importante!</strong> Para mantener la seguridad de tu cuenta, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
            </div>
            
            <p>Con estas credenciales podrás acceder a nuestro sistema de gestión de muebles, donde podrás realizar seguimiento de pedidos, consultar inventarios y mucho más.</p>
            
            <p>Si no solicitaste esta cuenta o tienes alguna pregunta, por favor contacta con nuestro equipo de soporte.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Bosquejo Muebles</p>
            <p>Este es un mensaje automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html>
