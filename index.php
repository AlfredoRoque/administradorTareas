<?php
include 'inc/funciones/sesiones.php';
include 'inc/funciones/funciones.php';
include 'inc/templetes/header.php'; 
include 'inc/templetes/barra.php'; 

// obtener id de la url
if(isset($_GET['id_proyecto'])){
    $id_proyecto = $_GET['id_proyecto'];
}

?>

<div class="contenedor">
    
    <?php
     include 'inc/templetes/sidebar.php';
    ?>
    <main class="contenido-principal">
    <?php
        // muestra todos los errores 
        error_reporting(E_ALL ^ E_NOTICE);
        // excepto los "notice"
        
        $proyecto = obtenerNombreProyecto($id_proyecto);
        if($proyecto): ?>
        <h1>Proyecto Actual:
            
             <?php foreach ($proyecto as $nombre): ?>
                  <span><?php echo $nombre['nombre'];?></span>
              <?php endforeach; ?>
        </h1>

        <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                <input type="submit" class="boton nueva-tarea" value="Agregar">
            </div>
        </form>
<?php else: 
            //si no hay proyecto seleccionado
            echo "<p><h1>Selecciona un Proyecto</h1></p>";   
      endif;
    
    ?>
 

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
               <?php 
                //  Obtener las tareas del proyecto actual
                $tareas = obtenerTareasProyecto($id_proyecto);
                if($tareas->num_rows > 0){
                    // si hay tareas
                    foreach($tareas as $tarea): ?>
                       <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                       <p><?php echo $tarea['nombre'] ?></p>
                         <div class="acciones">
                            <i class="far fa-check-circle <?php echo $tarea['estado'] === '1' ? 'completo' : '' ?>"></i>
                            <i class="fas fa-trash"></i>
                         </div>
                        </li> 

            <?php   endforeach;
                }else{
                    // no hay tareas
                    echo '<p class="lista-vacia">No hay tareas disponibles</p>';
                }
               ?> 
            </ul>
        </div>
        <div class="avance">
            <h2>Avance del Proyecto:</h2>
            <div id="barra-avance" class="barra-avance">
               <div id="porcentaje" class="porcentaje"></div>
            </div>
        </div>
    </main>
</div><!--.contenedor-->


<?php include 'inc/templetes/footer.php';?> 