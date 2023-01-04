<?php 
session_start();
include "db_conn.php";
$gare = $_POST["gare"];
$sql = "SELECT chantier.gare, equipe.nom, chantier.idEquipe FROM chantier, equipe WHERE chantier.idEquipe = equipe.id";
$result = mysqli_query($conn, $sql);
echo '<select name="choix" id="choix">
    <option value="">--Veuillez attribuer des ouvriers--</option>';

/* fetch associative array */
while ($row = $result->fetch_assoc()) {
 if (!is_null($row['gare']) && $row['gare'] == $gare) {
    echo '<option value="'. $row['idEquipe'] .'" selected>';
    echo $row['nom'];
    echo '</option>';
 }
 if (is_null($row['gare'])) {
     echo '<option value="'. $row['idEquipe'] .'">';
     echo $row['nom'];
     echo '</option>';
 }
}

echo '</select>';
echo '<br>';
echo '<input id="ouvrier" type="submit" value="Attribuer l'. "'" .'équipe">';

?>