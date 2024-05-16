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

      <section className='section'>
        <article className='article'>
          <div className='rectangulo'></div>
              <h2>
                Formulario de contacto
              </h2>
              <div className='mensaje-formulario'>
                <p>¡Hola corredor/a! ¿Tienes alguna pregunta sobre entrenamiento, competiciones o cualquier otra cosa relacionada con el atletismo? Estamos aquí para ayudarte.</p>
                <p>Completa el formulario a continuación con tus dudas o problemas.</p>
                <p>Por favor, proporciona la mayor cantidad de detalles posible para que podamos entender mejor tu situación y ofrecerte la mejor asistencia.</p>
              </div>
            <form action="#" className="inscripciones-form" method="post">
                  
                <div className="form-label">Email:</div>
                <input className="form-input" type="text" required/>

                <div className="form-label">Mensaje:</div>
                <textarea className="form-input" name="" id="" cols={30} rows={10}></textarea>
      
                <button className="form-button" type="submit">Enviar</button>
            </form>
        </article>
      </section>
    </>
  )
}

export default Contacto