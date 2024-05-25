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
      <article className='article'>
        <div className='rectangulo'></div>
            <h2 id="valores-title">
              Estamos aquí &nbsp; <i className="fa-solid fa-location-dot fa-xs"></i>
            </h2>
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d749.795417866446!2d-3.6282635308206475!3d37.21157545137386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1715933897035!5m2!1ses!2ses" width="100%" height="400" style={{border:0}}  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </article>
      <article className='article'>
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Lunes a Viernes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>17:00 - 18:00</td>
              <td>NIñ@s de 5 a 11 años</td>
            </tr>
            <tr>
              <td>18:00 - 19:00</td>
              <td>De 11 en adelante</td>
            </tr>
          </tbody>
        </table>
      </article>
    </>
  )
}

export default Club