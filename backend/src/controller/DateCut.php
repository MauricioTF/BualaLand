<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class DateCut extends AccesoBD {
    const RECURSO = "DateCut";
    const ID = 'idDate';
    const ROL = 3;


    public function crear(Request $request, Response $response, $args){

        $body = json_decode($request -> getBody());
                //hash
                //$body->passw = 
                //password_hash($body->idCustomers, PASSWORD_BCRYPT, ['cost' => 10]);
        $res = (int)$this->crearBD($body, self::RECURSO);

        $status = match($res){
            '0', 0 => 201,
            '1', 2 => 500,
            default => 409,
        };
        
        return $response->withStatus($status);
    }

    public function editarCustomerTotalPoint(Request $request, Response $response, $args){
        //(:id, :serie, :modelo, :marca, :categoria, :descripcion)
        $id = $args['idCustomer'];
        $body = json_decode($request -> getBody(), 1);
        $res = $this->editarBDPoints($body, $id);
        //un switch 
        $status = match($res){
            '0', 0 => 404,//not found
            '1', 1 => 200,
            '2', 2 => 409
        };
        return $response->withStatus($status);
    }

    //edita la cita desde el lado del empleado
    public function editByEmployee(Request $request, Response $response, $args){
        //(:id, :serie, :modelo, :marca, :categoria, :descripcion)
        $id = $args['id'];
        $body = json_decode($request -> getBody(), 1);
        $res = $this->editarBD($body, self::RECURSO, $id, 'updateByEmployee');

        //un switch 
        $status = match($res){
            '0', 0 => 404,//not found
            '1', 1 => 200,
            '2', 2 => 409
        };

        return $response->withStatus($status);
    }

    public function editar(Request $request, Response $response, $args){
        //(:id, :serie, :modelo, :marca, :categoria, :descripcion)
        $id = $args['id'];
        $body = json_decode($request -> getBody(), 1);
        $res = $this->editarBD($body, self::RECURSO, $id, 'updateByClient');
        //un switch 
        $status = match($res){
            '0', 0 => 404,//not found
            '1', 1 => 200,
            '2', 2 => 409
        };
        return $response->withStatus($status);
    }

    public function eliminar(Request $request, Response $response, $args){
        $res = $this ->eliminarBD($args['id'], self::RECURSO);
        $status = $res > 0 ? 200 : 404;
        return $response->withStatus($status);
    }
    
    public function buscar(Request $request, Response $response, $args){
        $id = $args['id'];

        $res = $this->buscarBD($id, self::RECURSO);
        $status = !$res ? 404 : 200;
        if($res){
            $response->getBody()->write(json_encode($res));
        }
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function filtrar(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
       
        $res = $this -> filtrarBy($datos, $args, self::RECURSO);
        
        $status = sizeof($res) > 0 ? 200: 204;
        $response->getBody()->write(json_encode($res));        
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function filtrarDC(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
       
        $res = $this -> filtrarByDC($datos, $args, self::RECURSO, 'dateXcustomer');
        
        $status = sizeof($res) > 0 ? 200: 204;
        $response->getBody()->write(json_encode($res));        
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function filtrarDatePending(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
       
        $res = $this -> filtrarByDC($datos, $args, self::RECURSO, 'StateDate');
        
        $status = sizeof($res) > 0 ? 200: 204;
        $response->getBody()->write(json_encode($res));        
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function filtrarPorFechaActual(Request $request, Response $response, $args){
        $datos = $request->getQueryParams();
       
        $res = $this -> filterByDate($datos, $args);
        
        $status = sizeof($res) > 0 ? 200: 204;
        $response->getBody()->write(json_encode($res));        
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }

    public function numRegs(Request $request, Response $response, $args){

            $datos = $request->getQueryParams();
        $res['cant'] = $this->numRegsBD($datos, self::RECURSO);

        $response->getBody()->write(json_encode($res));
        return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus(200);

        
    }

}
