import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase'; 
import './css/galeria.css';

interface ImageData {
  imagen: string;
  descripcion: string;
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


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'imagenes'));
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
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
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
            <img src={images[imagenFullscreen].imagen} alt={images[imagenFullscreen].descripcion} onLoad={() => setLoading(false)} />
              <button className="button">
              <span className="X"></span>
              <span className="Y"></span>
            </button>
            <p>{images[imagenFullscreen].descripcion}</p>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}

export default Galeria;
