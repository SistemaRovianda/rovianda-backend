
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PinController } from '../Controllers/Pin.Controller';
import { FridgesController } from '../Controllers/Fridges.Controller';
import { EntrancesMeatController } from '../Controllers/Entrances.Meat.Controller';
import { LotController } from '../Controllers/Lot.Controller';
import { ProductController } from '../Controllers/Product.Controller';
import { EntrancesPackingController } from '../Controllers/Entrances.Packing.Controller';
import { ConditioningController } from '../Controllers/Conditioning.Controller';
import { TenderizedController } from '../Controllers/Tenderized.Controller';
import { GrindingController } from '../Controllers/Grinding.Controller';
import { SausagedController } from '../Controllers/Sausaged.Controller';
import { UserController } from '../Controllers/User.Controller'
import { ProcessController } from '../Controllers/Process.Controller';
import { OvenController } from '../Controllers/Oven.Controller';


export class Initializer{
    private firebaseInstance: FirebaseHelper;
    private pinController:PinController;
    private fridgesController:FridgesController;
    private entrancesMeatController:EntrancesMeatController;
    private lotController:LotController;
    private productController:ProductController;
    private warehouseController:EntrancesPackingController;
    
    private conditioningController:ConditioningController;
    private tenderizedController:TenderizedController;
    private grindingController:GrindingController;
    private sausagedController:SausagedController;
    private userController: UserController;
    private processController:ProcessController;
    private ovenController: OvenController;

    constructor(){
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fridgesController = new FridgesController(this.firebaseInstance);
        this.entrancesMeatController = new EntrancesMeatController(this.firebaseInstance);
        this.lotController = new LotController(this.firebaseInstance);
        this.productController= new ProductController()
        this.warehouseController= new EntrancesPackingController();
        this.conditioningController = new ConditioningController(this.firebaseInstance);
        this.tenderizedController = new TenderizedController(this.firebaseInstance);
        this.grindingController = new GrindingController(this.firebaseInstance);
        this.sausagedController = new SausagedController(this.firebaseInstance);
        this.userController = new UserController (this.firebaseInstance);
        this.processController = new ProcessController(this.firebaseInstance);
        this.ovenController = new OvenController(this.firebaseInstance);
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
            case EntrancesPackingController.name:
                return this.warehouseController;
                break;
            case ConditioningController.name:
                return this.conditioningController;
                break;
            case TenderizedController.name:
                return this.tenderizedController;
                break;
            case GrindingController.name:
                return this.grindingController;
                break;
            case SausagedController.name:
                return this.sausagedController;
                break;
            case UserController.name:
                return this.userController;
                break;
            case ProcessController.name:
                return this.processController;
                break;
            case OvenController.name:
                return this.ovenController;
                break;
            default:
                return null;
                break;
        }
    }

    getMiddlewareFirebase(){
        return this.firebaseInstance;
    }
}