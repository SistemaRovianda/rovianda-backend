import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";

export class WarehouseDriefService{
    private warehouseDriefRepository:WarehouseDriefRepository;
    constructor(){
        this.warehouseDriefRepository = new WarehouseDriefRepository();
    }
    
    async getWarehouseDriefRepositoryById(id:number){
        return await this.warehouseDriefRepository.getWarehouseDriefById(id);
    }

    
    async getWarehouseDriefRepositoryByStatus(status:string){
        return await this.warehouseDriefRepository.getWarehouseDriefByStatus(status);
    }
}