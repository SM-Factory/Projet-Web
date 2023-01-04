<?php 
session_start();
include "db_conn.php";
$sql = "SELECT gare FROM chantier";
$result = mysqli_query($conn, $sql);
while ($row = $result->fetch_assoc()) {
    echo $row["gare"].',';
}
?>