import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, inject } from '@angular/core';
import { customersModel } from 'src/app/Shared/models/customers.model';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { ClienteService } from 'src/app/Shared/services/dateCut.service';
import { PrintService } from 'src/app/Shared/services/print.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-empleado',
  templateUrl: './clientes-empleado.component.html',
  styleUrls: ['./clientes-empleado.component.css'],
  animations: [
    trigger('estadoFiltro', [
      state(
        'show',
        style({
          'max-height': '100%',
          transform: 'translateX' //'max-height' : '100%', 'opacity' : '1', 'visibility' : 'visible'
        })
      ),
      state(
        'hide',
        style({
          'max-height': '0',
          'opacity' : '0',
          transform: 'translate(-100%)' //'max-height' : '0%', 'opacity' : '0', 'visibility' : '0'
        })
      ),
      transition('show => hide', animate('600ms ease-in-out')),
      transition('hide => show', animate('1000ms ease-in-out'))
    ])
  ]
})
export class ClientesEmpleadoComponent implements OnInit {
  filtro: any;
  //inyectar servicio en componente
  srvCliente = inject(ClienteService);
  srvPrint = inject(PrintService);
  employee = [new customersModel];
  srvAuth = inject(AuthService);
  usuario: string = "";
  pagActual = 1;
  itemsPPag = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible:boolean = false;

  constructor() {
    this.srvAuth.usrActual
      .subscribe(
        res => {
          this.usuario = res.idUser
        }
      )
  }

  get stateFiltro(){

    return this.filtroVisible ? 'show' : 'hide';
  }

  OnInfo(id : any){

    this.srvCliente.buscarCliente(id)
    .subscribe(
      
      data =>{

        Swal.fire({

          title : '<strong>Informacion</strong>',
          html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody  class ="text-start">'+
            '<tr><th>id </th>'+ `<td>${data.idCustomers}</td></tr>`+
            '<tr><th>nombre</th>'+ `<td>${data.name} ${data.lastname1} ${data.lastname2}</td></tr>`+
            '<tr><th>correo </th>'+ `<td>${data.email}</td></tr>`+
            '<tr><th>celular </th>'+ `<td>${data.cellphone}</td></tr>`+
            '<tr><th>cantidad de cortes </th>'+ `<td>${data.cutsAmount}</td></tr>`+
            '<tr><th>puntos </th>'+ `<td>${data.totalPoints}</td></tr>`+
            '</tbody>'+
            '</table>',
          showConfirmButton : false,
          showCancelButton : true,
          cancelButtonText : 'Cerrar'
        })
      }
      
    )
  }

  onCambioPag(e: any) {
    this.pagActual = e;
    this.filtrar();
  }

  onCambioTama(e: any) {
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }
  
  onEliminar(id: any){
    Swal.fire({
      title: '¿Desea eliminar',
      text: 'este cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.srvCliente.deleteCustomer(id)
          .subscribe({
            //next : ()=> {},

            complete: () => {
              this.filtrar();
              Swal.fire(
                'Eliminado!',
                'Eliminado correctamente.',
                'success'
              );
            },

            error: (e) => {

              switch (e) {

                case 404:

                  Swal.fire({
                    icon: 'error',
                    title: 'El cliente no existe',
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar'
                  })

                  break;

                case 412:

                  Swal.fire({
                    icon: 'error',
                    title: 'Imposible eliminar este cliente',
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    showCancelButton: true,
                    cancelButtonText: 'Cerrar'
                  })

                  break;
              }
            }
          });
      }
    })
  }

  filtrar(){
    console.log(this.usuario);
    this.srvCliente.filtrarPorEmpleado(this.filtro, this.pagActual, 5, this.usuario)
      .subscribe(
        data => {
          console.log(data);
          this.employee = Object(data);
        }
      );
  }

  ngOnInit():void{
    this.filtro = { idCustomers: '', idEmployee: '', name: '', lastName1: '', lastName2:'', email:''
                  , cellphone:''};        
    this.filtrar();
  }

  onFiltrar(){

    this.filtroVisible = !this.filtroVisible ;

    if(!this.filtroVisible){

      this.resetearFiltro();
    }
  }

  resetearFiltro(){

    this.filtro = {idCustomers : '', name : '', lastName1 : '', lastName2 : ''};

    this.filtrar();
  }

  
  onFiltroChange(f : any){

    this.filtro = f;

    this.filtrar();
  }

  onImprimir(){

    const encabezado = ["ID cliente", "Nombre", "correo", "celular"];

    this.srvCliente.filtrarPorEmpleado(this.filtro, this.pagActual, this.itemsPPag, this.usuario)
      .subscribe(
        data => {

          const cuerpo = Object(data)
            .map(
              (Obj : any) => {

                const datos = [

                  Obj.idCustomers,
                  Obj.name + ' ' + Obj.lastname1+ ' ' + Obj.lastname2,
                  Obj.email,
                  Obj.cellphone
                ]

                return datos;
              }
            )

            //imprime
            this.srvPrint.print(encabezado, cuerpo, "Listado de citas", true);
        }
      )
  }
}
