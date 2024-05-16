import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import './App.css';
import { firestore } from './firebase.ts';
import { collection, getDocs, orderBy, query, limit} from 'firebase/firestore';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface Hazaña {
  fecha: { seconds: number, nanoseconds: number };
  imagen: string;
  imagenes: string[];
  titulo: string;
  contenido: string;
  etiqueta: string;
}

function App() {
  const [datos, setDatos] = useState<Hazaña[]>([]);
  const [imagenFullscreen, setImagenFullscreen] = useState<number | null>(null);

  const handleImagenClick = (index: number) => {
    setImagenFullscreen(index);
  };

  const handleCloseFullscreen = () => {
    setImagenFullscreen(null);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const datosRef = query(collection(firestore, 'hazañas'), orderBy('fecha', 'desc'), limit(3)); 
        const snapshot = await getDocs(datosRef);
        const datosObtenidos = snapshot.docs.map(doc => doc.data() as Hazaña);
        setDatos(datosObtenidos);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    
    obtenerDatos();
  }, []);

  useEffect(() => {
    const tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach((tooltip) => {
        new window.bootstrap.Tooltip(tooltip);
    });
}, []);

  return (
    <>
      <header>
        <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="../img/pistaAtletismo.jpeg" height="" width="" className="d-block w-100" loading="lazy" alt="Pista de atletismo" />
              <div className="carousel-caption d-md-block animate__animated animate__fadeIn">
                <h5 className="animate__animated animate__fadeInDown">Bienvenido a</h5>
                <p>Club Atletismo Maracena</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../img/imagen-slider2.jpg" height="" width="" className="d-block w-100" loading="lazy" alt="Fin de carrera" />
              <div className="carousel-caption d-md-block animate__animated animate__fadeIn">
              <h5 className="animate__animated animate__fadeInDown">Second slide label</h5>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../img/imagen-medalla-sierraB.jpg" height="" width="" className="d-block w-100" loading="lazy" alt="Tercera foto" />
              <div className="carousel-caption d-md-block animate__animated animate__fadeIn">
              <h5 className="animate__animated animate__fadeInDown">Third slide label</h5>
              <p className="animate__animated animate__fadeInDown">Estamos a full</p>
              </div>
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
      </header>
      <section className='section'>
        <article className='hazañas article'>
          <div className='rectangulo'></div>
          <h2>
            Últimas noticias
          </h2>
          <div className='flex-hazañas'>
            {datos.map((dato, index) => (
              <div key={index} className="hazaña">
                <div className='imagen-hazaña'  onClick={() => handleImagenClick(index)}>
                {dato.imagenes && dato.imagenes.length > 0 && (
                  <img src={dato.imagenes[dato.imagenes.length - 1]} alt={dato.etiqueta} />
                )}
                <p className='etiqueta'>{dato.etiqueta}</p>
                <div className='lupa'> <i className="fa-solid fa-magnifying-glass fa-2xl"></i></div>
                </div>
                <h5>{dato.titulo}</h5>
                <p className='content'>{dato.contenido.length > 100 ? dato.contenido.slice(0, 150) + '...' : dato.contenido}</p>
                <p className='content'><b>{new Date(dato.fecha.seconds * 1000).toLocaleDateString()}</b></p>
              </div>
            ))}
          </div>
        </article>
        {imagenFullscreen !== null && (
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-image-container">
          <div>
              <img src={datos[imagenFullscreen].imagenes[datos[imagenFullscreen].imagenes.length - 1]} alt={datos[imagenFullscreen].etiqueta} />
              <button className="button">
              <span className="X"></span>
              <span className="Y"></span>
            </button>
            <p>{datos[imagenFullscreen].etiqueta}</p>
            </div>
          </div>
        </div>
      )}
      </section>
      <section className='valores-section'>
        <article className='valores article'>
        <div className='rectangulo'></div>
          <h2 id="valores-title">
            Nuestros valores
          </h2>
          <div className='valores-content'>
            <p>En el Club Atletismo Maracena, nos enorgullece ser más que un simple lugar de entrenamiento. Somos una familia unida por nuestra pasión por el atletismo y nuestra dedicación a valores que trascienden las fronteras de la pista. En nuestro club, cada atleta, entrenador y miembro del personal encuentra un hogar donde el compañerismo, el respeto y la superación personal son fundamentales en cada paso que damos juntos. Desde los jóvenes que dan sus primeros pasos en la pista hasta los atletas más experimentados que buscan alcanzar nuevas metas, todos son acogidos con los brazos abiertos en un ambiente donde la excelencia deportiva va de la mano con el crecimiento personal y el apoyo mutuo. Aquí, en el corazón del Club Atletismo Maracena, nuestros valores son más que palabras; son la esencia misma de lo que somos y de lo que aspiramos a ser como comunidad deportiva.</p>

          <div className="valores-parte2">
            <div className='slider'>
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner ">
                <div className="carousel-item active">
                  <img src="../img/trabajo_en_equipo.png" height="" width="" className="d-block w-100" alt="Trabajo en equipo"/>
                </div>
                <div className="carousel-item">
                  <img src="../img/trabajo_en_equipo.png" height="" width="" className="d-block w-100" alt="..."/>
                </div>
                {/* <div className="carousel-item">
                <video src="../img/prueba.mp4" className="d-block w-100" autoPlay loop></video>
                </div> */}
                <div className="carousel-item">
                  <img src="../img/pistaAtletismo.jpeg" height="" width="" className="d-block w-100" alt="..."/>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            </div>

            <div className='conjunto-valores'>
            <div className="skill-element" data-bs-toggle="tooltip" title="La capacidad de entrenar y competir en equipo para alcanzar los objetivos del club y celebrar los logros juntos.">
                <div className="progress-container">
                    <span>
                        <i className="fa-solid fa-people-group"></i>
                    </span>
                </div>
                <p>Trabajo en equipo</p>
            </div>
            <div className="skill-element" data-bs-toggle="tooltip" title="El respeto hacia los compañeros de equipo, entrenadores, competidores y los valores del deporte, promoviendo un ambiente positivo y de colaboración.">
                <div className="progress-container">
                    <span>
                        <i className="fas fa-handshake"></i>
                    </span>
                </div>
                <p>Respeto</p>
            </div>
            <div className="skill-element" data-bs-toggle="tooltip" title="El control de uno mismo y la capacidad de mantener el enfoque y cumplir con las responsabilidades y expectativas establecidas.">
                <div className="progress-container">
                    <span>
                        <i className="fas fa-clock"></i>
                    </span>
                </div>
                <p>Disciplina</p>
            </div>
            <div className="skill-element" data-bs-toggle="tooltip" title="La pasión por el deporte y la emoción de competir que impulsa a los miembros del club a dar lo mejor de sí mismos en cada entrenamiento y competición.">
                <div className="progress-container">
                    <span>
                        <i className="fa-solid fa-heart-pulse"></i>
                    </span>
                </div>
                <p>Pasión</p>
            </div>
            <div className="skill-element" data-bs-toggle="tooltip" title="El compromiso con la integridad, la honestidad y los valores éticos del deporte en todas las actividades y competiciones del club.">
                <div className="progress-container">
                    <span>
                        <i className="fas fa-balance-scale"></i>
                    </span>
                </div>
                <p>Ética</p>
            </div>
            <div className="skill-element" data-bs-toggle="tooltip" title="La determinación para superar obstáculos, alcanzar nuevas metas y desafiarse a sí mismo para alcanzar el máximo potencial en el atletismo y en la vida.">
                <div className="progress-container">
                    <span>
                        <i className="fa-solid fa-arrow-trend-up"></i>
                    </span>
                </div>
                <p>Superación</p>
            </div>
            </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

export default App;
