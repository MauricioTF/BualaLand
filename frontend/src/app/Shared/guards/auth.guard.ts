import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const srvAuth = inject(AuthService);
  const router = inject(Router);

  if(srvAuth.isLogged()){

    console.log(route.data);

    //si tiene datos y tiene un rol asignado -1 dice que no encuentra lo que se está buscando
    if(Object.keys(route.data).length !== 0 && route.data['roles'].indexOf(srvAuth.valorUserActual.rol) === -1){
      router.navigate(['/error403']);
      return false;
    }

    return true;
  }

  //cierra la sesion
  srvAuth.logout();
  //rediriga al login
  router.navigate(['/login']);
  return false;


};
