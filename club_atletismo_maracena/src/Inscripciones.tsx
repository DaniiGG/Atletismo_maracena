import { firestore } from './firebase.ts';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth } from './firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import './css/inscripciones.css';

function Inscripciones() {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    dni: '',
  });
  const [errors, setErrors] = useState({
    telefono: '',
    dni: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (name: FormFieldName, value: string) => {
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'telefono':
        const phonePattern = /^\d{9}$/; 
        setErrors({ ...errors, telefono: phonePattern.test(value) ? '' : 'El número de teléfono debe tener exactamente 9 dígitos.' });
        break;
      case 'dni':
        const dniPattern = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/;
        setErrors({ ...errors, dni: dniPattern.test(value.toUpperCase()) ? '' : 'Formato de DNI incorrecto.' });
        break;
      default:
        break;
    }
  };

  type FormFieldName = keyof typeof formData;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Object.entries(formData).forEach(([name, value]) => validateField(name as FormFieldName, value));

    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }
    try {
      const querySnapshot = await getDocs(query(collection(firestore, 'inscripciones'), where('dni', '==', formData.dni)));
      if (!querySnapshot.empty) {
        setMessage('Este DNI ya está registrado.');
        setError(true);
        return;
      }
      
      await addDoc(collection(firestore, 'inscripciones'), formData);
      setMessage('¡Inscripción exitosa!');
      setError(false);
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        dni: '',
      });
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setMessage('Hubo un error al procesar la inscripción. Por favor, inténtalo de nuevo más tarde.');
      setError(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setFormData((prevFormData) => ({ ...prevFormData, email: user.email || '' }));
      }
    });
    setLoaded(true);
    return () => unsubscribe();
  }, []);

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
        <h1 id="title">Inscríbete</h1><br></br>
        <p id="subtitle">¡Únete a nuestro club y comienza tu viaje hacia una vida más activa y saludable hoy mismo!</p>
      </div>
      {message && <div className={`message ${error ? 'error' : 'success'}`}>{message}</div>}
      <form className="inscripciones-form" onSubmit={handleSubmit}>
      <div className="form-label">Nombre:</div>
      <input className="form-input" type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />

      <div className="form-label">Apellidos:</div>
      <input className="form-input" type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required />

      <div className="form-label">Email:</div>
      <input className="form-input" type="email" name="email" value={formData.email} onChange={handleInputChange} required />

      <div className="form-label">Teléfono:</div>
      <input className="form-input" type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} onBlur={(e) => handleBlur('telefono', e.target.value)} required />
      {errors.telefono && <div className="form-error">{errors.telefono}</div>}

      <div className="form-label">Dirección:</div>
      <input className="form-input" type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required />

      <div className="form-label">DNI:</div>
      <input className="form-input" type="text" name="dni" value={formData.dni} onChange={handleInputChange} onBlur={(e) => handleBlur('dni', e.target.value)} required />
      {errors.dni && <div className="form-error">{errors.dni}</div>}

      <button className="form-button" type="submit">Enviar</button>

    </form>
    </>
  )
}

export default Inscripciones;
