import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "./firebase";
import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import './css/login.css'


function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(true);

    interface Usuario {
        userId: string;
        username: string;
        email: string;
        role: string;
    }

    async function guardarRolUsuario(userId: string, username: string, email: string, role: string) {
        const db = getFirestore();
        const usuario: Usuario = {
            userId: userId,
            username: username,
            email: email,
            role: role // Aquí guardamos el rol del usuario
        };
    
        try {
            const docRef = await addDoc(collection(db, 'usuarios'), usuario);
            console.log("Usuario registrado con ID: ", docRef.id);
        } catch (e) {
            console.error("Error al añadir usuario: ", e);
        }
    }

    function logueoFacebook() {
        const provider = new FacebookAuthProvider();
        const auth = getAuth(app);
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const userId = user.uid;
                const username = user.displayName;
                const email = user.email;
                const db = getFirestore();
                const usuariosRef = collection(db, 'usuarios');
                const consulta = query(usuariosRef, where('userId', '==', userId));
                getDocs(consulta)
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            console.log("El usuario ya está registrado.");
                        } else {
                            guardarRolUsuario(userId, username || "Usuario", email || "", "user");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al consultar la base de datos:", error);
                    });
                navigate("/");
            }).catch((error) => {
                const errorCode = error.code;
                let errorMessage = "Error al iniciar sesión con Facebook. Por favor, intenta de nuevo más tarde.";
                switch (errorCode) {
                    case "auth/popup-closed-by-user":
                        errorMessage = "El inicio de sesión con Facebook fue cancelado por el usuario.";
                        break;
                    default:
                        errorMessage = error.message;
                }
                setError(errorMessage);
                console.error("Error al iniciar sesión con Facebook:", errorMessage);
            });
    }

    function logueoGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential !== null) {
                    const user = result.user;
                    const userId = user.uid;
                    const username = user.displayName;
                    const email = user.email;
                    const db = getFirestore();
                    const usuariosRef = collection(db, 'usuarios');
                    const consulta = query(usuariosRef, where('userId', '==', userId));
                    getDocs(consulta)
                    .then((querySnapshot) => {
                        if (!querySnapshot.empty) {
                            console.log("El usuario ya está registrado.");
                        } else {
                            guardarRolUsuario(userId, username || "Usuario", email || "", "user");
                        }
                    })
                    .catch((error) => {
                        console.error("Error al consultar la base de datos:", error);
                    });
                    navigate("/");
                } else {
                    console.error("Credencial de Google nula.");
                }
            }).catch((error) => {
                const errorCode = error.code;
                let errorMessage = "Error al iniciar sesión con Google. Por favor, intenta de nuevo más tarde.";
                switch (errorCode) {
                    case "auth/popup-closed-by-user":
                        errorMessage = "El inicio de sesión con Google fue cancelado por el usuario.";
                        break;
                    default:
                        errorMessage = error.message;
                }
                setError(errorMessage);
                console.error("Error al iniciar sesión con Google:", errorMessage);
            });
    }

    function loguearse() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Usuario inició sesión:", user);
                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = "";
                switch (errorCode) {
                    default:
                        errorMessage = "Credenciales incorrectas.";
                }
                setError(errorMessage);
                console.error("Error al iniciar sesión:", errorMessage);
            });
    }

    function registrarse() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            guardarRolUsuario(user.uid, username, email, 'user');
            
            return updateProfile(user, {
                displayName: username
            }).then(() => {
                console.log("Nombre de usuario vinculado con éxito.");
                navigate("/");
            }).catch((error) => {
                console.error("Error al vincular nombre de usuario:", error.message);
                setError(error.message);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = "Error al registrar. Por favor, intenta de nuevo más tarde.";
            switch (errorCode) {
                case "auth/email-already-in-use":
                    errorMessage = "El correo electrónico ya está en uso.";
                    break;
                case "auth/weak-password":
                    errorMessage = "La contraseña es débil. Debe tener al menos 6 caracteres.";
                    break;
                default:
                    errorMessage = error.message;
            }
            setError(errorMessage);
            console.error("Error al registrar:", errorMessage);
        });
    }

    function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        registrarse();
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        loguearse();
    }

    const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png"></img>
      </div>
      <div className={`main-title ${loaded ? 'loaded' : ''}`}>
      <h1 id="title">Inicia sesión</h1><br></br>
      <p id="subtitle">Únete a nuestro club de atletismo y mantente en movimiento. ¡Inicia sesión para empezar tu próxima carrera!</p>
      </div>
      <div className="session-container">
        {showLogin && (
            <div className="login-container">
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} id="all-form">
                <div className="formulary">
                {error && <p className="error-message">{error}</p>}
                    <div className="inputBox">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <h5>Email</h5>
                    </div>
                    <div className="inputBox">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <h5>Contraseña</h5>
                    </div>
                    <button className="enter" type="submit">Iniciar Sesión</button>
                    </div>
                </form>
                
                <div className="social-login-buttons">
                    <button className="google-login" onClick={logueoGoogle}><img src="../public/img/google.png"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Iniciar sesión con Google</button>
                    <button className="facebook-login" onClick={logueoFacebook}><img src="../public/img/facebook.png"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Iniciar sesión con Facebook</button>
                </div>
                <p>¿No tienes cuenta? <span onClick={() => setShowLogin(false)}>Regístrate</span></p>
                
            </div>
        )}
        {!showLogin && (
            <div className="register-container">
                <h1>Registro</h1>
                <form onSubmit={handleRegisterSubmit} id="all-form">
                <div className="formulary">
                {error && <p className="error-message">{error}</p>}
                    <div className="inputBox">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <h5>Nombre de usuario*</h5>
                    </div>
                    <div className="inputBox">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <h5>Correo Electrónico*</h5>
                    </div>
                    <div className="inputBox">
                            <input type="pass" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <h5>Contraseña*</h5>
                    </div>
                    <button className="enter" type="submit">Registrarse</button>
                   
                    </div>
                </form>
                <p>¿Ya tienes cuenta? <span onClick={() => setShowLogin(true)}>Inicia Sesión</span></p>
            </div>
        )}
        </div>
    </>
  )
}

export default Login