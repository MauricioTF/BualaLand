export class administratorModel {

    idAdmin:string;
    idCompany : string;
    name? : string ;
    lastName1? : string ;
    lastName2? :string;
    email? : string;
    cellphone? : number;
    // ? es para decir que es opcional

    constructor(c? : administratorModel){

        this.idAdmin = c !== undefined ? c.idAdmin : '';
        this.idCompany = c !== undefined ? c.idCompany : '';
        this.name = c !== undefined ? c.name : '';
        this.lastName1 = c !== undefined ? c.lastName1 : '';
        this.lastName2 = c !== undefined ? c.lastName2 : '';
        this.email = c !== undefined ? c.email : '';


        if(this.cellphone !== undefined){
            this.cellphone = c?.cellphone;
        }
    }
}
