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

if (isset($_POST["setOpcion"])) {
	$opcion = $_POST["setOpcion"];
}
else {
	$opcion = NULL;
}


/**
 * @description: Condicional según una variable enviada por POST ejecuta su función
 * @param string $opcion, POST enviado ya satinado
 **/
switch ($opcion) {
	case 'antiguedad':
		calcularAntiguedad();
		break;

	case 'diasPeriodo':
		calcularDiasPeriodo();
		break;

	case 'diasTotalesAntiguedad':
		calcularDiasTotalesAntiguedad();
		break;

	case 'listarPeriodosTotales':
		listarPeriodosTotales();
		break;

	case 'listarPeriodosDisponibles':
		listarPeriodosDisponibles();
		break;

	case 'calcularFechaFin':
		calcularFechaFin();
		break;
} // cierre del switch


function calcularAntiguedad() {
	$antiguedad = vacacionesVE::_getAntiguedad($_POST["setFechaIngreso"]);
	printValues($antiguedad);
}

function calcularDiasPeriodo() {
	$diasPeriodo = vacacionesVE::_getDiasPeriodos($_POST["setFechaIngreso"], $_POST["setPeriodos"]);
	printValues($diasPeriodo);
}

function calcularDiasTotalesAntiguedad() {
	$diasAntiguedad = vacacionesVE::_getDiasTotalesAntiguedad($_POST["setAntiguedad"]);
	printValues($diasAntiguedad);
}

function listarPeriodosTotales() {
	$periodos = vacacionesVE::_getPeriodosAntiguedad($_POST["setFechaIngreso"]);
	printValues($periodos);
}

function listarPeriodosDisponibles() {
	$periodosUtilizados = array(
		"2013-2014"
	);
	$todosPeriodos = vacacionesVE::_getPeriodosAntiguedad($_POST["setFechaIngreso"]);

	$periodosNoUtilizados = array_diff($todosPeriodos, $periodosUtilizados);
	$periodosDisponibles = array_slice($periodosNoUtilizados, 0, vacacionesVE::$maxPeriodos);

	printValues($periodosDisponibles);
}


function calcularFechaFin() {
	$fechaFin = vacacionesVE::getFechaFinal($_POST["setFechaInicio"], $_POST["setDiasHabiles"]);
	printValues(vacacionesVE::getFechaFormato($fechaFin));
}

function printValues($valueToPrint) {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 2000 05:00:00 GMT');
	header('Content-type: application/json');

	echo json_encode($valueToPrint);
}