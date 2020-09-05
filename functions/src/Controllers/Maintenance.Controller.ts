import {Request,Response} from 'express';
import { Maintenance } from '../Models/Entity/Maintenance';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { MaintenanceService } from '../Services/Maintenance.Service';
import { StoreService } from '../Services/Store.Service';
import { DeviceService } from '../Services/Device.Service';
import { times } from 'lodash';
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

    async getMaintenanceById(req:Request,res:Response){
        let responser = await this.maintenanceService.getMaintenanceById(+req.params.id);
        return res.status(200).send(responser);
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
        let dateInit = req.query.dateInit;       
        let dateEnd = req.query.dateEnd
        let maintenance = await this.maintenanceService.getMaintenanceObject(dateInit,dateEnd);
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
        let dateEnd = req.query.dateEnd;
        let maintenance = await this.maintenanceService.getMaintenanceApparatus(dateInit,dateEnd);
        return res.status(200).send(maintenance);
    }

    async getMaintenanceApparatusByMounth(req:Request,res:Response){
        let mounth = req.params.mounth;
        let maintenance = await this.maintenanceService.getMaintenanceApparatusByMounth(mounth);
        return res.status(200).send(maintenance);
    }

    async getMaintenanceByWeek(req:Request,res:Response){
        let week = req.params.week;
        let maintenance = await this.maintenanceService.getMaintenanceByWeek(week);
        return res.status(200).send(maintenance);
    }

    async getStores(req:Request,res:Response){
        let response = await this.storeService.getStores();
        return res.status(200).send(response);
    }

    async getAllDevicesStore(req:Request,res:Response){
        let response = await this.maintenanceService.getAllDevicesStore();
        return res.status(200).send(response);
    }

    async getStoreMaintenance(req:Request,res:Response){
        let { dateInit,dateEnd } = req.body;
        let response = await this.maintenanceService.getStoreMaintenance(dateInit,dateEnd);
        return res.status(200).send(response);
    }
}


