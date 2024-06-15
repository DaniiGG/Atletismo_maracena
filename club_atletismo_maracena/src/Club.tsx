import { useState, useEffect } from 'react';
import './css/club.css';

interface Entrenador {
  name: string;
  img: string;
}

function Club() {
  const [loaded, setLoaded] = useState(false);
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const entrenadoresArray: Entrenador[] = [
      { name: 'John Doe', img: '../img/entrenadores/a.jpg' },
      { name: 'Entrenador 2', img: '../img/entrenadores/b.jpg' },
      { name: 'Entrenador 3', img: '../img/entrenadores/c.jpg' },
      //maas
    ];

    const shuffleArray = (array: Entrenador[]): Entrenador[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    setEntrenadores(shuffleArray(entrenadoresArray));
  }, []);

  return (
    <>
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio" />
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
        <h1 id="title">Nuestro club</h1><br />
        <p id="subtitle">Descubre la esencia de nuestro club y únete a una familia apasionada por el deporte y el compañerismo.</p>
      </div>
      <section className='section'>
        <article className='article'>
          <div className='rectangulo'></div>
          <h2 id="valores-title">Entrenadores</h2>
          <div className='entrenadores'>
              {entrenadores.map((entrenador, index) => (
                  <div key={index} className='entrenador'>
                      <div className='entrenador-img-wrapper'>
                          <img src={entrenador.img} alt={entrenador.name} className='entrenador-img' />
                          <p className='entrenador-name'>{entrenador.name}</p>
                      </div>
                  </div>
              ))}
          </div>
        </article>
      </section>
      <section className='pista-section'>
        <article className='article'>
          <div className='rectangulo'></div>
          <h2 id="valores-title">Lugar de entrenamiento</h2>
          <div className='pista'>
          <div className='pista-contenido'>
              <p>La <b>Pista de Atletismo Pilar Moleón</b>, un espacio emblemático dedicado al deporte y la superación personal. Esta pista más que un simple lugar para correr; es un santuario para atletas de todas las edades y niveles, uniendo a nuestra comunidad a través de la pasión por el deporte.</p>
              <p>Nuestra pista ofrece un entorno ideal para el entrenamiento diario. Aquí, cada corredor, desde el principiante hasta el profesional, encuentra un espacio para mejorar, competir y alcanzar sus metas. La <b>Pista de Atletismo Pilar Moleón</b> es un símbolo de esfuerzo, dedicación y comunidad, donde cada paso cuenta.</p>
          </div>
            <div className='slider'>
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src="../img/pista1.jpeg" height="" width="" className="d-block w-100" loading="lazy" alt="Pista de atletismo" />
                </div>
                <div className="carousel-item">
                  <img src="../img/pista2.jpeg" height="" width="" className="d-block w-100" loading="lazy" alt="Pista de atletismo" />
                </div>
                <div className="carousel-item">
                  <img src="../img/pista3.jpeg" height="" width="" className="d-block w-100" loading="lazy" alt="Pista de atletismo" />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
              </div>
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
      <section className='section'>
        <article className='article'>
        <div className='rectangulo'></div>
        <h2 id="valores-title">Horario</h2>
          <table className='horario'>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Lunes a Viernes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Hora">17:00 - 18:00</td>
              <td data-label="Lunes a Viernes">Niñ@s de 5 a 11 años</td>
            </tr>
            <tr>
              <td data-label="Hora">18:00 - 19:00</td>
              <td data-label="Lunes a Viernes">De 11 en adelante</td>
            </tr>
          </tbody>
          </table>
        </article>
      </section>
    </>
  );
}

export default Club;
