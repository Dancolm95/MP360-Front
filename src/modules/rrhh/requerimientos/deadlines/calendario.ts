import type { CalendarioLaboralUnico, DiaSemana, FechaISO } from '../contracts'

const DIA_MS = 24 * 60 * 60 * 1000

const DIAS_SEMANA: readonly DiaSemana[] = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
]

const PATRON_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/

export interface FechaCivil {
  readonly anio: number
  readonly mes: number
  readonly dia: number
  readonly tiempo: number
  readonly texto: FechaISO
}

interface CalendarioNormalizado {
  readonly diasHabiles: ReadonlySet<DiaSemana>
  readonly excepciones: ReadonlyMap<string, boolean>
  readonly tieneBaseSemanal: boolean
  readonly ultimaExcepcion: number | null
}

function crearFechaCivil(tiempo: number): FechaCivil {
  const fecha = new Date(tiempo)
  return {
    anio: fecha.getUTCFullYear(),
    mes: fecha.getUTCMonth() + 1,
    dia: fecha.getUTCDate(),
    tiempo,
    texto: fecha.toISOString().slice(0, 10) as FechaISO,
  }
}

/** Valida y normaliza una fecha civil `YYYY-MM-DD` sin usar la zona horaria local. */
export function parsearFechaCivil(fecha: FechaISO): FechaCivil | null {
  const coincidencia = PATRON_FECHA.exec(fecha)
  if (coincidencia === null) return null

  const anio = Number(coincidencia[1])
  const mes = Number(coincidencia[2])
  const dia = Number(coincidencia[3])
  const tiempo = Date.UTC(anio, mes - 1, dia)
  const normalizada = crearFechaCivil(tiempo)

  if (
    normalizada.anio !== anio ||
    normalizada.mes !== mes ||
    normalizada.dia !== dia
  ) {
    return null
  }
  return normalizada
}

function normalizarCalendario(
  calendario: CalendarioLaboralUnico,
): CalendarioNormalizado {
  const excepciones = new Map<string, boolean>()
  let ultimaExcepcion: number | null = null

  for (const excepcion of calendario.excepciones) {
    excepciones.set(excepcion.fecha, excepcion.habil)
    const fechaExcepcion = parsearFechaCivil(excepcion.fecha)
    if (
      fechaExcepcion !== null &&
      (ultimaExcepcion === null || fechaExcepcion.tiempo > ultimaExcepcion)
    ) {
      ultimaExcepcion = fechaExcepcion.tiempo
    }
  }

  return {
    diasHabiles: new Set(calendario.diasHabiles),
    excepciones,
    tieneBaseSemanal: calendario.diasHabiles.length > 0,
    ultimaExcepcion,
  }
}

function esHabil(
  fecha: FechaCivil,
  calendario: CalendarioNormalizado,
): boolean {
  const excepcion = calendario.excepciones.get(fecha.texto)
  if (excepcion !== undefined) return excepcion

  const diaSemana = DIAS_SEMANA[new Date(fecha.tiempo).getUTCDay()]
  return diaSemana !== undefined && calendario.diasHabiles.has(diaSemana)
}

export function esDiaHabil(
  fecha: FechaISO,
  calendario: CalendarioLaboralUnico,
): boolean {
  const civil = parsearFechaCivil(fecha)
  if (civil === null) return false
  return esHabil(civil, normalizarCalendario(calendario))
}

export function siguienteDiaHabil(
  fecha: FechaISO,
  calendario: CalendarioLaboralUnico,
): FechaISO | null {
  const inicio = parsearFechaCivil(fecha)
  if (inicio === null) return null

  const normalizado = normalizarCalendario(calendario)

  if (!normalizado.tieneBaseSemanal) {
    // Sin patrón semanal solo las excepciones `habil: true` crean días hábiles.
    let siguiente: number | null = null
    for (const [texto, habil] of normalizado.excepciones) {
      if (!habil) continue
      const candidato = parsearFechaCivil(texto as FechaISO)
      if (candidato === null || candidato.tiempo <= inicio.tiempo) continue
      if (siguiente === null || candidato.tiempo < siguiente) {
        siguiente = candidato.tiempo
      }
    }
    return siguiente === null ? null : crearFechaCivil(siguiente).texto
  }

  // Tras la última excepción el patrón semanal vuelve a ofrecer un día hábil
  // en, como máximo, una semana.
  const limite = Math.max(
    inicio.tiempo,
    normalizado.ultimaExcepcion ?? inicio.tiempo,
  ) + 7 * DIA_MS
  for (
    let tiempo = inicio.tiempo + DIA_MS;
    tiempo <= limite;
    tiempo += DIA_MS
  ) {
    const candidato = crearFechaCivil(tiempo)
    if (esHabil(candidato, normalizado)) return candidato.texto
  }
  return null
}

/**
 * Avanza `dias` días hábiles estrictamente posteriores a `fechaBase`. El día 0
 * es la propia fecha base, aunque no sea hábil (caso de una aprobación en
 * sábado o domingo).
 */
export function sumarDiasHabiles(
  fechaBase: FechaISO,
  dias: number,
  calendario: CalendarioLaboralUnico,
): FechaISO | null {
  if (!Number.isInteger(dias) || dias < 0) return null

  const base = parsearFechaCivil(fechaBase)
  if (base === null) return null

  let actual = base.texto
  for (let avanzados = 0; avanzados < dias; avanzados += 1) {
    const siguiente = siguienteDiaHabil(actual, calendario)
    if (siguiente === null) return null
    actual = siguiente
  }
  return actual
}
