
var	controllerPath = "controller/example.php";

//al cargar el documento
$(function() {
    $("#fechaIngreso").on("change", function() {
        calcularAntiguedad(this.value);
        listarPeriodosTotales(this.value);
    });

    $("#antiguedad").on("change", function () {
        diasTotalesAntiguedad(this.value);
    });
});


/**
 * calcularAntiguedad
 * @param {string} fechaIngreso
 */
function calcularAntiguedad(fechaIngreso = "") {
    if (fechaIngreso.trim() !== "") {
        $.post(controllerPath, {
                //variables enviadas (name: valor)
                setOpcion: "Antiguedad",
                setFechaIngreso: fechaIngreso
            },
            function (response) {
                if (response) {
                    $("#antiguedad").val(response);
                    diasTotalesAntiguedad(response);
                }
            }
        );
    }
} // cierre de la función


/**
 * diasTotalesAntiguedad
 * @param {integer} antiguedad
 */
function diasTotalesAntiguedad(antiguedad = 0) {
    if (antiguedad.trim() > 0) {
        $.post(controllerPath, {
                //variables enviadas (name: valor)
                setOpcion: "diasTotalesAntiguedad",
                setAntiguedad: antiguedad
            },
            function (response) {
                if (response) {
                    $("#diasTotalesAntiguedad").val(response);
                }
            }
        );
    } else {
        $("#diasTotalesAntiguedad").val(0);
    }
} // cierre de la función


function listarPeriodosTotales(fechaIngreso = "") {
    if (fechaIngreso.trim() !== "") {
        $.post(controllerPath, {
                //variables enviadas (name: valor)
                setOpcion: "listarPeriodosTotales",
                setFechaIngreso: fechaIngreso
            },
            function (response) {
                $("#periodos option").remove(); // limpia los option del select
                if (response) {
                    for (var i = 0; i < response.length; i++) {
				        // agrega los nuevos option al select
                        $('#periodos')
                            .append($("<option></option>")
                            .attr("value", response[i])
                            .text("Periodo " + response[i]));
                    }
                }
            }
        );
    }
} // cierre de la función


function listarPeriodos() {
	$.post(controllerPath, {
			//variables enviadas (name: valor)
			setOpcion: "ListaPeriodo"
		},
		function(response) {
			if (response) {
				cmbCombo = document.getElementById("cmbPeriodo");
				$("#cmbPeriodo").attr("disabled", false); //habilita el campo de estado
				//cmbCombo.options.length = 0; //limpia los option del select
				cmbCombo.options.length = 1; //limpia los option del select
				$("#cmbPeriodo").append(response); //agrega los nuevos option al select
				// $("#cmbPeriodo")
				// 	.val()
				// 	.trigger();
			}
		}
	);
} //cierre de la función
