import {connect} from '../Config/Db';
import { Repository, Between } from 'typeorm';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { Product } from '../Models/Entity/Product';
import { response } from 'express';
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

    async getAllWarehouseDrief(){
        await this.getConnection();
        return await this.warehouseDriefRepository.find();
    }

    async getWarehouseDriefById(lotId:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({
            where: {loteProveedor :lotId},
            relations: ["outputDriefs"]
        })
    }

    async getWarehouseDriefByIds(id:number){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({id})
    }

    async getWarehouseDriefByLoteId(loteProveedor:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({
            where: {loteProveedor:loteProveedor}
        });
    }
    async getWarehouseDriefByLoteIdAndProductId(loteProveedor:string,productId:number){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`SELECT * from warehouse_drief where lote_proveedor="${loteProveedor}" and productId=${productId}`);
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

    async getWarehouseDriefByStatusGroupProduct(status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`
        SELECT distinct(warehouse_drief.productId), product_catalog.description 
        FROM warehouse_drief 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_drief.productId
        WHERE status = "${status}"
        `);
    }

    async getWarehouseDriefByLoteProveedor(loteProveedor:string, status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`
        SELECT warehouse_drief.id, warehouse_drief.quantity, warehouse_drief.lote_proveedor, warehouse_drief.productId, product_catalog.description 
        FROM warehouse_drief 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_drief.productId 
        WHERE lote_proveedor = "${loteProveedor}" 
        AND status = "${status}"`);
    }

    async getWarehouseDriefByPrductStatus(productId:number, status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`
        SELECT warehouse_drief.id, warehouse_drief.quantity, warehouse_drief.lote_proveedor, warehouse_drief.productId, product_catalog.description 
        FROM warehouse_drief 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_drief.productId 
        WHERE productId = ${productId} 
        AND status = "${status}"`);
    }

    async getByProductIdAndStatus(productId:number,status:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.query(`
        SELECT * FROM warehouse_drief 
        WHERE warehouse_drief.productId = ${productId} 
        AND warehouse_drief.status = "${status}"
        `);
    }

    async getWarehouseDriefReport(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.find({
            where:{ date : Between(dateInit, dateEnd)},
            relations: ["product"]
        });
/*         
        query(`
        SELECT warehouse_drief.* ,product_catalog.description FROM warehouse_drief
        INNER JOIN product_catalog ON warehouse_drief.productId = product_catalog.id 
        WHERE warehouse_drief.date BETWEEN '${dateInit}' AND '${dateEnd}'
        ORDER BY warehouse_drief.date;`); */
    }

    async getByLoteProveedor(loteProveedor:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({loteProveedor})
    }

    async findLotsByProduct(product:Product){
        await this.getConnection();
        return await this.warehouseDriefRepository.find({product});
    }

    async findWarehouseDriefByProductLot(product:Product,loteProveedor:string){
        await this.getConnection();
        return await this.warehouseDriefRepository.findOne({product,loteProveedor});
    }
}