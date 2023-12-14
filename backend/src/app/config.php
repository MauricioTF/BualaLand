<?php

$container->set('config_bd', function(){

    //configuracion para bd
    //se guarda en objeto
    return(object)[

        "host" => "localhost:3307",
        "bd" => "bualaland",
        "usr" => "root",
        "pass" => "",
        "charset" => "utf8mb4" 
    ];
});

$container->set('clave', function(){

    return "3";

});