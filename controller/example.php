<?php
// Localización español
setlocale(LC_ALL, "es_VE.UTF-8", "es_VE", "spanish");
date_default_timezone_set("America/Caracas");
ini_set("default_charset", "utf-8");

define("ERRORES", E_ALL | E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
error_reporting(ERRORES);
ini_set("display_errors", "On");
ini_set("display_startup_errors", "On");

include("../vacacionesVE.php");

if (isset($_POST["setOpcion"]))
	$opcion = $_POST["setOpcion"];
else
	$opcion = NULL;


/**
 * @description: Condicional según una variable enviada por POST ejecuta su función
 * @param string $opcion, POST enviado ya satinado
 **/
switch ($opcion) {
	case 'Antiguedad':
		calcularAntiguedad();
		break;

	case 'diasTotalesAntiguedad':
		calcularDiasTotalesAntiguedad();
		break;
} // cierre del switch


function calcularAntiguedad() {
	$antiguedad = vacacionesVE::_getAntiguedad($_POST["setFechaIngreso"]);
	echo $antiguedad;
}


function calcularDiasTotalesAntiguedad() {
	$diasAntiguedad = vacacionesVE::_getDiasTotalesAntiguedad($_POST["setAntiguedad"]);
	echo $diasAntiguedad;
}
