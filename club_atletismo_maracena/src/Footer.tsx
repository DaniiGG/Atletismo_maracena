import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import './css/footer.css';

function Footer() {
    return (
        <footer>
            <div className='main-footer'>
                <div>
                    <div className='patrocinadores'>
                        <h6>Patrocinadores</h6>
                        <img src="../img/alssport-removebg-preview.png"></img>
                        <img src="../img/grupomayfo-removebg-preview.png"></img>
                    </div>
                </div>
                <div>
                    <h6>Contacto</h6>
                    <ul>
                        <li>Telefono
                            <ul>
                                <li>+34 654 66 75 45</li>
                                <li>+34 675 34 24 76</li>
                            </ul>
                        </li>
                        <li>Email
                            <ul>
                                <li>ejemplo@gmail.com</li>
                            </ul>
                        </li>
                    </ul>

                </div>

            </div>
            <div className='subfooter'>
                <div className="subfooter-parte1">
                <div id="inicio">
                    <img id="logo" src="../img/logoAtletismo.png" alt="logo atletismo maracena"></img>
                    <Link to="/">CLUB ATLETISMO <br/><b>MARACENA</b></Link>
                </div>
                    <div className="redes2">
                        <a target="_blank" href="https://www.facebook.com/clubatletismomaracena/?locale=es_ES"><i className="fa-brands fa-square-facebook fa-2xl"></i></a>&nbsp;&nbsp;&nbsp;
                        <a target="_blank" href="https://www.instagram.com/club_atletismo_maracena/"><i className="fa-brands fa-instagram fa-2xl"></i></a>
                    </div>
                </div>
                <div>
                    <p><Link to="">Aviso legal</Link>&nbsp;|&nbsp;<Link to="/politica-cookies">Política de cookies</Link>&nbsp;|&nbsp;<Link to="/politica-privacidad">Política de privacidad</Link></p>
                </div>
                <div className="redes">
                    <a target="_blank" href="https://www.facebook.com/clubatletismomaracena/?locale=es_ES"><i className="fa-brands fa-square-facebook fa-2xl"></i></a>&nbsp;&nbsp;&nbsp;
                    <a target="_blank" href="https://www.instagram.com/club_atletismo_maracena/"><i className="fa-brands fa-instagram fa-2xl"></i></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
