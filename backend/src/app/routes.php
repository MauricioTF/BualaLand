<?php
namespace App\controller;

use Slim\Routing\RouteCollectorProxy;

///////////////////////////////////////////////

$app->group('/cliente', function(RouteCollectorProxy $cliente){
    $cliente->get('/{pagina}/{limite}/{idEmployee}', Customer::class . ':filtrar' );//filtra clientes por empleado

    $cliente->get('', Customer::class . ':numRegs'); //

    $cliente->get('/{id}', Customer::class . ':buscar');//Listo
    
    $cliente->post('', Customer::class . ':crear');//Listo
    
    //modifica toda la estructura
    $cliente->put('/{id}', Customer::class . ':editar');//Listo
    //cambia el propietario del articulo
    $cliente->patch('/{id}', Customer::class . ':cambiarPropietario'); //
    
    $cliente->delete('/{id}', Customer::class . ':eliminar');//Listo

});
$app->group('/cita', function(RouteCollectorProxy $cita){
    $cita->get('/{pagina}/{limite}/{idEmployee}', DateCut::class . ':filtrar' );//filtra citas por empleado

    $cita->get('', DateCut::class . ':numRegs'); //

    $cita->get('/{id}', DateCut::class . ':buscar');//
    
    $cita->post('', DateCut::class . ':crear');//
    
    //modifica toda la estructura
    $cita->put('/{id}', DateCut::class . ':editar');//
    //cambia el propietario del articulo
    //$cita->patch('/{id}', DateCut::class . ':cambiarPropietario'); //
    
    $cita->delete('/{id}', DateCut::class . ':eliminar');//
});

//////////////////////////////////////////////

$app->group('/citac', function(RouteCollectorProxy $cita){

    //lleva id del cliente
    $cita->get('/{pagina}/{limite}/{idEmployee}', DateCut::class . ':filtrarDC' );//filtra citas por cliente

    $cita->group('/pendiente', function(RouteCollectorProxy $cita){

        //citas pendientes del cliente
        $cita->get('/{pagina}/{limite}/{idEmployee}', DateCut::class . ':filtrarDatePending' );//filtra citas por cliente
    
    });

    $cita->put('/changeTotalPoints/{idCustomer}', DateCut::class . ':editarCustomerTotalPoint' );//filtra citas por cliente

    $cita->get('/fecha/{pagina}/{limite}/{id}', DateCut::class . ':filtrarPorFechaActual');//Listo

        //edita desde el empleado
    $cita->put('/{id}', DateCut::class . ':editByEmployee');//

});
/*$app->group('/citac', function(RouteCollectorProxy $cita){

    //lleva id del cliente
    $cita->get('/{pagina}/{limite}/{idEmployee}', DateCut::class . ':filtrarByDate' );//filtra citas por cliente

});*/


////////////////////////////////////////
$app->group('/company', function(RouteCollectorProxy $company){
    $company->get('/{pagina}/{limite}', Company::class . ':filtrar');//Listo

    $company->get('', Company::class . ':numRegs'); //

    $company->get('/{id}', Company::class . ':buscar');//Listo

    $company->post('', Company::class . ':crear');//

    $company->put('/{id}', Company::class . ':editar');//Listo

    $company->delete('/{id}', Company::class . ':eliminar');//Listo

});
////////////////////////////////////////
$app->group('/employee', function(RouteCollectorProxy $empleado){
    $empleado->get('/{pagina}/{limite}/{idEmployee}', Employee::class . ':filtrar' );//

    $empleado->get('', Employee::class . ':numRegs'); //

    $empleado->get('/{id}', Employee::class . ':buscar');//Listo

    
    $empleado->post('', Employee::class . ':crear');//Listo
    
    //modifica toda la estructura
    $empleado->put('/{id}', Employee::class . ':editar');//Listo
    //cambia el propietario del articulo
    $empleado->patch('/{id}', Employee::class . ':cambiarPropietario'); //
    
    $empleado->delete('/{id}', Employee::class . ':eliminar');//Listo

});
////////////////////////////////////////
$app->group('/cut', function(RouteCollectorProxy $cortes){
    $cortes->get('/{pagina}/{limite}', Cuts::class . ':filtrar' );//

    $cortes->get('', Cuts::class . ':numRegs'); //

    $cortes->get('/{id}', Cuts::class . ':buscar');//Listo
    
    $cortes->post('', Cuts::class . ':crear');//Listo
    
    //modifica toda la estructura
    $cortes->put('/{id}', Cuts::class . ':editar');//Listo
    //cambia el propietario del articulo
    //$cortes->patch('/{id}', Cuts::class . ':cambiarPropietario'); //
    
    $cortes->delete('/{id}', Cuts::class . ':eliminar');//Listo

});


////////////////////////////////////////
$app->group('/admin', function(RouteCollectorProxy $admin){
    $admin->get('/{pagina}/{limite}', Administrator::class . ':filtrar' );//

    $admin->get('', Administrator::class . ':numRegs'); //

    $admin->get('/{id}', Administrator::class . ':buscar');//Listo
    
    $admin->post('', Administrator::class . ':crear');//Listo
    
    //modifica toda la estructura
    $admin->put('/{id}', Administrator::class . ':editar');//Listo
    //cambia el propietario del articulo
    $admin->patch('/{id}', Administrator::class . ':cambiarPropietario'); //
    
    $admin->delete('/{id}', Administrator::class . ':eliminar');//Listo

});
////////////////////////////////////////

$app->group('/usuario', function(RouteCollectorProxy $usuario){
    $usuario->patch('/rol/{id}', Users::class . ':cambiarRol'); //Listo

    $usuario->group('/passw', function(RouteCollectorProxy $passw){
        $passw->patch('/cambio/{id}', Users::class . ':cambiarPassw');//Listo

        $passw->patch('/reset/{id}', Users::class . ':resetPassw');//Listo
    });

});
//////////////////////////////////////////////

$app->group('/sesion', function(RouteCollectorProxy $sesion){

    $sesion->patch('/iniciar/{id}', Sesion::class . ':iniciar'); //

    $sesion->patch('/cerrar/{id}', Sesion::class . ':cerrar'); //

    $sesion->patch('/refrescar/{id}', Sesion::class . ':refrescar'); //


});

