import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/customers/customers.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';
import  {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ComponentsComponent } from  './components/components.component';
import { LoginComponent } from './components/login/login.component';
//import { Error403Component } from './components/error403/error403.component';
import { JwtInterceptor } from './Shared/helpers/jwt.interceptor';
import { RefreshTokenInterceptor } from './Shared/helpers/refresh-token.interceptor';
import { user } from './Shared/models/user';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { EmployeeComponent } from './components/employee/employee.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { CambioPassComponent } from  './components/cambio-pass/cambio-pass.component';
import { ClientesEmpleadoComponent } from './components/clientes-empleado/clientes-empleado.component';
import { LoaderInterceptor } from './Shared/helpers/loader.interceptor';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
  
    AppComponent,
    ClienteComponent,
    NavBarComponent,
    HomeComponent,
    ComponentsComponent,
    LoginComponent,
    EmployeeComponent,
    AdministratorComponent,
    CambioPassComponent,
    ClientesEmpleadoComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,  useClass : JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS,  useClass : RefreshTokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS,  useClass : LoaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

    constructor(libreria:FaIconLibrary){

      libreria.addIconPacks(fas);
    }
}
