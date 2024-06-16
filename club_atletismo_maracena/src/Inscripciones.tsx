import { firestore } from './firebase.ts';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { auth } from './firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import emailjs from 'emailjs-com'
import './css/inscripciones.css';

declare global {
  interface Window {
    paypal: any;
  }
}

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
  const [showFullInfo, setShowFullInfo] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name as FormFieldName, value); // Validate field on input change
  };

  const handleBlur = (name: FormFieldName, value: string) => {
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'telefono':
        const phonePattern = /^\d{9}$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          telefono: phonePattern.test(value) ? '' : 'El número de teléfono debe tener exactamente 9 dígitos.',
        }));
        break;
      case 'dni':
        const dniPattern = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/;
        setErrors((prevErrors) => ({
          ...prevErrors,
          dni: dniPattern.test(value.toUpperCase()) ? '' : 'Formato de DNI incorrecto.',
        }));
        break;
      default:
        break;
    }
  };

  const validateForm = async () => {
    let isValid = true;
  
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name as FormFieldName, value);
    });
  
    if (
      formData.telefono === '' ||
      formData.dni === ''
    ) {
      isValid = false;
      setMessage('Debe rellenar todos los campos correctamente.');
      setError(true);
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      isValid = false;
      setMessage('El número de teléfono debe tener nueve dígitos.');
      setError(true);
    } else if (!/^\d{8}[A-Za-z]$/.test(formData.dni)) {
      isValid = false;
      setMessage('El DNI debe tener ocho números seguidos de una letra.');
      setError(true);
    }
  
    if (isValid) {
      try {
        const querySnapshot = await getDocs(
          query(collection(firestore, 'inscripciones'), where('dni', '==', formData.dni))
        );
        if (!querySnapshot.empty) {
          setMessage('Este DNI ya está registrado.');
          setError(true);
          isValid = false;
        }
      } catch (error) {
        console.error('Error al validar el DNI:', error);
        setMessage('Hubo un error al validar el DNI. Por favor, inténtalo de nuevo más tarde.');
        setError(true);
        isValid = false;
      }
    }
  
    return isValid;
  };

  type FormFieldName = keyof typeof formData;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setFormData((prevFormData) => ({ ...prevFormData, email: user.email || '' }));
      }
    });
    setLoaded(true);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AczANP1djFkjD3Yaf06dyqNxTmMmZxHiqfbCQI3hgvZ6DaK9h3qAqsurBtIVNFEEmKj34QEw8LQCPWOz&vault=true&intent=subscription';
    script.async = true;
    script.onload = () => {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: async (data:any, actions:any) => {
          console.log(data)
          const isValid = await validateForm();
          if (isValid) {
            return actions.subscription.create({
              plan_id: 'P-9DN75489F5168674XMZUDKIA' 
            });
          } else {
            return Promise.reject(); 
          }
        },
        onError: function(err:any) {
          // Show a generic error message
          console.log(err)
          setError(true);
        },
        onApprove: async function(data:any, actions:any) {
          console.log('Subscription created with ID: ' + data.subscriptionID, actions); 
          try {
            const formDataWithDate = { ...formData, fecha: new Date() };

            await addDoc(collection(firestore, 'inscripciones'), formDataWithDate);
            sendEmailReceipt(formDataWithDate);
            setMessage('¡Inscripción exitosa! Ya eres parte de nuestro club.');
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
        }
      }).render('#paypal-button-container-P-9DN75489F5168674XMZUDKIA'); 
    };
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [formData]);

  const sendEmailReceipt = (formData:any) => {
    const templateParams = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      dni: formData.dni,
    };

    emailjs.send('service_22qek3l', 'template_r4lw7u5', templateParams, 'rVCM_9rNa1IUDuIM-')
      .then((response) => {
        console.log('Correo enviado exitosamente:', response.status, response.text);
      }, (err) => {
        console.error('Error al enviar el correo:', err);
      });
  };


  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
        <h1 id="title">Inscríbete</h1><br></br>
        <p id="subtitle">¡Únete a nuestro club y comienza tu viaje hacia una vida más activa y saludable hoy mismo!</p>
      </div>
      <section className='section'>
        <article className='article'>
          <div className='tarifas'>
            <div className='mensual'>
            </div>
            <div className='trimestral'>
            </div>
          </div>
        </article>

        <article className='article'>
            <div className='rectangulo'></div>
                <h2>
                  Formulario de inscripción
                </h2>
                <div className='mensaje-formulario'>
                  <h4>Opciones de Pago de Mensualidad</h4>
                  En Club de Atletismo Maracena, queremos hacer que el proceso de pago de tu mensualidad sea lo más sencillo y conveniente posible. Por eso, ofrecemos dos opciones fáciles para que elijas la que mejor se adapte a tus necesidades.&nbsp;

                  {showFullInfo ? (
                    <>
                      <h5>1. Pago en Línea</h5>
                      Ahora puedes pagar tu mensualidad directamente desde nuestra página web. Este método es rápido, seguro y te permite realizar el pago desde la comodidad de tu hogar. Sigue estos simples pasos para completar tu pago en línea:
                      <ul>
                        <li>Rellena el siguiente formulario.</li>
                        <li>Una vez rellenado haga click en "Paypal" o bien "Tarjeta de débito o crédito".</li>
                        <li>Rellene el formulario correspondiente.</li>
                        <li>Confirma el monto y haz clic en "Aceptar y continuar".</li>
                        <li>¡Y listo! Recibirás una confirmación de tu pago inmediatamente.</li>
                      </ul>

                      <h5>2. Transferencia Bancaria</h5>
                      Si prefieres realizar un depósito directo, también ofrecemos la opción de pagar a través de transferencia bancaria. Simplemente sigue estos pasos:

                      Visita tu banco o utiliza tu servicio de banca en línea.
                      Realiza una transferencia al siguiente número de cuenta bancaria:
                      <ul>
                        <li>Banco: [Nombre del Banco]</li>
                        <li>Cuenta: [Número de Cuenta]</li>
                        <li>Nombre del Titular: [Nombre del Titular]</li>
                      </ul>
                      En la referencia o concepto del pago, por favor incluye tu número de cliente o número de factura para que podamos identificar tu pago correctamente.&nbsp;
                      <a onClick={() => setShowFullInfo(false)}>Ver menos</a>
                    </>
                  ) : (
                    <a onClick={() => setShowFullInfo(true)}>Más información</a>
                  )}
                </div>
            {message && <div className={`message ${error ? 'error' : 'success'}`}>{message}</div>}
            <form className="inscripciones-form">
            <div className="form-label">Nombre:</div>
            <input className="form-input" type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />

            <div className="form-label">Apellidos:</div>
            <input className="form-input" type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required />

            <div className="form-label">Email:</div>
            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleInputChange} required />

            <div className="form-label">DNI:</div>
            <input className="form-input" type="text" name="dni" value={formData.dni} onChange={handleInputChange} onBlur={(e) => handleBlur('dni', e.target.value)} required />
            {errors.dni && <div className="form-error">{errors.dni}</div>}

            <div className="form-label">Teléfono:</div>
            <input className="form-input" type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} onBlur={(e) => handleBlur('telefono', e.target.value)} required />
            {errors.telefono && <div className="form-error">{errors.telefono}</div>}

            <div className="form-label">Dirección:</div>
            <input className="form-input" type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
          </form>
            <div className='paypal-button' id="paypal-button-container-P-9DN75489F5168674XMZUDKIA"></div>
      </article>
    </section>
    </>
  )
}

export default Inscripciones;
