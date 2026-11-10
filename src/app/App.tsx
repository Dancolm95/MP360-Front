import { ERP_CONTAINER_LAYER } from '../container'
import { RRHH_MODULE_ID } from '../modules/rrhh'
import { SHARED_LAYER } from '../shared'

/**
 * Composición raíz del frontend.
 *
 * En este andamiaje solo demuestra que las capas (contenedor, común y módulos)
 * están separadas y se conectan sin implementar vistas ni reglas de negocio.
 * Las vistas y la lógica del contenedor y del módulo RR. HH. se implementan
 * en tareas posteriores (T-CORE-04…T-CORE-08 y RH-REQ-01).
 */
export function App() {
  return (
    <main>
      <h1>ERP MP 360</h1>
      <p>Andamiaje del frontend modular (React + TypeScript + Vite).</p>
      <ul>
        <li>Contenedor ERP: {ERP_CONTAINER_LAYER}</li>
        <li>Componentes comunes: {SHARED_LAYER}</li>
        <li>Módulo: {RRHH_MODULE_ID}</li>
      </ul>
    </main>
  )
}
