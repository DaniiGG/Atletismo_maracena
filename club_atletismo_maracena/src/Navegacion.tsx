import { useState, useEffect, useRef } from 'react';
import './css/navegacion.css'
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import { User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function Navegacion() {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [scrollBg, setScrollBg] = useState(false);
    const [showShadow, setShowShadow] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [esAdmin, setEsAdmin] = useState(false);
    const navRef = useRef(null);

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
  
    function alternarSignOut() {
      const auth = getAuth();
      firebaseSignOut(auth).then(() => {
      }).catch((error) => {
        console.error('Error:', error);
      });
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (window.innerWidth >= 1050) {
              if (scrollTop > 0) {
                  setScrollBg(true);
                  setShowShadow(true);
              } else {
                  setScrollBg(false);
                  setShowShadow(false);
              }
          } else {
              setScrollBg(false);
              setShowShadow(false);
          }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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

    return (
        <> 
        <div className='menu-hamburguesa'>
        <div id="inicio" className='inicio2'>
                    <img id="logo" src="../img/logoAtletismo.png"></img>
                    <Link to="/">CLUB ATLETISMO <br/><b>MARACENA</b></Link>
        </div>
          <div className="barras" onClick={() => setMenuOpen(!menuOpen)}>
              <div className={`line ${menuOpen ? 'open' : ''}`}></div>
              <div className={`line ${menuOpen ? 'open' : ''}`}></div>
              <div className={`line ${menuOpen ? 'open' : ''}`}></div>
          </div>
        </div>
    
        <div className={`menu-horizontal ${scrollBg ? 'with-bg' : ''} ${menuOpen ? 'open' : ''}`} ref={navRef} style={{ backgroundColor: scrollBg ? '#1f1f1f' : 'transparent',
            boxShadow: showShadow ? '0px 2px 4px rgb(0, 0, 0)' : 'none' }}>
          <nav>
            <div id="inicio" className='inicio1'>
                    <img id="logo" src="../img/logoAtletismo.png"></img>
                    <Link to="/">CLUB ATLETISMO <br/><b>MARACENA</b></Link>
            </div>
            <ul>
              <li className={location.pathname === "/club" ? "active" : ""}><Link to="/club">Club</Link></li>
              <li  className={"has-submenu " + (location.pathname === "/inscripcion" ? "active" : "")}>
                <Link to="/inscripcion">Inscríbete</Link>
              </li>
              <li className={"has-submenu " + (location.pathname === "/noticias" ? "active" : "")}>
                <Link to="/noticias">Noticias</Link>
              </li>
              <li className={location.pathname === "/galeria" ? "active" : ""}><Link to="/galeria">Galería de fotos</Link></li>
              <li className={location.pathname === "/contacto" ? "active" : ""}><Link to="/contacto">Contacto</Link></li>
              <li className="has-submenu "> {user ? (
                        <>
                          <a>Bienvenido, {user.displayName ? user.displayName : user.email}</a>
                            <ul className="submenu">
                            {esAdmin && <li><Link to="/admin">Administración</Link></li>}
                              <li><a className="link" onClick={alternarSignOut}>Cerrar sesión</a></li>
                            </ul>
                        </>
                        ) : (
                          <Link to="/login"  className="link">Login</Link>
                      )}
               
              </li>
            </ul>
          </nav>
        </div>
    
          
          {/* <div className="container">
  <div className="heading">Sign In</div>
  <form className="form" action="">
    <input
      placeholder="E-mail"
      id="email"
      name="email"
      type="email"
      className="input"
      required
    />
    <input
      placeholder="Password"
      id="password"
      name="password"
      type="password"
      className="input"
      required
    />
    <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
    <input value="Sign In" type="submit" className="login-button" />
  </form>
  <div className="social-account-container">
    <span className="title">Or Sign in with</span>
    <div className="social-accounts">
      <button className="social-button google">
        <svg
          viewBox="0 0 488 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="svg"
        >
          <path
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
      </button>
      <button className="social-button apple">
        <svg
          viewBox="0 0 384 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="svg"
        >
          <path
            d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
          ></path>
        </svg>
      </button>
      <button className="social-button twitter">
        <svg
          viewBox="0 0 512 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="svg"
        >
          <path
            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
  <span className="agreement"><a href="#">Learn user licence agreement</a></span>
</div> */}

        </>
      )
}

export default Navegacion;