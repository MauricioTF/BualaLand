import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Token } from '@angular/compiler';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const srvAuth = inject(AuthService);//verificar si está logueado
    const srvToken = inject(TokenService);

    //si esta logueado
    if(srvAuth.isLogged()){

      request = request.clone({

        setHeaders : {
          Authorization : `Bearer ${srvToken.token}`
        }
      });
    }
    return next.handle(request);
  }
}
