<?php

class vacacion
{

	/**
	 * @param string $setFechaIngreso, Fecha de ingreso en formato YYYY-mm-dd
	 * @param string $setTipoPersona, Regular o funcionario.
	 */
	function __construct($setFechaIngreso = "", $setTipoPersona = "R")
	{
		$this->atrFechaIngreso = trim($setFechaIngreso);
		$this->atrTipoPersona = trim($setTipoPersona);
        $this->atrMaxPeriodo = 2; // máximo acumulado 2 periodos art 199 LOTTT y 1 o no acumulativo art 19 LCA
        $this->atrPeriodo = 1; // cada año
        $this->atrTipoPeriodo = "Año(s)"; // cada año

        if (strtoupper($this->atrTipoPersona) == "F") {
    		$this->setAsignarValoresFuncionario();
		}
	} // cierre del constructor

	private function setAsignarValoresFuncionario()
	{
        $this->atrMaxPeriodo = 1;
        $this->atrPeriodo = 5; // cada 5 años
        $this->atrTipoPeriodo = "Quinquenio"; // cada 5 años
    } // cierre de la función

	/**
	 * @param string $psFechaIngreso Fecha de inicio en formato YYYY-mm-dd
	 * @param string $psFechaPeriodo fecha del periodo a calcular la antigüedad YYYY-mm-dd o YYYY
	 */
	static function getAntiguedad($psFechaIngreso, $psFechaPeriodo = "")
	{
		if (trim($psFechaPeriodo) == "") {
			$psFechaPeriodo = date("Y-m-d");
        }
        if (strlen(trim(str_replace(array("-", "/"), "", $psFechaPeriodo))) == "4") {
            $diaMes = date("m-d");
            $psFechaPeriodo = $psFechaPeriodo . "-" . $diaMes;
        }

		$objFecha_Ingreso = new DateTime($psFechaIngreso);
		$objFecha_Periodo = new DateTime($psFechaPeriodo);

        $objAnos = $objFecha_Periodo->diff($objFecha_Ingreso);
		$liAntiguedad = intval($objAnos->y);

		unset($objFecha_Ingreso, $objFecha_Periodo, $objAnos);

		return $liAntiguedad;
    } // cierre de la función

	// parámetro del modelo FechaBD
	static public function getFechaFormato(
        $pmFecha = "",
        $pmFormatoE = "amd",
        $pmFormatoR = "dma",
        $separathor = '/'
	)
	{
		if ($pmFecha == "") {
			$pmFecha = date("d" . $separathor . "m" . $separathor . "Y");
		}

		switch ($pmFormatoE) {
			default:
			case 'dma':
				$lsDia = substr($pmFecha, 0, 2);
				$lsMes = substr($pmFecha, 3, 2);
				$lsAno = substr($pmFecha, 6, 4);
				break;

			case 'amd':
				$lsDia = substr($pmFecha, 8, 2);
				$lsMes = substr($pmFecha, 5, 2);
				$lsAno = substr($pmFecha, 0, 4);
				break;

			case 'mda':
				$lsDia = substr($pmFecha, 3, 2);
				$lsMes = substr($pmFecha, 0, 2);
				$lsAno = substr($pmFecha, 6, 4);
				break;
		}

        $lsDia = $lsDia . $separathor;
        $fechaRetorno = preg_replace("/[dD]/", $lsDia, $pmFormatoR);
        $lsMes = $lsMes . $separathor;
        $fechaRetorno = preg_replace("/[mM]/", $lsMes, $fechaRetorno );
        $lsAno = $lsAno . $separathor;
        $fechaRetorno = preg_replace("/[aAyY]/", $lsAno, $fechaRetorno);

		return substr($fechaRetorno, 0, -1);
	} //cierre de la función

}

?>
