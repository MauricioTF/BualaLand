import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../Shared/services/dateCut.service';
import { DateCutModel } from '../../Shared/models/dateCut.model';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { customersModel } from 'src/app/Shared/models/customers.model';
import { PrintService } from 'src/app/Shared/services/print.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
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
export class EmployeeComponent implements OnInit{


  filtro : any;
  //inyectar servicio en componente
  srvCliente = inject(ClienteService);
  fb = inject(FormBuilder);
  srvPrint = inject(PrintService);
  srvAuth = inject(AuthService);
  router = inject(Router);
  frmCliente : FormGroup;

  dateCuts = [new DateCutModel];
  employee = [new customersModel];

  titulo :string = '';

  usuario : string = '';
  pagActual = 1;
  itemsPPag = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible:boolean = false;

  constructor(){
    
    this.frmCliente = this.fb.group({

      idDate: [''],
      idCustomers: [''],
      idEmployee: [''],
      dateCut: [''],
      timeCut: [''],
      stateDate: ['', Validators.required],
      cutFree: [''],
      amount: ['', Validators.required]

    });

     //para saber cual usuario está logueado
     this.srvAuth.usrActual
     .subscribe(
       res => {this.usuario = res.idUser     
       }
     )
  }

  get F(){

    return this.frmCliente.controls;
  }

  get stateFiltro(){

    return this.filtroVisible ? 'show' : 'hide';
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
  
  onSubmit(){

    const cliente = {

      stateDate : this.frmCliente.value.stateDate,
      amount : this.frmCliente.value.amount,

  }

  console.log(this.frmCliente.value.idDate);
    const texto ='Actualizado correctamente';
    this.srvCliente.EditByEmployee(cliente, this.frmCliente.value.idDate) 
      .subscribe({
        
        complete : ()=> {

          console.log("ya");
          this.filtrar();
          Swal.fire({
            icon: 'success',
            title: texto,
            showConfirmButton: false,
            timer : 1500
          });
        },

        error : (e) => {

          switch(e){

            case 404 :
              console.log("404");

              Swal.fire({
                
                icon: 'error',
                title: 'El cliente no existe',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;

            case 409 :
              console.log("409");

              Swal.fire({
                icon: 'error',
                title: 'id cliente ya existe',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;
          }
        }
      });
  }
  //manejador de evento
  OnNuevo(){
    this.titulo = "Nuevo cliente";
    this.frmCliente.reset();

  }

  OnEditar(id : any){
    this.titulo = "Modificar cliente";
    this.srvCliente.buscar(id)
      .subscribe(
        data => {
          this.frmCliente.setValue(data);
        }
      );
  }

  OnEliminar(id : any){
    Swal.fire({
      title: 'Desea eliminar',
      text: 'esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.srvCliente.eliminar(id)
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

              switch(e){

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
                  text: 'Cliente con artefacto relacionado',
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

  OnInfo(id : any){

    this.srvCliente.buscar(id)
    .subscribe(
      
      data =>{

        Swal.fire({

          title : '<strong>Informacion</strong>',
          html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody  class ="text-start">'+
            '<tr><th>id </th>'+ `<td>${data.idDate}</td></tr>`+
            '<tr><th>cliente</th>'+ `<td>${data.idCustomers}</td></tr>`+
            '<tr><th>fecha </th>'+ `<td>${data.dateCut}</td></tr>`+
            '<tr><th>hora </th>'+ `<td>${data.timeCut}</td></tr>`+
            '<tr><th>estado </th>'+ `<td>${data.stateDate}</td></tr>`+
            '<tr><th>precio </th>'+ `<td>${data.amount}</td></tr>`+
            '</tbody>'+
            '</table>',
          showConfirmButton : false,
          showCancelButton : true,
          cancelButtonText : 'Cerrar'
        })
      }
      
    )
  }

  filtrar(){
    this.srvCliente.filterEmployee(this.filtro, this.pagActual, 5, this.usuario)
    .subscribe(
      data => {

        this.dateCuts = Object(data);
        //console.log(this.clientes);
      }
    );

  }

  ngOnInit(): void {
  
      this.filtro = {idDate : '', idCustomers : '', idEmployee : '', dateCut : '', timeCut:''};
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

    const encabezado = ["id cita", "id cliente", "fecha", "gratis", "precio"];

    this.srvCliente.filterEmployee(this.filtro, this.pagActual, this.itemsPPag, this.usuario)
      .subscribe(
        data => {

          const cuerpo = Object(data)
            .map(
              (Obj : any) => {

                const datos = [

                  Obj.idDate,
                  Obj.idCustomers,
                  Obj.dateCut+ ' ' + Obj.timeCut,
                  Obj.cutFree,
                  Obj.amount
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
