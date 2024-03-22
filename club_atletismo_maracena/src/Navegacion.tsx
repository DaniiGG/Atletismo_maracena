import { useState, useEffect  } from 'react'
import $ from 'jquery';
import './css/navegacion.css'

function Navegacion() {

    useEffect(() => {
        $(document).ready(function(){
          
          var currentLevel = 1; 
    
        $('.menu-toggle').on('click',function(){
            $('.menu').toggleClass('active');
            $('.menu-toggle .bar').toggleClass('cross');
            var isCross = $('.menu-toggle .bar').hasClass('cross');
                if(isCross) {
                    $('.menu-toggle .bar').css('background-color', 'white');
                } else {
                    $('.menu-toggle .bar').css('background-color', 'black');
                }
        });
    
        $('.menu').on('click', 'li', function(){
            var $submenu = $(this).children('ul');
            if ($submenu.length > 0) {
                if (!$submenu.hasClass('active')) {
                    $submenu.addClass('active');
                    $(this).siblings().find('ul').removeClass('active');
                    $('.back-button').css('display', 'block');
                    $(this).closest('ul').children('li').not(this).addClass('inactive').css('opacity', 0);
                    $(this).removeClass('inactive').css('opacity', 1);
                    currentLevel++;
                    setTimeout(function() {
                        $(`.level-${currentLevel - 1} > li.inactive`).css('display', 'none');
                    }, 400); 
                }
            }
        });
    
        $('.back-button').click(function(){
            if (currentLevel > 1) {
                currentLevel--;
                var $visibleSubmenu = $(`.level-${currentLevel} > li > ul.active`);
                $(`.level-${currentLevel} > li`).removeClass('inactive').css('opacity', 1);
                $(`.level-${currentLevel} > li`).css('display', 'block');
                if ($visibleSubmenu.length > 0) { 
                    $visibleSubmenu.removeClass('active'); 
                } else { 
                    $(`.level-${currentLevel - 1} > li`).removeClass('inactive').css('opacity', 1);
                    $(`.level-${currentLevel - 1} > li`).css('display', 'block');
                }
            }
            if (currentLevel === 1) {
                $('.back-button').css('display', 'none');
                $('.menu ul ul ul').removeClass('active');
                $('.menu ul ul').removeClass('active');
            }
        });
         // Cerrar el menú si se hace clic fuera de él
         $(document).click(function(event) {
            if (!$(event.target).closest('.menu').length && !$(event.target).closest('.menu-toggle').length) {
                $('.menu').removeClass('active');
                $('.menu-toggle .bar').removeClass('cross');
                $('.menu-toggle .bar').css('background-color', 'black');
            }
        });
    });
    
        });

    return (
        <> 
    
    <div className="menu-horizontal">
          <nav>
            <div id="inicio">
                    <img id="logo" src="../img/logoAtletismo.png"></img>
                    <p>CLUB ATLETISMO <br/><b>MARACENA</b></p>
            </div>
            <ul>
              <li>
                
              </li>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Club</a></li>
              <li className="has-submenu">
                <a href="#">Inscríbete</a>
                <ul className="submenu">
                  <li className="has-submenu">
                    <a href="#">Servicio 1</a>
                  </li>
                  <li><a href="#">Servicio 2</a></li>
                  <li><a href="#">Servicio 3</a></li>
                </ul>
              </li>
              <li className="has-submenu">
                <a href="#">Noticias</a>
                <ul className="submenu">
                  <li><a href="#">Producto 1</a></li>
                  <li><a href="#">Producto 2</a></li>
                  <li><a href="#">Producto 3</a></li>
                </ul>
              </li>
              <li><a href="#">Galería de fotos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </nav>
        </div>
    
          <div className="menu-hamburguesa">
            <div className="menu-toggle">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
    
            <nav className="menu">
                <div className="back-button"><i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Volver</div>
                <ul className="level-1">
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Club</a></li>
                    <li className="has-submenu"><a href="#">Inscríbete</a>
                        <ul className="level-2">
                            <li className="has-submenu"><a href="#">Servicio 1</a>
                                <ul className="level-3">
                                    <li><a href="#" >Subservicio 1.1</a></li>
                                    <li><a href="#" >Subservicio 1.2</a>
    
                                        <ul className="level-4">
                                            <li><a href="#" >Subservicio 1.2.1</a></li>
                                            <li><a href="#" >Subservicio 1.2.2</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><a href="#">Servicio 2</a></li>
                            <li><a href="#">Servicio 3</a></li>
                        </ul>
                    </li>
    
                    <li className="has-submenu"><a href="#">Noticias</a>
                        <ul className="level-2">
                            <li><a href="#">Producto 1</a>
                                <ul className="level-3">
                                    <li><a href="#" >Subproducto 1.1</a></li>
                                    <li><a href="#" >Subproducto 1.2</a></li>
                                </ul>
                            </li>
                            <li><a href="#">Producto 2</a></li>
                            <li><a href="#">Producto 3</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Galería de fotos</a></li>
                    <li><a href="#">Contacto</a></li>
                </ul>
    
            </nav>
          </div>
        </>
      )
}

export default Navegacion;