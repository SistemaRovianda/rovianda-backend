import {Request,Response} from 'express';
import { Maintenance } from '../Models/Entity/Maintenance';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { MaintenanceService } from '../Services/Maintenance.Service';
export class MaintenanceController{

    private maintenanceService:MaintenanceService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.maintenanceService = new MaintenanceService();
    }

    async getAllMaintenance(req:Request,res:Response){
        let maintenance = await this.maintenanceService.getAllMaintenance();
        return res.status(200).send(maintenance);

    }

    async createMaintenance(req:Request,res:Response){
        await this.maintenanceService.createMaintenance(req.body);
        return res.status(201).send();
    }
}