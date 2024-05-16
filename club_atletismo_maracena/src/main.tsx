import './css/index.css';
import { useState, useEffect } from 'react';
import { auth, firestore } from './firebase.ts';
import { createRoot } from 'react-dom/client';
import { query, where, getDocs, collection, DocumentData } from 'firebase/firestore';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import App from './App.jsx';
import Navegacion from './Navegacion.tsx';
import Club from './Club.tsx';
import Inscripcion from './Inscripciones.tsx';
import Noticias from './Noticias.tsx';
import Galeria from './Galeria.tsx';
import Contacto from './Contacto.tsx';
import Footer from './Footer.tsx';
import Login from './Login.tsx';
import PageNotFound from './PageNotFound.tsx';
import ScrollToTop from './ScrollToTop.tsx';
import Administracion from './Administracion.tsx';
import HazañaDetalle from './HazañaDetalle.tsx';

const getUserRole = async (userId: string): Promise<string> => {
  try {
    const userQuery = query(collection(firestore, 'usuarios'), where('userId', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data() as DocumentData;
      return userData.role || 'user';
    } else {
      console.error('No se encontró el usuario en la base de datos');
      return 'user';
    }
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    return 'user';
  }
};

interface PrivateRouteProps {
  path: string;
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }: PrivateRouteProps) => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole('login');
      }
    });
    return () => unsubscribe();
  }, []);

  if (userRole === "") {
    return <div>Cargando...</div>;
  } else if (userRole === 'admin') {
    return element;
  } else if (userRole === 'login') {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/error" />;
  }
};

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Navegacion /><App /><Footer /></>} />
        <Route path="club" element={<><Navegacion /><Club /><Footer /></>} />
        <Route path="inscripcion" element={<><Navegacion /><Inscripcion /><Footer /></>} />
        <Route path="noticias" element={<><Navegacion /><Noticias /><Footer /></>} />
        <Route path="galeria" element={<><Navegacion /><Galeria /><Footer /></>} />
        <Route path="contacto" element={<><Navegacion /><Contacto /><Footer /></>} />
        <Route path="login" element={<><Navegacion /><Login /><Footer /></>} />
        <Route path="register" element={<><Navegacion /><Footer /></>} /> 
        <Route path="/noticia/:id" element={<><Navegacion /><HazañaDetalle/><Footer /></>} />
        <Route path="administracion" element={ <PrivateRoute  path="administracion" element={<><Administracion /></>} /> } />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppRoutes />
  );
} else {
  console.error('No se encontró el elemento raíz (root) en el DOM.');
}