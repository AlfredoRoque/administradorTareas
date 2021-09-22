/*creacion de la dase de datos*/

drop database if exists uptask;
create database uptask CHARACTER SET utf8 COLLATE utf8_general_ci;
use uptask;

/*tablas*/

create table usuarios(id int(11) not null auto_increment, 
usuario varchar(50) not null, password varchar(60) not null, primary key(id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;

create table proyectos(id int(11) not null auto_increment, nombre varchar(100) not null, primary key(id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;

create table tareas(id int(11) not null auto_increment, nombre varchar(100) not null, estado int(1) not null DEFAULT '0',id_proyecto int(11) not null ,
primary key(id), foreign key (id_proyecto) references proyectos (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_general_ci;
