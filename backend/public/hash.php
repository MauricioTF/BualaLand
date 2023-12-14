<?php
$cadEntrada = "contraseña";
echo $cadEntrada . "<br>";

$opciones = [
    'cost' => 10
];

$entradaconHash = password_hash($cadEntrada, PASSWORD_BCRYPT, $opciones);

echo "Con has: " . $entradaconHash;

$cadDigitado = "contraseña";

if(password_verify($cadDigitado, $entradaconHash)){

    echo "<br> Acceso permitido";
}else{

    echo "<br> Acceso denegado";
}