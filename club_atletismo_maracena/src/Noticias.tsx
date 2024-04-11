import { useState, useEffect } from 'react';
import { firestore, auth, storage } from './firebase.ts';
import { collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './css/noticias.css';

interface Hazaña {
  fecha: { seconds: number; nanoseconds: number };
  imagen: string;
  titulo: string;
  contenido: string;
  etiqueta: string;
  destacada: boolean;
}

function Noticias() {
  const [datos, setDatos] = useState<Hazaña[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [destacada, setDestacada] = useState<Hazaña | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nuevaNoticia, setNuevaNoticia] = useState({
    imagen: '',
    titulo: '',
    contenido: '',
    etiqueta: '',
    fecha: '', 
    destacada: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Verifica si el usuario es administrador (nombre de usuario administrador = "admin")
        setIsAdmin(user.displayName === 'Danii');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaNoticia({ ...nuevaNoticia, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const storageRef = ref(storage, `imagenes/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Imagen subida correctamente');
        
        getDownloadURL(snapshot.ref).then((url: string) => {
          setNuevaNoticia({ ...nuevaNoticia, imagen: url });
        });
      }).catch((error) => {
        console.error('Error al subir la imagen:', error);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !isAdmin) {
      console.log('Usuario no autorizado');
      return;
    }

    try {
      const noticia = {
        ...nuevaNoticia,
        fecha: new Date(nuevaNoticia.fecha),
      };
      await addDoc(collection(firestore, 'hazañas'), noticia);
      console.log('Noticia insertada correctamente');
      setNuevaNoticia({
        imagen: '',
        titulo: '',
        contenido: '',
        etiqueta: '',
        fecha: '',
        destacada: false,
      });
    } catch (error) {
      console.error('Error al insertar la noticia:', error);
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const datosRef = query(collection(firestore, 'hazañas'), orderBy('fecha', 'desc'));
        const snapshot = await getDocs(datosRef);
        const datosObtenidos = snapshot.docs.map((doc) => doc.data() as Hazaña);
        setDatos(datosObtenidos);

        // Encontrar la noticia destacada más reciente
        const destacadaReciente = datosObtenidos.find((dato) => dato.destacada);
        setDestacada(destacadaReciente || null);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };


  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <div className='fotoInicial'>
        <img src='../img/imagen-slider3.png' alt='Imagen inicial'></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
      <h1 id="title">Noticias del club</h1><br></br>
      <p id="subtitle">¡Mantente al tanto de todas las novedades, eventos y logros de nuestro club!</p>
      </div>
      <section>
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
          <article className='destacada'>
            <div className='rectangulo'></div>
            <h2>Noticia Destacada</h2>
            <div className='flex-destacada'>
              <div className='destacada'>
                <div className='imagen-destacada'>
                  <img src={destacada.imagen} alt={destacada.etiqueta}></img>
                  <p>{destacada.etiqueta}</p>
                </div>
                <h5>{destacada.titulo}</h5>
                <p>{destacada.contenido.length > 100 ? destacada.contenido.slice(0, 130) + '...' : destacada.contenido}</p>
                <p>
                  <b>{new Date(destacada.fecha.seconds * 1000).toLocaleDateString()}</b>
                </p>
              </div>
            </div>
          </article>
        )}

        <article className='hazañas'>
        <div className='rectangulo'></div>
          <h2>Noticias del club</h2>
          <div className='flex-hazañas'>
            {datos.map((dato, index) => (
              <div key={index} className='hazaña'>
                <div className='imagen-hazaña'>
                  <img src={dato.imagen} alt={dato.etiqueta}></img>
                  <p>{dato.etiqueta}</p>
                </div>
                <h5>{dato.titulo}</h5>
                <p>{dato.contenido.length > 100 ? dato.contenido.slice(0, 130) + '...' : dato.contenido}</p>
                <p>
                  <b>{new Date(dato.fecha.seconds * 1000).toLocaleDateString()}</b>
                </p>
              </div>
            ))}
          </div>
        </article>

        {isAdmin && (
        <>
          <button onClick={toggleForm}>Insertar Noticia</button>
          {showForm && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="titulo"
                value={nuevaNoticia.titulo}
                onChange={handleChange}
                placeholder="Título de la noticia"
                required
              />
              <textarea
                name="contenido"
                value={nuevaNoticia.contenido}
                onChange={handleChange}
                placeholder="Contenido de la noticia"
                required
              />
              <input
                type="text"
                name="etiqueta"
                value={nuevaNoticia.etiqueta}
                onChange={handleChange}
                placeholder="Etiqueta de la noticia"
                required
              />
              <input
                type="date"
                name="fecha"
                value={nuevaNoticia.fecha}
                onChange={handleChange}
                required
              />
              <label>
                <input
                  type="checkbox"
                  name="destacada"
                  checked={nuevaNoticia.destacada}
                  onChange={() => setNuevaNoticia({ ...nuevaNoticia, destacada: !nuevaNoticia.destacada })}
                />
                Destacada
              </label>
              {/* Campo de entrada de archivo para la imagen */}
              <input type="file" accept="image/*" onChange={handleImageChange} required />
              {/* Vista previa de la imagen */}
              {nuevaNoticia.imagen && <img src={nuevaNoticia.imagen} alt="Vista previa" style={{ maxWidth: '200px' }} />}
              <button type="submit">Insertar Noticia</button>
            </form>
          )}
        </>
      )}
      </>
        )}
      </section>
    </>
  );
}

export default Noticias;
