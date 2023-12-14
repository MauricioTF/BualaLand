import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/customers/customers.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './Shared/guards/login.guard';
import { authGuard } from './Shared/guards/auth.guard';
import { Roles } from './Shared/models/roles';
import { CambioPassComponent } from './components/cambio-pass/cambio-pass.component';
import { ClientesEmpleadoComponent } from './components/clientes-empleado/clientes-empleado.component';

const routes: Routes = [

  //{path: 'cliente', component: ClienteComponent},
  //{path: 'cliente', component: EmployeeComponent},
  //{path: '', component: HomeComponent},

  ///
  {path: '', pathMatch:'full', redirectTo: '/login'},
  {path : 'login', component : LoginComponent, canActivate : [loginGuard]},
  {path: 'home', component: HomeComponent},

  {path: 'administrator', component: AdministratorComponent,
  canActivate: [authGuard],
  data: {roles : [Roles.Administrator] }},
  {path: 'changePassw', component: CambioPassComponent, canActivate: [authGuard]},

  {path: 'employee', component: EmployeeComponent,
  canActivate: [authGuard],
  data: {roles : [ Roles.Employee] }},
  
  {path: 'employeecustomer', component: ClientesEmpleadoComponent,
  canActivate: [authGuard],
  data: {roles : [ Roles.Employee] }},
  {path: 'changePassw', component: CambioPassComponent, canActivate: [authGuard]},

  {path: 'customer', component: ClienteComponent,
  canActivate: [authGuard],
  data: {roles : [ Roles.Customer] }},
  {path: 'changePassw', component: CambioPassComponent, canActivate: [authGuard]},
  //{path: 'cliente', component: EmployeeComponent},
  //{path : 'error403', component : Error403Component},
  {path : '**', redirectTo : '/home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
