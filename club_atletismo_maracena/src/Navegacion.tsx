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
                    <img id="logo" src="../img/logoAtletismo.png" alt="logo atletismo maracena"></img>
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
                    {esAdmin && <li><Link to="/administracion">Administración</Link></li>}
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
        </>
      )
}

export default Navegacion;