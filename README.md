# Frontend para navegadores web - Práctica 1
> En este proyecto se realiza una primera aproximación a la maquetación web y la programación en la parte cliente con Javascript + JQuery
> #### [Máster en Ingeniería Web por la Universidad Politécnica de Madrid (miw-upm)](http://miw.etsisi.upm.es)
> #### Asignatura: *FEMW (Frontend para Navegadores Web)*

## Tecnologías necesarias
* HTML5
* CSS3 + Bootstrap
* Javascript + JQuery + AJAX
* WebStorm
* Github

## Enunciado.

El objetivo de la primera práctica es que el alumno diseñe la parte visual del cliente del sistema web correspondiente 
al sitio del club de pádel y la parte de “login” utilizando tecnologías asíncronas al mismo tiempo que diseña y programa 
la parte de proceso (en cliente) mediante el lenguaje de scripting Javascript o jQuery.

La práctica por tanto se divide en dos fases:

### Fase 1: Maquetación de las páginas.

* Inicio

Al pulsarla, el sistema mostrará, siempre, la página de presentación/bienvenida. Se puede observar un ejemplo en la 
figura en la que en la parte superior aparece el menú con las opciones divididas en dos grupos (izquierda: funciones y 
derecha, registro y login) y en la parte inferior aparece información genérica del club.

* Instalaciones

Esta opción dará paso a una página en la que se mostrará, inmerso en un mapa de google, la ubicación de las 
instalaciones y enumerará los recursos de los que dispone el club (de manera estática):

* Servicios (o similares): 

El alumno puede sentirse libre de incorporar en esta opción o aquellas que considere convenientes, cualquier elemento de 
diseño que aporte valor extra a su práctica.



En esta práctica *NO* se desarrollará el proceso asociado a esta opción en la API REST, aunque sí se implementará el 
formulario con objeto de prepararlo para la siguiente práctica.

* Reservas

Las opción de “Reserva” que se van a presentar NO tienen ningún tipo de proceso más allá de mostrar el formulario.

* Registro

Permite que un usuario del sistema se pueda registrar en el mismo, lo que le dará capacidad para poder realizar reservas 
de pistas para jugar. Un usuario que quiera registrarse en el sistema deberá introducir un *nombre de usuario, una 
dirección de correo, una clave para poder identificarse y su fecha de nacimiento* (todas obligatorias menos la fecha de 
nacimiento, que será optativa). Dado que en la siguiente práctica nos ocuparemos de que el registro sea efectivo, el 
usuario deberá introducir dos veces la clave y *el sistema deberá verificar la coincidencia*.

* Login

Esta opción permitirá a un usuario registrado poder acceder al sistema para proceder a efectuar reservas de pistas. 
Para poder realizar el “login”, el usuario deberá identificarse mediante un nombre de usuario acompañándolo por la 
palabra clave que también registró.

### Fase 2: Implementar la lógica de login y logout.

* Login

Esta opción permitirá a un usuario registrado poder acceder al sistema para proceder a efectuar reservas de pistas. 
Para poder realizar el “login”, el usuario deberá identificarse mediante un nombre de usuario acompañándolo por la 
palabra clave que también registró. Esto producirá una llamada a una API externa de tipo GET /users/login 
con los parámetros username y password pasadas como parámetros  en la URL (formato urlencoded). En caso de identificación 
positiva, el sistema devuelve un token de seguridad en la cabecera http (Authorization). 
El cliente, al recibir la identificación positiva por parte del sistema, deberá almacenar el token anteriormente mencionado de manera local.

En caso de identificación negativa, se deberá mostrar la información en forma de mensaje indicando al usuario que el 
login no se ha efectuado de manera satisfactoria.

* Logout

Esta opción, que no producirá ninguna llamada a la API REST, destruirá el token en la parte cliente y enviará al usuario 
a la página de Inicio, con la opción de volver a hacer login.