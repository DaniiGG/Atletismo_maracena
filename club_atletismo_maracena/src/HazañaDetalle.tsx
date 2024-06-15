import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { firestore } from './firebase.ts';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './css/detalle.css';

function HazañaDetalle() {
    const { id } = useParams();
    const [noticia, setNoticia] = useState<any>(null);
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [editandoComentario, setEditandoComentario] = useState<string | null>(null);
    const [textoEditado, setTextoEditado] = useState('');
    const [esAdmin, setEsAdmin] = useState(false);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      const verificarAdmin = async () => {
          if (user) {
              const db = getFirestore();
              const usuariosRef = collection(db, 'usuarios');
              const consulta = query(usuariosRef, where('userId', '==', user.uid));
              const querySnapshot = await getDocs(consulta);
              if (!querySnapshot.empty) {
                  const usuario = querySnapshot.docs[0].data();
                  if (usuario.role === 'admin') {
                      setEsAdmin(true);
                  } else {
                      setEsAdmin(false);
                  }
              }
          }
      };

      verificarAdmin();
  }, [user]);

    const añadirComentario = async (noticiaId: string, usuarioId: string, nombreUsuario: string, contenido: string) => {
      try {
        const comentario = {
          noticiaId,
          usuarioId,
          nombreUsuario,
          contenido,
          fecha: new Date()
        };
        await addDoc(collection(firestore, 'comentarios'), comentario);
      } catch (error) {
        console.error('Error al añadir comentario:', error);
      }
    };

    const fetchComentarios = async () => {
      try {
        if (id) {
          const q = query(collection(firestore, 'comentarios'), where('noticiaId', '==', id));
          const querySnapshot = await getDocs(q);
          const comentariosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setComentarios(comentariosData);
        }
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };
  
    useEffect(() => {
      fetchComentarios();
    }, [id]);

    const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNuevoComentario(e.target.value);
    };

    const handleComentarioSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (id && nuevoComentario.trim() && user) {
        const usuarioId = user.uid;
        const nombreUsuario = user.displayName || 'Usuario Anónimo';
        await añadirComentario(id, usuarioId, nombreUsuario, nuevoComentario);
        setNuevoComentario('');
        fetchComentarios();
      }
    };
  
    
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

    const handleEditComentario = async (comentarioId: string) => {
      if (textoEditado.trim()) {
        const comentarioRef = doc(firestore, 'comentarios', comentarioId);
        await updateDoc(comentarioRef, { contenido: textoEditado });
        setEditandoComentario(null);
        setTextoEditado('');
        fetchComentarios();
      }
    };
  
    const handleDeleteComentario = async (comentarioId: string) => {
      const comentarioRef = doc(firestore, 'comentarios', comentarioId);
      await deleteDoc(comentarioRef);
      fetchComentarios();
    };
  

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleComentarioSubmit(e);
      }
    };

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
      
            <section className='section'>
              <article className='article detalle'>
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {noticia.imagenes.slice().reverse().map((imagen: string, index: number) => (
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
                  <p>{new Date(noticia.fecha.seconds * 1000).toLocaleDateString()}</p>
                  
                  </div>
                  <div className="comentarios">
                    <h3>Comentarios</h3>
                    <div className="lista-comentarios">
                      {comentarios.slice(0, 10).map(comentario => (
                        <div key={comentario.id} className="comentario">
                          {editandoComentario === comentario.id ? (
                            <div>
                              <textarea
                                value={textoEditado}
                                onChange={(e) => setTextoEditado(e.target.value)}
                                className="textarea-comentario"
                              />
                              <div className='acciones-editar'>
                                <button className='btn-guardar' onClick={() => handleEditComentario(comentario.id)}>Guardar</button>
                                <button className='btn-cancelar' onClick={() => setEditandoComentario(null)}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p><strong>{comentario.nombreUsuario}:</strong> {comentario.contenido}</p>
                              <p className="fecha">{new Date(comentario.fecha.seconds * 1000).toLocaleDateString()}</p>
                              {user && (user.uid === comentario.usuarioId || esAdmin) && (
                                <div className="acciones-comentario">
                                  <button onClick={() => {
                                    setEditandoComentario(comentario.id);
                                    setTextoEditado(comentario.contenido);
                                  }}>Editar</button>
                                  <button className='btn-borrar' onClick={() => handleDeleteComentario(comentario.id)}>Borrar</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleComentarioSubmit} className="form-comentario">
                      <textarea
                        value={nuevoComentario}
                        onChange={handleComentarioChange}
                        placeholder="Añadir un comentario"
                        onKeyDown={handleKeyDown}
                        className="textarea-comentario"
                      />
                      <button type="submit" className="btn-comentario">Enviar</button>
                    </form>
                  </div>
                </article>
              </section>
            </>
      ) : (
        <div className="preloader">
            <div className="loading-wave">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
          </div>
      )}
    </div>
  );
}

export default HazañaDetalle;