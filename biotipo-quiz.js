// Render y scoring del cuestionario "Determina tu biotipo".
// v2 (2026-08-18): una pregunta a la vez, con barra de progreso y avance
// automatico al tocar una opcion (nada de leer 12 preguntas de una ni
// apretar "siguiente" a cada rato) -- feedback real de Brayan probandolo
// el mismo. Todo en el navegador, sin backend.
(function () {
  const contenedor = document.getElementById("biotipo-preguntas");
  const resultadoDiv = document.getElementById("biotipo-resultado");
  if (!contenedor || typeof PREGUNTAS_BIOTIPO === "undefined") return;

  const puntos = { colerico: 0, sanguineo: 0, flematico: 0, melancolico: 0 };
  let paso = 0;
  const total = PREGUNTAS_BIOTIPO.length;

  function renderPaso() {
    const p = PREGUNTAS_BIOTIPO[paso];
    const pct = Math.round((paso / total) * 100);

    contenedor.innerHTML = `
      <div class="biotipo-progreso">
        <div class="biotipo-progreso-barra" style="width:${pct}%"></div>
      </div>
      <p class="biotipo-contador">${paso + 1} / ${total}</p>
      <h3 class="biotipo-pregunta-texto">${p.texto}</h3>
      <div class="biotipo-opciones"></div>
    `;

    const opcionesDiv = contenedor.querySelector(".biotipo-opciones");
    p.opciones.forEach((op) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "biotipo-opcion-boton";
      boton.textContent = op.texto;
      boton.addEventListener("click", () => elegir(op.tipo, boton));
      opcionesDiv.appendChild(boton);
    });
  }

  function elegir(tipo, boton) {
    if (tipo !== "ninguna") puntos[tipo]++;

    // Feedback visual instantaneo antes de avanzar (100ms) -- se siente vivo,
    // no un formulario. Evita doble click mientras avanza.
    contenedor.querySelectorAll(".biotipo-opcion-boton").forEach((b) => (b.disabled = true));
    boton.classList.add("elegida");

    setTimeout(() => {
      paso++;
      if (paso < total) {
        renderPaso();
      } else {
        mostrarResultado();
      }
    }, 180);
  }

  function mostrarResultado() {
    contenedor.innerHTML = "";
    const orden = Object.entries(puntos).sort((a, b) => b[1] - a[1]);
    const [primarioTipo] = orden[0];
    const [subTipo] = orden[1];
    const primario = DESCRIPCIONES_BIOTIPO[primarioTipo];
    const sub = DESCRIPCIONES_BIOTIPO[subTipo];

    resultadoDiv.classList.remove("oculto");
    resultadoDiv.innerHTML = `
      <h3>Tu biotipo primario: ${primario.nombre}</h3>
      <p>${primario.texto}</p>
      <h4>Subdominante: ${sub.nombre}</h4>
      <p>${sub.texto}</p>
      <p class="biotipo-detalle">Colérico ${puntos.colerico} · Sanguíneo ${puntos.sanguineo} · Flemático ${puntos.flematico} · Melancólico ${puntos.melancolico}</p>
      <p class="biotipo-nota">Estimación propia con un cuestionario corto, no un diagnóstico clínico.</p>
      <button type="button" class="biotipo-boton biotipo-repetir">Repetir</button>
    `;
    resultadoDiv.querySelector(".biotipo-repetir").addEventListener("click", () => {
      Object.keys(puntos).forEach((k) => (puntos[k] = 0));
      paso = 0;
      resultadoDiv.classList.add("oculto");
      renderPaso();
      contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    resultadoDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  renderPaso();
})();
