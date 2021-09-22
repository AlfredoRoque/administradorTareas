<?php

$conn = new mysqli('us-cdbr-east-04.cleardb.com','bbc5fa77b32947','b7634ce8','heroku_47a8dc202069711');

// echo $conn->ping();

if($conn->connect_error){
    echo $conn->connect_error;
}
//acentos y demas
$conn->set_charset('utf8');