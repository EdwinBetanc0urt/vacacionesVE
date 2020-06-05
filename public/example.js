
const controllerPath = 'controller/example.php';
const returnResponse = function(response) {
	return response.json();	
};

document.addEventListener('DOMContentLoaded', function() {
	addEventSelector({
		selector: '#fechaIngreso',
		action: function() {
			calcularAntiguedad(this.value);
			listarPeriodosDisponibles(this.value);
		}
	});

	addEventSelector({
		selector: '#antiguedad',
		action: function() {
			diasTotalesAntiguedad(this.value);
		}
	});
});

// al cargar el documento
$(function() {
	$('#periodos').on('change selected', function() {
		var selectedValues = [];
		const clearValues = function() {
			$('#diasPeriodo').val('');
			$('#fechaFin').val('');
			$('#fechaReingreso').val('');
		}

		$('#periodos :selected').each(function() {
			selectedValues.push(this.value);
		});

		if (selectedValues.length > 1) {
			// filtra los valoresde los periodos
			var periodos = selectedValues.filter(periodoItem => {
				return periodoItem != '' && periodoItem != '0';
			})

			if (periodos.length < 1) {
				clearValues()
				$('#periodos option')
					.attr('selected', false)
					.prop('selected', false);
				return;
			}
			calcularDiasPerido($('#fechaIngreso').val(), periodos);
			return;
		} else if (selectedValues.length == 1) {
			if (validarPeriodo(selectedValues[0])) {
				calcularDiasPerido($('#fechaIngreso').val(), selectedValues);
			}
		}
		clearValues();
	});

	$('#diasPeriodo').on('change', function() {
		if (this.value != '' && $('#fechaInicio').val() != '') {
			endDate($('#fechaInicio').val(), this.value);
		}
	});

	$('#fechaInicio').on('change', function() {
		if (this.value != '' && $('#diasPeriodo').val() != '') {
			endDate(this.value, $('#diasPeriodo').val());
		}
	});
});

function addEventSelector({
	selector,
	eventsList = ['change'],
	action = function() {}
}) {
	const selectorsNodeList = document.querySelectorAll(selector);

	if (typeof eventsList === 'string') {
		eventsList = eventsList.split(',');
	}

	const domElementsLength = selectorsNodeList.length;
	let domElementsIndex = 0;
	// iteration elements DOM
	while (domElementsIndex < domElementsLength) {
		const selectorNode = selectorsNodeList[domElementsIndex]

		const eventsLength = eventsList.length;
		let eventsIndex = 0;
		// iteration events to add
		while (eventsIndex < eventsLength) {
			selectorNode.addEventListener(
				eventsList[eventsIndex], 
				action
			);

			eventsIndex++;
		}
		domElementsIndex++;
	}
}

function validarPeriodo(periodo) {
	if (parseInt(periodo) === 0 || periodo === null) {
		alert(
			'¡Atención! \n' +
			'No posee períodos vacacionales aun, hasta no cumplir por lo ' +
			'menos un (1) año de haber ingresado o de haber usado las ' +
			'vacaciones no pude solicitar las mismas.'
		);
		return false;
	} else if (periodo.trim() == '') {
		alert(
			'¡Atención! \n' +
			'Debe seleccionar un periodo valido para calcular los días ' +
			'hábiles de las vacaciones.'
		);
		return false;
	}
	return true;
} // cierre de la función

/**
 * calcularAntiguedad
 * @param {string} fechaIngreso
 */
function calcularAntiguedad(fechaIngreso = '') {
	if (fechaIngreso.trim() === '' || fechaIngreso === null) {
		return;
	}

	const dataSend = new FormData();
	dataSend.append('setOpcion', 'antiguedad');
	dataSend.append('setFechaIngreso', fechaIngreso);
	
	fetch(controllerPath, {
		method: 'POST',
		body: dataSend,
		cache: 'no-cache'
	})
	.then(returnResponse)
	.then(function(data) {
		$('#antiguedad').val(data);
		diasTotalesAntiguedad(data);
	})
	.catch(function(error) {
		console.error(error);
	});
} // cierre de la función

/**
 * [calcularDiasPerido description]
 * @param   {integer}  fechaIngreso  [fechaIngreso description]
 * @param   {array}  periodos  [periodos description]
 */
function calcularDiasPerido(fechaIngreso, periodos) {
	const dataToSend = new FormData();
	dataToSend.append('setOpcion', 'diasPeriodo');
	dataToSend.append('setFechaIngreso', fechaIngreso);
	dataToSend.append('setPeriodos', periodos);

	fetch(controllerPath, {
		method: 'POST',
		body: dataToSend
	})
	.then(returnResponse)
	.then(function(data) {
		$('#diasPeriodo').val(data);
	})
	.catch(function(error) {
		console.error(error);
	});
}

/**
 * diasTotalesAntiguedad
 * @param {integer} antigüedad
 */
function diasTotalesAntiguedad(antiguedad = 0) {
	if (String(antiguedad).trim() > 0) {
		const dataToSend = new FormData();
		dataToSend.append('setOpcion', 'diasTotalesAntiguedad');
		dataToSend.append('setAntiguedad', antiguedad);

		fetch(controllerPath, {
			method: 'POST',
			body: dataToSend
		})
		.then(returnResponse)
		.then(function(data) {
			$('#diasTotalesAntiguedad').val(data);
		})
		.catch(function(error) {
			console.error(error);
		});
	} else {
		$('#diasTotalesAntiguedad').val(0);
	}
} // cierre de la función

function listarPeriodosDisponibles(fechaIngreso = '') {
	if (fechaIngreso.trim() !== '') {
		$.post(controllerPath, {
				setOpcion: 'listarPeriodosDisponibles',
				setFechaIngreso: fechaIngreso
			},
			function (response) {
				var disabled = false;
				$('#periodos option')
					.not('[value=""]') // primer item de las opciones
					.remove(); // limpia los option del select
				if (response && response.length > 0) {
					for (var i = 0; i < response.length; i++) {
						// agrega los nuevos option al select
						$('#periodos').append(
							$('<option></option>')
								.attr('value', response[i])
								.text('Periodo ' + response[i])
						);
					}
					disabled = true;
				} else {
					$('#periodos').append(
						$('<option></option>')
							.attr('value', '0')
							.text('Sin periodos disponibles')
					);
				}
				$('#periodos option[value=""]')
					.attr('disabled', disabled)
					.prop('disabled', disabled);
			}
		);
	}
} // cierre de la función

function endDate(startDate, diasHabiles) {
	const dataToSend = new FormData();
	dataToSend.append('setOpcion', 'calcularFechaFin');
	dataToSend.append('setFechaInicio', startDate);
	dataToSend.append('setDiasHabiles', diasHabiles);

	fetch(controllerPath, {
		method: 'POST',
		body: dataToSend
	})
	.then(returnResponse)
	.then(function(data) {
		$('#fechaFin').val(data);
	})
	.catch(function(error) {
		console.error(error);
	});
} // close of function endDate
