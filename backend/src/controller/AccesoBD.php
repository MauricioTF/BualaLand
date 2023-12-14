<?php
//conntroladores

namespace App\controller;
use Psr\Container\ContainerInterface;
use PDO;
use PDOException;

class AccesoBD{
    //atributos
    protected $container;
    //constructor en php
    public function __construct(ContainerInterface $c){
        $this->container = $c;
    }

    private function generarParam($datos){
        $cad = "(";
        foreach($datos as $campo => $valor){
            $cad .= ":$campo,";
        }
        $cad =trim($cad, ',');
        $cad .=")";

        return $cad;
    }

    public function crearBD($datos, $recurso){
        $params = $this->generarParam($datos);
        $sql = "SELECT create$recurso$params";
        $d = [];
        foreach($datos as $clave =>$valor){
            $d[$clave] = $valor;
        }

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        return $res[0];
    }
    //cliente, tecnico, usuario
    public function crearUsrBD($datos, $recurso, $rol, $campoId){

        $passw = $datos->passw;
        unset($datos->passw);
        $params = $this->generarParam($datos);

        
        $con = $this->container->get('bd');
        //Las transacciones es para que se cumpla todo o nada
        $con->beginTransaction();
        try{
            $sql = "SELECT create$recurso$params";
            $query = $con->prepare($sql);
            $d = [];
            foreach($datos as $clave =>$valor){
                $d[$clave] = filter_var($valor, FILTER_SANITIZE_SPECIAL_CHARS);
            }
            $query->execute($d);
            $res = $query->fetch(PDO::FETCH_NUM)[0];
            //crear el usuario

            $sql = "SELECT create$recurso$params(:usr, :rol, :passw);";
            $query = $con->prepare($sql);
            $query->execute(array(
                'usr' => $d[$campoId],
                'rol' => $rol,
                'passw' => $passw
            ));
            $con ->commit();
        }
        catch(PDOException $ex){
            //se quita en produccion
            print_r( $ex->getMessage());
            //deshace la transaccion en caso de dar error
            $con->rollback();
            $res = 2;
        }
        $query = null;
        $con = null;
        return $res;
    }


    public function edit($datos,$recurso, $id, $nameMethod){

        $params = $this->generarParam($datos);
        $params = substr($params, 0, 1) . ":id," . substr($params, 1);
        $sql = "SELECT   ";
        $d['id'] = $id;

        foreach($datos as $clave =>$valor){
            $d[$clave] = $valor;
        }
        
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        return $res[0];
    }

    public function editarBDPoints($datos, $id){
        $params = $this->generarParam($datos);
        $params = substr($params, 0, 1) . ":id," . substr($params, 1);
        $sql = "SELECT updateCustomerTotalPoints$params";
        $d['id'] = $id;
        //var_dump($params);die();
        foreach($datos as $clave =>$valor){
            $d[$clave] = $valor;
        }
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        return $res[0];
    }

    public function editarBD($datos,$recurso, $id, $nameMethod){

        $params = $this->generarParam($datos);
        $params = substr($params, 0, 1) . ":id," . substr($params, 1);
        $sql = "SELECT   $nameMethod$recurso$params";
        $d['id'] = $id;

        foreach($datos as $clave =>$valor){
            $d[$clave] = $valor;
        }
        
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        return $res[0];
    }

    public function eliminarBD($id, $recurso){

        $sql = "SELECT delete$recurso(:id);";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);

        $query->execute(["id" =>$id]);

        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;

