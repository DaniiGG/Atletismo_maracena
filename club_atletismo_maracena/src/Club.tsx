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
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2671.9831934436093!2d-3.6286506003322767!3d37.21112013853939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1715852250201!5m2!1ses!2ses" width="1000" height="400" style={{border:0}}  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </>
  )
}

export default Club