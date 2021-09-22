<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
    // codigo para crear los administradores

    // hashear passwords (ocultar)
    $opciones = array(
        'cost' => 10
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // importar la conexion
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) values (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);

}

if ($accion === 'login') {
    // codigo para logear administradores
    include '../funciones/conexion.php';

    try{
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario= ? ");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // logear usuario
        $stmt->bind_result($nombre_user,$id_user,$pass_user);
        $stmt->fetch();
        if ($nombre_user) {
            if (password_verify($password, $pass_user)) {
                session_start();
                // datos del usuario que se enviar al iniciar sesion puedes agregar o quietar
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_user;
                $_SESSION['login'] = true;
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_user,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'resultado' => 'password incorrecto'
                );
            }
            
        }else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            ); 
        }
        $stmt->close();
        $conn->close();

    }catch(Exception $e){
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}