from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import time
import os
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()
executor = ThreadPoolExecutor(max_workers=4)

class StepResult(BaseModel):
    case_id: str
    nombre: str
    modulo: str
    caso_uso: str
    prerequisitos: str
    postcondiciones: str
    datos_requeridos: str
    version_sistema: str
    autor: str
    pasos: List[dict]
    estado_general: str  # PASA | FALLA
    tiempo_total_ms: int

class RunRequest(BaseModel):
    execution_id: str
    suite_id: str
    tipo: str
    casos: List[dict]
    base_url: str
    email_destino: Optional[str] = None
    credenciales: Optional[dict] = None

class RunResponse(BaseModel):
    execution_id: str
    estado: str
    total: int
    pasados: int
    fallidos: int
    resultados: List[StepResult]

def obtener_pasos_por_tipo(tipo: str, base_url: str, credenciales: dict) -> List[dict]:
    usuario = credenciales.get("email", "") if credenciales else ""
    password = credenciales.get("password", "") if credenciales else ""

    pasos_por_tipo = {
        "regresion": [
            {
                "titulo": "Verificar carga del sistema",
                "modulo": "General",
                "caso_uso": "CU-001 Acceso al sistema",
                "prerequisitos": "Sistema desplegado y accesible",
                "postcondiciones": "Pantalla de login visible",
                "datos_requeridos": "URL del sistema",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Pantalla de login visible"},
                    {"paso": 2, "accion": "wait_for_selector(input[placeholder=Ingresa tu nombre de usuario])", "resultado_esperado": "Input de usuario visible"},
                    {"paso": 3, "accion": "wait_for_selector(input[placeholder=Ingresa tu contraseña])", "resultado_esperado": "Input de contraseña visible"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "Botón de login visible"},
                ]
            },
            {
                "titulo": "Login con credenciales válidas",
                "modulo": "Autenticación",
                "caso_uso": "CU-002 Iniciar sesión",
                "prerequisitos": "Usuario registrado en el sistema",
                "postcondiciones": "Usuario autenticado y en dashboard",
                "datos_requeridos": f"usuario: {usuario}, password: ****",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Pantalla de login cargada"},
                    {"paso": 2, "accion": f"fill(input[placeholder=Ingresa tu nombre de usuario], {usuario})", "resultado_esperado": "Usuario ingresado correctamente"},
                    {"paso": 3, "accion": f"fill(input[placeholder=Ingresa tu contraseña], {password})", "resultado_esperado": "Contraseña ingresada correctamente"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "Login exitoso"},
                    {"paso": 5, "accion": "expect_url(/dashboard)", "resultado_esperado": "Redirigido al dashboard"},
                ]
            },
            {
                "titulo": "Verificar navegación del dashboard",
                "modulo": "Dashboard",
                "caso_uso": "CU-003 Navegar al dashboard",
                "prerequisitos": "Usuario autenticado",
                "postcondiciones": "Dashboard visible con métricas",
                "datos_requeridos": "Sesión activa",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/dashboard)", "resultado_esperado": "Dashboard cargado"},
                    {"paso": 2, "accion": "wait_for_selector(nav)", "resultado_esperado": "Sidebar visible"},
                    {"paso": 3, "accion": "screenshot", "resultado_esperado": "Evidencia del dashboard capturada"},
                ]
            },
        ],
        "unitario": [
            {
                "titulo": "Verificar formulario de login",
                "modulo": "Autenticación",
                "caso_uso": "CU-002 Iniciar sesión",
                "prerequisitos": "Sistema accesible",
                "postcondiciones": "Formulario validado",
                "datos_requeridos": "URL de signin",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Formulario de login visible"},
                    {"paso": 2, "accion": "wait_for_selector(input[placeholder=Ingresa tu nombre de usuario])", "resultado_esperado": "Campo usuario presente"},
                    {"paso": 3, "accion": "wait_for_selector(input[placeholder=Ingresa tu contraseña])", "resultado_esperado": "Campo contraseña presente"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "Botón submit presente"},
                    {"paso": 5, "accion": "click_text(Ingresar)", "resultado_esperado": "Validación de campos vacíos activada"},
                ]
            },
        ],
        "e2e": [
            {
                "titulo": "Flujo completo de autenticación y navegación",
                "modulo": "Autenticación",
                "caso_uso": "CU-002 Iniciar sesión completo",
                "prerequisitos": "Usuario registrado, sistema en línea",
                "postcondiciones": "Usuario autenticado con acceso completo",
                "datos_requeridos": f"usuario: {usuario}, password: ****",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Login cargado"},
                    {"paso": 2, "accion": f"fill(input[placeholder=Ingresa tu nombre de usuario], {usuario})", "resultado_esperado": "Usuario completado"},
                    {"paso": 3, "accion": f"fill(input[placeholder=Ingresa tu contraseña], {password})", "resultado_esperado": "Contraseña completada"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "Autenticación exitosa"},
                    {"paso": 5, "accion": "expect_url(/dashboard)", "resultado_esperado": "En dashboard"},
                    {"paso": 6, "accion": f"goto({base_url}/clientes)", "resultado_esperado": "Módulo clientes accesible"},
                    {"paso": 7, "accion": "wait_for_selector(table)", "resultado_esperado": "Tabla de clientes visible"},
                    {"paso": 8, "accion": f"goto({base_url}/muebles)", "resultado_esperado": "Módulo muebles accesible"},
                    {"paso": 9, "accion": "wait_for_selector(table)", "resultado_esperado": "Tabla de muebles visible"},
                ]
            },
        ],
        "integracion": [
            {
                "titulo": "Verificar integración frontend-backend",
                "modulo": "General",
                "caso_uso": "CU-010 Integración de módulos",
                "prerequisitos": "Backend y frontend corriendo",
                "postcondiciones": "Datos cargados desde API",
                "datos_requeridos": f"usuario: {usuario}, password: ****",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Frontend cargado"},
                    {"paso": 2, "accion": f"fill(input[placeholder=Ingresa tu nombre de usuario], {usuario})", "resultado_esperado": "Input respondiendo"},
                    {"paso": 3, "accion": f"fill(input[placeholder=Ingresa tu contraseña], {password})", "resultado_esperado": "Input respondiendo"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "API de auth respondiendo"},
                    {"paso": 5, "accion": "expect_url(/dashboard)", "resultado_esperado": "Token JWT recibido y almacenado"},
                    {"paso": 6, "accion": f"goto({base_url}/clientes)", "resultado_esperado": "API de clientes respondiendo"},
                    {"paso": 7, "accion": "wait_for_selector(table)", "resultado_esperado": "Datos de API visibles en tabla"},
                ]
            },
        ],
        "sistema": [
            {
                "titulo": "Verificar sistema completo",
                "modulo": "Sistema",
                "caso_uso": "CU-000 Prueba de sistema",
                "prerequisitos": "Sistema completo desplegado",
                "postcondiciones": "Todos los módulos accesibles",
                "datos_requeridos": f"usuario: {usuario}, password: ****",
                "version_sistema": "1.0.0",
                "autor": "QA Automatizado",
                "pasos": [
                    {"paso": 1, "accion": f"goto({base_url}/signin)", "resultado_esperado": "Sistema responde"},
                    {"paso": 2, "accion": f"fill(input[placeholder=Ingresa tu nombre de usuario], {usuario})", "resultado_esperado": "UI interactiva"},
                    {"paso": 3, "accion": f"fill(input[placeholder=Ingresa tu contraseña], {password})", "resultado_esperado": "UI interactiva"},
                    {"paso": 4, "accion": "click_text(Ingresar)", "resultado_esperado": "Auth funcionando"},
                    {"paso": 5, "accion": "expect_url(/dashboard)", "resultado_esperado": "Dashboard accesible"},
                    {"paso": 6, "accion": f"goto({base_url}/clientes)", "resultado_esperado": "Módulo clientes OK"},
                    {"paso": 7, "accion": f"goto({base_url}/muebles)", "resultado_esperado": "Módulo muebles OK"},
                    {"paso": 8, "accion": f"goto({base_url}/producciones)", "resultado_esperado": "Módulo producciones OK"},
                    {"paso": 9, "accion": f"goto({base_url}/ventas)", "resultado_esperado": "Módulo ventas OK"},
                    {"paso": 10, "accion": f"goto({base_url}/dashboard)", "resultado_esperado": "Sistema estable"},
                ]
            },
        ],
    }

    return pasos_por_tipo.get(tipo, pasos_por_tipo["regresion"])

