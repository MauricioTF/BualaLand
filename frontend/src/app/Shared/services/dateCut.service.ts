import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateCutModel } from '../models/dateCut.model';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { customersModel } from '../models/customers.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  SRV : string = 'http://BualaLand';

  constructor(
    private http : HttpClient
  ) { }

  eliminar(id:any) : Observable<any>{

    return this.http.delete(`${this.SRV}/cita/${id}`)

    //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }

  buscar (id:any) :Observable<any>{

    return this.http.get<DateCutModel>(`${this.SRV}/cita/${id}`)
    .pipe(retry(1), catchError(this.handleError));

  }

  buscarCliente (id:any) :Observable<any>{

    return this.http.get<DateCutModel>(`${this.SRV}/cliente/${id}`)
    .pipe(retry(1), catchError(this.handleError));

  }
  
  //muestra las citas pendientes del cliente
  filterDatePending (parametros : any, pag:number, lim:number, idEmployee : any) : Observable<DateCutModel[]>{
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }

    //this.http.get<DateCutModel>(this.SRV+'/cliente/'+pag+'/'+lim);
    // alt+96 ``
    return this.http.get<DateCutModel[]>(`${this.SRV}/citac/pendiente/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));

  }


  //muestra las citas del cliente
  filterCustomer (parametros : any, pag:number, lim:number, idEmployee : any) : Observable<DateCutModel[]>{
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }

    return this.http.get<DateCutModel[]>(`${this.SRV}/citac/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));

  }

  //muestra las citas por empleado
  filterEmployee (parametros : any, pag:number, lim:number, idEmployee : any) : Observable<DateCutModel[]>{
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }

    return this.http.get<DateCutModel[]>(`${this.SRV}/cita/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));

  }

  filterByDate (parametros : any, pag:number, lim:number, idEmployee : any) : Observable<DateCutModel[]> {
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }
    return this.http.get<DateCutModel[]>(`${this.SRV}/citac/fecha/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));
  }


  //edita citas desde el lado del empleado
  EditByEmployee(datos : any, id? : any) : Observable<any>{

    console.log(datos);
    return this.http.put<DateCutModel>(`${this.SRV}/citac/${id}`, datos)
    //pipe para retornar operadores de rxjs
    .pipe(retry(1), catchError(this.handleError));
  }

  guardar (datos : any, id? : any) : Observable<any>{

    if(id){//modificar

      return this.http.put<DateCutModel>(`${this.SRV}/cita/${id}`, datos)
      //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));

    }else{//crear nuevo

      return this.http.post<DateCutModel>(`${this.SRV}/cita`, datos)
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

  updatePoint(datos : any, id?:any): Observable <any>{
    console.log(datos);
    
    return this.http.put<DateCutModel>(`${this.SRV}/citac/changeTotalPoints/${id}`, datos)
      //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }




  deleteCustomer(id:any) : Observable<any>{

    return this.http.delete(`${this.SRV}/cliente/${id}`)

    //pipe para retornar operadores de rxjs
      .pipe(retry(1), catchError(this.handleError));
  }

  filtrarPorEmpleado(parametros : any, pag:number, lim: number, idEmployee : any) : Observable<customersModel[]>{
    let params = new HttpParams;//para montar los parametros

    for (const prop in parametros) {
      
      if (prop){
        params = params.append(prop, parametros[prop]);
      }
    }
    console.log();
    return this.http.get<customersModel[]>(`${this.SRV}/cliente/${pag}/${lim}/${idEmployee}`, {params:params})
    .pipe(retry(1), catchError(this.handleError));
  }
}
