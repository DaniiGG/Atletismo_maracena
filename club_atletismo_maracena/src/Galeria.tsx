import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from './firebase'; 
import './css/galeria.css';

interface ImageData {
  imagen: string;
  descripcion: string;
  fecha: { seconds: number; nanoseconds: number };
}

function Galeria() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagenFullscreen, setImagenFullscreen] = useState<number | null>(null);

  const handleImagenClick = (index: number) => {
    setImagenFullscreen(index);
  };

  const handleCloseFullscreen = () => {
    setImagenFullscreen(null);
  };

  const handleNextImage = () => {
    if (imagenFullscreen !== null && imagenFullscreen < images.length - 1) {
      setImagenFullscreen(imagenFullscreen + 1);
    }
  };

  const handlePrevImage = () => {
    if (imagenFullscreen !== null && imagenFullscreen > 0) {
      setImagenFullscreen(imagenFullscreen - 1);
    }
  };


  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Crear una consulta ordenada por el campo 'fecha'
        const q = query(collection(firestore, 'imagenes'), orderBy('fecha', 'desc')); // Cambia 'desc' a 'asc' para orden ascendente
        const querySnapshot = await getDocs(q);
        const loadedImages: ImageData[] = [];
  
        querySnapshot.forEach(doc => {
          const data = doc.data() as ImageData;
          loadedImages.push(data);
        });
  
        setImages(loadedImages); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images: ', error);
      }
    };
  
    fetchImages();
  }, []); 


  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio" />
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
        <h1 id="title">Galería de fotos</h1><br />
        <p id="subtitle">Explora momentos capturados de nuestras actividades, competiciones y eventos.</p>
      </div>

      {loading ? ( 
          <div className="preloader">
            <div className="loading-wave">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
          </div>
        ) : (
      <section className='grid-container'>
        {images.map((image, index) => (
          <article key={index} className={`image ${image.descripcion}`} onClick={() => handleImagenClick(index)}>
            <img src={image.imagen} alt={`Imagen ${index + 1}`} />
            {/* <div className='descripcion'><span>{image.descripcion}</span></div> */}
          </article>
        ))}
      </section>
        )}
         {imagenFullscreen !== null && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-image-container">
          {loading && (
            <div className="preloader">
              <div className="loading-wave">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            </div>
            )}
            <div>
              {imagenFullscreen > 0 && (
              <button className="prev-button" onClick={handlePrevImage}>
                  <div className="triangle2"/>
                </button>
              )}
              <img src={images[imagenFullscreen].imagen} alt={images[imagenFullscreen].descripcion} onLoad={() => setLoading(false)} />
                <button className="button"  onClick={handleCloseFullscreen}>
                <span className="X"></span>
                <span className="Y"></span>
              </button>
              {imagenFullscreen < images.length - 1 && (
                <button className="next-button" onClick={handleNextImage}>
                  <div className="triangle1"/>
                </button>
              )}
              <p>{images[imagenFullscreen].descripcion}</p>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}

export default Galeria;
