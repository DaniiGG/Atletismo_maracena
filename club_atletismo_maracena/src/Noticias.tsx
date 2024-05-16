import { useState, useEffect } from 'react';
import { firestore } from './firebase.ts';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './css/noticias.css';

interface Hazaña {
  fecha: { seconds: number; nanoseconds: number };
  imagen: string;
  imagenes: string[];
  titulo: string;
  contenido: string;
  etiqueta: string;
  destacada: boolean;
  id: string;
}

function Noticias() {
  const [datos, setDatos] = useState<Hazaña[]>([]);
  const [destacada, setDestacada] = useState<Hazaña | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderByDate, setOrderByDate] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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
        const datosRef = query(collection(firestore, 'hazañas'), orderBy('fecha', orderByDate));
        const datosDest = query(collection(firestore, 'hazañas'), orderBy('fecha', "desc"));
        const snapshot = await getDocs(datosRef);
        const snapshotDesc = await getDocs(datosDest);
        const datosObtenidos = snapshot.docs.map((doc) => {
          const data = doc.data() as Hazaña;
          return { ...data, id: doc.id }; // Incluimos el ID del documento en los datos
        });
        const datosDestacada = snapshotDesc.docs.map((doc) => doc.data() as Hazaña);
        setDatos(datosObtenidos);
        const destacadaReciente = datosDestacada.find((dato) => dato.destacada);
        setDestacada(destacadaReciente || null);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, [orderByDate]);


  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const filteredData = datos.filter((dato) =>
    dato.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className='fotoInicial'>
        <img src='../img/imagen-slider3.png' loading="lazy" alt='Imagen inicial'></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
      <h1 id="title">Noticias del club</h1><br></br>
      <p id="subtitle">¡Mantente al tanto de todas las novedades, eventos y logros de nuestro club!</p>
      </div>
      <section className='section'>
      {loading ? ( // Preloader si está cargando
          <div className="preloader">
            <div className="loading-wave">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
          </div>
        ) : (
          <>
        {destacada && (
          <article className='hazañas article'>
            <div className='rectangulo'></div>
            <h2>Noticia Destacada</h2>
            <div className='flex-destacada'>
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {destacada.imagenes.map((imagen, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img src={imagen} className="d-block w-100" alt={`Imagen ${index + 1}`} />
                  </div>
                ))}
                
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
              <p className='etiqueta'>{destacada.etiqueta}</p>
            </div>
              <div className='contenido-destacada'>
                <h5>{destacada.titulo}</h5>
                {destacada.contenido.split('\n').map((line, i) => {
                  if (line.trim().startsWith('- ')) {
                    return <li key={i}>{line.trim().substring(2)}</li>;
                  } else {
                    return <p key={i}>{line}</p>;
                  }
                })}
                <p>
                  <b>{new Date(destacada.fecha.seconds * 1000).toLocaleDateString()}</b>
                </p>
              </div>
            </div>
          </article>
        )}


        <article className='hazañas article'>
          <div className='filtros'>
          <div className="input-container">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Buscar por título..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <select value={orderByDate} onChange={(e) => setOrderByDate(e.target.value as 'asc' | 'desc')}>
            <option value="desc">Fecha (Desc.)</option>
            <option value="asc">Fecha (Asc.)</option>
          </select>
        </div>
        <div className='rectangulo'></div>
          <h2>Noticias del club</h2>
          <div className='flex-hazañas'>
            {currentData.map((dato, index) => (
              <div key={dato.id} className='hazaña'>
                <div className='imagen-hazaña' onClick={() => handleImagenClick(index)}>
                {dato.imagenes && dato.imagenes.length > 0 && (
                  <img src={dato.imagenes[dato.imagenes.length - 1]} alt={dato.etiqueta} />
                )}
                  <p className='etiqueta'>{dato.etiqueta}</p>
                  <div className='lupa'> <i className="fa-solid fa-magnifying-glass fa-2xl"></i></div>
                </div>
                <Link to={`/noticia/${dato.id}`} className='news-link'>
                <h5>{dato.titulo}&nbsp;<i className="fa-solid fa-arrow-up-right-from-square"></i></h5>
                </Link>
                <p className='content'>{dato.contenido.length > 100 ? dato.contenido.slice(0, 130) + '...' : dato.contenido}</p>
                <p className='content'>
                  <b>{new Date(dato.fecha.seconds * 1000).toLocaleDateString()}</b>
                </p>
                
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

        <div className="pagination">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      </>
        )}
      </section>
    </>
  );
}

export default Noticias;
