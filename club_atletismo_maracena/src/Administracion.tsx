import { useState, useEffect } from 'react';
import { firestore, storage } from './firebase.ts';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query  } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from "react-router-dom";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import * as XLSX from 'xlsx';
import './css/administracion.css';

type Imagen = {
    id: string;
    imagen: string;
    descripcion: string;
    fecha: { seconds: number; nanoseconds: number };
};

type Noticia = {
    id: string;
    imagenes:string[];
    titulo: string;
    contenido: string;
    etiqueta: string;
    fecha: { seconds: number; nanoseconds: number };
    destacada: boolean;
};

type Inscripcion= {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
    dni: string;
    fecha:{ seconds: number; nanoseconds: number };
  }

type Seccion = "seccion1" | "seccion2" | "seccion3"; 

function Administracion() {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [seccionAbierta, setSeccionAbierta] = useState<Seccion | null>("seccion1"); 
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [nuevaNoticia, setNuevaNoticia] = useState({
        imagenes: [] as string[],
        titulo: '',
        contenido: '',
        etiqueta: '',
        fecha: '', 
        destacada: false,
      });
    const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);
    const [imagenes, setImagenes] = useState<Imagen[]>([]);
    const [nuevaImagen, setNuevaImagen] = useState<{file: File | null, fecha: string}>({file: null, fecha: ''});
    const [mostrarFormularioNoticia, setMostrarFormularioNoticia] = useState(false);
    const [mostrarFormularioGaleria, setMostrarFormularioGaleria] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false); 
    const [searchTerm, setSearchTerm] = useState('');
    const [orderByDate, setOrderByDate] = useState<'asc' | 'desc'>('desc');
    const [imagenesActuales, setImagenesActuales] = useState<string[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredNoticias = noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const sortedNoticias = orderByDate === 'asc'
        ? filteredNoticias.sort((a, b) => a.fecha.seconds - b.fecha.seconds)
        : filteredNoticias.sort((a, b) => b.fecha.seconds - a.fecha.seconds);

    setTimeout(() => {
        const messageElement = document.querySelector('.message');
        if (messageElement) {
          setTimeout(() => {
            messageElement.classList.add('hide');
          }, 5000);
        }
      }, 5000); 

      const exportarAExcel = () => {
        const workbook = XLSX.utils.book_new();
        
        const headers = [
            { header: "Id", key: "id" },
            { header: "Nombre", key: "nombre" },
            { header: "Apellidos", key: "apellidos" },
            { header: "Email", key: "email" },
            { header: "Dni", key: "dni" },
            { header: "Teléfono", key: "telefono" },
            { header: "Dirección", key: "direccion" }
        ];
        const inscripcionesWS = XLSX.utils.json_to_sheet(inscripciones, { header: headers.map(h => h.key) });
        
        headers.forEach((h, i) => {
            const cellAddress = XLSX.utils.encode_col(i) + "1";
            inscripcionesWS[cellAddress].v = h.header;
        });
        
        XLSX.utils.book_append_sheet(workbook, inscripcionesWS, 'Inscripciones');
        XLSX.writeFile(workbook, 'inscripciones.xlsx');
        };

      const cargarInscripciones = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'inscripciones'));
            const inscripcionesData= querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inscripcion));
            setInscripciones(inscripcionesData);
        } catch (error) {
            console.error('Error al cargar inscripciones:', error);
        }
    };

    const handleEliminarInscripcion = async (id: string, nombre: string) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar la inscripción de " + nombre + "?");
        if (!confirmacion) {
            return;
        }
        try {
            await deleteDoc(doc(firestore, 'inscripciones', id));
            console.log("Inscripción eliminada correctamente");
            setMessage('Inscripción eliminada correctamente.');
            setError(false);
            cargarInscripciones();
        } catch (error) {
            console.error('Error al eliminar inscripción:', error);
            setMessage('No se ha podido eliminar la inscripción.');
            setError(true);
        }
    };

    useEffect(() => {
        cargarInscripciones();
    }, []);

    useEffect(() => {
        cargarNoticias();
        cargarImagenes();
    }, []);

    useEffect(() => {
        cargarNoticias();
    }, [searchTerm, orderByDate]);

    const cargarNoticias = async () => {
        try {
            const noticiasQuery = query(
                collection(firestore, 'hazañas'),
                orderBy('fecha', 'desc') 
            );
            const querySnapshot = await getDocs(noticiasQuery);
            const noticiasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Noticia));
            setNoticias(noticiasData);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
    };

    const cargarImagenes = async () => {
        try {
            const imagenesQuery = query(
                collection(firestore, 'imagenes'),
                orderBy('fecha', 'desc')
            );
            const querySnapshot = await getDocs(imagenesQuery);
            const imagenesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imagen));
            setImagenes(imagenesData);
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
        }
    };


    const handleEliminarNoticia = async (id: string, titulo: string) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar " + titulo + "?");
        if (!confirmacion) {
            return;
        }
    
        try {
            await deleteDoc(doc(firestore, 'hazañas', id));
            console.log("Noticia eliminada correctamente");
            cargarNoticias();
        } catch (error) {
            console.error('Error al eliminar noticia:', error);
        }
    };
    
    const handleEliminarImagen = async (id: string) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta imagen?");
        if (!confirmacion) {
            return;
        }
    
        try {
            await deleteDoc(doc(firestore, 'imagenes', id));
            console.log("Imagen eliminada correctamente");
            cargarImagenes();
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
        }
    };

    const toggleSeccion = (seccion: Seccion) => {
        if (seccionAbierta === seccion) {
            return;
        } else {
            setSeccionAbierta(seccion);
        }
    };

    const handleChangeNoticia = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNuevaNoticia({ ...nuevaNoticia, [name]: value });
      };
      const handleImageChangeNoticia = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
    
            Promise.all(
                files.map((file) => {
                    const storageRef = ref(storage, `imagenes/${file.name}`);
                    return uploadBytes(storageRef, file).then((snapshot) => {
                        console.log('Imagen subida correctamente');
                        return getDownloadURL(snapshot.ref);
                    });
                })
            )
            .then((urls: string[]) => {
                setNuevaNoticia((prevNoticia) => ({
                    ...prevNoticia,
                    imagenes: [...prevNoticia.imagenes, ...urls]
                }));
            })
            .catch((error) => {
                console.error('Error al subir las imágenes:', error);
            });
        }
    };

    const handleSubmitNoticia  = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const noticia = {
        ...nuevaNoticia,
        fecha: new Date(nuevaNoticia.fecha),
        };
        await addDoc(collection(firestore, 'hazañas'), noticia);
        setMessage('Noticia insertada correctamente.');
        setError(false);
        console.log('Noticia insertada correctamente.');
        setNuevaNoticia({
        imagenes: [],
        titulo: '',
        contenido: '',
        etiqueta: '',
        fecha: '',
        destacada: false,
        });
        cargarNoticias();
        setMostrarFormularioNoticia(!mostrarFormularioNoticia);
    } catch (error) {
        console.error('Error al insertar la noticia:', error);
        setMessage('No se ha podido insertar la noticia.');
        setError(false);
    }
    };
    const handleEditarNoticia = (noticia: Noticia) => {
        setNoticiaEditando(noticia);
        setImagenesActuales(noticia.imagenes);
    };

    const handleGuardarEdicionNoticia = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!noticiaEditando) {
            console.error('No hay ninguna noticia para editar');
            return;
        }
    
        try {
            // Actualizar solo el contenido de la noticia
            await updateDoc(doc(firestore, 'hazañas', noticiaEditando.id), {
                titulo: noticiaEditando.titulo,
                contenido: noticiaEditando.contenido,
                etiqueta: noticiaEditando.etiqueta,
                fecha: noticiaEditando.fecha,
                destacada: noticiaEditando.destacada,
            });
    
            // Actualizar imágenes si se han subido nuevas
            if (nuevaNoticia.imagenes.length > 0) {
                await updateDoc(doc(firestore, 'hazañas', noticiaEditando.id), {
                    imagenes: nuevaNoticia.imagenes,
                });
            }
    
            console.log('Noticia actualizada correctamente');
            setMessage('Noticia actualizada correctamente.');
            setError(false);
            setNoticiaEditando(null);
            cargarNoticias();
        } catch (error) {
            console.error('Error al actualizar la noticia:', error);
        }
    };

    const handleDateChangeImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevaImagen(prevState => ({ ...prevState, fecha: e.target.value }));
    };

    const handleImageChangeImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNuevaImagen(prevState => ({ ...prevState, file: files[0] }));
        } else {
            setNuevaImagen(prevState => ({ ...prevState, file: null }));
        }
    };

    const handleSubmitImagen = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (nuevaImagen.file) {
            try {
                const storageRef = ref(storage, `imagenes/${nuevaImagen.file.name}`);
                await uploadBytes(storageRef, nuevaImagen.file);
                console.log('Imagen subida correctamente');
                const imagenURL = await getDownloadURL(storageRef);
                const fecha = nuevaImagen.fecha ? new Date(nuevaImagen.fecha) : new Date();
                await addDoc(collection(firestore, 'imagenes'), { imagen: imagenURL, fecha });
                setMessage('Imagen guardada correctamente.');
                setError(false);
                console.log('URL de la imagen y fecha guardadas en Firestore');
                setNuevaImagen({file: null, fecha: ''});
                cargarImagenes();
                setMostrarFormularioGaleria(!mostrarFormularioGaleria);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
                setMessage('Error al subir la imagen.');
                setError(true);
            }
        }
    };
    function alternarSignOut() {
        const auth = getAuth();
        firebaseSignOut(auth).then(() => {
        }).catch((error) => {
          console.error('Error:', error);
        });
      }

    return (
        <>
            <div className='encabezado-administracion'>
                <div id="inicio">
                        <img id="logo" src="../img/logoAtletismo.png"></img>
                        <Link to="/">CLUB ATLETISMO <br/><b>MARACENA</b></Link>
                </div>
                <h1>Panel de administración</h1>
                <a className="link" onClick={alternarSignOut}>Cerrar sesión</a>
            </div>
            <div className='administracion'>
            <div className="sidebar">
                <ul>
                    <hr></hr>
                    <li onClick={() => toggleSeccion("seccion1")}>Noticias</li>
                    <hr></hr>
                    <li onClick={() => toggleSeccion("seccion2")}>Inscripciones</li>
                    <hr></hr>
                    <li onClick={() => toggleSeccion("seccion3")}>Galería</li>
                </ul>
            </div>
            {message && <div className={`message ${error ? 'error' : 'success'}`}>{message}</div>}
            <div className='secciones'>
                
                <div className={seccionAbierta === "seccion1" ? 'submenu-visible' : 'submenu-hidden'}>
                    
                    <div className='header-administracion'>
                        <h1>{noticiaEditando ? 'Edita la noticia' : mostrarFormularioNoticia ? 'Nueva noticia' : 'Control de noticias'}</h1>
                        <button onClick={() => {
                        if (noticiaEditando) {
                            setNoticiaEditando(null);
                        } else {
                            setMostrarFormularioNoticia(!mostrarFormularioNoticia);
                        }
                        }}>
                        { noticiaEditando || mostrarFormularioNoticia ? (<><i className="fa-solid fa-left-long"></i>&nbsp;&nbsp;&nbsp;{'Volver a la lista'} </> ): (<>{'Nueva noticia'}&nbsp;&nbsp;&nbsp; <i className="fa-solid fa-plus"></i></>)}
                        </button>
                    </div>
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
                    {!mostrarFormularioNoticia && !noticiaEditando && (
                    <div className="lista-noticias">
                        {sortedNoticias.map(noticia => (
                            <div key={noticia.id} className="noticia">
                                <h4>{noticia.titulo}</h4>
                                <div id={`carousel-${noticia.id}`} className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {noticia.imagenes.slice().reverse().map((imagen, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                <img src={imagen} className="d-block w-100" alt={`Imagen ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${noticia.id}`} data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${noticia.id}`} data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                                {/* Resto de la información de la noticia */}
                                {noticia.contenido.split('\n').map((line, i) => {
                                    if (line.trim().startsWith('- ')) {
                                        return <li key={i}>{line.trim().substring(2)}</li>;
                                    } else {
                                        return <p key={i}>{line}</p>;
                                    }
                                })}
                                <p><strong>Etiqueta:</strong> {noticia.etiqueta}</p>
                                <p><strong>Fecha:</strong> {new Date(noticia.fecha.seconds * 1000).toLocaleDateString()}</p>
                                <p><strong>Destacada:</strong> {noticia.destacada ? 'Sí' : 'No'}</p>
                                <div className='acciones'>
                                    <button className="edit-button" type="button" onClick={() => handleEditarNoticia(noticia)}>
                                        <span className="button__text">Editar</span>
                                        <span className="button__icon">
                                            <svg className="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#fff" strokeLinecap="round" strokeWidth="2"><path d="m20 20h-16"></path><path clipRule="evenodd" d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z" fillRule="evenodd"></path></g></svg>
                                        </span>
                                    </button>
                                    <button className="del-button" type="button" onClick={() => handleEliminarNoticia(noticia.id, noticia.titulo)}>
                                        <span className="button__text">Eliminar</span>
                                        <span className="button__icon">
                                            <svg className="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                <title></title>
                                                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line className="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line>
                                                <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="256" x2="256" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="184" x2="192" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="328" x2="320" y1="176" y2="400"></line>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {mostrarFormularioNoticia && (
                <div className="noticia-formulario">
                    <form onSubmit={handleSubmitNoticia}>

                        <input
                            type="text"
                            name="titulo"
                            value={nuevaNoticia.titulo}
                            onChange={handleChangeNoticia}
                            placeholder="Título de la noticia"
                            required
                            className="input-titulo"
                        />

                        <textarea
                            name="contenido"
                            value={nuevaNoticia.contenido}
                            onChange={handleChangeNoticia}
                            placeholder="Contenido de la noticia"
                            required
                            className="input-contenido"
                        />

                        <input
                            type="text"
                            name="etiqueta"
                            value={nuevaNoticia.etiqueta}
                            onChange={handleChangeNoticia}
                            placeholder="Etiqueta de la noticia"
                            required
                            className="input-etiqueta"
                        />

                        <input
                            type="date"
                            name="fecha"
                            value={nuevaNoticia.fecha}
                            onChange={handleChangeNoticia}
                            required
                            className="input-fecha"
                        />

                        <label className="checkbox-destacada">
                            <input
                                type="checkbox"
                                name="destacada"
                                checked={nuevaNoticia.destacada}
                                onChange={() => setNuevaNoticia({ ...nuevaNoticia, destacada: !nuevaNoticia.destacada })}
                            />
                            Destacada
                        </label>

                        <input type="file" accept="image/*" onChange={handleImageChangeNoticia} multiple required className="input-imagen" />
                        
                        <div className="imagenes-previas">
                            {nuevaNoticia.imagenes.map((imagen, index) => (
                                <img key={index} src={imagen} alt={`Vista previa ${index}`} className="imagen-previa" />
                            ))}
                        </div>
                        
                        <button type="submit" className="boton-insertar">Insertar Noticia</button>

                    </form>
                </div>
                )}

                    {noticiaEditando &&  (
                            <div className="noticia-formulario">
                                <form onSubmit={handleGuardarEdicionNoticia}>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={noticiaEditando.titulo}
                                        onChange={(e) => setNoticiaEditando({ ...noticiaEditando, titulo: e.target.value })}
                                        placeholder="Título de la noticia"
                                        required
                                        className="input-titulo"
                                    />
                                    <textarea
                                        name="contenido"
                                        value={noticiaEditando.contenido}
                                        onChange={(e) => setNoticiaEditando({ ...noticiaEditando, contenido: e.target.value })}
                                        placeholder="Contenido de la noticia"
                                        required
                                        className="input-contenido"
                                    />
                                    <input
                                        type="text"
                                        name="etiqueta"
                                        value={noticiaEditando.etiqueta}
                                        onChange={(e) => setNoticiaEditando({ ...noticiaEditando, etiqueta: e.target.value })}
                                        placeholder="Etiqueta de la noticia"
                                        required
                                        className="input-etiqueta"
                                    />
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={noticiaEditando.fecha.seconds ? new Date(noticiaEditando.fecha.seconds * 1000).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setNoticiaEditando({ ...noticiaEditando, fecha: { seconds: new Date(e.target.value).getTime() / 1000, nanoseconds: 0 } })}
                                        required
                                        className="input-fecha"
                                    />
                                    <label className="checkbox-destacada">
                                        <input
                                            type="checkbox"
                                            name="destacada"
                                            checked={noticiaEditando.destacada}
                                            onChange={(e) => setNoticiaEditando({ ...noticiaEditando, destacada: e.target.checked })}
                                        />
                                        Destacada
                                    </label>
                                    <div className="imagenes-previas">
                                        {imagenesActuales.map((imagen, index) => (
                                            <img key={index} src={imagen} alt={`Imagen ${index}`} className="imagen-previa" />
                                        ))}
                                    </div>

                                    <input type="file" accept="image/*" onChange={handleImageChangeNoticia} multiple className="input-imagen" />
                                    <button type="submit" className="boton-insertar">Guardar</button>
                                </form>
                            </div>
                        )}
                </div>

                <div className={seccionAbierta === "seccion2" ? 'submenu-visible' : 'submenu-hidden'}>
                <h3>Lista de Usuarios</h3>
                <div className="input-container">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div><br></br>
                <table>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Email</th>
                        <th>Dni</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {inscripciones
                    .filter(inscripcion => inscripcion.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(inscripcion => (
                        <tr key={inscripcion.id}>
                            <td>{inscripcion.id}</td>
                            <td>{inscripcion.nombre}</td>
                            <td>{inscripcion.apellidos}</td>
                            <td>{inscripcion.email}</td>
                            <td>{inscripcion.dni}</td>
                            <td>{inscripcion.telefono}</td>
                            <td>{inscripcion.direccion}</td>
                            <td>
                                {inscripcion.fecha && inscripcion.fecha.seconds
                                    ? new Date(inscripcion.fecha.seconds * 1000).toLocaleDateString()
                                    : 'Fecha no disponible'}
                                </td>
                            <td>
                                <button className="del-button" type="button" onClick={() => handleEliminarInscripcion(inscripcion.id, inscripcion.nombre)}>
                                    <span className="button__text">Eliminar</span>
                                        <span className="button__icon">
                                            <svg className="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                <title></title>
                                                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeMiterlimit: '10', strokeWidth: '32px' }} x1="80" x2="432" y1="112" y2="112"></line>
                                                <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="256" x2="256" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="184" x2="192" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="328" x2="320" y1="176" y2="400"></line>
                                            </svg>
                                        </span>
                                    </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="total-row">
                        <td colSpan={7}>Total de inscripciones: {inscripciones.length}</td>
                        </tr>
                    </tfoot>
                </table>
                <button className="button" type="button" onClick={exportarAExcel}>
                    <span className="button__text">Descargar Excel</span>
                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" className="svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                </button>
                </div>

                <div className={seccionAbierta === "seccion3" ? 'submenu-visible' : 'submenu-hidden'}>
                    <div className='header-administracion'>
                        <h1>{mostrarFormularioGaleria ? 'Nueva imagen' : 'Control de galería'}</h1>
                        <button onClick={() => {
                            setMostrarFormularioGaleria(!mostrarFormularioGaleria);
                        }
                        }>
                        { mostrarFormularioGaleria ? (<><i className="fa-solid fa-left-long"></i>&nbsp;&nbsp;&nbsp;{'Volver a la lista'} </> ): (<>{'Nueva imagen'}&nbsp;&nbsp;&nbsp; <i className="fa-solid fa-plus"></i></>)}
                        </button>
                    </div>
                        {!mostrarFormularioGaleria &&(
                        <div className="lista-imagenes">
                            {imagenes.map(imagen => (
                                <div key={imagen.id} className="imagen-item">
                                    <img src={imagen.imagen} alt={`Imagen ${imagen.id}`} className="imagen-galeria" />
                                    <button className="del-button" type="button" onClick={() => handleEliminarImagen(imagen.id)}>
                                    <span className="button__text">Eliminar</span>
                                        <span className="button__icon">
                                            <svg className="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                                                <title></title>
                                                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeMiterlimit: '10', strokeWidth: '32px' }} x1="80" x2="432" y1="112" y2="112"></line>
                                                <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></path>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="256" x2="256" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="184" x2="192" y1="176" y2="400"></line>
                                                <line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1="328" x2="320" y1="176" y2="400"></line>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        )}
                        {mostrarFormularioGaleria && (
                        <div className="noticia-formulario">
                            <form onSubmit={handleSubmitImagen}>
                                <input type="date" name="fecha" id="fecha" placeholder="fecha"
                                 value={nuevaImagen.fecha} onChange={handleDateChangeImagen} required/>
                                <input type="file" accept="image/*" onChange={handleImageChangeImagen} required className="input-imagen" />
                                <button type="submit" className="boton-insertar">Subir Imagen</button>
                            </form>
                        </div>
                        )}
                    </div>
            </div>
        </div>
        </>
        
    );
}

export default Administracion;