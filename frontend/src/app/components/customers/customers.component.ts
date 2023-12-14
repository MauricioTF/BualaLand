import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../Shared/services/dateCut.service';
import { DateCutModel } from '../../Shared/models/dateCut.model';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UsuarioService } from 'src/app/Shared/services/usuario.service';
import { PrintService } from 'src/app/Shared/services/print.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
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

export class ClienteComponent implements OnInit{


  filtro : any;
  //inyectar servicio en componente
  srvCliente = inject(ClienteService);
  srvUsuario = inject(UsuarioService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente : FormGroup;

  dateCuts = [new DateCutModel];

  titulo :string = '';

  usuario : string = '';
  idE : string = '';
  pagActual = 1;
  itemsPPag = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible:boolean = false;

  //para el total de puntos
  totalPoints : number = 0;

  srvAuth = inject(AuthService);

  constructor(){

    this.frmCliente = this.fb.group({

      idDate: [''],
      idCustomers: [''],
      idEmployee: [''],
      dateCut: ['', Validators.required],
      timeCut: ['', Validators.required],
      stateDate: [''],
      cutFree: [''],
      amount: ['']

    });

    //para saber cual usuario está logueado
    this.srvAuth.usrActual
    .subscribe(
      res => {this.usuario = res.idUser,
              this.idE = res.idEmployee,
              this.totalPoints = res.totalPoints   
      }
    )
  }

  updatePoints() {
    let cliente = null;
    if (this.totalPoints == 10) {
      cliente = {
        points: 1
      }

    } else {
      cliente = {
        points: this.totalPoints + 1
      }

    }
    this.srvCliente.updatePoint(cliente, this.usuario).subscribe();
    this.filtrar();

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

  var client = null;
  
  if(this.frmCliente.value.idDate == null){

    client = {

    idCustomers : this.usuario,
    idEmployee : this.idE,
    dateCut : this.frmCliente.value.dateCut,
    timeCut : this.frmCliente.value.timeCut,
    stateDate : "0",
    cutFree : "0",
    amount : "0",
    
}
  }else{

    client = {
      dateCut : this.frmCliente.value.dateCut,
      timeCut : this.frmCliente.value.timeCut,
    }
  }

    
    const texto = this.frmCliente.value.idDate ? 'Actualizado correctamente' : 'Creado correctamente';
    this.srvCliente.guardar(client, this.frmCliente.value.idDate) 
      .subscribe({
        
        complete : ()=> {

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

              Swal.fire({
                
                icon: 'error',
                title: 'La cita no existe',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;

            case 409 :

              Swal.fire({
                icon: 'error',
                title: 'La fecha debe ser posterior a la actual',
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
              });
            break;
          }
        }
      });
      this.updatePoints();
     
  }
  //manejador de evento
  OnNuevo(){

    this.titulo = "Nueva cita";
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
            '<tr><th>empleado </th>'+ `<td>${data.idEmployee}</td></tr>`+
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
    this.srvCliente.filterCustomer(this.filtro, this.pagActual, 5, this.usuario)
    .subscribe(
      data => {

        this.dateCuts = Object(data);

      }
    );

  }

  ngOnInit(): void {
  
    this.resetearFiltro();
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

    this.srvCliente.filterCustomer(this.filtro, this.pagActual, this.itemsPPag, this.usuario)
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
