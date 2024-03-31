import { Link } from "react-router-dom";
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


const PageNotFound = () => (
  <div style={{ textAlign: "center" }}>
  <h1>404 - Página no encontrada</h1>
  <p>La página que buscas no existe.</p>
  <Link to="/" className="link">Volver a inicio</Link>
</div>
);

const AppRoutes = () => {
  

  return (
    <Routes>
      <Route path="/" element={<><Navegacion /><App /><Footer /></>} />
      <Route path="club" element={<><Navegacion /><Club /><Footer /></>} />
      <Route path="inscripcion" element={<><Navegacion /><Inscripcion /><Footer /></>} />
      <Route path="noticias" element={<><Navegacion /><Noticias /><Footer /></>} />
      <Route path="galeria" element={<><Navegacion /><Galeria /><Footer /></>} />
      <Route path="contacto" element={<><Navegacion /><Contacto /><Footer /></>} />
      <Route path="login" element={<><Navegacion /><Login /><Footer /></>} />
      <Route path="register" element={<><Navegacion /><Footer /></>} /> 
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <Router>
      <AppRoutes />
    </Router>
  );
} else {
  console.error('No se encontró el elemento raíz (root) en el DOM.');
}