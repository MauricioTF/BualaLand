<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
//use Psr\Container\ContainerInterface;
//use PDO;
use Firebase\JWT\JWT;


class Sesion extends AccesoBD{

    const TIPO_USR = [
        1 =>"Administrator",
        2 => "Employee",
        3 => "Customer",
    ];
    private function modificarToken(string $idUsuario, string $tokenRef=""){

        return $this->accederToken('modificar', $idUsuario, $tokenRef);

    }

    private function verificarRefresco(string $idUsuario, string $tokenRef){

        return $this->accederToken('verificar', $idUsuario, $tokenRef);

    }

    public function generarTokens(string $idUsuario, int $rol, string $nombre, string $idEmployee, int $totalPoints){

        $key = $this->container->get('clave'); //crear una clave
        //token normal
        if($rol === 1 || $rol === 2){
            $payload = [
                'iss' =>$_SERVER['SERVER_NAME'],
                'iat' => time(),//fecha hora actual
                'exp' => time() + 30,//tiempo de expiracion 60 son los segundos
                'sub' => $idUsuario,//sesion iniciada
                'rol' => $rol,
                'nom' => $nombre,
                'idE' => $idEmployee,
            ];
        }else if($rol === 3){
            $payload = [
                'iss' =>$_SERVER['SERVER_NAME'],
                'iat' => time(),//fecha hora actual
                'exp' => time() + 30,//tiempo de expiracion 60 son los segundos
                'sub' => $idUsuario,//sesion iniciada
                'rol' => $rol,
                'nom' => $nombre,
                'idE' => $idEmployee,
                'totalPoints' => $totalPoints
            ];
        }
        //token de referencia
        $payloadRef = [
            'iss' =>$_SERVER['SERVER_NAME'],
            'iat' => time(),//fecha hora actual
            'rol' => $rol,
        ];

        $tkRef = JWT::encode($payloadRef, $key, 'HS256');//genera el token para guardarlo en esta ariable y luego devolverlo

        //guardar token
        $this->modificarToken(idUsuario: $idUsuario, tokenRef: $tkRef);

        return[
            "token" => JWT::encode($payload, $key, 'HS256'),//genera el token para guardarlo en esta ariable y luego devolverlo
            "refreshToken"=> $tkRef
        ];
 
    }

    private function autenticar($idUsuario, $passw){

        $dato = $this->buscarUsr(idUsuario: $idUsuario);

        return(($dato) && (password_verify($passw, $dato->passw))) ?
            ['rol' => $dato->rol] : null;

    }

    public function iniciar(Request $request, Response $response, $args){

        $body = json_decode($request->getbody());
        $res = $this->autenticar($args['id'], $body->passw);
        $idEmployee = '';
        $totalPoints = 0;
        if($res){

            if($res['rol'] == "1"){
                
            $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'name');

            }else if($res['rol'] == "2"){
        
                $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'name');
                $idEmployee = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'idEmployee');


            }else{

                $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'name');
                $idEmployee = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'idEmployee');
                $totalPoints = $this->searchInTable($args['id'], self::TIPO_USR[$res['rol']], 'totalPoints');

            }

            //generar token
            $token = $this->generarTokens($args['id'], $res['rol'], $nombre, $idEmployee, $totalPoints);
                $response->getBody()->write(json_encode($token));
            $status = 200;
        }else{

            $status = 401;//no autenticado
        }

       return $response->
       withHeader('Content-type', 'Application/json')
       ->withStatus($status);
    }

    public function cerrar(Request $request, Response $response, $args){
            $this->modificarToken(idUsuario: $args['id']);

            return $response->withStatus(200);
    }

    public function refrescar(Request $request, Response $response, $args){
        
        $body = json_decode($request->getBody());

        $rol = $this->verificarRefresco($args['id'], $body->tkR);
        $idEmployee = '';
        $totalPoints = 0;
        if($rol){

             if($rol == "1"){
                
            $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'name');

            }else if($rol == "2"){
        
                $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'name');
                $idEmployee = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'idEmployee');

            }else{

                $nombre = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'name');
                $idEmployee = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'idEmployee');
                $totalPoints = $this->searchInTable($args['id'], self::TIPO_USR[$rol], 'totalPoints');

            }

            $tokens = $this -> generarTokens($args['id'], $rol, $nombre, $idEmployee, $totalPoints);
        }
        
        if(isset($tokens)){
            
            $status = 200;
            $response->getBody()->write(json_encode($tokens));
        }else{

            $status = 401;
        }

        return $response
            ->withHeader('content-Type', 'Application/json')
            ->withStatus($status);

    }
}