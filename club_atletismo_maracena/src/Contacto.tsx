import { useState, useEffect } from 'react';

import './css/contacto.css'


function Contacto() {
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
      <h1 id="title">Contáctanos</h1><br></br>
      <p id="subtitle">Estamos aquí para escucharte: contáctanos y mantente informado</p>
      </div>
      <div id="all-form">
          
          <form action="#" method="post">
          <div className="formulary">
              
  
              <div className="inputBox">
                  <input type="text" required/>
                  <h5>Email*</h5>
              </div>

              <div className="inputBox">
                  <input type="pass" required/>
                  <h5>Contraseña*</h5>
              </div>
  
              <button type="submit" className="enter">Iniciar Sesión</button>
  
          </div>
      </form>
      
  </div>
    </>
  )
}

export default Contacto