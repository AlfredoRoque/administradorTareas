<?php

// obtiene pagina actual que se ejecuta
function obtenerPaginaActual(){
    // obtener el nombre del archivo actual 
    $archivo = basename($_SERVER['PHP_SELF']);
    // solo almacenar el nombre del archivo (sin el php)
    $pagina = str_replace('.php', '', $archivo);
    // retornar el resultado
    return $pagina;
}

//* Consultas*

// Obtener todos los proyectos

function obtenerProyectos(){
    include 'conexion.php';

    try{
        return $conn->query('SELECT id, nombre FROM proyectos');
    }catch(Exception $e){
        echo 'Error!!:' . $e->getMessage();
        return false;
    }
}

// obtener nombre del proyecto
function obtenerNombreProyecto($id = null){
    include 'conexion.php';

    try{
    return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
    }catch(Exception $e){
        echo 'Error!!:' . $e->getMessage();
        return false;
    }
}

// obtener tareas de cada proyecto
function obtenerTareasProyecto($id = null){
    include 'conexion.php';

    try{
    return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
    }catch(Exception $e){
        echo 'Error!!:' . $e->getMessage();
        return false;
    }
}