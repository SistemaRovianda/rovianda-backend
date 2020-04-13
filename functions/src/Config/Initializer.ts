
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinController } from '../Controllers/Pin.Controller';
import { FridgesController } from '../Controllers/Fridges.Controller';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { ProductController } from '../Controllers/Product.Controller';

export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private pinController:PinController;
    private fridgesController:FridgesController;
    private entrancesMeatController:EntrancesMeatController;
    private productController:ProductController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fridgesController = new FridgesController(this.firebaseInstance);
        this.entrancesMeatController = new EntrancesMeatController(this.firebaseInstance);
        this.productController= new ProductController(this.firebaseInstance)
    }

    getController(prototype:string){
        switch(prototype){
            case EntrancesMeatController.name:
                return this.entrancesMeatController;
                break;
            case ProductController.name:
                return this.productController;
                break;
            case PinController.name:
                return this.pinController;
                break;
            case FridgesController.name:
                return this.fridgesController;
                break;
            case EntrancesMeatController.name:
                return this.entrancesMeatController;
                break;
            default:
                return null;
                break;
        }
    }
}