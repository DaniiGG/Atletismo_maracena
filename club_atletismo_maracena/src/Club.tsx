import { useState, useEffect } from 'react';
import './css/club.css'


function Club() {
  
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
      <h1 id="title">Nuestro club</h1><br></br>
      <p id="subtitle">Descubre la esencia de nuestro club y únete a una familia apasionada por el deporte y el compañerismo.</p>
      </div>

    </>
  )
}

export default Club