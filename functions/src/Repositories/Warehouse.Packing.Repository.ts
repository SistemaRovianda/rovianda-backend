import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';

export class WarehousePackingRepository{
    private warehousePackingRepository:Repository<WarehousePacking>;

    async getConnection(){
        if(!this.warehousePackingRepository){
            this.warehousePackingRepository = (await connect()).getRepository(WarehousePacking);
        }
    }

    async getWarehousePackingfById(id:number){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({id})
    }

    async getWarehousePackingByLoteId(loteProveedor:string){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({loteProveedor:loteProveedor})
    }

    async getWarehousePackingByStatus(status:string){
        await this.getConnection();
        return await this.warehousePackingRepository.find({
            where: {status: `${status}`},
        });
    }

    async saveWarehousePacking(warehousepacking:WarehousePacking){
        
        await this.getConnection();
        return await this.warehousePackingRepository.save(warehousepacking);
    } 
}