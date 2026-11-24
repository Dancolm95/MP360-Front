import { MODULOS, PERFILES, USUARIO } from './datos'

function Panel() {
  return (
    <img
      className="ux-acceso__panel"
      src="/preview/mp360/img/acceso-panel.jpg"
      alt=""
      aria-hidden="true"
    />
  )
}

function Logo() {
  return (
    <img
      className="ux-acceso__logo"
      src="/preview/mp360/img/logo-mp-dark.png"
      alt="MP 360"
    />
  )
}

export function DisenoLogin() {
  return (
    <div className="ux-acceso">
      <Panel />

      <div className="ux-acceso__columna">
        <Logo />

        <h1 className="ux-acceso__titulo ux-acceso__titulo--hero">
          Bienvenido a <span className="ux-acceso__marca">MP 360°</span>
        </h1>
        <p className="ux-acceso__subtitulo">
          Un nuevo sistema que unifica, planifica y ejecuta.
        </p>

        <form className="ux-login__formulario">
          <label className="ux-login__campo">
            <span className="ux-login__etiqueta">Usuario</span>
            <input
              type="text"
              className="ux-login__control"
              placeholder="Ingresa tu usuario"
              autoComplete="username"
            />
          </label>

          <label className="ux-login__campo">
            <span className="ux-login__etiqueta">Contraseña</span>
            <input
              type="password"
              className="ux-login__control"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="ux-acceso__boton ux-login__enviar">
            Ingresar
          </button>
          <button type="button" className="ux-login__olvide">
            Olvidé mi contraseña
          </button>
        </form>
      </div>
    </div>
  )
}

export function DisenoPerfiles() {
  return (
    <div className="ux-acceso">
      <Panel />

      <div className="ux-acceso__columna">
        <Logo />

        <h1 className="ux-acceso__titulo">Accede al módulo MP 360°</h1>
        <p className="ux-acceso__subtitulo">
          Un nuevo sistema que unifica, planifica y ejecuta.
        </p>

        <ul className="ux-perfiles">
          {PERFILES.map((perfil) => (
            <li
              key={perfil.nombre}
              className={perfil.activo ? 'ux-perfiles__fila ux-perfiles__fila--activa ux-acceso__tarjeta' : 'ux-perfiles__fila'}
            >
              <button type="button" className="ux-perfiles__boton">
                <img className="ux-perfiles__foto" src={perfil.foto} alt="" />
                <span className="ux-perfiles__datos">
                  <span className="ux-perfiles__nombre">{perfil.nombre}</span>
                  <span className="ux-perfiles__rol">{perfil.rol}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="ux-acceso__boton ux-acceso__boton--ancho">
          Usar otro Perfil
        </button>
      </div>
    </div>
  )
}

export function DisenoModulos() {
  return (
    <div className="ux-acceso">
      <div className="ux-acceso__columna">
        <h1 className="ux-acceso__titulo">Accede al módulo MP 360°</h1>
        <p className="ux-acceso__subtitulo">
          Tu rol de administrador te permite ingresar a diversos módulos
        </p>

        <div className="ux-modulos__usuario ux-acceso__tarjeta">
          <img className="ux-modulos__foto" src={USUARIO.foto} alt="" />
          <span className="ux-perfiles__datos">
            <span className="ux-perfiles__nombre">{USUARIO.nombre}</span>
            <span className="ux-perfiles__rol">{USUARIO.rol}</span>
          </span>
        </div>

        <button type="button" className="ux-acceso__boton ux-acceso__boton--ancho ux-modulos__salir">
          Salir
        </button>
      </div>

      <div className="ux-modulos__rejilla">
        {MODULOS.map((modulo) => (
          <button key={modulo.nombre} type="button" className="ux-modulos__tarjeta">
            <img src={modulo.imagen} alt={modulo.nombre} />
          </button>
        ))}
      </div>
    </div>
  )
}
