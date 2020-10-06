import { getSqlServerCon } from "../Config/SqlS";
import { WarehouseForm } from "../Models/DTO/Warehouse.DTO";
import { SqlSRepository } from "../Repositories/SqlS.Repositoy";
import { validateWarehouse } from "../Utils/Validators/Warehouse.Validator";

export class WarehouseService{
    private sqlSRepository:SqlSRepository;
   constructor(){
       this.sqlSRepository = new SqlSRepository();
   }

    async createWarehouse(warehouseForm:WarehouseForm){
        validateWarehouse(warehouseForm);
        await this.sqlSRepository.createWarehouse(warehouseForm);
    }

    async getAllWarehouse(){
        return await this.sqlSRepository.getAllWarehouses();
    }

}