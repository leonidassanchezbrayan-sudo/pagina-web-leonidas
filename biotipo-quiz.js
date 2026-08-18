// Render y scoring del cuestionario "Determina tu biotipo".
// v3 (2026-08-18): suma un paso 0 de género (no puntúa, ajusta un detalle del
// resultado final) antes de las 12 preguntas. Una pregunta a la vez, barra de
// progreso, avance automático al tocar una opción. Todo en el navegador, sin
// backend.
(function () {
  const contenedor = document.getElementById("biotipo-preguntas");
  const resultadoDiv = document.getElementById("biotipo-resultado");
  if (!contenedor || typeof PREGUNTAS_BIOTIPO === "undefined") return;

  const puntos = { colerico: 0, sanguineo: 0, flematico: 0, melancolico: 0 };
  let genero = null;
  let paso = -1; // -1 = pregunta de género, 0..11 = preguntas de biotipo
  const total = PREGUNTAS_BIOTIPO.length;

  function renderPaso() {
    if (paso === -1) return renderGenero();

    const p = PREGUNTAS_BIOTIPO[paso];
    const pct = Math.round(((paso + 1) / (total + 1)) * 100);

    contenedor.innerHTML = `
      <div class="biotipo-progreso"><div class="biotipo-progreso-barra" style="width:${pct}%"></div></div>
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

  function renderGenero() {
    const pct = Math.round((1 / (total + 1)) * 100);
    contenedor.innerHTML = `
      <div class="biotipo-progreso"><div class="biotipo-progreso-barra" style="width:${pct}%"></div></div>
      <p class="biotipo-contador">Antes de arrancar</p>
      <h3 class="biotipo-pregunta-texto">${PREGUNTA_GENERO.texto}</h3>
      <div class="biotipo-opciones"></div>
    `;
    const opcionesDiv = contenedor.querySelector(".biotipo-opciones");
    PREGUNTA_GENERO.opciones.forEach((op) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "biotipo-opcion-boton";
      boton.textContent = op.texto;
      boton.addEventListener("click", () => {
        genero = op.valor;
        contenedor.querySelectorAll(".biotipo-opcion-boton").forEach((b) => (b.disabled = true));
        boton.classList.add("elegida");
        setTimeout(() => {
          paso = 0;
          renderPaso();
        }, 150);
      });
      opcionesDiv.appendChild(boton);
    });
  }

  function elegir(tipo, boton) {
    if (tipo !== "ninguna") puntos[tipo]++;
    contenedor.querySelectorAll(".biotipo-opcion-boton").forEach((b) => (b.disabled = true));
    boton.classList.add("elegida");
    setTimeout(() => {
      paso++;
      if (paso < total) renderPaso();
      else mostrarResultado();
    }, 180);
  }

  function mostrarResultado() {
    contenedor.innerHTML = "";

    // Regla real del marco (no es un detalle menor): segun la investigacion,
    // el cuerpo colerico es exclusivamente masculino. En mujeres, esa
    // intensidad no da "colerico" -- da "flematica fuego-agua" (cuerpo/reglas
    // de flematico, intensidad de colerico). Por eso en mujeres colerico NO
    // compite por primario/subdominante -- se mide aparte como "intensidad".
    const intensidadColerica = puntos.colerico;
    const candidatos = genero === "mujer"
      ? Object.entries(puntos).filter(([tipo]) => tipo !== "colerico")
      : Object.entries(puntos);

    const orden = candidatos.sort((a, b) => b[1] - a[1]);
    const [primarioTipo, primarioPts] = orden[0];
    const [subTipo, subPts] = orden[1];
    const primario = DESCRIPCIONES_BIOTIPO[primarioTipo];
    const sub = DESCRIPCIONES_BIOTIPO[subTipo];

    let notaExtra = "";
    if (genero === "mujer" && intensidadColerica >= Math.ceil(total / 3)) {
      const esFuegoAgua = primarioTipo === "flematico" && intensidadColerica >= primarioPts - 1;
      notaExtra = esFuegoAgua
        ? `<p class="biotipo-nota-extra"><strong>Posible "flemática fuego-agua"</strong>: tu cuerpo/reglas dan flemático, pero tu intensidad (${intensidadColerica}/${total}) es de nivel colérico -- combinación real pero poco común según esta investigación.</p>`
        : `<p class="biotipo-nota-extra">Tu intensidad colérica (${intensidadColerica}/${total}) es alta -- vale la pena que lo tengas en cuenta, aunque tu biotipo de base salió otro.</p>`;
    }

    resultadoDiv.classList.remove("oculto");
    resultadoDiv.innerHTML = `
      <h3>Tu biotipo primario: ${primario.nombre}</h3>
      <p>${primario.texto}</p>
      <h4>Subdominante: ${sub.nombre}</h4>
      <p>${sub.texto}</p>
      ${notaExtra}
      <p class="biotipo-detalle">Colérico ${puntos.colerico} · Sanguíneo ${puntos.sanguineo} · Flemático ${puntos.flematico} · Melancólico ${puntos.melancolico}</p>
      <p class="biotipo-nota">Estimación propia con un cuestionario corto, no un diagnóstico clínico.</p>
      <button type="button" class="biotipo-boton biotipo-repetir">Repetir</button>
    `;
    resultadoDiv.querySelector(".biotipo-repetir").addEventListener("click", () => {
      Object.keys(puntos).forEach((k) => (puntos[k] = 0));
      genero = null;
      paso = -1;
      resultadoDiv.classList.add("oculto");
      renderPaso();
      contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    resultadoDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  renderPaso();
})();
