'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Capability } from '../../shared'
import type {
  DestinationResolution,
  LogicalDestination,
  NavigationPort,
  Section,
  SectionCatalog,
  SessionIdentity,
  SignOutDestination,
  SignOutPort,
} from '../../container/contracts'
import {
  CAP_RRHH_REQUERIMIENTOS_READ,
  DEST_RRHH_ALTA,
  DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  DEST_RRHH_REQUERIMIENTOS_NUEVO,
  DEST_RRHH_SELECCION,
  RRHH_MODULE_ID,
  SECTION_ALTA,
  SECTION_REQUERIMIENTOS,
  SECTION_SELECCION,
} from './identifiers'
import type {
  ContextoBandeja,
  RequerimientoId,
  SeleccionRequerimiento,
} from './requerimientos'
import { ContainerShell } from '../../container/components/ContainerShell'
import { useFocusOnMount } from '../../container/accessibility'

const EMPTY_SECTIONS: readonly Section[] = []

const SECTION_PRESENTATION = {
  [String(SECTION_REQUERIMIENTOS)]: {
    label: 'Requerimientos',
    destination: DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  },
  [String(SECTION_SELECCION)]: {
    label: 'Selección',
    destination: DEST_RRHH_SELECCION,
  },
  [String(SECTION_ALTA)]: { label: 'Alta', destination: DEST_RRHH_ALTA },
} satisfies Readonly<
  Record<string, { readonly label: string; readonly destination: LogicalDestination }>
>

type ViewState =
  | { readonly status: 'loading' }
  | { readonly status: 'tray'; readonly section: Section }
  | { readonly status: 'upcoming'; readonly section: Section }
  | { readonly status: 'forbidden' }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' }

type ZonaRequerimientos = 'bandeja' | 'detalle' | 'formulario'

/** Acciones y contexto que el contenedor aporta a la vista de bandeja. */
export interface AccionesBandejaContenedor {
  readonly onAbrirDetalle?: (seleccion: SeleccionRequerimiento) => void
  readonly onNuevo?: () => void
  readonly contextoInicial?: ContextoBandeja
  readonly restaurarFocoEn?: RequerimientoId
}

/**
 * Vistas reales de Requerimientos que el punto de composición de `src/app`
 * inyecta en la zona central. El contenedor decide qué zona mostrar y conserva
 * el contexto y el foco; el módulo no importa componentes de `src/app`.
 */
export interface VistasRequerimientos {
  readonly bandeja: (acciones: AccionesBandejaContenedor) => ReactNode
  readonly detalle?: (
    seleccion: SeleccionRequerimiento,
    onVolver: () => void,
  ) => ReactNode
  readonly formulario?: (onCerrar: () => void) => ReactNode
}

export interface RrhhContainerProps {
  readonly catalog: SectionCatalog
  readonly capabilities: readonly Capability[]
  readonly identity?: SessionIdentity
  readonly navigation: NavigationPort
  readonly signOut: SignOutPort
  readonly onSignedOut: (destination: SignOutDestination) => void
  readonly onSessionEnded: () => void
  readonly initialDestination?: LogicalDestination
  readonly vistas: VistasRequerimientos
}

function getRrhhSections(catalog: SectionCatalog): readonly Section[] {
  return (
    catalog.modules.find((module) => module.id === RRHH_MODULE_ID)?.sections ??
    EMPTY_SECTIONS
  )
}

function findSection(sections: readonly Section[], destination: LogicalDestination) {
  const sectionId =
    destination === DEST_RRHH_REQUERIMIENTOS_BANDEJA
      ? SECTION_REQUERIMIENTOS
      : destination === DEST_RRHH_SELECCION
        ? SECTION_SELECCION
        : destination === DEST_RRHH_ALTA
          ? SECTION_ALTA
          : undefined

  return sectionId ? sections.find((section) => section.id === sectionId) : undefined
}

function hasUx02Read(
  capabilities: readonly Capability[],
  sections: readonly Section[],
) {
  const requirements = sections.find(
    (section) => section.id === SECTION_REQUERIMIENTOS,
  )
  return Boolean(
    capabilities.includes(CAP_RRHH_REQUERIMIENTOS_READ) &&
      requirements?.status === 'implemented' &&
      requirements.visible &&
      requirements.capabilities.includes(CAP_RRHH_REQUERIMIENTOS_READ),
  )
}

