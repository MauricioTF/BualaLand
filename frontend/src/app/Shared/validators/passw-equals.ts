import { FormGroup} from "@angular/forms";

export function notEqualsValidator(){

    return(fg: FormGroup) => {

        const passwN = fg.controls['passwN'];
        const passwR = fg.controls['passwR'];

        if(passwR.errors && !passwR.errors['notEqual']){

            return ;
        }

        if(passwN.value !== passwR.value){

            passwR.setErrors({notEquals : true});
        }else{

            passwR.setErrors(null);
        }
    }
}