<?php

$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

// Creaor un nuevo proyecto
if ($accion === 'crear') {
    // importar la conexion
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) values (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'estado' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
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