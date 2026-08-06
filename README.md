# Página web de Leonidas Teotl — demo v1

Landing simple + burbuja de chat "Yo, Robot" conectada al mismo cerebro del bot de
Telegram (`@Compa999bot`, NVIDIA NIM `glm-5.2`). Ver
`../Bot-Telegram/bot-telegram-nvidia.md` sección "Pendiente importante" — esto retoma
ese plan pausado el 2026-08-05.

## Estructura

- `index.html` / `style.css` / `script.js` — el sitio estático (frontend).
- `api/chat.py` — función serverless de Vercel que recibe el mensaje del chat y
  consulta a NVIDIA NIM. La clave NUNCA está en este archivo, se lee de la variable
  de entorno `NVIDIA_API_KEY` configurada en Vercel.
- `requirements.txt` — dependencia (`requests`) que Vercel instala para la función.

## Cómo publicarla (sin instalar nada en la PC)

1. Crear cuenta gratis en **github.com** (si no tenés una).
2. En GitHub: "New repository" → nombre `pagina-web-leonidas` → crear.
3. Dentro del repo vacío, click en "uploading an existing file" → arrastrar los 5
   archivos de esta carpeta (`index.html`, `style.css`, `script.js`, `requirements.txt`,
   y la carpeta `api/` con `chat.py` adentro) → commit.
4. Crear cuenta gratis en **vercel.com** (podés entrar directo con la cuenta de GitHub
   del paso 1, un solo click).
5. En Vercel: "Add New… → Project" → elegir el repo `pagina-web-leonidas` → Deploy.
   No hace falta tocar ninguna configuración, Vercel detecta solo el `index.html` y la
   función en `api/`.
6. Una vez desplegado: Project → **Settings → Environment Variables** → agregar:
   - Name: `NVIDIA_API_KEY`
   - Value: (la clave que está en `Python/credenciales/nvidia_nim_api_key.json`, campo `api_key`)
7. Volver a **Deployments** → los 3 puntitos del último deploy → **Redeploy** (para que
   tome la variable nueva).
8. Vercel te da una URL tipo `pagina-web-leonidas.vercel.app` — esa es la página
   pública, anda desde cualquier celu/compu. Generar el QR apuntando a esa URL con
   cualquier generador gratis (ej. qr-code-generator.com).

## Limitaciones honestas de esta v1

- El chat NO busca contexto en `Bot-Telegram/notas/` todavía (a diferencia del bot de
  Telegram) — responde con personalidad genérica del canal, no con la base de
  conocimiento curada. Portar eso es un paso futuro si esta v1 sirve.
- Sin memoria entre mensajes (cada pregunta es independiente) — el bot de Telegram sí
  guarda historial, esta v1 no todavía.
- Sin límite de uso propio — cualquiera que entre a la página puede gastar cuota
  gratis de NVIDIA. Aceptable para una demo con pocos visitantes, revisar si se usa en
  serio.