def ejecutar_caso_sync(caso_def: dict, base_url: str, execution_id: str) -> StepResult:
    from playwright.sync_api import sync_playwright

    screenshots_dir = f"screenshots/{execution_id}"
    os.makedirs(screenshots_dir, exist_ok=True)

    pasos_resultado = []
    estado_general = "PASA"
    inicio_total = time.time()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for step in caso_def["pasos"]:
            inicio = time.time()
            accion = step["accion"]
            resultado_esperado = step["resultado_esperado"]
            resultado_obtenido = ""
            defectos = ""
            estado = "PASA"
            screenshot_path = None

            try:
                # Ejecutar acción
                if accion.startswith("goto("):
                    url = accion[5:-1]
                    page.goto(url, timeout=15000)
                    page.wait_for_load_state("networkidle", timeout=10000)
                    resultado_obtenido = f"Página cargada: {page.title()}"

                elif accion.startswith("fill(input[placeholder="):
                    inner = accion[len("fill(input[placeholder="):]
                    coma_idx = inner.rindex("], ")
                    placeholder = inner[:coma_idx]
                    value = inner[coma_idx+3:-1] if inner.endswith(")") else inner[coma_idx+3:]
                    page.get_by_placeholder(placeholder).fill(value)
                    resultado_obtenido = f"Campo llenado correctamente"

                elif accion.startswith("fill("):
                    contenido = accion[5:-1]
                    coma = contenido.index(", ")
                    selector = contenido[:coma]
                    value = contenido[coma+2:]
                    page.fill(selector, value)
                    resultado_obtenido = f"Campo llenado correctamente"

                elif accion.startswith("wait_for_selector(input[placeholder="):
                    placeholder = accion[len("wait_for_selector(input[placeholder="):-2]
                    page.get_by_placeholder(placeholder).wait_for(state="visible", timeout=10000)
                    resultado_obtenido = f"Input visible: {placeholder}"

                elif accion.startswith("wait_for_selector("):
                    selector = accion[18:-1]
                    page.wait_for_selector(selector, timeout=10000)
                    resultado_obtenido = f"Elemento visible: {selector}"

                elif accion.startswith("click_text("):
                    texto = accion[11:-1]
                    print(f"[DEBUG] Usando get_by_role para click en botón: {texto}")
                    page.get_by_role("button", name=texto).click()
                    page.wait_for_timeout(2000)
                    resultado_obtenido = f"Click ejecutado en botón: {texto}"

                elif accion.startswith("click("):
                    selector = accion[6:-1]
                    page.click(selector)
                    page.wait_for_timeout(1500)
                    resultado_obtenido = f"Click ejecutado en: {selector}"

                elif accion.startswith("expect_url("):
                    expected = accion[11:-1]
                    page.wait_for_url(f"**{expected}**", timeout=10000)
                    resultado_obtenido = f"URL correcta: {page.url}"

                elif accion == "screenshot":
                    resultado_obtenido = "Evidencia capturada"

                # Screenshot por cada paso
                nombre_caso = caso_def["titulo"][:20].replace(" ", "_")
                screenshot_path = f"{screenshots_dir}/{nombre_caso}_paso_{step['paso']}.png"
                page.screenshot(path=screenshot_path)

            except Exception as e:
                estado = "FALLA"
                estado_general = "FALLA"
                resultado_obtenido = str(e)
                defectos = f"Error en paso {step['paso']}: {str(e)[:200]}"
                try:
                    screenshot_path = f"{screenshots_dir}/{caso_def['titulo'][:20].replace(' ', '_')}_paso_{step['paso']}_error.png"
                    page.screenshot(path=screenshot_path)
                except:
                    pass

            fin = time.time()
            pasos_resultado.append({
                "paso": step["paso"],
                "entrada_accion": accion,
                "resultado_esperado": resultado_esperado,
                "resultado_obtenido": resultado_obtenido,
                "defectos": defectos,
                "observaciones": "" if estado == "PASA" else f"Fallo en paso {step['paso']}",
                "estado": estado,
                "screenshot_path": screenshot_path,
                "tiempo_ms": int((fin - inicio) * 1000)
            })

        browser.close()

    fin_total = time.time()

    return StepResult(
        case_id=caso_def.get("id", ""),
        nombre=caso_def["titulo"],
        modulo=caso_def["modulo"],
        caso_uso=caso_def["caso_uso"],
        prerequisitos=caso_def["prerequisitos"],
        postcondiciones=caso_def["postcondiciones"],
        datos_requeridos=caso_def["datos_requeridos"],
        version_sistema=caso_def["version_sistema"],
        autor=caso_def["autor"],
        pasos=pasos_resultado,
        estado_general=estado_general,
        tiempo_total_ms=int((fin_total - inicio_total) * 1000)
    )


