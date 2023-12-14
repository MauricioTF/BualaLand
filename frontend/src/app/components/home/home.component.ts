import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateCutModel } from 'src/app/Shared/models/dateCut.model';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { ClienteService } from 'src/app/Shared/services/dateCut.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent {

  srvCliente = inject(ClienteService);
  filtro : any;
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente : FormGroup;

  idUser : string = '';
  rol : number = -1;
  totalPoints : number = -1;

  srvAuth = inject(AuthService);


  dateCuts = [new DateCutModel];
  pagActual = 1;
  itemsPPag = 5;
  numReg = 0;
  paginas = [2, 5, 10, 20, 50];
  filtroVisible:boolean = false;

  constructor(){


    this.frmCliente = this.fb.group({

      idDate : [''],  
      idCustomers : [''],   
      idEmployee : [''],
      dateCut : [''],
      timeCut : [''],
      stateDate : [''],   
      cutFree : [''], 
      amount : ['']   
      
    });

    this.srvAuth.usrActual
    .subscribe(
      res => {this.rol = res.rol,
      this.idUser = res.idUser,
    this.totalPoints = res.totalPoints
  }

    )
    console.log("usuario      "+this.idUser);
  }

  get stateFiltro(){

    return this.filtroVisible ? 'show' : 'hide';
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
  
  OnEditar(id : any){
    this.srvCliente.buscar(id)
      .subscribe(

        data => {

          this.frmCliente.setValue(data);
        }
      );
  }

  filtrar(){

    //debe mostrar cita pendiente del cliente
    if(this.rol == 3){
    this.srvCliente.filterDatePending(this.filtro, 1, 5, this.idUser)
    .subscribe(
      data => {
        
        this.dateCuts = Object(data);
      }
    );
    }
    if(this.rol ==2){
      this.srvCliente.filterByDate(this.filtro, 1, 5, this.idUser)
      .subscribe(
        data => {

          this.dateCuts = Object(data);
        }
      );
      }
  }

  ngOnInit(): void {
  
    this.filtro = {idDate : '', idCustomers : '', idEmployee : '', dateCut : '', timeCut:''};
    this.filtrar();
  
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
}
