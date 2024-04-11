import { useState, useEffect } from 'react';
import './css/cookies.css'; 
import '@fortawesome/fontawesome-free/css/all.css';

interface EventoSeguimiento {
  nombreEvento: string;
  datos: any;
  timestamp: Date;
}

function Cookies(): JSX.Element {
  const [mostrarMensaje, setMostrarMensaje] = useState<boolean>(true);

  useEffect(() => {
    const cookiesAceptadas = document.cookie.includes('cookiesAceptadas=true');
    if (cookiesAceptadas) {
      setMostrarMensaje(false);
    } else {
      registrarEvento('visualizacionMensajeCookies', { timestamp: new Date() });
    }
  }, []);

  const aceptarCookies = (): void => {
    document.cookie = 'cookiesAceptadas=true; max-age=31536000'; 
    setMostrarMensaje(false);
    registrarEvento('aceptacionCookies', { timestamp: new Date() });
  };

  const rechazarCookies = (): void => {
    setMostrarMensaje(false);
    registrarEvento('rechazoCookies', { timestamp: new Date() });
  };

  const registrarEvento = (nombreEvento: string, datos: any): void => {
    const nuevoEvento: EventoSeguimiento = { nombreEvento, datos, timestamp: new Date() };
    const eventoSerializado = JSON.stringify(nuevoEvento);
    document.cookie = `eventoSeguimiento=${encodeURIComponent(eventoSerializado)}; max-age=31536000`; 
  };

  return (
    <>
      {mostrarMensaje && (
        <div className="cookies-mensaje">
          <p>Club Atletismo Maracena utiliza cookies para garantizar que obtengas la mejor experiencia en nuestro sitio web. Si necesitas más información sobre las cookies. <a href='#'>Política de cookies&nbsp;<i className="fa-solid fa-arrow-up-right-from-square fa-2xs"></i></a></p>
          <button onClick={aceptarCookies}>Aceptar</button>
          <button onClick={rechazarCookies}>Rechazar</button>
        </div>
      )}
    </>
  );
}

export default Cookies;
