import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import './css/footer.css';

function Footer() {
    // const [showButton, setShowButton] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollY = window.scrollY;
    //         const alturaX = 200; 
    //         setShowButton(scrollY > alturaX);
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    // const scrollToTop = () => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth' // Desplazamiento suave
    //     });
    // };

    return (
        <footer>
            {/* Botón de scroll en caso de tener un menu que no se fixed 
            {showButton && (
                <button className="scroll-button" onClick={scrollToTop}>
                    <i className="fas fa-chevron-up"></i>
                </button>
            )}*/}
            <div className='main-footer'>
                <div>
                    {/* <div id="inicio">
                        <img id="logo" src="../img/logoAtletismo.png"></img>
                        <a>CLUB ATLETISMO <br/><b>MARACENA</b></a>
                    </div> */}

                    <div className='patrocinadores'>
                        <h6>Patrocinadores</h6>
                        <img src="../img/alssport-removebg-preview.png"></img>
                        <img src="../img/grupomayfo-removebg-preview.png"></img>
                        <img src="../img/runpro.jpg"></img>
                    </div>
                </div>
            
                <div>
                    
                    <h6>Síguenos</h6>
                    <i className="fa-brands fa-square-facebook fa-2xl"></i>&nbsp;&nbsp;&nbsp;
                    <i className="fa-brands fa-instagram fa-2xl"></i>
                    
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
                <div>
                    <p><Link to="">Aviso legal</Link>&nbsp;|&nbsp;<Link to="">Política de cookies</Link>&nbsp;|&nbsp;<Link to="">Política de privacidad</Link></p>
                </div>
                <div>
                    <i className="fa-brands fa-square-facebook fa-2xl"></i>&nbsp;&nbsp;&nbsp;
                    <i className="fa-brands fa-instagram fa-2xl"></i>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
