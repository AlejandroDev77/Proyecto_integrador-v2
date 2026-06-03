import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

# Configuración — cambiá estos valores por los tuyos
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "dylanpoma4@gmail.com"
SMTP_PASSWORD = "wmknschmzekbyrmh"  # App password de Google, no tu contraseña normal

def enviar_reporte(email_destino: str, execution_id: str, resumen: dict):
    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = email_destino
    msg["Subject"] = f"Reporte QA — Ejecución {execution_id[:8]}..."

    # Cuerpo del correo
    cuerpo = f"""
    <html><body>
    <h2 style="color:#1F4E79;">Reporte de Ejecución QA</h2>
    <p><b>Execution ID:</b> {execution_id}</p>
    <p><b>Estado:</b> {resumen['estado'].upper()}</p>
    <p><b>Total casos:</b> {resumen['total']}</p>
    <p style="color:green;"><b>Pasados:</b> {resumen['pasados']}</p>
    <p style="color:red;"><b>Fallidos:</b> {resumen['fallidos']}</p>
    <br>
    <p>Se adjuntan los reportes completos en formato .docx, .xlsx y .html</p>
    </body></html>
    """
    msg.attach(MIMEText(cuerpo, "html"))

    # Adjuntar archivos
    archivos = [
        f"reportes/{execution_id}.docx",
        f"reportes/{execution_id}.xlsx",
        f"reportes/{execution_id}.html",
    ]

    for filepath in archivos:
        if os.path.exists(filepath):
            with open(filepath, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename={os.path.basename(filepath)}"
                )
                msg.attach(part)

    # Enviar
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, email_destino, msg.as_string())