        return $res;
    }

    public function buscarBD($id, $recurso){
        $sql = "CALL search$recurso(:id);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(['id' => $id]);
        $res = $query->fetch(PDO::FETCH_ASSOC);
        $query = null;
        $con = null;        
        return $res;
    }
    public function filtrarBD($datos, $args, $recurso){
        $limite = $args['limite'];
        $pagina = ($args['pagina'] - 1) * $limite;
        $cadena = "";

        foreach($datos as $valor){
            $cadena .= "%$valor%&";
        }
        $sql = "call filter$recurso('$cadena', $pagina, $limite);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetchAll();
        $query = null;
        $con = null;
        return $res;
    }

    public function filtrarBy($datos, $args, $recurso ){
        $limite = $args['limite'];
        $pagina = ($args['pagina'] - 1) * $limite;
        $idEmployee = $args['idEmployee'];
        $cadena = "";

        foreach($datos as $valor){
            $cadena .= "%$valor%&";
        }
        $sql = "call filterBy$recurso('$cadena', $pagina, $limite, $idEmployee);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetchAll();
        $query = null;
        $con = null;
        return $res;
    }

    public function filterByDate($datos, $args){
        $limite = $args['limite'];
        $pagina = ($args['pagina'] - 1) * $limite;
        $cadena = "";
        foreach($datos as $valor){
            $cadena .= "%$valor%&";
        }
        $idUsuario = $args['id'];


        $con = $this->container->get('bd');
        $query = $con->prepare("CALL todayRegs('$cadena', $pagina, $limite, $idUsuario);");
        $query->execute();
        $res = $query->fetchAll();
        $query = null;
        $con = null;        
        return $res;
    }

    //eliminar este metodo cuando se cambie el proc
    public function filtrarByDC($datos, $args, $recurso, $nameMethod){
        $limite = $args['limite'];
        $pagina = ($args['pagina'] - 1) * $limite;
        $idEmployee = $args['idEmployee'];
        $cadena = "";

        foreach($datos as $valor){
            $cadena .= "%$valor%&";
        }
        $sql = "call filterBy$nameMethod('$cadena', $pagina, $limite, $idEmployee);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetchAll();
        $query = null;
        $con = null;
        return $res;
    }

    /////////////////////////////////////

    public function numRegsBD($datos, $recurso){
    
        $cadena = "";
        foreach($datos as $valor){
            $cadena .= "%$valor%&";
        }
        $sql = "call numRegs$recurso('$cadena');";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;
        return $res;

    }

    public function cambiarPropietarioBD($d){
        $params = $this->generarParam($d);
        $sql = "SELECT cambiarPropietario$params";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->bindParam(':id', $d['id'], PDO::PARAM_INT);
        $query->bindParam(':idCliente', $d['idCliente'], PDO::PARAM_INT);
        $query->execute();
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;
        return $res;
    }
//pssN = new paswword

    public function editarUsuari($idUsuario, int $rol = -1, string $passwN = ''){
         //el procedimiento que sera llamado, ya sea cambiar la contrase;a o el rol del usuario
         $proc = $rol == -1 ? 'select passwUsers(:id, :passw);' : 'select rolUsers(:id, :rol);';
         $sql = "call searchUsers('$idUsuario');";
         $con = $this->container->get('bd');
         $query = $con->prepare($sql);
         $query -> execute();
         $usuario = $query->fetch(PDO::FETCH_ASSOC);
         
         if($usuario){
             $params = ['id' => $usuario['idUser']];
             $params = $rol == -1 ? array_merge($params, ['passw' => $passwN]) :
                                 array_merge($params, ['rol' => $rol]);
             $query = $con -> prepare($proc);
             $retorno = $query ->execute($params);
         } else {
             $retorno = false;
         }
 
         $query = null;
         $con = null;
         return $retorno;
    }

    //parametros opcionales
    public function buscarUsr(string $idUsuario = ''){

        $con = $this->container->get('bd');
        $query = $con->prepare("CALL searchUsers('$idUsuario');");
        $query->execute();
        $res = $query->fetch();
        $query = null;
        $con = null;        
        return $res;
    }

    public function searchInTable($id, string $tipoUsuario, string $dataSearch){

        $proc = 'search' .$tipoUsuario ."( '$id')";

        $sql = "call $proc";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();

        if($query->rowCount()>0){

            $res = $query->fetch(PDO::FETCH_ASSOC);
        }else{

            $res = [];
        }

        $query = null;
        $con = null;      
        $res = $res[$dataSearch];

        if(\str_contains($res, " ")){
            $res = substr($res, 0, strpos($res, " "));
        }
        return $res;
    }
    //proc modificar o crear un token nuevo, 
    public function accederToken(string $proc, string $idUsuario, string $tokenRef=""){

        $sql = $proc == "modificar" ? "select ModificarToken(:idUsuario, :tk);" :
                                        "call verificarToken(:idUsuario, :tk);";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(["idUsuario" => $idUsuario, "tk" => $tokenRef]);

        if($proc == "modificar"){

            $datos = $query->fetch(PDO::FETCH_NUM);
        }else{

            $datos = $query->fetchColumn();
        }

        $query = null;
        $con = null;

        return $datos;
    }
}