// Cuestionario "Determina tu biotipo" -- preguntas originales (no copiadas de
// ninguna fuente), inspiradas en los rasgos de comportamiento ya documentados
// del marco de biotipos (Conocimiento/manager-biotipos-rgp.md del vault).
// v2 (2026-08-18): reescrito mas corto/directo, en "tu" (no "vos", para no
// sonar regional a una audiencia latina general) -- feedback real de Brayan
// probandolo el mismo: "me dio pereza, mucho que leer".
// Cada opcion suma 1 punto a un biotipo; "ninguna" no suma a nadie.
const PREGUNTAS_BIOTIPO = [
  {
    texto: "Se traba un proyecto. ¿Qué haces primero?",
    opciones: [
      { texto: "Tomo el mando y lo resuelvo", tipo: "colerico" },
      { texto: "Junto gente, busco ideas nuevas", tipo: "sanguineo" },
      { texto: "Bajo la tensión primero", tipo: "flematico" },
      { texto: "Analizo en detalle qué falló", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "Tu fin de semana ideal:",
    opciones: [
      { texto: "Avanzar en algo, con meta clara", tipo: "colerico" },
      { texto: "Rodeado de gente, planes nuevos", tipo: "sanguineo" },
      { texto: "Tranquilo, sin apuros", tipo: "flematico" },
      { texto: "Solo, con tiempo para pensar", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "Alguien te lleva la contra. ¿Qué haces?",
    opciones: [
      { texto: "Defiendo mi postura, fuerte", tipo: "colerico" },
      { texto: "Aligero el ambiente", tipo: "sanguineo" },
      { texto: "Cedo para evitar el choque", tipo: "flematico" },
      { texto: "Le doy vueltas después, solo", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "La gente te describe como:",
    opciones: [
      { texto: "Decidido y directo", tipo: "colerico" },
      { texto: "El alma de la reunión", tipo: "sanguineo" },
      { texto: "Confiable, siempre en calma", tipo: "flematico" },
      { texto: "Reservado, pero certero", tipo: "melancolico" },
      { texto: "Ninguna me representa", tipo: "ninguna" },
    ],
  },
  {
    texto: "Para decidir algo importante, pesa más:",
    opciones: [
      { texto: "Llegar rápido al resultado", tipo: "colerico" },
      { texto: "Cómo se siente en el momento", tipo: "sanguineo" },
      { texto: "Cómo afecta a los tuyos", tipo: "flematico" },
      { texto: "Analizar todas las opciones", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "En un grupo, tu rol natural:",
    opciones: [
      { texto: "Liderar y repartir tareas", tipo: "colerico" },
      { texto: "Animar y motivar al equipo", tipo: "sanguineo" },
      { texto: "Resolver roces, mantener la paz", tipo: "flematico" },
      { texto: "Revisar los detalles finos", tipo: "melancolico" },
      { texto: "Depende del grupo", tipo: "ninguna" },
    ],
  },
  {
    texto: "Algo te sale mal. ¿Cómo reaccionas?",
    opciones: [
      { texto: "Frustración rápida, ya en modo solución", tipo: "colerico" },
      { texto: "Lo hablo enseguida con alguien", tipo: "sanguineo" },
      { texto: "Me lo guardo, sin drama", tipo: "flematico" },
      { texto: "Le doy vueltas yo solo", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que más te cuesta sostener:",
    opciones: [
      { texto: "Paciencia con los más lentos", tipo: "colerico" },
      { texto: "Disciplina sin novedad", tipo: "sanguineo" },
      { texto: "Arrancar sin que me empujen", tipo: "flematico" },
      { texto: "Bajar la autoexigencia", tipo: "melancolico" },
      { texto: "Ninguna me representa", tipo: "ninguna" },
    ],
  },
  {
    texto: "En una fiesta grande, sos de:",
    opciones: [
      { texto: "Buscar planes reales, productivos", tipo: "colerico" },
      { texto: "Romper el hielo con cualquiera", tipo: "sanguineo" },
      { texto: "Quedarte con tu grupo de siempre", tipo: "flematico" },
      { texto: "Una charla profunda, uno a uno", tipo: "melancolico" },
      { texto: "Depende de la fiesta", tipo: "ninguna" },
    ],
  },
  {
    texto: "Al terminar algo, lo que más satisface:",
    opciones: [
      { texto: "Haber ganado, llegar primero", tipo: "colerico" },
      { texto: "Que la gente la haya pasado bien", tipo: "sanguineo" },
      { texto: "Que nadie haya quedado mal", tipo: "flematico" },
      { texto: "Que haya quedado impecable", tipo: "melancolico" },
      { texto: "Depende de qué sea", tipo: "ninguna" },
    ],
  },
  {
    texto: "Te cancelan un plan de última hora:",
    opciones: [
      { texto: "Me molesta perder el tiempo", tipo: "colerico" },
      { texto: "Armo otro plan al toque", tipo: "sanguineo" },
      { texto: "Tampoco pasa nada", tipo: "flematico" },
      { texto: "En el fondo, lo agradezco", tipo: "melancolico" },
      { texto: "Depende del plan", tipo: "ninguna" },
    ],
  },
  {
    texto: "Explicando algo que te apasiona:",
    opciones: [
      { texto: "Voy directo al punto", tipo: "colerico" },
      { texto: "Lo cuento con energía y gestos", tipo: "sanguineo" },
      { texto: "Lo explico con calma", tipo: "flematico" },
      { texto: "Me meto en el detalle fino", tipo: "melancolico" },
      { texto: "Depende del tema", tipo: "ninguna" },
    ],
  },
];

const DESCRIPCIONES_BIOTIPO = {
  colerico: {
    nombre: "Colérico",
    texto: "Orientado a resultados, directo y con liderazgo natural. Tu fortaleza es ejecutar rápido; el reto es la paciencia con los tiempos ajenos.",
  },
  sanguineo: {
    nombre: "Sanguíneo",
    texto: "Carismático, social, movido por la experiencia y la conexión con la gente. Tu fortaleza es crear vínculo rápido; el reto es sostener la disciplina cuando pasa la novedad.",
  },
  flematico: {
    nombre: "Flemático",
    texto: "Empático, mediador, mantiene la calma bajo presión. Tu fortaleza es la paciencia y la estabilidad; el reto es arrancar cosas nuevas sin que alguien más empuje.",
  },
  melancolico: {
    nombre: "Melancólico",
    texto: "Analítico, reflexivo, atento al detalle. Tu fortaleza es la profundidad de pensamiento; el reto es no quedarte trabado en la autocrítica.",
  },
};

if (typeof module !== "undefined") {
  module.exports = { PREGUNTAS_BIOTIPO, DESCRIPCIONES_BIOTIPO };
}
