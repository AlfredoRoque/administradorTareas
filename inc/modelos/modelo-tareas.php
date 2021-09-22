<?php

$accion = $_POST['accion'];

// Crear nueva tarea
if ($accion === 'crear') {
    $id_proyecto =(int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    // importar la conexion
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) values (?, ? ) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'estado' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        }else {
            $respuesta = array(
                'respuesta' => 'error'
            ); 
        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);

}

// eliminar una tarea de la BD
if ($accion === 'eliminar') {
    $id_tarea =(int) $_POST['id'];
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'estado' => 'correcto'
            );
        }else {
            $respuesta = array(
                'respuesta' => 'error'
            ); 
        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
   
    echo json_encode($respuesta);
    
}

if ($accion === 'actualizar') {
    $id_tarea =(int) $_POST['id'];
    $estado = $_POST['estado'];
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'estado' => 'correcto'
            );
        }else {
            $respuesta = array(
                'respuesta' => 'error'
            ); 
        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
   
    echo json_encode($respuesta);
}