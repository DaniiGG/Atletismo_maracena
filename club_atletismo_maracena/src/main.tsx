import './css/index.css'
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import App from './App.jsx'
import Navegacion from './Navegacion.tsx';
import Club from './Club.tsx';
import Inscripcion from './Inscripciones.tsx';
import Noticias from './Noticias.tsx';
import Galeria from './Galeria.tsx';
import Contacto from './Contacto.tsx';
import Footer from './Footer.tsx';
import Login from './Login.tsx';
import Cookies from './Cookies.tsx';
import PageNotFound from './PageNotFound.tsx';
import ScrollToTop from './ScrollToTop.tsx';

const AppRoutes = () => {
  
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Navegacion /><App /><Footer /><Cookies /></>} />
        <Route path="club" element={<><Navegacion /><Club /><Footer /><Cookies /></>} />
        <Route path="inscripcion" element={<><Navegacion /><Inscripcion /><Footer /><Cookies /></>} />
        <Route path="noticias" element={<><Navegacion /><Noticias /><Footer /><Cookies /></>} />
        <Route path="galeria" element={<><Navegacion /><Galeria /><Footer /><Cookies /></>} />
        <Route path="contacto" element={<><Navegacion /><Contacto /><Footer /><Cookies /></>} />
        <Route path="login" element={<><Navegacion /><Login /><Footer /><Cookies /></>} />
        <Route path="register" element={<><Navegacion /><Footer /><Cookies /></>} /> 
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