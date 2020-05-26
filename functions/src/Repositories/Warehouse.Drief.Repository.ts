import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
export class WarehouseDriefRepository{
    private warehouseDriefRepository:Repository<WarehouseDrief>;

    async getConnection(){
        if(!this.warehouseDriefRepository){
            this.warehouseDriefRepository = (await connect()).getRepository(WarehouseDrief);
        }
    }

    async saveWarehouseDrief(warehouseDrief:WarehouseDrief){
        await this.getConnection();
        return await this.warehouseDriefRepository.save(warehouseDrief);
    }

    async getWarehouseDriefById(id:number){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({id})
    }

    async getWarehouseDriefByLoteId(loteProveedor:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({
            where: {id:loteProveedor}
        });
    }

    async getWarehouseDriefByStatus(status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.find({
            where: {status: `${status}`},
        });
    }

    async getWarehouseDriefByStatusGroup(status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`SELECT distinct(lote_proveedor) FROM warehouse_drief WHERE status = "${status}"`);
    }

    async getWarehouseDriefByLoteProveedor(loteProveedor:string, status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`
        SELECT warehouse_drief.lote_proveedor, warehouse_drief.productId, product_catalog.description 
        FROM warehouse_drief 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_drief.productId 
        WHERE lote_proveedor = "${loteProveedor}" 
        AND status = "${status}"`);
    }
}