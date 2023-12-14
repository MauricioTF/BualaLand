import { HttpClient } from '@angular/common/http';
import { Token } from '../models/tokens';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, retry, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { user } from '../models/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  SRV = environment.SRV;
  http = inject(HttpClient);
  srvToken = inject(TokenService);
  router = inject(Router);

  private usrActualSubject = new BehaviorSubject<user>( new user ());
  public usrActual = this.usrActualSubject.asObservable();
  
  constructor() { }

  public get valorUserActual() : user {

    return this.usrActualSubject.value;
  }

  public login(user : {idUsuario:'', passw:''}):Observable<any>{

    return this.http.patch<Token>(`${this.SRV}/sesion/iniciar/${user.idUsuario}`, {passw:user.passw})

      .pipe(
        retry(1),
        tap(
          tokens => {
            //console.log(tokens);
            //se guardaran los tokens en el cliente para seguir autenticado
            this.doLogin(tokens);
            this.router.navigate(['/home']);
          }
        ),
        //para obtener el dato
        map(()=> true),
        //captar los errores
        catchError(
          error => {return of (error.status)}
        )
      )
  }


  public logout(){

    if(this.isLogged()){
      this.http.patch(`${this.SRV}/sesion/cerrar/${this.valorUserActual.idUser}`, {})
      .subscribe();
      this.doLogout();
    }
    
  }

  private doLogin (tokens : Token) : void {

    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());

  }

  private doLogout(){

    if(this.srvToken.token){

      this.srvToken.eliminarTokens();
    }

    this.usrActualSubject.next(this.getUserActual());
    this.router.navigate(['/login']);

  }

  private getUserActual() : user{

    if(!this.srvToken.token){
      return new user();
    }

    const tokenD = this.srvToken.decodeToken();
    return {idUser : tokenD.sub, name : tokenD.nom,  rol : tokenD.rol, idEmployee : tokenD.idE, totalPoints : tokenD.totalPoints};
  }

  //para verificar de forma mas rapida
  public isLogged() : boolean{

    return !!this.srvToken.token && !this.srvToken.jwtTokenExp();
  }

  public verificarRefrescar() : boolean {

    if(this.isLogged() && this.srvToken.tiempoExpToken() <= 20){

      this.srvToken.refreshTokens();
      return true;
    } else {

      return false;
    }
  }
}
