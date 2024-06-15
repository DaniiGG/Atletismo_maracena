import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import './css/footer.css';

function Footer() {
    return (
        <footer>
            <div className='main-footer'>
                <div>
                <h6>Patrocinadores</h6>
                    <div className='patrocinadores'>
                        <img src="../img/alssport-removebg-preview.png"></img>&nbsp;&nbsp;&nbsp;
                        <img src="../img/run_pro.png"></img>&nbsp;&nbsp;&nbsp;
                        <img src="../img/grupomayfo-removebg-preview.png"></img>
                    </div>
                </div>
                <div>
                    <h6>Contacto</h6>
                    <ul>
                        <li>Telefono
                            <ul>
                                <li><a href="tel:+34645343423">645 34 34 23</a></li>
                                <li><a href="tel:+34672346521">672 34 65 21</a></li>
                            </ul>
                        </li>
                        <li>Email
                            <ul>
                                <li><a href="mailto:atletismomaracena@gmail.com">atletismomaracena@gmail.com</a></li>
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
                    <p><Link to="/politica-cookies">Política de cookies</Link>&nbsp;|&nbsp;<Link to="/politica-privacidad">Política de privacidad</Link></p>
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
