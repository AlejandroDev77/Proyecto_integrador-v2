<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title')</title>
    <style>
        @page {
            size: letter;
            margin: 2.54cm 2.54cm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .header {
            margin-bottom: 30px;
            position: relative;
            padding-top: 30px;
        }

        .header-info {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
        }

        .fecha {
            color: #4a5568;
            font-size: 13px;
            margin-bottom: 8px;
        }

        .header-content {
            text-align: center;
            position: relative;
            padding-top: 80px;
            margin-top: 40px;
        }

        .logo-container {
            position: absolute;
            left: 0;
            top: -20px;
        }

        .logo-container img {
            height: 100px;
            width: auto;
            object-fit: contain;
        }

        .report-info {
            text-align: center;
            flex: 1;
            max-width: 600px;
            margin: 30px auto 0;
        }

        .company-info {
            text-align: right;
            font-size: 13px;
            line-height: 1.6;
            color: #4a5568;
        }

        .header h1 {
            color: #1a202c;
            font-size: 22px;
            margin: 0 0 8px 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .subtitle {
            color: #4a5568;
            font-size: 15px;
            margin-top: 0;
            font-weight: 500;
        }

        .fecha {
            text-align: right;
            color: #4a5568;
            font-size: 13px;
            margin: 20px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .report-summary {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }

        .report-summary h2 {
            color: #1a202c;
            font-size: 18px;
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .report-summary p {
            margin: 8px 0;
            font-size: 14px;
            color: #4a5568;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 13px;
        }

        th {
            background-color: #2d3748;
            color: white;
            font-weight: 600;
            padding: 12px;
            text-align: left;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .estado {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
            text-transform: uppercase;
        }

        .estado-activo {
            background-color: #def7ec;
            color: #046c4e;
        }

        .estado-inactivo {
            background-color: #fde8e8;
            color: #9b1c1c;
        }
    </style>
</head>
<body>
    @yield('content')
</body>
</html>