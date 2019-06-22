
class Vacaciones {
    constructor(fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }


	/**
	 * @param string $psFechaIngreso Fecha de inicio en formato Y-m-d
	 * @param string $psFechaPeriodo fecha del periodo a calcular la antiguedad Y-m-d
	 */
	getAntiguedad(fechaIngreso = '', fechaPeriodo = '')
	{
		if (fechaIngreso.trim() == '') {
			fechaIngreso = this.fechaIngreso;
		}
        if (fechaPeriodo.trim() == '') {
			fechaPeriodo = Vacaciones.clientDate();
		}

		// $objFecha_Ingreso = new DateTime($psFechaIngreso);
		// $objFecha_Periodo = new DateTime($psFechaPeriodo);

		// $objAnos = $objFecha_Periodo->diff($objFecha_Ingreso);
		// $liAntiguedad = intval($objAnos->y);

		return antiguedad;
    }

    /**
     * Obtiene fecha del cliente en un string
     * @param {string} date fecha
     * @returns {string} formato Y-m-d
     */
    static getClientDate(date = null, formatoEntrada = 'd-m-y', formatoSalida = 'Y-m-d') {
        var year, month, day;

        if (typeof date === 'undefined' || date === null || date.trim() === '') {
            // instance the objet Data with current date from client
            date = new Date();
        }
        else if (typeof date === 'string') {
            // instance the objet Data with date or time send
            date = new Date(date);
        }
        console.log(date);
        day = this.zeroPad(date.getDate());
        month = this.zeroPad(date.getMonth() + 1);
        year = date.getFullYear();

        var fechaRetorno = formatoSalida
            .replace(/[YyAa]/g, year)
            .replace(/[Mm]/g, month)
            .replace(/[Dd]/g, day);
        // PROBLEMA CON 1 DIA DE DIFERENCIA
        return fechaRetorno;
    }

    /**
     * zero pad
     * @param {number} number
     * @param {number} pad
     * @returns {string}
     */
    static zeroPad(number, pad = 2) {
        var zero = Number(pad) - number.toString().length + 1;
        return Array(+(zero > 0 && zero)).join('0') + number;
    }

}

export default Vacaciones;
