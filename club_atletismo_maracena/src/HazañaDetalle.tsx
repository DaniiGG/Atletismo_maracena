import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { firestore } from './firebase.ts';
import { doc, getDoc } from 'firebase/firestore';

function HazañaDetalle() {
    const { id } = useParams();
    const [noticia, setNoticia] = useState<any>(null);
    
    useEffect(() => {
        const fetchNoticia = async () => {
          try {
            if (id) {
                const noticiaRef = doc(firestore, 'hazañas', id);
                const snapshot = await getDoc(noticiaRef);
                console.log(snapshot)
                if (snapshot.exists()) {
                setNoticia(snapshot.data());
                } else {
                console.log('No se encontró la noticia');
                }
            }
          } catch (error) {
            console.error('Error al obtener la noticia:', error);
          }
        };
    
        fetchNoticia();
      }, [id]);

      const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

  return (
    
    <div className="detalles-noticia">
        {noticia ? (
            <>
            <div className='fotoInicial'>
                <img src='../img/imagen-slider3.png' loading="lazy" alt='Imagen inicial'></img>
            </div>
            <div className={`main-title ${loaded ? 'loaded' : ''}`}>
                <h1 id="title">{noticia.etiqueta}</h1><br></br>
                <p id="subtitle">{new Date(noticia.fecha.seconds * 1000).toLocaleDateString()}</p>
            </div>
      
            
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                {noticia.imagenes.map((imagen: string, index: number) => (
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
                <p className='etiqueta'>{noticia.etiqueta}</p>
                </div>
                <div className='contenido-noticia'>
                <h2>{noticia.titulo}</h2>
                {noticia.contenido.split('\n').map((line: string, i: number) => {
                  if (line.trim().startsWith('- ')) {
                    return <li key={i}>{line.trim().substring(2)}</li>;
                  } else {
                    return <p key={i}>{line}</p>;
                  }
                })}
                <p>{noticia.contenido}</p>
                <p>{new Date(noticia.fecha.seconds * 1000).toLocaleDateString()}</p>
                </div>
            </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default HazañaDetalle;