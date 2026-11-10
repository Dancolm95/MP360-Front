# Constitución del frontend ERP MP 360

## Propósito
Construir un frontend administrativo modular: RR. HH. es el primer módulo, no una aplicación aislada.

## Fuentes de verdad
1. La Definición Funcional RR. HH. V2.2 rige reglas, datos, actores y estados; conserva V2.1 donde V2.2 no la sustituye.
2. La Especificación UX/UI RR. HH. V1.2 rige vistas, acciones y patrones de interacción cuando no contradice la definición funcional.
3. `MP360PantallasRRHH.pdf` rige la apariencia y composición visual, según decisión del equipo; sus datos de ejemplo no son reglas.
4. La maqueta `ERP Front.zip` es referencia técnica, no fuente de requisitos. Toda contradicción se registra y resuelve antes de implementarla.

## Arquitectura
- El contenedor, navegación, identidad, permisos y componentes comunes pertenecen al ERP; cada módulo encapsula sus vistas y lógica de dominio.
- Las vistas usan patrones compartidos de tablas, filtros, formularios, diálogos, estados y mensajes; no duplican el contenedor ni la lógica transversal.
- El acceso a datos pasa por contratos y adaptadores. Los mocks respetan esos contratos y se distinguen de operaciones reales.
- Las decisiones de framework, herramientas y contratos de API se documentan cuando se tomen; no se infieren de la maqueta.

## Seguridad y comportamiento
- El backend valida autenticación, autorización, reglas de negocio y cambios de estado; la interfaz refleja capacidades y ofrece lectura o estado sin permisos.
- No se incluyen credenciales de demo ni datos sensibles de producción en el código o `localStorage`.
- Una acción solo muestra éxito tras confirmar su persistencia real. Los errores conservan los datos introducidos y explican cómo continuar.

## Entrega verificable
- Cada cambio funcional se vincula a regla, vista UX, página visual y criterios de aceptación; las diferencias abiertas no se completan por suposición.
- Se verifican estados de carga, vacío, error y sin permisos, navegación por teclado y accesibilidad de controles y diálogos.
- Las pantallas se comparan con el PDF y se prueban los flujos afectados antes de dar una funcionalidad por terminada.
