const burbuja = document.getElementById("chat-bubble");
const panel = document.getElementById("chat-panel");
const cerrar = document.getElementById("chat-cerrar");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const mensajes = document.getElementById("chat-mensajes");

burbuja.addEventListener("click", () => {
  panel.classList.toggle("oculto");
  if (!panel.classList.contains("oculto")) input.focus();
});

cerrar.addEventListener("click", () => panel.classList.add("oculto"));

function agregarMensaje(texto, rol) {
  const div = document.createElement("div");
  div.className = `msg ${rol}`;
  div.textContent = texto;
  mensajes.appendChild(div);
  mensajes.scrollTop = mensajes.scrollHeight;
  return div;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pregunta = input.value.trim();
  if (!pregunta) return;

  agregarMensaje(pregunta, "usuario");
  input.value = "";
  input.disabled = true;

  const cargando = agregarMensaje("escribiendo...", "bot cargando");

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: pregunta }),
    });
    const datos = await resp.json();
    cargando.remove();
    agregarMensaje(datos.respuesta || "No pude responder ahora, probá de nuevo en un rato.", "bot");
  } catch (err) {
    cargando.remove();
    agregarMensaje("Hubo un error de conexión, probá de nuevo.", "bot");
  } finally {
    input.disabled = false;
    input.focus();
  }
});
