from jinja2 import Template
from datetime import datetime

TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte QA</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #1F4E79; border-bottom: 3px solid #1F4E79; padding-bottom: 8px; }
    h2 { color: #2E75B6; margin-top: 30px; }
    .meta { background: #EBF3FB; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .meta span { margin-right: 30px; font-weight: bold; }
    .badge { padding: 4px 12px; border-radius: 4px; color: white; font-weight: bold; font-size: 13px; }
    .pass { background-color: #375623; }
    .fail { background-color: #833C00; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #1F4E79; color: white; padding: 10px; text-align: left; }
    td { padding: 9px 10px; border-bottom: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) { background: #F7F9FC; }
    .screenshot { margin: 10px 0 20px; }
    .screenshot img { max-width: 700px; border: 1px solid #ccc; border-radius: 4px; }
    .timestamp { color: #888; font-size: 12px; margin-top: 40px; }
  </style>
</head>
<body>
  <h1>Reporte de Ejecución QA</h1>

  <div class="meta">
    <span>ID: {{ execution_id }}</span>
    <span>Fecha: {{ fecha }}</span>
    <span>Estado: {{ estado }}</span>
    <span>Total: {{ total }}</span>
    <span style="color: #375623;">✔ Pasados: {{ pasados }}</span>
    <span style="color: #833C00;">✘ Fallidos: {{ fallidos }}</span>
  </div>

  {% for resultado in resultados %}
  <h2>{{ resultado.nombre }} — {{ resultado.modulo }}</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Acción</th>
        <th>Esperado</th>
        <th>Obtenido</th>
        <th>Estado</th>
        <th>Tiempo</th>
      </tr>
    </thead>
    <tbody>
      {% for step in resultado.pasos %}
      <tr>
        <td>{{ step.paso }}</td>
        <td>{{ step.entrada_accion or '' }}</td>
        <td>{{ step.resultado_esperado or '' }}</td>
        <td>{{ step.resultado_obtenido or '' }}</td>
        <td><span class="badge {{ step.estado }}">{{ step.estado }}</span></td>
        <td>{{ step.tiempo_ms or 0 }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <h3>Evidencias</h3>
  {% for step in resultado.pasos %}
  <div class="screenshot">
    <strong>Paso {{ step.paso }}: {{ step.entrada_accion }}</strong>
    {% if step.screenshot_path %}
    <br><img src="{{ step.screenshot_path }}" alt="Paso {{ step.paso }}">
    {% else %}
    <p>(Sin screenshot)</p>
    {% endif %}
  </div>
  {% endfor %}
  {% endfor %}

  <p class="timestamp">Generado el {{ fecha }}</p>
</body>
</html>
"""

def generar_html(data: dict, output_path: str):
    template = Template(TEMPLATE)
    html = template.render(
        execution_id=data["execution_id"],
        fecha=datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        estado=data["estado"].upper(),
        total=data["total"],
        pasados=data["pasados"],
        fallidos=data["fallidos"],
        resultados=data["resultados"]
    )
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    return output_path