<?php

require('utils.php');

/**
 * Vacaciones Venezuela
 *
 * Clase PHP para obtener los cálculos relacionados a vacaciones
 * @author: Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * @license: GNU GPL v3,  Licencia Pública General de GNU 3.
 * @license: CC BY-SA, Creative Commons Atribución - CompartirIgual (CC BY-SA) 4.0 Internacional.
 * @category Librería.
 * @package: vacacionesVE.php.
 * @since: v0.3.
 * @version: 0.7.
 */
class vacacionesVE
{
	use utils;

	public $atrDiasVacaciones = 15; // días correspondientes de vacaciones según la LOTTT
	public $atrTipoPersona = "R"; // tipo de persona Regular o Funcionario
	public $atrFechaIngreso, $atrAntiguedad;
	/**
	 * @param string $setFechaIngreso, Fecha de ingreso en formato YYYY-mm-dd
	 * @param string $setTipoPersona, Regular o funcionario.
	 */
	function __construct($setFechaIngreso = "", $setTipoPersona = "R")
	{
		$this->atrTipoPersona = trim($setTipoPersona);
        $this->atrMaxPeriodo = 2; // máximo acumulado 2 periodos art 199 LOTTT y 1 o no acumulativo art 19 LCA
        $this->atrPeriodo = 1; // cada año
        $this->atrTipoPeriodo = "Año(s)"; // cada año

		$this->setFechaIngreso($setFechaIngreso);
        if (strtoupper($this->atrTipoPersona) == "F") {
    		$this->setAsignarValoresFuncionario();
		}
	} // cierre del constructor

	/**
	 * @param string $setFechaIngreso, Fecha de ingreso en formato YYYY-mm-dd
	 */
	public function setFechaIngreso($setFechaIngreso)
	{
        if (strlen(trim(str_replace(array("-", "/"), "", $setFechaIngreso))) == "4") {
			$setFechaIngreso = str_replace(array("-", "/"), "", $setFechaIngreso);
			$diaMes = date("m-d");
			$setFechaIngreso = $setFechaIngreso . "-" . $diaMes;
		}
		$this->atrFechaIngreso = trim($setFechaIngreso);
	}

	private function setAsignarValoresFuncionario()
	{
        $this->atrMaxPeriodo = 1;
        $this->atrPeriodo = 5; // cada 5 años
        $this->atrTipoPeriodo = "Quinquenio"; // cada 5 años
    } // cierre de la función

	/**
	 * @param string $fechaIngreso Fecha de inicio en formato YYYY-mm-dd
	 * @param string $fechaPeriodo fecha del periodo a calcular la antigüedad YYYY-mm-dd o YYYY
	 */
	static function _getAntiguedad($fechaIngreso, $fechaPeriodo = "")
	{
		if (trim($fechaPeriodo) == "") {
			$fechaPeriodo = date("Y-m-d");
        }
        if (strlen(trim(str_replace(array("-", "/"), "", $fechaPeriodo))) == "4") {
            $diaMes = date("m-d");
            $fechaPeriodo = $fechaPeriodo . "-" . $diaMes;
		}
		$objFecha_Ingreso = new DateTime($fechaIngreso);
		$objFecha_Periodo = new DateTime($fechaPeriodo);

        $objAnos = $objFecha_Periodo->diff($objFecha_Ingreso);
		$liAntiguedad = intval($objAnos->y);

		unset($objFecha_Ingreso, $objFecha_Periodo, $objAnos);
		return $liAntiguedad;
	} // cierre de la función

	public function getAntiguedad($fechaIngreso = "", $fechaPeriodo = "")
	{
		if (trim($fechaIngreso) == "" || $fechaIngreso == NULL) {
			$fechaIngreso = $this->atrFechaIngreso;
		}
		return self::_getAntiguedad($fechaIngreso, $fechaPeriodo);
	}

	/**
	 * La formula es 15 + (años de servicio -1)
	 * hasta llegar a 15 días hábiles (30 días de vacaciones en total)
	 */
	static public function _getDiasVacacionesAntiguedad($piAntiguedad)
	{
		$piAntiguedad = intval(trim($piAntiguedad));
		//$liDiasAntiguedad = $this->atrDiasVacaciones + ($piAntiguedad - 1);
		$liDiasAntiguedad = 15 + ($piAntiguedad - 1);
		if ($liDiasAntiguedad > 30) {
			$liDiasAntiguedad = 30;
		}
		return $liDiasAntiguedad;
	} // cierre de la función

	public function getDiasVacacionesAntiguedad($piAntiguedad = "") {
		if (trim($piAntiguedad) == "") {
			$piAntiguedad = $this->getAntiguedad($this->atrFechaIngreso);
		}
		return self::_getDiasVacacionesAntiguedad($piAntiguedad);
	}
}

?>
