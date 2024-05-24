import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function PoliticaPrivacidad() {
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
                <h1 id="title">Política de Privacidad</h1><br />
                <p id="subtitle"> fecha efectiva: 21-May-2024 - Última actualización: 21-May-2024</p>
            </div>
            <article className='article'>

                <p className="privacy-policy-p">
                Podemos modificar esta Política de Privacidad en cualquier momento sin
                    previo aviso y publicaremos la Política de Privacidad revisada
                    en el Servicio. La Política revisada será
                    efectiva 180 días después de que la
                    Política revisada se publique en el Servicio y su
                    continuo acceso o uso del Servicio después de dicho tiempo
                    constituirá su aceptación de la Política de Privacidad revisada. Por lo tanto, le recomendamos que revise periódicamente esta página.
                </p>

                <ol className="privacy-policy-ol">
                        <li>
                        <h5 className="privacy-policy-h5">
                        Información que Recopilamos:
                        </h5>

                        
                        <p className="privacy-policy-p">
                        Recopilaremos y procesaremos la siguiente
                            información personal sobre usted:
                        </p>
                        <ol className="privacy-policy-ol">

                                        <li>Nombre</li>
                            
                                        <li>Email</li>
                            
                                        <li>Teléfono</li>
                            
                            
                                        <li>Año de nacimiento</li>
                            
                                        <li>Dirección</li>
                            
                            
                                        <li>Información de pago</li>
                                        
                                        <li>DNI</li>
                                        
                        </ol>
                        

                        

                    </li>

                    
                        <li>
                        <h5 className="privacy-policy-h5">
                            Cómo Recopilamos su Información:
                        </h5>
                        <p className="privacy-policy-p">
                            Recopilamos/recibimos información sobre usted de la
                            siguiente manera:
                        </p>
                        <ol className="privacy-policy-ol">
                            <li>Cuando un usuario completa el formulario de registro o de otro modo envía información personal</li>
                            <li>Interactúa con el sitio web</li>
                            <li>De fuentes públicas</li>
                        </ol>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Cómo Usamos su Información:
                        </h5>
                        <p className="privacy-policy-p">
                            Usaremos la información que recopilamos
                            sobre usted para los siguientes propósitos:
                        </p>
                        <ol className="privacy-policy-ol">
                            <li>Procesamiento de pagos</li>
                        </ol>
                        <p className="privacy-policy-p">
                            Si deseamos usar su información para cualquier otro
                            propósito, solicitaremos su consentimiento y
                            utilizaremos su información solo al recibir su
                            consentimiento y solo para el/los propósito(s) para
                            los cuales se concede el consentimiento, a menos que estemos obligados a hacerlo
                            por ley.
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Cómo Compartimos su Información:
                        </h5>
                        <p className="privacy-policy-p">
                            No transferiremos su información personal
                            a ningún tercero sin buscar su consentimiento,
                            excepto en circunstancias limitadas como se describe
                            a continuación:
                        </p>
                        <ol className="privacy-policy-ol">
                            <li>Analíticas</li>
                        </ol>
                        <p className="privacy-policy-p">
                            Requerimos que dicho tercero use la
                            información personal que les transferimos solo
                            para el propósito para el cual fue transferida y
                            no la retengan por más tiempo del necesario para
                            cumplir con dicho propósito.
                        </p>
                        <p className="privacy-policy-p">
                            También podemos divulgar su información personal
                            para lo siguiente: (1) para cumplir con la ley
                            aplicable, regulación, orden judicial u otro
                            proceso legal; (2) para hacer cumplir sus acuerdos con nosotros,
                            incluida esta Política de Privacidad; o (3) para responder
                            a reclamaciones de que su uso del Servicio viola
                            derechos de terceros. Si el Servicio o nuestra
                            empresa se fusiona o es adquirida por otra
                            empresa, su información será uno de los
                            activos que se transfieran al nuevo propietario.
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Retención de su Información:
                        </h5>
                        <p className="privacy-policy-p">
                            Retendremos su información personal con nosotros
                            durante
                            90 días a 2 años después de que los usuarios terminen sus cuentas
                            o durante el tiempo
                            que necesitemos para cumplir con los propósitos para
                            los que fue recopilada, según se detalla en esta
                            Política de Privacidad. Podemos necesitar retener cierta
                            información durante períodos más largos, como
                            para llevar registros/informes de acuerdo con
                            la ley aplicable o por otras razones legítimas
                            como hacer cumplir derechos legales, prevención
                            del fraude, etc. La información residual anónima
                            y la información agregada, que no lo identifique
                            (directa o indirectamente), puede almacenarse indefinidamente.
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Sus Derechos:
                        </h5>
                        <p className="privacy-policy-p">
                            Dependiendo de la ley que aplique, puede tener
                            derecho a acceder y rectificar o borrar su
                            información personal o recibir una copia de su información personal,
                            restringir u oponerse al procesamiento activo de sus datos, pedirnos que compartamos (portemos)
                            su información personal a otra entidad,
                            retirar cualquier consentimiento que nos haya
                            proporcionado para procesar sus datos, el derecho a presentar una queja
                            ante una autoridad competente y otros derechos
                            que puedan ser relevantes según las leyes aplicables. Para
                            ejercer estos derechos, puede escribirnos a
                            daniescomoli@gmail.com.
                            Responderemos a su
                            solicitud de acuerdo con la ley aplicable.
                        </p>
                        <p className="privacy-policy-p">
                            Tenga en cuenta que si no nos permite recopilar
                            o procesar la información personal requerida o
                            retira el consentimiento para procesar la misma para
                            los propósitos necesarios, es posible que no pueda acceder
                            o usar los servicios para los cuales se solicitó su información.
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Cookies, Etc.
                        </h5>
                        <p className="privacy-policy-p">
                            Para obtener más información sobre cómo usamos estas
                            y sus opciones en relación con estas tecnologías de seguimiento, consulte nuestra
                            <Link to="/politica-cookies">Política de Cookies.</Link>
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Seguridad:
                        </h5>
                        <p className="privacy-policy-p">
                            La seguridad de su información es importante para
                            nosotros y utilizaremos medidas de seguridad razonables
                            para prevenir la pérdida, el uso indebido o la alteración no autorizada de su información bajo nuestro
                            control. Sin embargo, dado los riesgos inherentes, no
                            podemos garantizar una seguridad absoluta y, por lo tanto,
                            no podemos asegurar o garantizar la seguridad de ninguna información que nos transmita
                            y lo hace bajo su propio riesgo.
                        </p>
                    </li>
                    <li>
                        <h5 className="privacy-policy-h5">
                            Enlaces de Terceros y Uso de su Información:
                        </h5>
                        <p className="privacy-policy-p">
                            Nuestro Servicio puede contener enlaces a otros sitios web
                            que no son operados por nosotros. Esta Política de Privacidad
                            no aborda la política de privacidad y otras
                            prácticas de terceros, incluidos aquellos
                            terceros que operen cualquier sitio web o servicio
                            que pueda ser accesible a través de un enlace en el
                            Servicio. Le recomendamos encarecidamente que revise la
                            política de privacidad de cada sitio que visite. No
                            tenemos control ni asumimos ninguna responsabilidad por
                            el contenido, las políticas de privacidad o las prácticas de
                            sitios o servicios de terceros.
                        </p>
                    </li>
                    
                    <li>
                        <h5 className="privacy-policy-h5">
                        Oficial de Quejas / Protección de Datos:
                        </h5>
                        <p className="privacy-policy-p">
                        Si tiene alguna consulta o preocupación sobre el procesamiento de su información que tenemos disponible, puede enviar un correo electrónico a nuestro Oficial de Quejas a Club Atletismo Maracena, Av. José Comino, correo electrónico: daniescomoli@gmail.com. Atenderemos sus inquietudes de acuerdo con la ley aplicable.
                        </p>
                    </li>
                </ol>

            </article>
        </>

    );

}

export default PoliticaPrivacidad;