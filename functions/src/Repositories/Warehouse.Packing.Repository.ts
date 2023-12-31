import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { WarehousePacking } from '../Models/Entity/Warehouse.Packing';
import { Product } from '../Models/Entity/Product';

export class WarehousePackingRepository{
    private warehousePackingRepository:Repository<WarehousePacking>;

    async getConnection(){
        if(!this.warehousePackingRepository){
            this.warehousePackingRepository = (await connect()).getRepository(WarehousePacking);
        }
    }

    async getWarehousePackingfById(lotId:string){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({
            where: {loteProveedor :lotId},
            relations:["outputsPacking"]
        });
    }

    async getWarehousePackingfByLote(lotId:string){
        await this.getConnection();
        return await this.warehousePackingRepository.find({
            where: {loteProveedor :lotId},
            relations:["outputsPacking","product"]
        });
    }

    async getWarehousePackingByLoteId(loteProveedor:string){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({loteProveedor:loteProveedor})
    }

    async getWarehousePackingByLoteIdAndProductId(loteProveedor:string,productId:number){
        await this.getConnection();
        return await this.warehousePackingRepository.query(`SELECT * from warehouse_packing where lote_proveedor="${loteProveedor}" and productId=${productId}`);
    }
    // async getWarehousePackingByStatus(status:string){
    //     await this.getConnection();
    //     return await this.warehousePackingRepository.query(`SELECT lote_proveedor, productId FROM warehouse_packing WHERE status = "${status}" GROUP BY lote_proveedor`);
    // }

    async getWarehousePackingByStatusGroup(status:string){
        await this.getConnection();
        return await this.warehousePackingRepository.query(`SELECT distinct(lote_proveedor) FROM warehouse_packing WHERE status = "${status}"`);
    }

    async getWarehousePackingByStatusGroupProduct(status:string){
        await this.getConnection();
        return await this.warehousePackingRepository.query(`
        SELECT distinct(warehouse_packing.productId), product_catalog.description 
        FROM warehouse_packing 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_packing.productId
        WHERE status = "${status}"
        `);
    }

    async getWarehousePackingByLoteProveedor(loteProveedor:string, status:string){
        await this.getConnection();
        return await this.warehousePackingRepository.query(`
        SELECT warehouse_packing.lote_proveedor, warehouse_packing.productId, product_catalog.description, 
        warehouse_packing.id, warehouse_packing.quantity
        FROM warehouse_packing 
        INNER JOIN product_catalog  ON product_catalog.id = warehouse_packing.productId 
        WHERE lote_proveedor = "${loteProveedor}" 
        AND status = "${status}"`);
    }

    async saveWarehousePacking(warehousepacking:WarehousePacking){
        
        await this.getConnection();
        return await this.warehousePackingRepository.save(warehousepacking);
    } 

    async findLotsPackingByProduct(product:Product,status:string){
        await this.getConnection();  
        return await this.warehousePackingRepository.find({product,status}); // servicio para obtener productos abiertos de un almacen
    }

    async findWarehousePackingById(id:number){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({id});
    }

    async findWarehousePackingByIdAndStatus(id:number,status:string){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({id,status});
    }

    async findWarehousePackingByProductLot(product:Product,loteProveedor:string){
        await this.getConnection();
        return await this.warehousePackingRepository.findOne({product,loteProveedor});
    }
}