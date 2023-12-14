<?php

use  DI\Container;
use Slim\Factory\AppFactory;


require __DIR__ . '/../../vendor/autoload.php';

$cont_aux = new \DI\Container();

AppFactory::setContainer($cont_aux);

$app = AppFactory::create();

$container = $app -> getContainer();
include_once 'config.php';


$app->add(new Tuupola\Middleware\JwtAuthentication([

    "secure" => false,
    "path" => ["/accesobd","/hash"],
    "ignore" => ["/sesion", "/datecut", "/customer", "/users", "/employee"],
    "secret" => $container->get('clave'),
    "agorithm" => ["HS256", "HS384"]
]));

include_once 'routes.php';
include_once 'conexion.php';

$app->run();

