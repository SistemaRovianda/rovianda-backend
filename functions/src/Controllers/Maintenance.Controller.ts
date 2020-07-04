import {Request,Response} from 'express';
import { Maintenance } from '../Models/Entity/Maintenance';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { MaintenanceService } from '../Services/Maintenance.Service';
import { StoreService } from '../Services/Store.Service';
import { DeviceService } from '../Services/Device.Service';
export class MaintenanceController{

    private maintenanceService:MaintenanceService;
    private storeService:StoreService;
    private deviceService:DeviceService
    constructor(private firebaseInstance:FirebaseHelper){
        this.maintenanceService = new MaintenanceService(this.firebaseInstance);
        this.storeService = new StoreService();
        this.deviceService = new DeviceService();
    }

    async getAllMaintenance(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getAllMaintenance();
        return res.status(200).send(maintenance);
    }
  
    async createMaintenance(req:Request,res:Response){
        await this.maintenanceService.createMaintenance(req.body);
        return res.status(201).send();
    }

    async saveStore(req:Request,res:Response){
        await this.storeService.saveStore(req.body);
        return res.status(201).send();
    }
  
    async getMaintenanceStore(req:Request,res:Response){
        let maintenance = await this.storeService.getMaintenanceStore();
        return res.status(200).send(maintenance);
    }
  
    async saveDevice(req:Request,res:Response){
        await this.deviceService.saveDevice(req.body);
        return res.status(201).send();
    }

    async getMaintenanceByStore(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getMaintenanceByStore(req.params.store);
        return res.status(200).send(maintenance);
    }

    async uppdateMaintenance(req:Request,res:Response){
        await this.maintenanceService.uppdateMaintenance(+req.params.id,req.body);
        return res.status(204).send();
    }

    async getMaintenanceByMounth(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getMaintenanceByMounth(req.params.mounth);
        return res.status(200).send(maintenance);
    }
    
    async getMaintenanceObject(req:Request,res:Response){
        console.log(req.query.dateInit,req.query.dateEnd);
        let maintenance = await this.maintenanceService.getMaintenanceObject();
        return res.status(200).send(maintenance);
    }

    async getMaintenanceMounth(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getMaintenanceMounth();
        return res.status(200).send(maintenance);
    }

    async getMaintenanceByObject(req:Request,res:Response){
        let object = req.params.object;
        let dateInit = req.query.dateInit;       
        let dateEnd = req.query.dateEnd
        let maintenance = await this.maintenanceService.getMaintenanceByObject(dateInit,dateEnd,object);
        return res.status(200).send(maintenance);
    }

    async getMaintenanceApparatus(req:Request,res:Response){
        let dateInit = req.query.dateInit;       
        let dateEnd = req.query.dateEnd
        let maintenance = await this.maintenanceService.getMaintenanceApparatus(dateInit,dateEnd);
        return res.status(200).send(maintenance);
    }
}


