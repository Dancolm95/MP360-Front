'use client'

import type { VistasRequerimientos } from '../modules/rrhh'
import {
  BandejaRequerimientos,
  DetalleRequerimientoVista as DetalleRequerimiento,
} from '../modules/rrhh/requerimientos'
import {
  CATALOGOS,
  COLABORADORES,
  PLAZO_ADMINISTRATIVO_DIAS,
  SOLICITANTES,
  crearBandejaDemoPort,
  detalleDemo,
} from './requerimientos-demo'
import {
  FormularioUx03,
  crearPuertoPreview,
} from './preview/requerimientos/ux03/FormularioUx03'

const BANDEJA_DEMO = crearBandejaDemoPort()
const FORMULARIO_DEMO = crearPuertoPreview(CATALOGOS)

/**
 * Composición de la demo para `/`: el contenedor aporta navegación, contexto y
 * foco; estas vistas solo presentan. La sesión, el catálogo y los datos siguen
 * siendo simulados y no hay autorización ni persistencia reales.
 */
export const VISTAS_REQUERIMIENTOS_DEMO: VistasRequerimientos = {
  bandeja: ({ onAbrirDetalle, onNuevo, contextoInicial, restaurarFocoEn }) => (
    <BandejaRequerimientos
      port={BANDEJA_DEMO}
      catalogos={CATALOGOS}
      solicitantes={SOLICITANTES}
      tamanoPaginaInicial={10}
      tamanosPagina={[4, 10]}
      contextoInicial={contextoInicial}
      onAbrirDetalle={onAbrirDetalle}
      restaurarFocoEn={restaurarFocoEn}
      onNuevo={onNuevo}
    />
  ),
  detalle: (seleccion, onVolver) => (
    <DetalleRequerimiento
      detalle={detalleDemo(seleccion.requerimiento)}
      onVolver={onVolver}
    />
  ),
  formulario: (onCerrar) => (
    <FormularioUx03
      catalogos={CATALOGOS}
      colaboradores={COLABORADORES}
      plazoAdministrativoDias={PLAZO_ADMINISTRATIVO_DIAS}
      puerto={FORMULARIO_DEMO}
      onCancelar={onCerrar}
    />
  ),
}
