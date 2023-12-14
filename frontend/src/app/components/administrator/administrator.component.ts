import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { AuthService } from 'src/app/Shared/services/auth.service';
//import { customersModel } from 'src/app/Shared/models/customers.model';
import { EmployeeModel } from 'src/app/Shared/models/employee.model';
import { EmployeeService } from 'src/app/Shared/services/employee.service';
import { PrintService } from 'src/app/Shared/services/print.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-cliente',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css'],
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


export class AdministratorComponent implements OnInit{

  filtro : any;
  //inyectar servicio en componente
  srvCliente = inject(EmployeeService);
  srvPrint = inject(PrintService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente : FormGroup;

  employee = [new EmployeeModel];

  titulo :string = '';

  usuario : string = '';
  srvAuth = inject(AuthService);
  pagActual = 1;
  itemsPPag = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible:boolean = false;

  constructor(){
    
    this.frmCliente = this.fb.group({

      idUser : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],  
      passw : ['' , Validators.required],
      idAdmin : [''],
      name : ['', [Validators.required, Validators.min(3), Validators.maxLength(30)
        , Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')]],
      lastName1 : ['', [Validators.required, Validators.min(2), Validators.maxLength(15)
        , Validators.pattern('[A-Za-zÑñáéíóú]*')]],
      lastName2 : ['', [Validators.required, Validators.min(2), Validators.maxLength(15)
        , Validators.pattern('[A-Za-zÑñáéíóú]*')]],
      email : ['', [Validators.required, Validators.email]],   
      cellphone : ['', Validators.required], 
      specialty : ['', Validators.required]   
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

      idUser : this.frmCliente.value.idUser,
      passw : this.frmCliente.value.passw,
      idAdmin : this.usuario,
      name : this.frmCliente.value.name,
      lastName1 : this.frmCliente.value.lastName1,
      lastName2 : this.frmCliente.value.lastName2,
      email : this.frmCliente.value.email,
      cellphone : this.frmCliente.value.cellphone,
      specialty : this.frmCliente.value.specialty,

  }

    this.srvCliente.newEmployee(cliente) 
      .subscribe({
        
        complete : ()=> {

          this.filtrar();
          Swal.fire({
            icon: 'success',
            title: 'Creado correctamente',
            showConfirmButton: false,
            timer : 1500
          });

        },

        error : (e) => {

          switch(e){

            case 404 :
              console.log("409");

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
              console.log("500");

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

    this.titulo = "Nuevo empleado";
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

  OnResetear(id: any, nombre:string){
    
    Swal.fire({
      title: 'Desea resetear contraseña de ',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, resetear!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.srvCliente.resetPassw(id)
          .subscribe({
            //next : ()=> {},

            complete: () => {
              this.filtrar();
              Swal.fire(
                'Contraseña!',
                'Reseteada correctamente.',
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

                default:

                Swal.fire({
                  icon: 'error',
                  title: 'Imposible resetear esta contraseña',
                  text: 'error',
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

    this.srvCliente.buscarEmployee(id)
    .subscribe(
      
      data =>{

        Swal.fire({

          title : '<strong>Informacion</strong>',
          html : '<br>'+
            '<table class="table table-sm table-striped">'+
            '<tbody  class ="text-start">'+
            '<tr><th>id </th>'+ `<td>${data.idEmployee}</td></tr>`+
            '<tr><th>nombre</th>'+ `<td>${data.name} ${data.lastname1} ${data.lastname2}</td></tr>`+
            '<tr><th>correo </th>'+ `<td>${data.email}</td></tr>`+
            '<tr><th>celular </th>'+ `<td>${data.cellphone}</td></tr>`+
            '<tr><th>especialidad</th>'+ `<td>${data.specialty}</td></tr>`+
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
    this.srvCliente.filter(this.filtro, this.pagActual, 5, this.usuario)
    .subscribe(
      data => {

        this.employee = Object(data);
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

    const encabezado = ["ID empleado", "Nombre", "email", "celular", "especialidad"];

    this.srvCliente.filter(this.filtro, this.pagActual, this.itemsPPag, this.usuario)
      .subscribe(
        data => {

          const cuerpo = Object(data)
            .map(
              (Obj : any) => {

                const datos = [

                  Obj.idEmployee,
                  Obj.name + ' ' + Obj.lastname1+ ' ' + Obj.lastname2,
                  Obj.email,
                  Obj.cellphone,
                  Obj.specialty
                ]

                return datos;
              }
            )

            //imprime
            this.srvPrint.print(encabezado, cuerpo, "Listado de citas", true);
        }
      )
  }

  onCerrar(){

    this.router.navigate(['']);
  }
}
