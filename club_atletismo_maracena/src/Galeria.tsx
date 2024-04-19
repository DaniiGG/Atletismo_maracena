import { useState, useEffect } from 'react';
import './css/galeria.css'


function Galeria() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
      <h1 id="title">Galería de fotos</h1><br></br>
      <p id="subtitle">Explora momentos capturados de nuestras actividades, competiciones y eventos.</p>
      </div>

      <section>
        <article>
          
        </article>
      </section>
    </>
  )
}

export default Galeria