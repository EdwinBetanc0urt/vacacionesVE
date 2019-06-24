
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>VacacionesVE, Calculo de vacacioines para Venezuela</title>
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
            <?php
              $fechaIngreso = isset($_POST["fechaIngreso"]) ? $_POST["fechaIngreso"] : '2017-06-01';
            ?>
            <label for="fechaIngreso">Fecha Ingreso</label>
            <input type="date" name="fechaIngreso" class="form-control"
              value="<?= $fechaIngreso ?>" />
          </div>
          <div class="form-group col-md-6">
            <label for="fechaInicio">Fecha Inicio Vacacional</label>
            <input type="date" name="fechaInicio" class="form-control"
              value="<?= $fechaIngreso ?>" />
          </div>
          <?php
            // Localización español
            setlocale(LC_ALL, "es_VE.UTF-8", "es_VE", "spanish");
            date_default_timezone_set("America/Caracas");
            ini_set("default_charset", "utf-8");

            define("ERRORES", E_ALL | E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
            error_reporting(ERRORES);
            ini_set("display_errors", "On");
            ini_set("display_startup_errors", "On");


            include('vacacionesVE.php');
            $vacaciones = new vacacionesVE('2017');
            $antiguedad = $vacaciones->getAntiguedad(NULL, "2019");
            $diasPorAntiguidad = $vacaciones->getDiasVacacionesAntiguedad();
            $fechaFin = "";
            if (isset($_POST["calcular"])) {
              $fechaFin = $vacaciones->getFechaFinal(
                $_POST["fechaInicio"],
                $diasPorAntiguidad
              );
            }
          ?>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <b>Fecha Inicio:</b><br />
                  <?= isset($_POST["calcular"]) ? $_POST["fechaInicio"] : "____" ?>
                </td>
                <td>
                  <b>Fecha Fin:</b><br />
                  <?= isset($_POST["calcular"]) ? $fechaFin : "____" ?>
                </td>
                <td>
                  <b>Antiguedad:</b><br />
                  <?= isset($_POST["calcular"]) ? $antiguedad : "____" ?>
                </td>
                <td>
                  <b>Dias X Antiguedad:</b><br />
                  <?= isset($_POST["calcular"]) ? $diasPorAntiguidad : "____" ?>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit" name="calcular" value="true" class="btn btn-primary">
            Calcular
          </button>
        </div>
      </div>
    </form>

    <!-- <script type="module" src="./index.js"></script> -->
    <script src="public/jquery.min.js"></script>
    <script src="public/bootstrap/js/bootstrap.min.js"></script>
  </body>
</html>
