<?php

use Psr\Container\ContainerInterface;//interfaz de contenedor para poder usarla


$container->set('bd', function(ContainerInterface $c){//creando bd como una funcion
    $conf = $c->get('config_bd');//un objeto
    $opc = [//array

        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
    ];
//DSN objeto de conexion---- linea de conexiones
//mysql libreria a utilizar
    $dsn = "mysql:host=$conf->host;dbname=$conf->bd;charset=$conf->charset";
   
    try{
        $con = new PDO($dsn, $conf->usr, $conf->pass, $opc);
    }catch(PDOException $e){
        print "ERROR" . $e->getMessage() . "<br>";//quitar en produccion
        die(); 
    }

    return $con;//retorna el valor del objeto
});