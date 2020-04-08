import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinController } from '../Controllers/Pin.Controller';
import { FridgesController } from '../Controllers/Fridges.Controller';

export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private pinController:PinController;
    private fridgesController:FridgesController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fridgesController = new FridgesController(this.firebaseInstance);
    }

    getController(prototype:string){
        switch(prototype){
            case PinController.name:
                return this.pinController;
                break;
            case FridgesController.name:
                return this.fridgesController;
                break;    
            default:
                return null;
                break;
        }
    }
}