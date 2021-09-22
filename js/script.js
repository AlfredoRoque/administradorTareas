
eventListeners();

var listaProyectos = document.querySelector('ul#proyectos');
function eventListeners(){

    // Document ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });

    // Boton para crear proyectos
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Boton para nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();
    
    // crear un un <input> para el nombre del proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el nuevo proyecto mediante su id
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // se crea el proyecto al presionar enter
    inputNuevoProyecto.addEventListener('keypress', function(e){
        // deteccion de la tecla
        var tecla = e.which || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });

}

function guardarProyectoDB(nombreProyecto) {
    
    // llamado de ajax
    var xhr = new XMLHttpRequest();

    // enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function(){
        if(this.status === 200){
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.estado;

            // comprobar la insercion
            if(resultado === 'correcto'){
                // exito
                if(tipo === 'crear'){
                    // Se creo un nuevo proyecto
                    // inyectar html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                           ${proyecto}
                        </a>
                    `;
                    listaProyectos.appendChild(nuevoProyecto);
                    // alerts de creacion
                    swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto ' + proyecto + ' se creo correctamente'
                    })
                    .then(resultado =>{
                        // redireccionar a la nueva url
                        if(resultado.value){
                            window.location.href = 'index.php?id_proyecto='+id_proyecto;
                        }
                    })
                }else{
                    // se actualizo o elimino
                }
            }else{
                // error
                swal({
                    type: 'error',
                    title: 'ERROR',
                    text: 'Error al crear'
                });
            }
        }

    }

    // Enviar el request
    xhr.send(datos);
}

// Agregar una nueva tarea
function agregarTarea(e){
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;

    // validar que el campo no este vacio
    if (nombreTarea === '') {
        swal({
            type: 'error',
            title: 'ERROR!!',
            text: 'Coloca nombre a la tarea'
        });
    }else{
        // insertar en Base de datos
        // Llamado a ajax
        var xhr = new XMLHttpRequest();

        // crear un Formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // abrir conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        

        // ejecutarlo y respuesta
        xhr.onload = function(){
            if (this.status === 200) {
                // correcto
                var respuesta = JSON.parse(xhr.responseText);
                
                var resultado = respuesta.estado,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;
                if(resultado === 'correcto'){
                    // se agrego correctamente
                    if (tipo === 'crear') {
                        swal({
                            type: 'success',
                            title: 'Tarea Creado',
                            text: 'La tarea ' + tarea + ' se creo correctamente'
                        });

                        // seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // construir templete
                        var nuevaTarea = document.createElement('li');

                        // agregarle el id
                        nuevaTarea.id = 'tarea:'+id_insertado;

                        // agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // construir el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // agregarlo al html
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // actualizar el progreso
                        actualizarProgreso();
                        
                    }
                }else{
                    // hubo un error
                    swal({
                        type: 'error',
                        title: 'Error!!',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        // enviarlo
        xhr.send(datos);
    }
}

// Cambiar estado o eliminar tareas
function accionesTareas(e){
    e.preventDefault();
    // target indica a que se le esta dando click
    if(e.target.classList.contains('fa-check-circle')){
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if(e.target.classList.contains('fa-trash')){
        Swal.fire({
            title: 'Estas seguro?',
            text: "Esta accion no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
              var tareaEliminar = e.target.parentElement.parentElement;
              //   Borrar de la BD
              eliminarTareaBD(tareaEliminar);

              // Borrar del HTML
              tareaEliminar.remove();

              Swal.fire(
                'Borrado!',
                'Tu archivo ha sido borrado.',
                'success'
              )
            }
          })
    }
}

// Cambiar el estado de una tarea
function cambiarEstadoTarea(tarea, estado){
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    var xhr = new XMLHttpRequest();

        // crear un Formdata
        var datos = new FormData();
        datos.append('id', idTarea[1]);
        datos.append('accion', 'actualizar');
        datos.append('estado', estado);

        // abrir conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // ejecutarlo y respuesta
        xhr.onload = function(){
            if (this.status === 200) {
                JSON.parse(xhr.responseText);
                actualizarProgreso();
            }

        }

        xhr.send(datos);
}

// Eliminar tareas de la BD
function eliminarTareaBD(tarea){
    var idTarea = tarea.id.split(':');
    
    var xhr = new XMLHttpRequest();

        // crear un Formdata
        var datos = new FormData();
        datos.append('id', idTarea[1]);
        datos.append('accion', 'eliminar');

        // abrir conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        

        // ejecutarlo y respuesta
        xhr.onload = function(){
            if (this.status === 200) {
                JSON.parse(xhr.responseText);

                // Comprobar que haya tareas
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes').innerHTML = 
                    "<p class='lista-vacia'>No hay tareas disponibles</p>";
                    
                }
                // actualizar el progreso
                actualizarProgreso();
            }

        }

        xhr.send(datos);
}

// actualizar progreso
function actualizarProgreso() {
    // obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    // obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // determinar el avance
    const avance =Math.round((tareasCompletadas.length / tareas.length) * 100);
    
    // asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    // Mostrar alerta del 100%
    if(avance === 100){
        swal({
            type: 'success',
            title: 'Proyecto Completado',
            text: 'El proyecto ' + this.listaProyectos.nombre_proyecto + ' ha sido concluido'
        });
    }
}