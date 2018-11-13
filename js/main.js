$(document).ready(function () {

    //Cargamos variables globales.
    var tokenId = undefined;
    var user = undefined;

    iniciar();


    $(".burger3").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("on");
    });

    //Caso en el que se presiona el sliderbar.
    $('.slidebar a').click(function (event) {
        event.preventDefault();

        //Ocultamos todos los paneles.
        $('div.main').children('section').hide();

        //Coloco el estado del sliderbar en no activo.
        $(".slidebar li").attr("id", "");

        //Coloco el estado del sliderbar (el que pulso) en modo activo.
        $(this).parent().attr("id", "active");

        //Muestro el contenido correspondiente.     
        $('#' + $(this).attr('name')).fadeIn();

        //En el caso de que sea el panel de login ocultamos el panel de registro y mostramos el login
        if ($(this).attr('name') === "panelLogin") {
            panelLogin(true);
        }
        else if ($(this).attr('name') === "panelLogout") {
            iniciar();
        }

        $("#wrapper").toggleClass("toggled");
        $(".burger3").toggleClass("on");

        //Mando el foco al primer input encontrado.
        $('#' + $(this).attr('name') + " input:first").focus();
    });

    // ========================
    //     LOGIN - USUARIOS
    // ========================

    $("#boton_login").on("click", (event) => {
        event.preventDefault();

        //Recojo el email y password introducidos y compruebo que están rellenos.
        var user = $('#login_usuario').val();
        var pass = $('#password_login').val();
        var m_mensaje = comprobarLogin();
        if (m_mensaje === "") {
            $.ajax({
                url: 'http://fenw.etsisi.upm.es:5555/users/login?username='+user+'&password='+pass,
                async: true,
                type: 'GET',
                success: (data, texStatus, request) => {
                    Cookies.set('tokenAPI', request.getResponseHeader('Authorization'));
                    Cookies.set('username', user);
                    window.document.location.href = 'index.html';
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    if (jqXHR.status === 401) {
                        alertify.error("Usuario y/o contraseña incorrectas");
                    } else {
                        alertify.error(errorThrown);
                    }
                }
            });
        } else {
            $('#login_usuario').focus();
            alertify.error(m_mensaje);
        }
    });

    $(".tabLogout").on("click", (event) => {
        event.preventDefault();
        Cookies.remove('tokenAPI');
        Cookies.remove('username');
        window.document.location.href = 'index.html';
    });

    $("#crear_cuenta").on("click", function (event) {
        event.preventDefault();
        mostrarRegis();
    });

    $("#volver_login").on("click", function (event) {
        event.preventDefault();
        mostrarLogin();
    });

    $("#boton_nuevo_usuario").on("click", function (event) {

        event.preventDefault();
        //Recogemos todos los valores y comprobamos que son correctos.
        var email = $('#reg_email').val();
        var password = $('#reg_password').val();
        var sexo = $('#reg_sexo:checked').val();
        var nombre = $('#reg_nombre').val();
        var apellidos = $('#reg_apellidos').val();
        var fecha_nacimiento = $('#reg_fecha_nacimiento').val();
        var mensaje = comprobarRegistro();
        if (mensaje === "") {
            //Realizamos la insercción
            $.ajax({
                type: 'POST',
                url: '/usuarios/insertUser',
                contentType: "application/json",
                // Al ser una petición de tipo GET, vamos a tener URLs
                // de la siguiente forma: /currency?from=USD&to=EUR&quantity=20
                data:
                    JSON.stringify({
                        nombre: nombre,
                        apellidos: apellidos,
                        sexo: sexo,
                        fecha_nacimiento: fecha_nacimiento,
                        email: email,
                        password: password
                    })
                ,

                // En caso de éxito, mostramos el resultado.
                success: function (data, textStatus, jqXHR) {
                    if (data.respuesta === undefined) {
                        alertify.error("Usuario no encontrado en la BBDD");
                    } else {
                        //EJemplo buscar CursoByID -> GET -> getinfobyid
                        //
                        alertify.success("Registrado con ID: " + data.id);
                        mostrarLogin();
                        //$("#resultadoFrom").text(data.respuesta + ". ID: "+ data.id);
                    }

                },
                error: function (jqXHR, statusText, errorThrown) {
                    alertify.error("Error al insertar un usuario");
                }
            });
        } else {
            alertify.error(mensaje);
        }

    });

    // ===========================
    //       OTRAS FUNCIONES
    // ===========================

    function iniciar() {
        $(".slidebar li:first").attr("id", "active");

        panelHome(false);
        panelServicios(false);
        panelInstalaciones(false);
        panelReservar(false);

        tokenId = Cookies.get('tokenAPI');
        if (tokenId !== undefined) {
            alertify.success("Bienvenido: " + Cookies.get('username'));
            mostrarLogin();
            modoLogin();
        } else {
            modoNoLogin();
        }

        $(".main section:first").fadeIn();
    }

    /* -_-_-_-_-_-_-_-_-_-_-_ */
    /* MODOS DE VISUALIZACIÓN */
    /* -_-_-_-_-_-_-_-_-_-_-_ */

    function panelHome(mostrar) {
        if (mostrar) {
            $('#panelHome').fadeIn();
        } else {
            $('#panelHome').hide();
        }
    }

    function panelServicios(mostrar) {
        if (mostrar) {
            $('#panelServicios').fadeIn();
        } else {
            $('#panelServicios').hide();
        }
    }

    function panelInstalaciones(mostrar) {
        if (mostrar) {
            $('#panelInstalaciones').fadeIn();
        } else {
            $('#panelInstalaciones').hide();
        }
    }

    function panelReservar(mostrar) {
        if (mostrar) {
            $('#panelReservas').fadeIn();
        } else {
            $('#panelReservas').hide();
        }
    }

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
        panelLogin(false);
        tabLogin(true);
        tabLogout(false);
    }

    function modoLogin() {
        panelLogin(true);
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