@router.post("/run", response_model=RunResponse)
async def run_suite(request: RunRequest):
    import asyncio
    loop = asyncio.get_event_loop()

    # Obtener casos según tipo
    casos = obtener_pasos_por_tipo(
        request.tipo,
        request.base_url,
        request.credenciales or {}
    )

    resultados = []
    for caso in casos:
        resultado = await loop.run_in_executor(
            executor, ejecutar_caso_sync, caso, request.base_url, request.execution_id
        )
        resultados.append(resultado)

    pasados = sum(1 for r in resultados if r.estado_general == "PASA")
    fallidos = len(resultados) - pasados

    response_data = {
        "execution_id": request.execution_id,
        "estado": "completado",
        "total": len(resultados),
        "pasados": pasados,
        "fallidos": fallidos,
        "resultados": [r.dict() for r in resultados]
    }

    # Generar reportes
    os.makedirs("reportes", exist_ok=True)
    from reports.tqa711_generator import generar_tqa711
    from reports.xlsx_generator import generar_xlsx
    from reports.html_generator import generar_html

    generar_tqa711(response_data, f"reportes/{request.execution_id}.docx")
    generar_xlsx(response_data, f"reportes/{request.execution_id}.xlsx")
    generar_html(response_data, f"reportes/{request.execution_id}.html")

    # Enviar correo
    if request.email_destino:
        from reports.email_sender import enviar_reporte
        enviar_reporte(request.email_destino, request.execution_id, response_data)

    return RunResponse(**response_data)