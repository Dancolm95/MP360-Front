---
description: SDD · Iniciar o continuar el flujo coordinado de una capacidad
agent: coordinator
subagent: false
---
Coordina el flujo SDD de la capacidad `docs/specs/$1/`.
Petición, decisión o contexto adicional del usuario: $2

Lee `memory.md` y determina la fase real desde los documentos y estados existentes. Ejecuta únicamente la
siguiente fase segura mediante el agente especializado correspondiente. Respeta las
aprobaciones obligatorias de spec y de plan/tareas, y no encadenes implementación de
múltiples tareas sin confirmación del usuario. Resume el resultado, los bloqueos y la
siguiente decisión o comando recomendado.
