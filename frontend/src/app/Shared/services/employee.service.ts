import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/employee.model';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  SRV : string = 'http://BualaLand';

  constructor(
    private http : HttpClient
  ) { }

  eliminar(id:any) : Observable<any>{

    return this.http.delete(`${this.SRV}/employee/${id}`)

    //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }

  buscar (id:any) :Observable<any>{

    return this.http.get<EmployeeModel>(`${this.SRV}/cita/${id}`)
    .pipe(retry(1), catchError(this.handleError));

  }

  buscarEmployee (id:any) :Observable<any>{

    return this.http.get<EmployeeModel>(`${this.SRV}/employee/${id}`)
    .pipe(retry(1), catchError(this.handleError));

  }

  //muestra las citas del cliente
  filter (parametros : any, pag:number, lim:number, idEmployee : any) : Observable<EmployeeModel[]>{
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }

    //this.http.get<DateCutModel>(this.SRV+'/cliente/'+pag+'/'+lim);
    // alt+96 ``
    return this.http.get<EmployeeModel[]>(`${this.SRV}/employee/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));

  }

  resetPassw(idEmployee:any) : Observable<any>{

    return this.http.patch(`${this.SRV}/usuario/passw/reset/${idEmployee}`, {passwN:idEmployee})

    //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }

  //edita citas desde el lado del empleado
  EditByEmployee(datos : any, id? : any) : Observable<any>{

    console.log(datos);
    return this.http.put<EmployeeModel>(`${this.SRV}/citac/${id}`, datos)
    //pipe para retornar operadores de rxjs
    .pipe(retry(1), catchError(this.handleError));
  }

  newEmployee (datos : any) : Observable<any>{
  
    return this.http.post<EmployeeModel>(`${this.SRV}/employee`, datos)
      //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));

  }
  guardar (datos : any, id? : any) : Observable<any>{

    if(id){//modificar

      return this.http.put<EmployeeModel>(`${this.SRV}/cita/${id}`, datos)
      //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));

    }else{//crear nuevo

      return this.http.post<EmployeeModel>(`${this.SRV}/cita`, datos)
      //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
    }
  }

  private handleError(error:any){

    return throwError(

      ()=>{
        return error.status;
      }
    )
  }


}
