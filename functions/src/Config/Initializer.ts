import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { ProductController } from '../Controllers/Product.Controller';

export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private entrancesMeatController:EntrancesMeatController;
    private productController:ProductController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
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
            default:
                return null;
                break;
        }
    }
}