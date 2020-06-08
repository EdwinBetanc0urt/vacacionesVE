
const controllerPath = 'controller/example.php';
const returnResponse = function(response) {
	return response.json();
};

// on the load document
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

	addEventSelector({
		selector: '#periodos',
		action: function() {
			const selectedValues = [];
			const clearValues = function() {
				document.getElementById('diasPeriodo').value = '';
				document.getElementById('fechaFin').value = '';
				document.getElementById('fechaIncorporacion').value = '';
			}

			const selectedList = document.querySelectorAll('#periodos option:checked');
			// const selectedList = document.getElementById('periodos').selectedOptions;
			selectedList.forEach(function(element) {
				selectedValues.push(element.value);
			});

			const fechaIngreso = document.getElementById('fechaIngreso').value;

			if (selectedValues.length > 1) {
				// filtra los valoresde los periodos
				const periodos = selectedValues.filter(periodoItem => {
					return periodoItem != '' && periodoItem != '0';
				});

				if (periodos.length < 1) {
					clearValues();
					document.querySelectorAll('#periodos option').forEach(function(element) {
						element.selected = false;
					});
					return;
				}
				calcularDiasPerido(fechaIngreso, periodos);
				return;
			} else if (selectedValues.length == 1) {
				if (validarPeriodo(selectedValues[0])) {
					calcularDiasPerido(fechaIngreso, selectedValues);
				}
			}
			clearValues();
		},
		eventsList: [
			'change',
			'selected'
		]
	});

	addEventSelector({
		selector: '#diasPeriodo',
		action: function() {
			const startDate = document.getElementById('fechaInicio').value;
			endDate(startDate, this.value);
		}
	});

	addEventSelector({
		selector: '#fechaInicio',
		action: function() {
			const daysPeriod = document.getElementById('diasPeriodo').value;
			endDate(this.value, daysPeriod);
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

function dispatchEventRelationship(element) {
  if ('createEvent' in document) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, 'true');
    element.dispatchEvent(event);
  } else {
    element.fireEvent('onchange');
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
} // end of function

/**
 * calcular Antiguedad
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
		const element = document.getElementById('antiguedad');
		element.value = data;

		dispatchEventRelationship(element);
		// diasTotalesAntiguedad(data);
	})
	.catch(function(error) {
		console.error(error);
	});
} // end of function

/**
 * [calcularDiasPerido description]
 * @param   {number}  fechaIngreso  [fechaIngreso description]
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
		const element = document.getElementById('diasPeriodo');
		element.value = data;

		dispatchEventRelationship(element);
	})
	.catch(function(error) {
		console.error(error);
	});
} // end of function

/**
 * Get total days antiquity
 * @param {number} antigüedad
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
			document.getElementById('diasTotalesAntiguedad').value = data;
		})
		.catch(function(error) {
			document.getElementById('diasTotalesAntiguedad').value = 0;
			console.error(error);
		});
	} else {
		document.getElementById('diasTotalesAntiguedad').value = 0;
	}
} // end of function

function listarPeriodosDisponibles(fechaIngreso = '') {
	if (fechaIngreso.trim() !== '') {
		const dataToSend = new FormData();
		dataToSend.append('setOpcion', 'listarPeriodosDisponibles');
		dataToSend.append('setFechaIngreso', fechaIngreso);

		fetch(controllerPath, {
			method: 'POST',
			body: dataToSend
		})
		.then(returnResponse)
		.then(function(data) {
			let isDisabled = false;
			// primer item de las opciones
			document.querySelectorAll('#periodos option:not([value=""])').forEach(function(element) {
				element.remove(); // limpia los option del select
			});

			const selectElement = document.getElementById('periodos');
			if (data && data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					// agrega los nuevos option al select
					const optionElement = document.createElement('option');
					optionElement.value = data[i];
					optionElement.text = 'Periodo ' + data[i];
					selectElement.appendChild(optionElement);
				}
				isDisabled = true;
			} else {
				const optionElement = document.createElement('option');
				optionElement.value = '0';
				optionElement.text = 'Sin periodos disponibles';
				selectElement.appendChild(optionElement);
			}
			document.querySelectorAll('#periodos option[value=""]').forEach(function(element) {
				element.disabled = isDisabled;
				element.selected = false;
			});
		})
		.catch(function(error) {
			console.error(error);
		});
	}
} // end of function

function endDate(startDate, diasHabiles) {
	if (startDate === '' || diasHabiles === '') {
		return;
	}

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
		const endDate = data.endDate.replace(/[/]/g, '-');
		const incorporationDate = data.incorporationDate.replace(/[/]/g, '-');

		document.getElementById('fechaFin').value = endDate;
		document.getElementById('fechaIncorporacion').value = incorporationDate;
	})
	.catch(function(error) {
		console.error(error);
	});
} // close of function endDate
