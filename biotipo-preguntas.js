// Cuestionario "Determina tu biotipo" -- preguntas originales (no copiadas de
// ninguna fuente), inspiradas en los rasgos ya documentados del marco de
// biotipos (Conocimiento/manager-biotipos-rgp.md del vault).
// v3 (2026-08-18): reescrito para que cada opcion apunte a lo que ESE biotipo
// valora/le da satisfaccion (no solo como actua) -- pedido explicito de
// Brayan. Suma pregunta de genero al inicio (no puntua, ajusta el texto del
// resultado -- RGP describe el colerico como biologia exclusivamente
// masculina y un subtipo raro "flematica fuego-agua" en mujeres).
// El sistema de puntos ya da biotipo primario (mas puntos) + subdominante
// (segundo mas puntos) -- no hacen falta "opciones combinadas" aparte.
const PREGUNTA_GENERO = {
  texto: "Para empezar, ¿con cuál te identificás?",
  opciones: [
    { texto: "Hombre", valor: "hombre" },
    { texto: "Mujer", valor: "mujer" },
    { texto: "Prefiero no decirlo", valor: "otro" },
  ],
};

const PREGUNTAS_BIOTIPO = [
  {
    texto: "¿Qué te haría sentir más vivo un lunes cualquiera?",
    opciones: [
      { texto: "Tener una meta clara y lograrla", tipo: "colerico" },
      { texto: "Un día lleno de gente y planes", tipo: "sanguineo" },
      { texto: "Que todo esté en calma, sin sobresaltos", tipo: "flematico" },
      { texto: "Tiempo a solas para pensar algo a fondo", tipo: "melancolico" },
      { texto: "Depende del día", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que de verdad te llena de orgullo:",
    opciones: [
      { texto: "Haber ganado, ser el mejor", tipo: "colerico" },
      { texto: "Que la gente la haya pasado increíble con vos", tipo: "sanguineo" },
      { texto: "Haber cuidado a los tuyos, sin peleas", tipo: "flematico" },
      { texto: "Haber entendido algo que nadie más vio", tipo: "melancolico" },
      { texto: "Depende de qué logro sea", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que de verdad no soportás:",
    opciones: [
      { texto: "La gente lenta o que no cumple", tipo: "colerico" },
      { texto: "El aburrimiento, la rutina sin gracia", tipo: "sanguineo" },
      { texto: "El conflicto, los gritos", tipo: "flematico" },
      { texto: "Que hagan las cosas mal, sin cuidado", tipo: "melancolico" },
      { texto: "Depende de la situación", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que más te atrae de una idea nueva:",
    opciones: [
      { texto: "Que se pueda ejecutar ya, sin vueltas", tipo: "colerico" },
      { texto: "Que sea distinta, que rompa la rutina", tipo: "sanguineo" },
      { texto: "Que no arriesgue lo que ya funciona", tipo: "flematico" },
      { texto: "Que tenga lógica hasta el último detalle", tipo: "melancolico" },
      { texto: "Depende de la idea", tipo: "ninguna" },
    ],
  },
  {
    texto: "En el fondo, lo que más te motiva a levantarte:",
    opciones: [
      { texto: "Ganar, llegar más lejos que ayer", tipo: "colerico" },
      { texto: "La gente que vas a ver hoy", tipo: "sanguineo" },
      { texto: "Que los tuyos estén bien", tipo: "flematico" },
      { texto: "Un problema interesante para resolver", tipo: "melancolico" },
      { texto: "Depende del día", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que te haría sentir más respetado:",
    opciones: [
      { texto: "Que te reconozcan como el que resuelve", tipo: "colerico" },
      { texto: "Que te busquen para pasarla bien", tipo: "sanguineo" },
      { texto: "Que confíen en vos para lo importante", tipo: "flematico" },
      { texto: "Que valoren lo que pensás, aunque hablés poco", tipo: "melancolico" },
      { texto: "Depende de quién lo diga", tipo: "ninguna" },
    ],
  },
  {
    texto: "Tu peor pesadilla en un trabajo:",
    opciones: [
      { texto: "Que no te dejen decidir nada", tipo: "colerico" },
      { texto: "Estar solo, sin nadie con quien hablar", tipo: "sanguineo" },
      { texto: "Un ambiente tenso, con peleas constantes", tipo: "flematico" },
      { texto: "Que te apuren sin dejarte pensar bien", tipo: "melancolico" },
      { texto: "Depende del trabajo", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que buscás de verdad en una amistad:",
    opciones: [
      { texto: "Alguien que te siga el ritmo, sin frenarte", tipo: "colerico" },
      { texto: "Alguien con quien siempre pase algo", tipo: "sanguineo" },
      { texto: "Alguien en quien confiar pase lo que pase", tipo: "flematico" },
      { texto: "Alguien con quien de verdad se pueda hablar en serio", tipo: "melancolico" },
      { texto: "Depende de la persona", tipo: "ninguna" },
    ],
  },
  {
    texto: "Si te elogian, lo que más te gusta escuchar:",
    opciones: [
      { texto: "\"Nadie más lo hubiera logrado así\"", tipo: "colerico" },
      { texto: "\"Con vos todo es más divertido\"", tipo: "sanguineo" },
      { texto: "\"Con vos uno se siente tranquilo\"", tipo: "flematico" },
      { texto: "\"Pensás las cosas mejor que nadie\"", tipo: "melancolico" },
      { texto: "Depende de quién me lo diga", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que te da más miedo, en el fondo:",
    opciones: [
      { texto: "Perder, quedarte atrás", tipo: "colerico" },
      { texto: "Que se acabe la diversión, quedarte solo", tipo: "sanguineo" },
      { texto: "Que se rompa algo importante para vos", tipo: "flematico" },
      { texto: "Equivocarte por no haberlo pensado bien", tipo: "melancolico" },
      { texto: "Depende del momento", tipo: "ninguna" },
    ],
  },
  {
    texto: "El tipo de historia que más te engancha:",
    opciones: [
      { texto: "Alguien que se la jugó todo y ganó", tipo: "colerico" },
      { texto: "Una aventura llena de gente y momentos", tipo: "sanguineo" },
      { texto: "Una familia o equipo que se mantiene unido", tipo: "flematico" },
      { texto: "Un misterio que hay que resolver a fondo", tipo: "melancolico" },
      { texto: "Depende de la historia", tipo: "ninguna" },
    ],
  },
  {
    texto: "Lo que sentís cuando por fin terminás algo grande:",
    opciones: [
      { texto: "Ya quiero el próximo desafío", tipo: "colerico" },
      { texto: "Ganas de festejarlo con gente", tipo: "sanguineo" },
      { texto: "Alivio, por fin tranquilidad", tipo: "flematico" },
      { texto: "Satisfacción de que quedó bien hecho", tipo: "melancolico" },
      { texto: "Depende de qué haya sido", tipo: "ninguna" },
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
  module.exports = { PREGUNTA_GENERO, PREGUNTAS_BIOTIPO, DESCRIPCIONES_BIOTIPO };
}
