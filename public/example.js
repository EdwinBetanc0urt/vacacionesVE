
var	controllerPath = "controller/example.php";

//al cargar el documento
$(function () {
    $("#fechaIngreso").on("change", function() {
        calcularAntiguedad(this.value)
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
