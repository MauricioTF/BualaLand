import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/Shared/services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent {

  usuario : string = '';
  rol : number = -1;
  srvAuth = inject(AuthService);

  result : string = 'd';

  constructor(){

    this.srvAuth.usrActual
      .subscribe(
        res => {this.usuario = res.name,
          this.rol = res.rol
        }
      )
  }

  
  onSalir(){

    this.srvAuth.logout();
  }
}
