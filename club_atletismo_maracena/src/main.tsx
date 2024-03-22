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
      {/* <Route path="pokemon" element={<><Navegacion /><Pokemon /><Footer /></>} />
      <Route path="detalles/:id" element={<><Navegacion /><Detalles /><Footer /></>} />
      <Route path="minijuego" element={user ? (
        <><Navegacion /><Minijuego /><Footer /></>
      ) : (
        <><Navegacion /><Login /><Footer /></>
      )} />
      <Route path="login" element={<><Navegacion /><Login /><Footer /></>} />
      <Route path="register" element={<><Navegacion /><Register /><Footer /></>} /> */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

createRoot(document.getElementById("root")).render(
  <Router>
    <AppRoutes />
  </Router>
);