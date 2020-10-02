
const controllerPath = 'controller/example.php';
const returnResponse = function(response) {
	return response.json();
};

// on the load document
document.addEventListener('DOMContentLoaded', function() {
	// TODO: Change years with 2 or more steps, send requests at each step
	addEventSelector({
		selector: '#dateOfAdmission',
		action: function() {
			calculateAntiquity(this.value);
			listAvailablePeriods(this.value);
		}
	});

	addEventSelector({
		selector: '#antiquity',
		action: function() {
			calculateTotalDaysForAntiquity(this.value);
		}
	});

	addEventSelector({
		selector: '#periodsList',
		action: function() {
			const selectedValues = [];
			const clearValues = function() {
				document.getElementById('daysForSelectedPeriods').value = '';
				document.getElementById('holidayEndDate').value = '';
				document.getElementById('incorporationDate').value = '';
			}

			// const selectedInList = document.querySelectorAll('#periodsList option:checked');
			const periodsElement = document.getElementById('periodsList')
			const selectedInList = Array.from(periodsElement.selectedOptions);
			selectedInList.forEach(function(element) {
				selectedValues.push(element.value);
			});

			const dateOfAdmission = document.getElementById('dateOfAdmission').value;

			if (selectedValues.length > 1) {
				// filter the values of the periods
				const periodsList = selectedValues.filter(periodoItem => {
					return periodoItem != '' && periodoItem != '0';
				});

				if (periodsList.length < 1) {
					clearValues();
					// const optionsList = document.querySelectorAll('#periodsList option');
					const optionsList = Array.from(periodsElement.options);
					optionsList.forEach(function(element) {
						element.selected = false;
					});
					return;
				}
				calculateDaysForPeriods(dateOfAdmission, periodsList);
				return;
			} else if (selectedValues.length == 1) {
				if (validatePeriod(selectedValues[0])) {
					calculateDaysForPeriods(dateOfAdmission, selectedValues);
				}
			}
			clearValues();
		},
		eventsList: [
			'change',
			'selected'
		]
	});

	const endDateEvent = function() {
		const holidayStartDate = document.getElementById('holidayStartDate').value;
		const daysPeriod = document.getElementById('daysForSelectedPeriods').value;
		endDate(holidayStartDate, daysPeriod);
	};

	addEventSelector({
		selector: '#daysForSelectedPeriods',
		action: endDateEvent
	});

	addEventSelector({
		selector: '#holidayStartDate',
		action: endDateEvent
	});

});

/**
 * Add event to element (or element with selector)
 * @param {string} selector
 * @param {object} element
 * @param {array} eventsList
 * @param {function} action
 */
function addEventSelector({
	selector,
	element,
	eventsList = ['change'],
	action = function() {}
}) {
	let selectorsNodeList = [
		element
	];
	if (element === undefined || element === null) {
		selectorsNodeList = document.querySelectorAll(selector);
	}

	if (typeof eventsList === 'string') {
		eventsList = eventsList.split(',');
	}

	const domElementsLength = selectorsNodeList.length;
	let domElementsIndex = 0;
	// iteration DOM elements
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

/**
 * Dispatch evento into element
 * @param {object} element
 */
function dispatchEventRelationship(element) {
  if ('createEvent' in document) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, 'true');
    element.dispatchEvent(event);
  } else {
    element.fireEvent('onchange');
  }
}

function validatePeriod(periodo) {
	if (parseInt(periodo) === 0 || periodo === null) {
		alert(
			'Attention! \n' +
			'You do not have vacation periods yet, until you have reached at ' +
			'least one (1) year of entering or having used the vacation, I ' +
			'could not request it.'
		);
		return false;
	} else if (periodo.trim() == '') {
		alert(
			'Attention! \n' +
			'You must select a valid period to calculate the working days of ' +
			'the vacation.'
		);
		return false;
	}
	return true;
} // end of function

/**
 * Calculate Antiquity
 * @param {string} dateOfAdmission
 */
