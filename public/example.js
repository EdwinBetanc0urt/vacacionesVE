
var	controllerPath = 'controller/example.php';

// al cargar el documento
$(function() {
    $('#fechaIngreso').on('change', function () {
        calcularAntiguedad(this.value);
        listarPeriodosTotales(this.value);
    });

    $('#antiguedad').on('change', function () {
        diasTotalesAntiguedad(this.value);
    });

    $('#periodos').on('change selected', function () {
        var selectedValues = []
        $('#periodos :selected').each(function () {
            selectedValues.push(this.value);
        });

        if (selectedValues.length > 1) {
            // filtra los valoresde los periodos
            var periodos = selectedValues.filter(periodoItem => {
                return periodoItem != '' && periodoItem != '0';
            })

            if (periodos.length < 1) {
                $('#diasPeriodo').val('');
                $('#fechaFin').val('');
                $('#fechaReingreso').val('');
                $('#periodos option')
                    .attr('selected', false)
                    .prop('selected', false);
                return;
            }
			calcularDiasPerido($('#antiguedad').val(), periodos);
        } else if (selectedValues.length == 1) {
            if (validarPeriodo(selectedValues[0])) {
			    calcularDiasPerido($('#antiguedad').val(), selectedValues);
            } else {
                $('#diasPeriodo').val('');
                $('#fechaFin').val('');
                $('#fechaReingreso').val('');
            }
        } else {
            $('#diasPeriodo').val('');
            $('#fechaFin').val('');
            $('#fechaReingreso').val('');
		}
    });

    $('#diasPeriodo').on('change', function () {
        // fechaFinal(this.value);
        // fechaReingreso(this.value);
    });
});


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
            'habiles de las vacaciones.'
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
    if (fechaIngreso.trim() !== '' || fechaIngreso !== null) {
        $.post(controllerPath, {
                setOpcion: 'antiguedad',
                setFechaIngreso: fechaIngreso
            },
            function (response) {
                if (response) {
                    $('#antiguedad').val(response);
                    diasTotalesAntiguedad(response);
                }
            }
        );
    }
} // cierre de la función


/**
 * [calcularDiasPerido description]
 * @param   {integer}  antiguedad  [periodos description]
 * @param   {array}  periodos  [periodos description]
 */
function calcularDiasPerido(antiguedad, periodos) {
    $.post(controllerPath, {
        setOpcion: 'diasPeriodo',
        setAntiguedad: antiguedad,
        setPeriodos: periodos
        },
        function (response) {
            if (response) {
                $('#diasPeriodo').val(response);
            }
        }
    );
}


/**
 * diasTotalesAntiguedad
 * @param {integer} antiguedad
 */
function diasTotalesAntiguedad(antiguedad = 0) {
    if (antiguedad.trim() > 0) {
        $.post(controllerPath, {
                setOpcion: 'diasTotalesAntiguedad',
                setAntiguedad: antiguedad
            },
            function (response) {
                if (response) {
                    $('#diasTotalesAntiguedad').val(response);
                }
            }
        );
    } else {
        $('#diasTotalesAntiguedad').val(0);
    }
} // cierre de la función


function listarPeriodosTotales(fechaIngreso = '') {
    if (fechaIngreso.trim() !== '') {
        $.post(controllerPath, {
                setOpcion: 'listarPeriodosTotales',
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
