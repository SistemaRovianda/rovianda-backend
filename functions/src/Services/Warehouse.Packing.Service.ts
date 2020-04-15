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

    async saveWarehousePacking(entrances_packing:WarehousePacking){

        if(!entrances_packing.date) throw new Error("[400],Falta la propiedad date");
        if(!entrances_packing.is_pz) throw new Error("[400],Falta la propiedad is_pz");
        if(!entrances_packing.lote_proveedor) throw new Error("[400],Falta la propiedad lote_proveedor");
        if(!entrances_packing.observations) throw new Error("[400],Falta la propiedad observations");
        if(!entrances_packing.closing_date) throw new Error("[400],Falta la propiedad closing_date");
        if(!entrances_packing.opening_date) throw new Error("[400],Falta la propiedad opening_date");
        if(!entrances_packing.quantity) throw new Error("[400],Falta la propiedad quantity");
        if(!entrances_packing.status) throw new Error("[400],Falta la propiedad status");
        if(!entrances_packing.user_id) throw new Error("[400],Falta la propiedad user_id");
                
        return await this.warehousePackingRepository.saveWarehousePacking(entrances_packing);
    }
}