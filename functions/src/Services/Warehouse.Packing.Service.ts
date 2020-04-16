import { WarehousePackingRepository } from "../Repositories/Warehouse.Packing.Repository";
import { WarehousePacking } from "../Models/Entity/Warehouse.Packing";

export class WarehousePackingService{
    private warehousePackingRepository:WarehousePackingRepository;
    constructor(){
        this.warehousePackingRepository = new WarehousePackingRepository();
    }
    
    async getWarehousePackingById(id:number){
        return await this.warehousePackingRepository.getWarehousePackingfById(id);
    }

    
    async getWarehousePackingByStatus(status:string){
        return await this.warehousePackingRepository.getWarehousePackingByStatus(status);
    }


        async saveWarehousePacking(warehousePacking:WarehousePacking){
            return await this.warehousePackingRepository.saveWarehousePacking(warehousePacking);
        }
    
}