$(document).ready(function () {

    //Cargamos variables globales.
    var tokenId = undefined;

    iniciar();


    $(".burger3").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("on");
    });

    //Caso en el que se presiona el sliderbar.
    $('.slidebar a').click(function (event) {
        event.preventDefault();

        //Coloco el estado del sliderbar en no activo.
        $(".slidebar li").attr("id", "");

        //Coloco el estado del sliderbar (el que pulso) en modo activo.
        $(this).parent().attr("id", "active");

        //Muestro el contenido correspondiente.
        if (($(this).attr('name') !== "panelUnlogin")) {
            $('#panel').load("./panels/" + $(this).attr('name') + ".html");

            //En el caso de que sea el panel de login ocultamos el panel de registro y mostramos el login
            if ($(this).attr('name') === "panelLogin") {
                panelLogin(true);
            }
            else if ($(this).attr('name') === "panelUnlogin") {
                iniciar();
            }
            else if ($(this).attr('name') === "panelReservas") {
                alertify.success("Función no implementada");
                $("a[name='panelHome']").parent().attr("id", "active");
                $('#panel').load("./panels/panelHome.html");
            }

            $("#wrapper").toggleClass("toggled");
            $(".burger3").toggleClass("on");

            //Mando el foco al primer input encontrado.
            $('#' + $(this).attr('name') + " input:first").focus();
        } else {
            Cookies.remove('tokenAPI');
            Cookies.remove('username');
            window.document.location.href = 'index.html';
        }
    });

    // ========================
    //     LOGIN - USUARIOS
    // ========================

    $("#panel").on("click", "#boton_login", (event) => {
        event.preventDefault();

        //Recojo el email y password introducidos y compruebo que están rellenos.
        var user = $('#login_usuario').val();
        var pass = $('#password_login').val();
        var m_mensaje = comprobarLogin();
        if (m_mensaje === "") {
            $.ajax({
                url: 'http://fenw.etsisi.upm.es:5555/users/login',
                type: 'GET',
                port: 5555,
                data: {"username": user, "password": pass}
            })
            .done((data, texStatus, request) => {
                Cookies.set('tokenAPI', request.getResponseHeader('Authorization'));
                Cookies.set('username', user);
                window.document.location.href = 'index.html';
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                    if (jqXHR.status === 401) {
                        alertify.error("Usuario y/o contraseña incorrectas");
                    } else {
                        alertify.error(errorThrown);
                    }
                }
            );
        } else {
            $('#login_usuario').focus();
            alertify.error(m_mensaje);
        }
    });

    $("#panel").on("click", "#crear_cuenta", (event) => {
        event.preventDefault();
        mostrarRegis();
    });

    $("#panel").on("click", "#volver_login", (event) => {
        event.preventDefault();
        mostrarLogin();
    });

    $("#panel").on("click", "#boton_nuevo_usuario", (event) => {

        event.preventDefault();
        var mensaje = comprobarRegistro();
        if (mensaje === "") {
            //Realizamos la insercción
            alertify.success("Función de registro no implementada");
        } else {
            alertify.error(mensaje);
        }

    });

    // ===========================
    //       OTRAS FUNCIONES
    // ===========================

    function iniciar() {
        $(".slidebar li:first").attr("id", "active");

        $('#panel').load("./panels/panelHome.html");

        tokenId = Cookies.get('tokenAPI');
        if (tokenId !== undefined) {
            alertify.success("Bienvenido: " + Cookies.get('username'));
            modoLogin();
        } else {
            modoNoLogin();
        }

        $(".main section:first").fadeIn();
    }

    /* -_-_-_-_-_-_-_-_-_-_-_ */
    /* MODOS DE VISUALIZACIÓN */
    /* -_-_-_-_-_-_-_-_-_-_-_ */

    function panelLogin(mostrar) {
        if (mostrar) {
            $('#panelLogin').show();
            $('#panel_registro').hide();
            $('#panel_login').fadeIn();
            $('#direccion_login').focus();
            $('#panel_login input').val("");
        } else {
            $('#panel_registro').hide();
            $('#panel_login').hide();
        }
    }

    function mostrarLogin() {
        //Ocultamos el panel de login
        $('#panel_registro').fadeOut(function(){
            //Mostramos el panel de registro.
            $('#panel_login').fadeIn();
            $('#direccion_login').focus();
            $('#panel_login input').val("");
        });
    }

    function mostrarRegis() {
        //Ocultamos el panel de login
        $('#panel_login').fadeOut(function () {
            //Mostramos el panel de registro.
            $('#panel_registro').fadeIn();
            $('#reg_usuario').focus();
            $('#panel_registro input[type="text"],[type="password"],[type="date"]').val("");
            $('#panel_registro input[type="radio"]:first').prop("checked", true);
        });
    }

    function modoNoLogin() {
        tabLogin(true);
        tabLogout(false);
    }

    function modoLogin() {
        tabLogin(false);
        tabLogout(true);
    }

    function tabLogin(mostrar) {
        if (mostrar) {
            $('.tabLogin').fadeIn();
        } else {
            $('.tabLogin').hide();
        }
    }

    function tabLogout(mostrar) {
        if (mostrar) {
            $('.tabLogout').fadeIn();
        } else {
            $('.tabLogout').hide();
        }
    }

    /* -_-_-_-_-_-_-_-_ */
    /* CONTROL DE DATOS */
    /* -_-_-_-_-_-_-_-_ */

    function comprobarLogin() {

        var m_usuario = $('#login_usuario');
        var m_password_login = $('#password_login');

        var mensaje = "";

        //Control del usuario.
        if (m_usuario.val().trim() === "") {
            mensaje += "Introduce usuario";
            m_usuario.addClass("error");
        } else {
            m_usuario.removeClass("error");
        }
        //Control de password.
        if (m_password_login.val().trim() === "") {
            if (mensaje !== "")
                mensaje += " y "
            else mensaje += "Introduce ";
            mensaje += "contraseña";
            m_password_login.addClass("error");
        } else {
            m_password_login.removeClass("error");
        }

        return mensaje;
    }

    function comprobarRegistro() {

        var m_usuario = $('#reg_usuario');
        var m_email = $('#reg_email');
        var m_password = $('#reg_password');
        var m_password2 = $('#reg_password2');
        var m_fecha_nacimiento = $('#reg_fecha_nacimiento');

        var mensaje = "";
        var llave = false;

        //Control del usuario.
        if (m_usuario.val().trim() === "") {
            m_usuario.addClass("error");
            llave = true;
        } else {
            m_usuario.removeClass("error");
        }
        //Control del email.
        if (m_email.val().trim() === "") {
            m_email.addClass("error");
            llave = true;
        } else {
            m_email.removeClass("error");
        }
        //Control de password.
        if (m_password.val().trim() === "") {
            m_password.addClass("error");
            llave = true;
        } else {
            m_password.removeClass("error");
        }
        if (llave === true) {
            mensaje = "Campos con * obligatorios";
        }
        //Control de password.
        if (m_password2.val().trim() === "") {
            m_password2.addClass("error");
            llave = true;
        } else {
            m_password2.removeClass("error");
        }
        if (llave === true) {
            mensaje = "Campos con * obligatorios";
        }
        //Control de email válido.
        if (mensaje === "") {
            if (!validaCorreo(m_email.val().trim())) {
                mensaje += "Introduce un email válido";
                m_email.addClass("error");
            } else {
                m_email.removeClass("error");
            }
        }
        //Control coinciden passwords.
        if (mensaje === "") {
            if (m_password.val().trim() !== m_password2.val().trim()) {
                mensaje += "Contraseñas no coinciden";
                m_password.addClass("error");
                m_password2.addClass("error");
            } else {
                m_password.removeClass("error");
                m_password2.removeClass("error");
            }
        }
        return mensaje;
    }

    function validaCorreo(valor) {
        var reg = /(^[a-zA-Z0-9._-]{1,30})@([a-zA-Z0-9.-]{1,30}$)/;
        if (reg.test(valor)) return true;
        else return false;
    }

});