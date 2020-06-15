<?php

trait utils {

	// parámetro del modelo FechaBD
	public static function getFechaFormato(
        $dateInput = "",
        $formatInput = "amd",
        $formatOutput = "dma",
        $separathor = '/'
	)
	{
		if ($dateInput == "") {
			$dateInput = date("d" . $separathor . "m" . $separathor . "Y");
		}

		switch ($formatInput) {
			default:
			case 'dma':
				$day = substr($dateInput, 0, 2);
				$month = substr($dateInput, 3, 2);
				$year = substr($dateInput, 6, 4);
				break;

			case 'amd':
				$day = substr($dateInput, 8, 2);
				$month = substr($dateInput, 5, 2);
				$year = substr($dateInput, 0, 4);
				break;

			case 'mda':
				$day = substr($dateInput, 3, 2);
				$month = substr($dateInput, 0, 2);
				$year = substr($dateInput, 6, 4);
				break;
		}

        $day = $day . $separathor;
        $dateOutput = preg_replace("/[dD]/", $day, $formatOutput);
        $month = $month . $separathor;
        $dateOutput = preg_replace("/[mM]/", $month, $dateOutput);
        $year = $year . $separathor;
        $dateOutput = preg_replace("/[aAyY]/", $year, $dateOutput);

		return substr($dateOutput, 0, -1);
	} // cierre de la función

	/**
	 * Método getFechaFinal
	 *
	 * Devuelve un string con la fecha final calculada a partir de una fecha dada
	 * hasta la canidad de días hábiles (tomando en cuneta dias laborables de la
	 * semana y los días feriados dados si existen)
	 *
	 * @param string $fechainicio Fecha de inicio en formato Y-m-d
	 * @param integer $diasHabiles cantidad de dias habiles para calcular el final
	 * @param array $diasferiados Arreglo de días feriados en formato Y-m-d
	 * @param array $diasNoHabiles Arreglo de días no laborables o tomados como
	 * no hábiles, Representación numérica ISO-8601 del día de la semana 1 (para
	 * lunes) hasta 7 (para domingo).
	 * @return string $psFechafin Fecha de fin en formato Y-m-d
	 */
	static public function getFechaFinal(
		$fechaInicio = "",
		$diasHabiles = 0,
		$diasFeriados = array(),
		$diasNoHabiles = array(6,7)
	)
	{
		// obtenemos la fecha de hoy, solo para usar como referencia al usuario
		if (trim($fechaInicio) == "") {
			$fechaInicio = date("Y/m/d");
		}

		// convirtiendo en timestamp las fechas
		$fechaInicial =  strtotime($fechaInicio);
		$diasHabiles = intval($diasHabiles);
		$fechaFinal = 0;

		// 24 horas, por 60 minutos, por 60 segundos
		$segundosDia = 86400; // 24 * 60 * 60
		$segundos = 0;
		if ($diasHabiles < 0) {
			return $fechaInicio;
		}
		// Creamos un for desde 0 hasta los días enviados envía el día de que
		// culminan las vacaciones un día hábil adicional para el reingreso
		//for ($diaRecorrido = 0; $diaRecorrido < $diasHabiles; $diaRecorrido++) {
		for ($diaRecorrido = 0; $diaRecorrido <= $diasHabiles; $diaRecorrido++) {
			// Comparamos si estamos en sábado o domingo, si es así restamos un dia
			if (in_array(date("N", $fechaInicial + $segundos), $diasNoHabiles)) {
				$diaRecorrido--;
			}
			// Comparamos si estamos en dia feriado, para restar un dia
			elseif (in_array(date('Y/m/d', $fechaInicial + $segundos), $diasFeriados)) {
				$diaRecorrido--;
			}
			else {
				// Si no es sábado o domingo, y el for termina y nos muestra la nueva fecha
				$fechaFinal = date("Y/m/d", $fechaInicial + $segundos);
			}

			// Acumulamos la cantidad de segundos que tiene un día en cada vuelta del for
			$segundos = $segundos + $segundosDia;
		}

		return $fechaFinal;
	} // cierre de la función

}

?>
