import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Link } from "react-router-dom";
import './css/index.css'
import * as React from "react";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navegacion from './Navegacion.jsx';

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
      <Route path="/" element={<><Navegacion /><App /></>} />
      {/* <Route path="club" element={<><Navegacion /><Club /><Footer /></>} />
      <Route path="inscripcion" element={<><Navegacion /><Inscripcion /><Footer /></>} />
      <Route path="noticias" element={<><Navegacion /><Noticias /><Footer /></>} />
      <Route path="login" element={<><Navegacion /><Login /><Footer /></>} />
      <Route path="register" element={<><Navegacion /><Register /><Footer /></>} /> */}
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