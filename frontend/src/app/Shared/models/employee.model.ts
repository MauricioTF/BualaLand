export class EmployeeModel {

    idEmployee:string;
    passw : string;
    idAdmin : string;
    name? : string ;
    lastname1? : string ;
    lastname2? :string;
    email? : string;
    cellphone? : number;
    specialty? : string;
    // ? es para decir que es opcional

    constructor(c? : EmployeeModel){

        this.idEmployee = c !== undefined ? c.idEmployee : '';
        this.passw = c !== undefined ? c.passw : '';
        this.idAdmin = c !== undefined ? c.idAdmin : '';
        this.name = c !== undefined ? c.name : '';
        this.lastname1 = c !== undefined ? c.lastname1 : '';
        this.lastname2 = c !== undefined ? c.lastname2 : '';
        this.email = c !== undefined ? c.email : '';
        if(this.cellphone !== undefined){
            this.cellphone = c?.cellphone;
        }
        this.specialty = c !== undefined ? c.specialty : '';


    }
}
