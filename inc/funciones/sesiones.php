<?php
// funcion para comprobar si las contraseñas del admin son correctas
function usuario_Autenticado(){
    if(!revisar_Usuario()){
        header('Location:login.php');
        exit();
    }
}
// si las contraseñas son correctas se inicia la sesion
function revisar_Usuario(){
    return isset($_SESSION['nombre']);
}

session_start();
usuario_Autenticado();