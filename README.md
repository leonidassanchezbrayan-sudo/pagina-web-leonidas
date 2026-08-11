# Página web de Leonidas Teotl — demo v1 (funcionando desde 2026-08-06)

Landing simple + burbuja de chat "Yo, Robot" conectada al mismo cerebro del bot de
Telegram (`@Compa999bot`, NVIDIA NIM `glm-5.2`). Ver
`../Bot-Telegram/bot-telegram-nvidia.md` sección "Pendiente importante" — esto retoma
ese plan pausado el 2026-08-05.

**URL pública en producción**: `pagina-web-leonidas-7par.vercel.app`

## Estructura

- `index.html` / `style.css` / `script.js` — el sitio estático (frontend), se sirve
  desde la **raíz** del repo.
- `api/chat.py` — función serverless de Vercel (Python) que recibe el mensaje del chat
  y consulta a NVIDIA NIM. La clave NUNCA está en este archivo, se lee de la variable
  de entorno `NVIDIA_API_KEY` configurada en Vercel.
- `api/requirements.txt` — dependencia (`requests`) de la función. **Importante: tiene
  que estar DENTRO de `api/`, nunca en la raíz del repo** (ver sección de errores).

## Cómo publicarla (sin instalar nada en la PC) — receta ya probada

1. Crear cuenta gratis en **github.com**.
2. "New repository" → nombre a elección (ej. `pagina-web-<cliente>`) → crear.
3. Subir por el uploader web ("uploading an existing file"): `index.html`, `style.css`,
   `script.js`, y la carpeta `api/` completa (con `chat.py` **y** `requirements.txt`
   adentro). **No** subir ningún `requirements.txt` ni `pyproject.toml` en la raíz.
4. Crear cuenta en **vercel.com** con "Continue with GitHub".
5. Al instalar la GitHub App de Vercel: elegir **"Only select repositories"** y sumar
   solo el repo nuevo (no "All repositories" — así no le das acceso a Vercel a otros
   repos tuyos que no tienen nada que ver, ej. uno con términos legales).
6. Al elegir plan: **"I'm working on personal projects" (Hobby)**, nunca "Pro" (esa es
   de pago con trial que pide tarjeta).
7. "Add New → Project" → importar el repo → antes de Deploy, abrir **"Environment
   Variables"** y cargar `NVIDIA_API_KEY` (valor en
   `Python/credenciales/nvidia_nim_api_key.json`, campo `api_key`) → recién ahí Deploy.
8. Una vez deployado: **Settings → Deployment Protection → Vercel Authentication →
   desactivar** ("Require Log In" en off) — sin esto la página pide login de Vercel
   para verla, no queda pública.
9. La URL final "linda" (sin código random) está en la página principal del proyecto o
   en **Settings → Domains**. Esa es la que se usa para el QR.

## Errores reales que salieron la primera vez (y cómo se resolvieron)

Documentado para no repetirlos la próxima vez que se arme esto para un cliente:

1. **"No python entrypoint found... api/chat.py (variable: handler)"** — pasó por tener
   un `requirements.txt` en la **raíz** del repo. Eso hace que Vercel detecte "esto es
   una app Python completa" y busque un único archivo entrypoint (`app.py`, `main.py`,
   etc.) para servir TODAS las rutas — rompe el sitio estático. **Solución**: el
   `requirements.txt` (o `pyproject.toml`) tiene que vivir **dentro de `api/`**, nunca
   en la raíz. Así Vercel trata `api/chat.py` como una función aislada (por tener una
   clase `handler(BaseHTTPRequestHandler)`) y sirve el resto como sitio estático normal.
2. **La página raíz devolvía `Error response / 501 Unsupported method GET`** — mismo
   causante que el punto 1 (requirements.txt en la raíz forzaba "modo app completa",
   toda ruta iba a parar a `chat.py`, que solo entiende POST).
3. **La URL pública pedía login de Vercel** — Deployment Protection ("Vercel
   Authentication") viene activada por default en proyectos nuevos. Hay que
   desactivarla a mano (paso 8 de arriba) para que cualquiera la vea sin cuenta.
4. **El chat respondía "no pude responder (límite de uso o red)"** — dos causas
   posibles, en este orden de probabilidad:
   - La variable de entorno se cargó con datos equivocados (pasó por confundir el
     campo Key con el Value al tipear rápido) — si dudás del valor cargado, mejor
     editarla de nuevo desde cero que asumir que está bien (no se puede "ver" una
     variable marcada Sensitive).
   - **NVIDIA NIM (plan gratis) a veces tarda más de 25s en responder** — el
     `timeout=25` original de `chat.py` cortaba la espera antes de tiempo. Subido a
     `timeout=59` (Vercel permite hasta 5 minutos de ejecución en este plan, así que
     hay margen de sobra, pero no conviene poner algo exagerado tipo 200s: nadie va a
     esperar tanto mirando "escribiendo..." en un chat real).
   - Para diagnosticar esto se usó **Vercel → proyecto → Logs**, que muestra el error
     real de Python (`Read timed out`, etc.) — el primer lugar a mirar si el chat falla
     sin mensaje claro.
5. **Quedaron proyectos duplicados en Vercel** de los intentos que fallaron antes de
   encontrar el fix — Vercel crea un proyecto nuevo cada vez que falla el primer deploy
   y se reintenta desde `vercel.com/new` en vez de desde el proyecto ya creado. Borrar
   los que no sirven (Settings → Delete Project) para no confundirse.

## Limitaciones honestas de esta v1

- El chat NO busca contexto en `Bot-Telegram/notas/` todavía (a diferencia del bot de
  Telegram) — responde con personalidad genérica del canal, no con la base de
  conocimiento curada. Portar eso es un paso futuro si esta v1 sirve.
- Sin memoria entre mensajes (cada pregunta es independiente) — el bot de Telegram sí
  guarda historial, esta v1 no todavía.
- Sin límite de uso propio — cualquiera que entre a la página puede gastar cuota
  gratis de NVIDIA. Aceptable para una demo con pocos visitantes, revisar si se usa en
  serio.
- Respuestas pueden tardar varios segundos (a veces cerca de 30-40s) porque el modelo
  gratis de NVIDIA NIM no es instantáneo — esperable en el plan gratis, no es un bug.
