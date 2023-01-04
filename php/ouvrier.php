<?php 
session_start();
include "db_conn.php";
$gare=$_POST['gare'];
$ouvrier=$_POST['ouvrier'];
$rh = $_SESSION['id'];
$sql = "UPDATE chantier SET gare=NULL, date='0000-00-00', rhId=NULL WHERE gare='$gare'";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}

$sql = "UPDATE chantier SET gare='$gare', date=NOW(), rhId='$rh' WHERE idEquipe='$ouvrier'";

if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}


?>