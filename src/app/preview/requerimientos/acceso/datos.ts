export interface Perfil {
  readonly nombre: string
  readonly rol: string
  readonly foto: string
  readonly activo: boolean
}

export const PERFILES: readonly Perfil[] = [
  {
    nombre: 'Rodrigo Ayala',
    rol: 'Administrador',
    foto: '/preview/mp360/img/acceso-avatar-rodrigo.jpg',
    activo: true,
  },
  {
    nombre: 'Jesús Vargas',
    rol: 'Colaborador FI',
    foto: '/preview/mp360/img/acceso-avatar-jesus.jpg',
    activo: false,
  },
]

export const USUARIO = {
  nombre: 'Rodrigo Ayala',
  rol: 'Administrador',
  foto: '/preview/mp360/img/acceso-avatar-rodrigo.jpg',
} as const

export interface Modulo {
  readonly nombre: string
  readonly imagen: string
}

export const MODULOS: readonly Modulo[] = [
  { nombre: 'Recursos Humanos', imagen: '/preview/mp360/img/modulo-rrhh.jpg' },
  { nombre: 'Operaciones', imagen: '/preview/mp360/img/modulo-operaciones.jpg' },
  { nombre: 'Contabilidad', imagen: '/preview/mp360/img/modulo-contabilidad.jpg' },
  { nombre: 'Finanzas', imagen: '/preview/mp360/img/modulo-finanzas.jpg' },
]
