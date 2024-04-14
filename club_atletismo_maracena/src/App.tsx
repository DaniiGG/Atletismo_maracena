import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import { useState, useEffect } from 'react';
import './App.css';
import { firestore } from './firebase.ts';
import { collection, getDocs, orderBy, query, limit} from 'firebase/firestore';
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface Hazaña {
  fecha: { seconds: number, nanoseconds: number };
  imagen: string;
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
              <img src="../img/pistaAtletismo.jpeg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block animate__animated animate__fadeIn">
                <h5 className="animate__animated animate__fadeInDown">First slide label</h5>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../img/imagen-slider2.jpg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block animate__animated animate__fadeIn">
              <h5 className="animate__animated animate__fadeInDown">Second slide label</h5>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../img/imagen-medalla-sierraB.jpg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block animate__animated animate__fadeIn">
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
                <div className='imagen-hazaña'  onClick={() => handleImagenClick(index)}>
                <img src={dato.imagen} alt={dato.etiqueta}></img>
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
            <img src={datos[imagenFullscreen].imagen} alt={datos[imagenFullscreen].etiqueta}></img>
            <p>{datos[imagenFullscreen].etiqueta}</p>
          </div>
        </div>
      )}
      </section>
      <section className='valores-section'>
        <article className='valores'>
        <div className='rectangulo'></div>
          <h2>
            Nuestros valores
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a sem in neque hendrerit efficitur nec ac mi. Sed in sapien vel enim ultrices facilisis non in dolor. Mauris rhoncus dui vel odio commodo vehicula varius convallis mauris. Ut condimentum magna et ante pretium ornare. Etiam lacinia ex quis mi tristique scelerisque et id eros. Vivamus sollicitudin ullamcorper eros et dictum. Suspendisse a ligula et mauris dapibus fermentum at sagittis nunc. Nullam sit amet lacus nulla. Ut sit amet lobortis est. In tristique consectetur nisi non aliquam. Vivamus erat velit, venenatis a nunc et, maximus commodo justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a sem in neque hendrerit efficitur nec ac mi. Sed in sapien vel enim ultrices facilisis non in dolor. Mauris rhoncus dui vel odio commodo vehicula varius convallis mauris. Ut condimentum magna et ante pretium ornare. Etiam lacinia ex quis mi tristique scelerisque et id eros. Vivamus sollicitudin ullamcorper eros et dictum. Suspendisse a ligula et mauris dapibus fermentum at sagittis nunc. Nullam sit amet lacus nulla. Ut sit amet lobortis est. In tristique consectetur nisi non aliquam. Vivamus erat velit, venenatis a nunc et, maximus commodo justo.</p>
        </article>

      </section>
    </>

  );
}

export default App;
