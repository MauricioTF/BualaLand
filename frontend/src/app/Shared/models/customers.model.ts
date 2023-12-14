export class customersModel {

    idCustomers:string;
    idEmployee : string;
    name? : string ;
    lastName1? : string ;
    lastName2? :string;
    email? : string;
    cellphone? : number;
    cutsAmount? : number;
    points? : number;
    totalPoints? : number;    
    // ? es para decir que es opcional

    constructor(c? : customersModel){

        this.idCustomers = c !== undefined ? c.idCustomers : '';
        this.idEmployee = c !== undefined ? c.idEmployee : '';
        this.name = c !== undefined ? c.name : '';
        this.lastName1 = c !== undefined ? c.lastName1 : '';
        this.lastName2 = c !== undefined ? c.lastName2 : '';
        this.email = c !== undefined ? c.email : '';


        if(this.cellphone !== undefined){
            this.cellphone = c?.cellphone;
        }
        if(this.cutsAmount !== undefined){
            this.cutsAmount = c?.cutsAmount;
        }
        if(this.points !== undefined){
            this.points = c?.points;
        }
        if(this.totalPoints !== undefined){
            this.totalPoints = c?.totalPoints;
        }
 
    }
}
