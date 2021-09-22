
eventListeners();

function eventListeners(){
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
    if (usuario === '' || password === '') {
        // la validacion fallo
        swal({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
        });
    } else {
        // validacion correcta, mandar a ejecutar ajax
        // datos que se enviaran al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo); 
        
        // llamado ajax

        var xhr = new XMLHttpRequest();

        // abrir la conexion 
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos
        xhr.onload = function(){
            if(this.status === 200){
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                // si datos de nueva cuenta correctos
                if (respuesta.respuesta === 'correcto') {
                    if (respuesta.tipo === 'crear') {
                        swal({
                            type: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creo correctamente'
                        });
                    }else if(respuesta.tipo === 'login'){
                        swal({
                            type: 'success',
                            title: 'Correcto',
                            text: 'presiona ok para continuar'
                        })
                        .then(resultado => {
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=1';
                            }
                        })
                    }
                }else{
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        // enviar peticion
        xhr.send(datos);

    }
}