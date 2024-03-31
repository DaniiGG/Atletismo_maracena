

import './css/contacto.css'


function Contacto() {
  

  return (
    <> 
      <div className='fotoInicial'>
        <img src="../img/imagen-slider3.png"></img>
      </div>
      <div id="all-form">
          
          <form action="#" method="post">
          <div className="formulary">
              
  
              <div className="inputBox">
                  <input type="text" required/>
                  <h5>Email*</h5>
              </div>

              <div className="inputBox">
                  <input type="pass" required/>
                  <h5>Contraseña*</h5>
              </div>
  
              <button type="submit" className="enter">Iniciar Sesión</button>
  
          </div>
      </form>
      
  </div>
    </>
  )
}

export default Contacto