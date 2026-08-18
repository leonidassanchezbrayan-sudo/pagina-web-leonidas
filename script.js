// --- Carrito de pedido (junta lo marcado y arma un WhatsApp con todo) ---
const NUMERO_WHATSAPP = "593963348763";
const pedido = new Set();
const botonesAgregar = document.querySelectorAll(".btn-agregar");
const carritoBubble = document.getElementById("carrito-bubble");
const carritoContador = document.getElementById("carrito-contador");

function actualizarCarrito() {
  carritoContador.textContent = pedido.size;
  carritoBubble.classList.toggle("oculto", pedido.size === 0);
}

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const item = boton.dataset.item;
    const yaEsta = pedido.has(item);
    if (yaEsta) {
      pedido.delete(item);
      boton.setAttribute("aria-pressed", "false");
      boton.textContent = "+ Agregar al pedido";
    } else {
      pedido.add(item);
      boton.setAttribute("aria-pressed", "true");
      boton.textContent = "✓ Agregado";
    }
    actualizarCarrito();
  });
});

carritoBubble.addEventListener("click", () => {
  if (pedido.size === 0) return;
  const lista = [...pedido].map((item) => `- ${item}`).join("\n");
  const texto = `Hola, quiero info/presupuesto sobre:\n${lista}`;
  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
});

// Paquete Combo: la burbuja habla directo con el backend del kit de WhatsApp
// (mismas conversaciones/leads que WhatsApp) en vez de la funcion propia de
// Vercel. TODO: reemplazar por el dominio real de EasyPanel una vez confirmado.
const KIT_BACKEND_URL = "https://proyectos-web-leonidas-bot-whatsapp.wfaqlk.easypanel.host/api/web-chat";

function sessionIdVisitante() {
  let id = localStorage.getItem("chat_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_session_id", id);
  }
  return id;
}

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
    const resp = await fetch(KIT_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: pregunta, sessionId: sessionIdVisitante() }),
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
