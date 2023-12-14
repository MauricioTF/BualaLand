export class DateCutModel {

    idDate:string;
    idCustomers:string;
    idEmployee : string;
    dateCut? : number ;
    timeCut? : number ;
    stateDate? :number;
    cutFree? : number;
    amount ?: number;
    
    // ? es para decir que es opcional

    constructor(c? : DateCutModel){

        this.idDate = c !== undefined ? c.idDate : '';
        this.idCustomers = c !== undefined ? c.idCustomers : '';
        this.idEmployee = c !== undefined ? c.idEmployee : '';

        if(this.dateCut !== undefined){
            this.dateCut = c?.dateCut;
        }
        if(this.timeCut !== undefined){
            this.timeCut = c?.timeCut;
        }
        if(this.stateDate !== undefined){
            this.stateDate = c?.stateDate;
        }
        if(this.cutFree !== undefined){
            this.cutFree = c?.cutFree;
        }
        if(this.amount !== undefined){
            this.amount = c?.amount;
        }
    }
}
