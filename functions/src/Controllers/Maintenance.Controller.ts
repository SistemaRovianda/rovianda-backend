import {Request,Response} from 'express';
import { Maintenance } from '../Models/Entity/Maintenance';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { MaintenanceService } from '../Services/Maintenance.Service';
import { StoreService } from '../Services/Store.Service';
export class MaintenanceController{

    private maintenanceService:MaintenanceService;
    private storeService:StoreService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.maintenanceService = new MaintenanceService();
        this.storeService = new StoreService();
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

    async getMaintenanceMounth(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getMaintenanceMounth();
        return res.status(200).send(maintenance);
    }
  
}