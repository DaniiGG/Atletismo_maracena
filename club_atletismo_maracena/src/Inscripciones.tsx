
import { useState, useEffect } from 'react';
import './css/inscripciones.css'


function Inscripciones() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
      <h1 id="title">Inscríbete</h1><br></br>
      <p id="subtitle">¡Únete a nuestro club y comienza tu viaje hacia una vida más activa y saludable hoy mismo!</p>
      </div>
    </>
  )
}

export default Inscripciones