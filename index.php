
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>VacacionesVE, Calculo de vacaciones para Venezuela</title>
    <meta charset="UTF-8">
    <meta name="title" content="EdwinBetanc0urt GitHub Pages">
    <meta name="description" content="EdwinBetanc0urt GitHub Pages">
    <link rel="stylesheet" href="public/bootstrap/css/bootstrap.min.css">
  </head>
  <body>
    <form id="vacacionesVE" name="vacacionesVE" method="post" action="index.php">
      <div class="container">
        <div class="form-row align-items-center">
          <div class="form-group col-md-6">
            <label for="fechaIngreso">Fecha Ingreso</label>
            <input type="date" id="fechaIngreso" class="form-control" />
          </div>
          <div class="form-group col-md-6">
            <label for="fechaInicio">Fecha Inicio Vacacional</label>
            <input type="date" id="fechaInicio" class="form-control" />
          </div>

          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <b>Fecha Inicio:</b><br />
                </td>
                <td>
                  <b>Fecha Fin:</b><br />
                </td>
                <td>
                  <b>Antigüedad (años):</b><br />
                  <input type="number" id="antiguedad" class="form-control" />
                </td>
                <td>
                  <b>Dias Totales por Antiguedad:</b><br />
                  <input type="number" id="diasTotalesAntiguedad" class="form-control" />
                </td>
              </tr>
                <td>
                  <b>Dias X Antiguedad:</b><br />
                </td>
              </tr>
            </tbody>
          </table>

          <br /><br />
        </div>
      </div>
    </form>

    <!-- <script type="module" src="./index.js"></script> -->
    <script src="public/jquery.min.js"></script>
    <script src="public/bootstrap/js/bootstrap.min.js"></script>
    <script src="public/example.js"></script>
  </body>
</html>
