<?php

$conn = new mysqli('localhost','root','','uptask');

// echo $conn->ping();

if($conn->connect_error){
    echo $conn->connect_error;
}
//acentos y demas
$conn->set_charset('utf8');