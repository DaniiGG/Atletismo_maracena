import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import { useState, useEffect } from 'react';
import './App.css';
import { firestore } from './firebase.ts';
import { collection, getDocs, orderBy, query, limit} from 'firebase/firestore';

interface Hazaña {
  fecha: { seconds: number, nanoseconds: number };
  imagen: string;
  titulo: string;
  contenido: string;
  etiqueta: string;
}

function App() {

  const [datos, setDatos] = useState<Hazaña[]>([]);

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

  return (
    <>
      <header>
        <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-bs-ride="true">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="../public/img/pistaAtletismo.jpeg" className="d-block w-100 vh-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../public/img/imagen-slider2.jpg" className="d-block w-100 vh-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5>Second slide label</h5>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../public/img/imagen-medalla-sierraB.jpg" className="d-block w-100 vh-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5>Third slide label</h5>
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
      <section className='hazañas-section'>
        {/* <article className='banner'>
        </article> */}
        
        <article className='hazañas'>
          <div className='rectangulo'></div>
          <h2>
            Últimas noticias
          </h2>
          <div className='flex-hazañas'>
            {datos.map((dato, index) => (
              <div key={index} className="hazaña">
                <div className='imagen-hazaña'>
                <img src={dato.imagen} alt={dato.etiqueta}></img>
                <p>{dato.etiqueta}</p>
                </div>
                <h5>{dato.titulo}</h5>
                <p>{dato.contenido.length > 100 ? dato.contenido.slice(0, 130) + '...' : dato.contenido}</p>
                <p><b>{new Date(dato.fecha.seconds * 1000).toLocaleDateString()}</b></p>
              </div>
            ))}
          </div>

        </article>
      </section>
      <section className='valores-section'>
        <article className='valores'>
        <div className='rectangulo'></div>
          <h2>
            Nuestros valores
          </h2>
        </article>

      </section>
    </>

  );
}

export default App;
