import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";

export class WarehouseDriefService{
    private warehouseDriefRepository:WarehouseDriefRepository;
    constructor(){
        this.warehouseDriefRepository = new WarehouseDriefRepository();
    }

    async createWarehouseDrief(warehouseDrief:WarehouseDrief){
        return await this.warehouseDriefRepository.createWarehouseDrief(warehouseDrief);
    }
    
    async getWarehouseDriefRepositoryById(id:number){
        return await this.warehouseDriefRepository.getWarehouseDriefById(id);
    }

    
    async getWarehouseDriefRepositoryByStatus(status:string){
        return await this.warehouseDriefRepository.getWarehouseDriefByStatus(status);
    }
}