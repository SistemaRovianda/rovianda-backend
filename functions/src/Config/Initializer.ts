
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
import { FormulationController } from '../Controllers/Formulation.Controller';
import { PackagingController } from '../Controllers/Packaging.Controller';
import { EntranceDriefController } from '../Controllers/Entrances.Drief.Controller';
import { DryngLabelController } from '../Controllers/Dryng.Label.Controller';
import { InspectionController } from '../Controllers/Inspection.Controller';
import { SalesRequestController } from '../Controllers/Sales.Controller';
import { RawController } from '../Controllers/Raw.Controller';
import { MaintenanceController } from '../Controllers/Maintenance.Controller';
import { ReportController } from '../Controllers/Report.Controller';
import { ClientController } from '../Controllers/Client.Controller';
import { WarehouseController } from '../Controllers/Warehouse.Controller';
import { CatalogsController } from '../Controllers/Catalogs.Controller';

export class Initializer {
    private firebaseInstance: FirebaseHelper;
    private pinController: PinController;
    private fridgesController: FridgesController;
    private entrancesMeatController: EntrancesMeatController;
    private lotController: LotController;
    private productController: ProductController;
    private warehouseController: EntrancesPackingController;
    private conditioningController: ConditioningController;
    private tenderizedController: TenderizedController;
    private grindingController: GrindingController;
    private sausagedController: SausagedController;
    private userController: UserController;
    private ovenController: OvenController;
    private processController: ProcessController;
    private formulationController: FormulationController;
    private packagingController: PackagingController;
    private entranceDriefController: EntranceDriefController;
    private dryngLabelController: DryngLabelController;
    private inspectionController: InspectionController;
    private salesRequestController: SalesRequestController;
    private rawController: RawController;
    private maintenanceController:MaintenanceController;
    private reportController:ReportController;
    private clientController: ClientController;
    private warehouseSQLSController:WarehouseController;
    private catalogsController: CatalogsController;
    constructor() {
        this.firebaseInstance = new FirebaseHelper();
        this.pinController = new PinController(this.firebaseInstance);
        this.fridgesController = new FridgesController(this.firebaseInstance);
        this.entrancesMeatController = new EntrancesMeatController(this.firebaseInstance);
        this.lotController = new LotController(this.firebaseInstance);
        this.productController = new ProductController(this.firebaseInstance)
        this.warehouseController = new EntrancesPackingController();
        this.conditioningController = new ConditioningController(this.firebaseInstance);
        this.tenderizedController = new TenderizedController(this.firebaseInstance);
        this.grindingController = new GrindingController(this.firebaseInstance);
        this.sausagedController = new SausagedController(this.firebaseInstance);
        this.userController = new UserController(this.firebaseInstance);
        this.processController = new ProcessController(this.firebaseInstance);
        this.ovenController = new OvenController(this.firebaseInstance);
        this.formulationController = new FormulationController(this.firebaseInstance);
        this.packagingController = new PackagingController(this.firebaseInstance);
        this.entranceDriefController = new EntranceDriefController(this.firebaseInstance);
        this.dryngLabelController = new DryngLabelController();
        this.inspectionController = new InspectionController(this.firebaseInstance);
        this.salesRequestController = new SalesRequestController(this.firebaseInstance);
        this.rawController = new RawController(this.firebaseInstance);
        this.clientController = new ClientController(this.firebaseInstance);
        this.maintenanceController = new MaintenanceController(this.firebaseInstance);
        this.reportController = new ReportController(this.firebaseInstance);
        this.warehouseSQLSController = new WarehouseController();
        this.catalogsController = new CatalogsController();
    }

    getController(prototype: string) {
        switch (prototype) {
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
            case FormulationController.name:
                return this.formulationController;
                break;
            case PackagingController.name:
                return this.packagingController;
                break;
            case EntranceDriefController.name:
                return this.entranceDriefController;
            case DryngLabelController.name:
                return this.dryngLabelController;
                break;
            case InspectionController.name:
                return this.inspectionController;
                break;
            case SalesRequestController.name:
                return this.salesRequestController;
                break;
            case RawController.name:
                return this.rawController;
                break;
            case MaintenanceController.name:
                return this.maintenanceController;
                break;
            case ReportController.name:
                return this.reportController;
                break;
            case ClientController.name:
                return this.clientController;
                break;
            case WarehouseController.name:
                return this.warehouseSQLSController;
                break;
            case CatalogsController.name:
                return this.catalogsController;
                break;
            default:
                return null;
                break;
        }
    }

    getMiddlewareFirebase() {
        return this.firebaseInstance;
    }
}