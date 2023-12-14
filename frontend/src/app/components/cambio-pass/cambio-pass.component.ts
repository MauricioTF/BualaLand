import { Component, inject } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { UsuarioService } from 'src/app/Shared/services/usuario.service';
import { notEqualsValidator } from 'src/app/Shared/validators/passw-equals';
import { passwordStrengthValidator } from 'src/app/Shared/validators/passw-strength';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.component.html',
  styleUrls: ['./cambio-pass.component.css']
})
export class CambioPassComponent {

  frmChangePassw : FormGroup;
  router = inject(Router);
  fb = inject(FormBuilder);
  srvUsuario = inject(UsuarioService);
  authSrv = inject(AuthService);
  errorLogin : boolean = false;

  //formulario
  constructor(){

    this.frmChangePassw = this.fb.group({

      passw : ['', Validators.required],
      passwN : ['',[Validators.required,Validators.minLength(8), passwordStrengthValidator()]], //fortaleza de la contraseña - comparacion entre contraseñas
      passwR : ['',Validators.required]},
      {validator : [notEqualsValidator()]} as AbstractControlOptions
    )
  }

  get F(){

    return this.frmChangePassw.controls;
  }

  onSubmit(){

    this.srvUsuario.changePassw(
      this.authSrv.valorUserActual.idUser,{
        passw : this.frmChangePassw.value.passw,
        passwN : this.frmChangePassw.value.passwN

      }      
    ).subscribe({

      complete:() => {
        Swal.fire({
          icon: 'success',
          title: "Contraseña cambiada",
          showConfirmButton: false,
          timer : 1500
        });
        this.onCerrar();
      },
      error:(e) => {
        
        Swal.fire({
          icon: 'error',
          title: 'Contraseña actual incorrecta',
          showConfirmButton: false,
          cancelButtonColor: '#d33',
          showCancelButton: true,
          cancelButtonText: 'Cerrar'
        });
      }
    })
    
}

onCerrar(){

  this.router.navigate(['/home']);
}
}
