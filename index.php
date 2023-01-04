<!DOCTYPE html>
<html>
<head>
	<title>Connexion</title>
	<link rel="stylesheet" type="text/css" href="style_log.css">
	<link rel="icon" type="image/png" href="assets/img/logo-ct.png">
</head>
<body>
<img src="assets\img\logo-ct.png " id="logo">

     <form action="php/login.php" method="post">
     	<h2>Se connecter</h2>
     	<?php if (isset($_GET['error'])) { ?>
     		<p class="error"><?php echo $_GET['error']; ?></p>
     	<?php } ?>
     	<label>Nom d'utilisateur</label>
     	<input type="text" name="uname" placeholder="Entrez votre nom d'utilisateur"><br>

     	<label>Mot de passe</label>
     	<input type="password" name="password" placeholder="Entrez votre mot de passe"><br>

     	<button type="submit">Se connecter</button>
     </form>
</body>
</html>