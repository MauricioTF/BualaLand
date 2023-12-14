<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class Users extends AccesoBD {
    const RECURSO = "Usuario";

    private function autenticar($idUsuario, $passw){

        $dato = $this->buscarUsr(idUsuario: $idUsuario);

        return(($dato) && (password_verify($passw, $dato->passw))) ?
            ['rol' => $dato->rol] : null;

    }

    public function cambiarRol(Request $request, Response $response, $args){
        $body = json_decode($request -> getbody());
        $datos = $this ->editarUsuari(idUsuario: $args['id'], rol: $body->rol);
        $status = $datos == true ? 200 : 404;
        return $response->withStatus($status);
    }

    public function cambiarPassw(Request $request, Response $response, $args){
        $body = json_decode($request -> getbody(), 1);
        //autenticar
        $usuario = $this->autenticar($args['id'], $body['passw']);

        if($usuario){
            $datos = $this ->editarUsuari(idUsuario: $args['id'], passwN: Hash::hash($body['passwN']));
            $status = 200;
        }else{
            $status = 401;
        }
        return $response->withStatus($status);

    }
   
    public function resetPassw(Request $request, Response $response, $args){ //only admin
        $body = json_decode($request -> getbody());
        //hacerle el hash
        $datos = $this ->editarUsuari(idUsuario: $args['id'], passwN: Hash::hash($body->passwN));
        $status = $datos == true ? 200 : 404;
        return $response->withStatus($status);
    }


}