function classifyResolution(
  resolution: DestinationResolution,
  sections: readonly Section[],
): ViewState {
  if (resolution.status === 'session-ended') return { status: 'forbidden' }
  if (resolution.status !== 'ok') return { status: resolution.status }

  const section = findSection(sections, resolution.destination)
  if (!section || !section.visible) return { status: 'not-found' }

  if (
    section.id === SECTION_REQUERIMIENTOS &&
    section.status === 'implemented' &&
    section.capabilities.includes(CAP_RRHH_REQUERIMIENTOS_READ)
  ) {
    return { status: 'tray', section }
  }

  if (section.status === 'not-implemented') {
    return { status: 'upcoming', section }
  }

  return { status: 'forbidden' }
}

function ViewHeading({ children }: { readonly children: string }) {
  const ref = useFocusOnMount<HTMLHeadingElement>()
  return (
    <h1 ref={ref} tabIndex={-1}>
      {children}
    </h1>
  )
}

function DestinationLoading() {
  const ref = useFocusOnMount<HTMLParagraphElement>()
  return (
    <p
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      Validando destino…
    </p>
  )
}

export function RrhhContainer({
  catalog,
  capabilities,
  identity,
  navigation,
  signOut,
  onSignedOut,
  onSessionEnded,
  initialDestination = DEST_RRHH_REQUERIMIENTOS_BANDEJA,
  vistas,
}: RrhhContainerProps) {
  const sections = getRrhhSections(catalog)
  const canReadUx02 = hasUx02Read(capabilities, sections)
  const [view, setView] = useState<ViewState>(
    canReadUx02 ? { status: 'loading' } : { status: 'forbidden' },
  )
  const [zonaRequerimientos, setZonaRequerimientos] =
    useState<ZonaRequerimientos>('bandeja')
  const [seleccion, setSeleccion] = useState<SeleccionRequerimiento>()
  const requestRef = useRef(0)
  const viewRef = useRef(view)
  useEffect(() => {
    viewRef.current = view
  }, [view])
  // `vistas` se lee por ref: un objeto nuevo por render no debe cambiar la
  // identidad de `resolve` ni devolver la zona abierta a la bandeja.
  const vistasRef = useRef(vistas)
  useEffect(() => {
    vistasRef.current = vistas
  }, [vistas])

  const resolve = useCallback(
    async (destination: LogicalDestination) => {
      if (!canReadUx02) {
        setView({ status: 'forbidden' })
        return
      }

      const request = ++requestRef.current
      // Abrir el formulario desde la bandeja no vacía la vista: así el foco
      // sigue en el control que lo abrió y el formulario puede devolverlo.
      const conservaBandeja =
        destination === DEST_RRHH_REQUERIMIENTOS_NUEVO &&
        Boolean(vistasRef.current.formulario) &&
        viewRef.current.status === 'tray'
      if (!conservaBandeja) setView({ status: 'loading' })
      let resolution: DestinationResolution
      try {
        resolution = await navigation.resolve(destination)
      } catch {
        if (request === requestRef.current) setView({ status: 'error' })
        return
      }
      if (request !== requestRef.current) return

      if (resolution.status === 'session-ended') {
        onSessionEnded()
        return
      }

      if (
        resolution.status === 'ok' &&
        resolution.destination === DEST_RRHH_REQUERIMIENTOS_NUEVO &&
        vistasRef.current.formulario
      ) {
        const section = findSection(sections, DEST_RRHH_REQUERIMIENTOS_BANDEJA)
        if (section?.visible && section.status === 'implemented') {
          setSeleccion(undefined)
          setZonaRequerimientos('formulario')
          setView({ status: 'tray', section })
          return
        }
      }

      const siguiente = classifyResolution(resolution, sections)
      if (siguiente.status === 'tray') {
        setSeleccion(undefined)
        setZonaRequerimientos('bandeja')
      }
      setView(siguiente)
    },
    [canReadUx02, navigation, onSessionEnded, sections],
  )

  useEffect(() => {
    void resolve(initialDestination)
    return () => {
      requestRef.current += 1
    }
  }, [initialDestination, resolve])

  const activeSection =
    view.status === 'tray' || view.status === 'upcoming' ? view.section : undefined
  const activePresentation = activeSection
    ? SECTION_PRESENTATION[String(activeSection.id)]
    : undefined
  const authorizedCatalog = canReadUx02 ? catalog : { modules: [] }
  const navigableSections = canReadUx02
    ? sections.filter(
        (section) => section.visible && SECTION_PRESENTATION[String(section.id)],
      )
    : []

  const abrirDetalle = vistas.detalle
    ? (siguiente: SeleccionRequerimiento) => {
        setSeleccion(siguiente)
        setZonaRequerimientos('detalle')
      }
    : undefined
  const abrirFormulario = vistas.formulario
    ? () => setZonaRequerimientos('formulario')
    : undefined
  const volverABandeja = () => setZonaRequerimientos('bandeja')

  return (
    <ContainerShell
      catalog={authorizedCatalog}
      identity={identity}
      activeModuleId={canReadUx02 ? RRHH_MODULE_ID : undefined}
      activeSectionId={activeSection?.id}
      activeSectionLabel={activePresentation?.label}
      onSelectModule={() => void resolve(DEST_RRHH_REQUERIMIENTOS_BANDEJA)}
      signOut={signOut}
      onSignedOut={onSignedOut}
    >
      {canReadUx02 ? (
        <nav aria-label="Secciones de RR. HH.">
          {navigableSections.map((section) => {
            const presentation = SECTION_PRESENTATION[String(section.id)]
            if (!presentation) return null
            return (
              <button
                key={String(section.id)}
                type="button"
                className="erp-section-navigation__item"
                aria-current={activeSection?.id === section.id ? 'page' : undefined}
                aria-label={
                  activeSection?.id === section.id
                    ? `${presentation.label} (sección activa)`
                    : undefined
                }
                onClick={() => void resolve(presentation.destination)}
              >
                {presentation.label}
              </button>
            )
          })}
        </nav>
      ) : null}

      {view.status === 'loading' ? <DestinationLoading /> : null}
      {view.status === 'forbidden' ? (
        <section role="alert">
          <ViewHeading>Sin permisos</ViewHeading>
          <p>No tienes acceso de lectura a Requerimientos de RR. HH.</p>
        </section>
      ) : null}
      {view.status === 'not-found' ? (
        <section role="alert">
          <ViewHeading>Destino no encontrado</ViewHeading>
          <p>El destino solicitado no está disponible.</p>
          {canReadUx02 ? (
            <button
              type="button"
              onClick={() => void resolve(DEST_RRHH_REQUERIMIENTOS_BANDEJA)}
            >
              Volver a Requerimientos
            </button>
          ) : null}
        </section>
      ) : null}
      {view.status === 'error' ? (
        <section role="alert">
          <ViewHeading>No se pudo validar el destino</ViewHeading>
          <p>Inténtalo de nuevo más tarde.</p>
        </section>
      ) : null}
      {view.status === 'tray' ? (
        <section>
          {zonaRequerimientos === 'detalle' && seleccion && vistas.detalle ? (
            vistas.detalle(seleccion, volverABandeja)
          ) : (
            <>
              <ViewHeading>Requerimientos</ViewHeading>
              {vistas.bandeja({
                onAbrirDetalle: abrirDetalle,
                onNuevo: abrirFormulario,
                contextoInicial: seleccion?.contexto,
                restaurarFocoEn: seleccion?.requerimiento.id,
              })}
              {zonaRequerimientos === 'formulario' && vistas.formulario
                ? vistas.formulario(volverABandeja)
                : null}
            </>
          )}
        </section>
      ) : null}
      {view.status === 'upcoming' ? (
        <section>
          <ViewHeading>{activePresentation?.label ?? 'Sección'}</ViewHeading>
          <p>Próximamente</p>
          <p>Esta sección aún no tiene funcionalidad disponible.</p>
          <button
            type="button"
            onClick={() => void resolve(DEST_RRHH_REQUERIMIENTOS_BANDEJA)}
          >
            Volver a Requerimientos
          </button>
        </section>
      ) : null}
    </ContainerShell>
  )
}
