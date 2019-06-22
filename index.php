
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>EdwinBetanc0urt GitHub Pages</title>
    <meta charset="UTF-8">
    <meta name="title" content="EdwinBetanc0urt GitHub Pages">
    <meta name="description" content="EdwinBetanc0urt GitHub Pages">
  </head>
  <body>
    Hola mundo!
    Lib Vacaciones, especificamente para Venezuela

    <br><br>
    <?php

        // Localización español
        setlocale(LC_ALL, "es_VE.UTF-8", "es_VE", "spanish");
        date_default_timezone_set("America/Caracas");
        ini_set("default_charset", "utf-8");

    		define("ERRORES", E_ALL | E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
        error_reporting(ERRORES);
        ini_set("display_errors", "On");
        ini_set("display_startup_errors", "On");


        include('vacaciones.php');
        $vacaciones = new vacacion();

        $a = vacacion::getFechaFormato('2013-06-09', 'amd', 'dma');
        echo $a;
    ?>
    <!-- <script type="module" src="./index.js"></script> -->
  </body>
</html>
