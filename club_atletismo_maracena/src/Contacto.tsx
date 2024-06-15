import React, { useState, useEffect, FormEvent } from 'react';
import emailjs from 'emailjs-com';
import './css/contacto.css';

const Contacto: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs.sendForm('service_bnm0bnq', 'template_mafud68', e.target as HTMLFormElement, 'rVCM_9rNa1IUDuIM-')
      .then(() => {
        setMessage('Mensaje enviado con éxito');
        setError(false);
      }, (error) => {
          setMessage('Error al enviar el mensaje: '+ error.text);
          setError(true);
      });

    e.currentTarget.reset();
  };

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" alt="Imagen slider"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
        <h1 id="title">Contáctanos</h1><br></br>
        <p id="subtitle">Estamos aquí para escucharte: contáctanos y mantente informado</p>
      </div>

      <section className='section'>
        <article className='article'>
          <div className='rectangulo'></div>
          <h2>Formulario de contacto</h2>
          <div className='mensaje-formulario'>
            <p>¡Hola corredor/a! ¿Tienes alguna pregunta sobre entrenamiento, competiciones o cualquier otra cosa relacionada con el atletismo? Estamos aquí para ayudarte.</p>
            <p>Por favor, en los siguientes campos proporciona detalles reales y la mayor cantidad de información posible para que podamos entender mejor tu situación y ofrecerte la mejor asistencia.</p>
            <p>Completa el formulario a continuación con tus dudas o problemas.</p>
            <p><b>Este formulario enviará un correo electrónico.</b></p>
          </div>
          {message && <div className={`message ${error ? 'error' : 'success'}`}>{message}</div>}
          <form onSubmit={sendEmail} className="inscripciones-form">

            <div className="form-label">Nombre completo:</div>
            <input className="form-input" type="text" name="user_name" required/>

            <div className="form-label">Email:</div>
            <input className="form-input" type="email" name="user_email" required/>

            <div className="form-label">Mensaje:</div>
            <textarea className="form-input" name="message" cols={30} rows={10} required></textarea>

            <button className="form-button" type="submit">Enviar</button>
          </form>
          <div className='medios-contacto'>
            <div className='contacto email'>
            <i className="fa-regular fa-envelope"></i>
            <ul>
              <li><b>Mail:</b></li>
              <li><a href="mailto:atletismomaracena@gmail.com">atletismomaracena@gmail.com</a></li>
            </ul>
            

            </div>
            <div className='contacto telefono'>
            <i className="fa-solid fa-phone-volume"></i>
            <ul>
              <li><b>Teléfonos:</b></li>
              <li><a href="tel:+34645343423">645 34 34 23</a></li>
              <li><a href="tel:+34672346521">672 34 65 21</a></li>
            </ul>
            
            </div>
          </div>
        </article>
      </section>
      <section className='section'>
          <article className='article'>
            <div className='rectangulo'></div>
            <h2 id="valores-title">Estamos aquí &nbsp; <i className="fa-solid fa-location-dot fa-xs"></i></h2>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d749.795417866446!2d-3.6282635308206475!3d37.21157545137386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1715933897035!5m2!1ses!2ses" width="100%" height="400" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </article>
      </section>
    </>
  );
}

export default Contacto;
