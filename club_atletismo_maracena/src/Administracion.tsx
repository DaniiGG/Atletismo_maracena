import { useState, useEffect } from 'react';
import { firestore, storage } from './firebase.ts';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc  } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import './css/administracion.css';

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
  }

type Seccion = "seccion1" | "seccion2" | "seccion3"; 

function Administracion() {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [seccionAbierta, setSeccionAbierta] = useState<Seccion | null>(null); 
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

      const exportarAExcel = () => {
        const workbook = XLSX.utils.book_new();
        const inscripcionesWS = XLSX.utils.json_to_sheet(inscripciones);
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

    useEffect(() => {
        cargarInscripciones();
    }, []);

    useEffect(() => {
        cargarNoticias();
    }, []);

    const cargarNoticias = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'hazañas'));
            const noticiasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Noticia));
            setNoticias(noticiasData);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
    };

    const handleEliminarNoticia = async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'hazañas', id));
            console.log("Noticia eliminada correctamente");
            cargarNoticias();
        } catch (error) {
            console.error('Error al eliminar noticia:', error);
        }
    };

    const toggleSeccion = (seccion: Seccion) => {
        if (seccionAbierta === seccion) {
            return;
        } else {
            setSeccionAbierta(seccion);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNuevaNoticia({ ...nuevaNoticia, [name]: value });
      };

      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const noticia = {
        ...nuevaNoticia,
        fecha: new Date(nuevaNoticia.fecha),
        };
        await addDoc(collection(firestore, 'hazañas'), noticia);
        console.log('Noticia insertada correctamente');
        setNuevaNoticia({
        imagenes: [],
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
    const handleEditarNoticia = (noticia: Noticia) => {
        setNoticiaEditando(noticia);
    };

    const handleGuardarEdicion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!noticiaEditando) {
            console.error('No hay ninguna noticia para editar');
            return;
        }
        try {
            await updateDoc(doc(firestore, 'hazañas', noticiaEditando.id), {
                titulo: noticiaEditando.titulo,
                contenido: noticiaEditando.contenido,
                etiqueta: noticiaEditando.etiqueta,
                fecha: noticiaEditando.fecha,
                destacada: noticiaEditando.destacada,
            });
            console.log('Noticia actualizada correctamente');
            setNoticiaEditando(null);
            cargarNoticias();
        } catch (error) {
            console.error('Error al actualizar la noticia:', error);
        }
    };
    

    return (
        <>
            <div className='encabezado-administracion'>
                <div id="inicio">
                        <img id="logo" src="../img/logoAtletismo.png"></img>
                        <Link to="/">CLUB ATLETISMO <br/><b>MARACENA</b></Link>
                </div>
                <h1>Panel de administración</h1>
            </div>
            <div className='administracion'>
            <div className="sidebar">
                <ul>
                    <li onClick={() => toggleSeccion("seccion1")}>Noticias</li>
                    <li onClick={() => toggleSeccion("seccion2")}>Inscripciones</li>
                    <li onClick={() => toggleSeccion("seccion3")}>Sección 3</li>
                </ul>
            </div>
            <div className='secciones'>
                <div className={seccionAbierta === "seccion1" ? 'submenu-visible' : 'submenu-hidden'}>
                    <h3>Control de noticias</h3>
                    <div className="lista-noticias">
                            {noticias.map(noticia => (
                                <div key={noticia.id} className="noticia">
                                    <h2>{noticia.titulo}</h2>
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
                                    <button onClick={() => handleEditarNoticia(noticia)}>Editar</button>
                                    <button onClick={() => handleEliminarNoticia(noticia.id)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                    <div className="noticia-formulario">
                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                name="titulo"
                                value={nuevaNoticia.titulo}
                                onChange={handleChange}
                                placeholder="Título de la noticia"
                                required
                                className="input-titulo"
                            />

                            <textarea
                                name="contenido"
                                value={nuevaNoticia.contenido}
                                onChange={handleChange}
                                placeholder="Contenido de la noticia"
                                required
                                className="input-contenido"
                            />

                            <input
                                type="text"
                                name="etiqueta"
                                value={nuevaNoticia.etiqueta}
                                onChange={handleChange}
                                placeholder="Etiqueta de la noticia"
                                required
                                className="input-etiqueta"
                            />

                            <input
                                type="date"
                                name="fecha"
                                value={nuevaNoticia.fecha}
                                onChange={handleChange}
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

                            <input type="file" accept="image/*" onChange={handleImageChange} multiple required className="input-imagen" />
                            
                            <div className="imagenes-previas">
                                {nuevaNoticia.imagenes.map((imagen, index) => (
                                    <img key={index} src={imagen} alt={`Vista previa ${index}`} className="imagen-previa" />
                                ))}
                            </div>
                            
                            <button type="submit" className="boton-insertar">Insertar Noticia</button>

                        </form>
                    </div>

                    {noticiaEditando && (
                            <div className="noticia-formulario">
                                <form onSubmit={handleGuardarEdicion}>
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
                                    <button type="submit" className="boton-insertar">Guardar</button>
                                </form>
                            </div>
                        )}
                </div>

                <div className={seccionAbierta === "seccion2" ? 'submenu-visible' : 'submenu-hidden'}>
                <h3>Lista de Usuarios</h3>
                <ul>
                    {inscripciones.map(inscripcion => (
                        <li key={inscripcion.id}>
                            Nombre: {inscripcion.nombre}, Apellidos: {inscripcion.apellidos}, Email: {inscripcion.email}, Teléfono: {inscripcion.telefono}, Dirección: {inscripcion.direccion}
                        </li>
                    ))}
                </ul>
                <button className="button" type="button" onClick={exportarAExcel}>
                    <span className="button__text">Descargar Excel</span>
                    <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" className="svg"><path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path><path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path><path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path></svg></span>
                </button>
                </div>

                <div className={seccionAbierta === "seccion3" ? 'submenu-visible' : 'submenu-hidden'}>
                    <h3>Contenido de la Sección 3</h3>
                </div>
            </div>
        </div>
        </>
        
    );
}

export default Administracion;