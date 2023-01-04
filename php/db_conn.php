<?php

$sname= "localhost";
$unmae= "id20017399_admin";
$password = "_S%$=bo3Iq*BK!7!";

$db_name = "id20017399_sncf";

$conn = mysqli_connect($sname, $unmae, $password, $db_name);

if (!$conn) {
	echo "Connection failed!";
}