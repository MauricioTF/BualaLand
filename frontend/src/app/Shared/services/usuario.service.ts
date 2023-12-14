import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  http = inject(HttpClient);
  SRV = environment.SRV;

  constructor() { }

  changePassw(id:any, datos : {}) : Observable<any>{

    return this.http.patch(`${this.SRV}/usuario/passw/cambio/${id}`, datos)

    //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error:any){

    return throwError(

      ()=>{
        return error.status;
      }
    )
  }
}
