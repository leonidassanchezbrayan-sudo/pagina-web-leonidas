"""Funcion serverless de Vercel: puente entre la burbuja de chat de la pagina
web y el mismo LLM gratis (NVIDIA NIM, glm-5.2) que ya usa el bot de Telegram
(ver Python/managers/ia_nim.py -- misma logica, reimplementada aca porque
Vercel corre esta funcion aislada, sin acceso al resto del vault).

La clave de NVIDIA NUNCA va en este archivo -- se lee de una variable de
entorno (NVIDIA_API_KEY) que se configura en el panel de Vercel, no en el
codigo. Sin eso configurado, la funcion responde con un mensaje de error
claro en vez de romperse.
"""
import json
import os
from http.server import BaseHTTPRequestHandler

import requests

NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODELO = "z-ai/glm-5.2"

CONTEXTO = (
    "Sos el asistente virtual del canal de Leonidas Teotl (@leonidasteotl), "
    "un canal de shorts de viajes y motivacion ('menos pantalla, mas horizonte'). "
    "Respondele a quien te escriba desde la pagina web: tono cercano, en "
    "español, respuestas cortas y directas (2-4 lineas maximo). Si te "
    "preguntan algo que no sabes del canal, respondé con honestidad que no "
    "tenés esa info todavía."
)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        largo = int(self.headers.get("Content-Length", 0))
        cuerpo = self.rfile.read(largo)
        try:
            datos = json.loads(cuerpo)
            pregunta = (datos.get("mensaje") or "").strip()[:1000]
        except (json.JSONDecodeError, AttributeError):
            pregunta = ""

        if not pregunta:
            self._responder(400, {"respuesta": "Mandame un mensaje primero."})
            return

        api_key = os.environ.get("NVIDIA_API_KEY")
        if not api_key:
            self._responder(500, {
                "respuesta": "El chat todavia no esta configurado (falta la clave de NVIDIA en Vercel)."
            })
            return

        respuesta = self._consultar_nvidia(pregunta, api_key)
        if respuesta is None:
            respuesta = "No pude responder ahora mismo (límite de uso o red) -- probá de nuevo en un rato."

        self._responder(200, {"respuesta": respuesta})

    def _consultar_nvidia(self, pregunta, api_key):
        try:
            r = requests.post(
                NVIDIA_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODELO,
                    "messages": [
                        {"role": "system", "content": CONTEXTO},
                        {"role": "user", "content": pregunta},
                    ],
                    "max_tokens": 400,
                    "temperature": 0.4,
                },
                timeout=59,
            )
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"[api/chat] fallo la consulta a NVIDIA: {e}")
            return None

    def _responder(self, codigo, data):
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))
