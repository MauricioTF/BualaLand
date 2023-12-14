export class user{

    idUser : string = '';
    name : string = '';
    rol : number = -1;
    idEmployee : string = '';
    totalPoints : number = -1;
    
    constructor (us? : user) {
        this.idUser = us !== undefined ? us.idUser : '';
        this.name = us !== undefined ? us.name : '';
        this.rol = us !== undefined ? us.rol : -1;
        this.idEmployee = us !== undefined ? us.idEmployee : '';
        this.totalPoints = us !== undefined ? us.totalPoints : -1;

    }
}