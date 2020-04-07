import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinController } from '../Controllers/Pin.Controller';
import { FidgesController } from '../Controllers/Fidges.Controller';

export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private pinController:PinController;
    private fidgesController:FidgesController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fidgesController = new FidgesController(this.firebaseInstance);
    }

    getController(prototype:string){
        switch(prototype){
            case PinController.name:
                return this.pinController;
                break;
            case FidgesController.name:
                return this.fidgesController;
                break;    
            default:
                return null;
                break;
        }
    }
}