<?php
// Spanish localization
setlocale(LC_ALL, "es_VE.UTF-8", "es_VE", "spanish");
date_default_timezone_set("America/Caracas");
ini_set("default_charset", "utf-8");

define("ERRORS", E_ALL | E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
error_reporting(ERRORS);
ini_set("display_errors", "On");
ini_set("display_startup_errors", "On");

include("../vacacionesVE.php");

if (isset($_POST["getRequest"])) {
	$option = $_POST["getRequest"];
}
else {
	$option = NULL;
}


/**
 * @description: Conditional according to a variable sent by POST executes its function
 * @param string $option, POST sent already satin
 **/
switch ($option) {
	case 'antiquity':
		calculateAntiquity();
		break;

	case 'daysForPeriods':
		calculateDaysForPeriods();
		break;

	case 'totalDaysForAntiquity':
		calculateTotalDaysForAntiquity();
		break;

	case 'availablePeriods':
		listAvailablePeriods();
		break;

	case 'calculateEndDate':
		calculateEndDate();
		break;
} // end of switch


function calculateAntiquity() {
	$antiquity = vacacionesVE::_getAntiguedad(
		$_POST["setDateOfAdmission"]
	);
	printValues($antiquity);
}

function calculateDaysForPeriods() {
	$daysOfPeriods = vacacionesVE::_getDiasPeriodos(
		$_POST["setDateOfAdmission"],
		$_POST["setPeriodsList"]
	);
	printValues($daysOfPeriods);
}

function calculateTotalDaysForAntiquity() {
	$totalDaysForAntiquity = vacacionesVE::_getDiasTotalesAntiguedad(
		$_POST["setAntiquity"]
	);
	printValues($totalDaysForAntiquity);
}

function listAvailablePeriods() {
	$periodsUsed = array(
		"2017-2018"
	);
	$allPeriods = vacacionesVE::_getPeriodosAntiguedad(
		$_POST["setDateOfAdmission"]
	);

	$periodsNotUsed = array_diff($allPeriods, $periodsUsed);
	$availablePeriods = array_slice($periodsNotUsed, 0, vacacionesVE::$maxPeriodos);

	printValues($availablePeriods);
}

function calculateEndDate() {
	$feastDay = array(); // format YY-mm-dd

	$endDate = vacacionesVE::getFechaFinal(
		$_POST["setHolidayStartDate"],
		$_POST["setBusinessDays"],
		$feastDay
	);
	$incorporationDate = vacacionesVE::getFechaFinal(
		$_POST["setHolidayStartDate"],
		$_POST["setBusinessDays"] + 1,
		$feastDay
	);
	$sendValues = array(
		"endDate" => $endDate,
		"incorporationDate" => $incorporationDate
	);

	printValues($sendValues);
}

function printValues($valueToPrint) {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 2000 05:00:00 GMT');
	header('Content-type: application/json');

	echo json_encode($valueToPrint);
}