function calculateAntiquity(dateOfAdmission = '') {
	if (dateOfAdmission.trim() === '' || dateOfAdmission === null) {
		return;
	}

	const dataSend = new FormData();
	dataSend.append('getRequest', 'antiquity');
	dataSend.append('setDateOfAdmission', dateOfAdmission);

	fetch(controllerPath, {
		method: 'POST',
		body: dataSend,
		cache: 'no-cache'
	})
	.then(returnResponse)
	.then(function(data) {
		const element = document.getElementById('antiquity');
		element.value = data;

		dispatchEventRelationship(element);
	})
	.catch(function(error) {
		console.error(error);
	});
} // end of function

/**
 * [calculateDaysForPeriods description]
 * @param   {number}  dateOfAdmission
 * @param   {array}  periodsList  [periodsList description]
 */
function calculateDaysForPeriods(dateOfAdmission, periodsList) {
	const dataToSend = new FormData();
	dataToSend.append('getRequest', 'daysForPeriods');
	dataToSend.append('setDateOfAdmission', dateOfAdmission);
	dataToSend.append('setPeriodsList', periodsList);

	fetch(controllerPath, {
		method: 'POST',
		body: dataToSend
	})
	.then(returnResponse)
	.then(function(data) {
		const element = document.getElementById('daysForSelectedPeriods');
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
function calculateTotalDaysForAntiquity(antiquity = 0) {
	if (String(antiquity).trim() > 0) {
		const dataToSend = new FormData();
		dataToSend.append('getRequest', 'totalDaysForAntiquity');
		dataToSend.append('setAntiquity', antiquity);

		fetch(controllerPath, {
			method: 'POST',
			body: dataToSend
		})
		.then(returnResponse)
		.then(function(data) {
			document.getElementById('totalDaysForAntiquity').value = data;
		})
		.catch(function(error) {
			document.getElementById('totalDaysForAntiquity').value = 0;
			console.error(error);
		});
	} else {
		document.getElementById('totalDaysForAntiquity').value = 0;
	}
} // end of function

function listAvailablePeriods(dateOfAdmission = '') {
	if (dateOfAdmission.trim() !== '') {
		const dataToSend = new FormData();
		dataToSend.append('getRequest', 'availablePeriods');
		dataToSend.append('setDateOfAdmission', dateOfAdmission);

		fetch(controllerPath, {
			method: 'POST',
			body: dataToSend
		})
		.then(returnResponse)
		.then(function(data) {
			let isDisabled = false;
			// first item of the options
			document.querySelectorAll('#periodsList option:not([value=""])').forEach(function(element) {
				element.remove(); // clean select options
			});

			const selectElement = document.getElementById('periodsList');
			if (data && data.length > 0) {
				data.forEach(function(optionItem) {
					// add new options to select
					const optionElement = document.createElement('option');
					optionElement.value = optionItem;
					optionElement.text = 'Period ' + optionItem;
					selectElement.appendChild(optionElement);
				});
				isDisabled = true;
			} else {
				const optionElement = document.createElement('option');
				optionElement.value = '0';
				optionElement.text = 'No periods available';
				selectElement.appendChild(optionElement);
			}
			document.querySelectorAll('#periodsList option[value=""]').forEach(function(element) {
				element.disabled = isDisabled;
				element.selected = false;
			});
		})
		.catch(function(error) {
			console.error(error);
		});
	}
} // end of function

function endDate(holidayStartDate, businessDays) {
	if (holidayStartDate === '' || businessDays === '') {
		return;
	}

	const dataToSend = new FormData();
	dataToSend.append('getRequest', 'calculateEndDate');
	dataToSend.append('setHolidayStartDate', holidayStartDate);
	dataToSend.append('setBusinessDays', businessDays);

	fetch(controllerPath, {
		method: 'POST',
		body: dataToSend
	})
	.then(returnResponse)
	.then(function(data) {
		const endDate = data.endDate.replace(/[/]/g, '-');
		const incorporationDate = data.incorporationDate.replace(/[/]/g, '-');

		document.getElementById('holidayEndDate').value = endDate;
		document.getElementById('incorporationDate').value = incorporationDate;
	})
	.catch(function(error) {
		console.error(error);
	});
} // close of function endDate
