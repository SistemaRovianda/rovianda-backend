
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinController } from '../Controllers/Pin.Controller';
import { FridgesController } from '../Controllers/Fridges.Controller';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { LotController } from '../Controllers/Lot.Controller';
import { ProductController } from '../Controllers/Product.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';
import { DriefController } from '../Controllers/Drief.Controller';
import { ProcessController } from '../Controllers/Process.Controller';

export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private pinController:PinController;
    private fridgesController:FridgesController;
    private entrancesMeatController:EntrancesMeatController;
    private lotController:LotController;
    private productController:ProductController;
    private warehouseController:EntrancesPackingController;
    private driefController:DriefController;
    private processController:ProcessController;
    
    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fridgesController = new FridgesController(this.firebaseInstance);
        this.entrancesMeatController = new EntrancesMeatController(this.firebaseInstance);
        this.lotController = new LotController(this.firebaseInstance);
        this.productController= new ProductController(this.firebaseInstance)
        this.warehouseController= new EntrancesPackingController(this.firebaseInstance)
        this.driefController = new DriefController(this.firebaseInstance);
        this.processController = new ProcessController(this.firebaseInstance);
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
            case LotController.name:
                return this.lotController;
                break;
            case DriefController.name:
                return this.driefController;
                break;
            case EntrancesPackingController.name:
                return this.warehouseController;
                break;
            case ProcessController.name:
                return this.processController;
                break;
            default:
                return null;
                break;
        }
    }
}