//import {UserController} from '../Controllers/User.Controller';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';

export class Initializer{
    //private userController:UserController;
    private firebaseInstance: FirebaseHelper;
    private entrancesMeatController:EntrancesMeatController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.entrancesMeatController = new EntrancesMeatController(this.firebaseInstance);
        //this.userController = new UserController(this.firebaseInstance);
    }

    getController(prototype:string){
        switch(prototype){
            case EntrancesMeatController.name:
                return this.entrancesMeatController;
                break;
            /*case CategoryController.name:
                return this.categoryController;
                break;
            case ProductSaleController.name:
                return this.productSaleController;
                break;
            case ProductController.name:
                return this.productController;
                break;
            case CondimentController.name:
                return this.condimentController;
                break;
            case QualifyController.name:
                return this.qualifyController;
                break;
            case QuestionController.name:
                return this.questionController;
                break;
            case OrderController.name:
                return this.orderController;
                break;
            case ExtraController.name:
                return this.extraController;
                break;*/
            default:
                return null;
                break;
        }
    }
}