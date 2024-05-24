import { useState, useEffect } from 'react';

function PoliticaCookies() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
      }, []);

    return (
        <>
            <div className='fotoInicial'>
                <img src="../img/imagen-slider3.png" loading="lazy" alt="imagen de inicio" />
            </div>
            <div className={`main-title ${loaded ? 'loaded' : ''}`}>
                <h1 id="title">Política de Cookies</h1><br />
                <p id="subtitle"> fecha efectiva: 21-May-2024 - Última actualización: 21-May-2024</p>
            </div>
            <article className='article'>
                <h5>¿Qué son las cookies?</h5>
                <div className="cookie-policy-p"><p>Esta Política de cookies explica qué son las cookies y cómo las usamos, los tipos de cookies que utilizamos, es decir, la información que recopilamos mediante cookies y cómo se usa esa información, y cómo administrar la configuración de las cookies.</p> <p>Cookies Son pequeños archivos de texto que se utilizan para almacenar pequeños fragmentos de información. Se almacenan en su dispositivo cuando el sitio web se carga en su navegador. Estas cookies nos ayudan a que el sitio web funcione correctamente, hacerlo más seguro, brindar una mejor experiencia de usuario y comprender cómo funciona el sitio web y analizar qué funciona y dónde necesita mejorar.</p></div>

                &nbsp;
                <h5>¿Cómo usamos las cookies?</h5>
                <div className="cookie-policy-p"><p>Como la mayoría de los servicios en línea, nuestro sitio web utiliza cookies propias y de terceros para varios propósitos. Las cookies de origen son principalmente necesarias para que el sitio web funcione correctamente y no recopilan ninguno de sus datos de identificación personal.</p> <p>Las cookies de terceros utilizadas en nuestro sitio web son principalmente para comprender cómo funciona funciona el sitio web, cómo interactúa con nuestro sitio web, mantiene nuestros servicios seguros, proporciona anuncios que sean relevantes para usted y, en general, le brinda una experiencia de usuario mejor y mejorada y le ayuda a acelerar sus interacciones futuras con nuestro sitio web.</p></div>

                &nbsp;

                    <div className="cky-audit-table-element"></div>

                &nbsp;
                    <h5 style={{marginBottom:"20px"}}>Gestiona las preferencias de cookies</h5>

                    <div><p>Puede cambiar sus preferencias de cookies en cualquier momento haciendo clic en el botón de arriba. Esto le permitirá volver a visitar el banner de consentimiento de cookies y cambiar sus preferencias o retirar su consentimiento de inmediato.</p><p>Además de esto, diferentes navegadores ofrecen diferentes métodos para bloquear y eliminar las cookies utilizadas por los sitios web. Puede cambiar la configuración de su navegador para bloquear/eliminar las cookies. A continuación se enumeran los enlaces a los documentos de soporte sobre cómo administrar y eliminar cookies de los principales navegadores web.</p><p>Chrome: <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/accounts/answer/32050">https://support.google.com/accounts/answer/32050</a></p><p>Safari: <a target="_blank" rel="noopener noreferrer" href="https://support.apple.com/en-in/guide/safari/sfri11471/mac">https://support.apple.com/en-in/guide/safari/sfri11471/mac</a></p><p>Firefox: <a target="_blank" rel="noopener noreferrer" href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US">https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&amp;redirectlocale=en-US</a></p><p>Internet Explorer: <a target="_blank" rel="noopener noreferrer" href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc">https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc</a></p><p>Si está utilizando cualquier otro navegador web, visite los documentos de soporte oficiales de su navegador.</p></div>

            </article>
        </>

    );

}

export default PoliticaCookies;