import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OvenProducts } from '../Models/Entity/Oven.Products';

export class OvenRepository{
    private ovenRepository:Repository<OvenProducts>;

    async getConnection(){
        if(!this.ovenRepository){
            this.ovenRepository = (await connect()).getRepository(OvenProducts);
        }
    }

    async getOvenProducts(){
            
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`
        SELECT oven_products.id, oven_products.pcc, 
        oven_products.new_lote, oven_products.date, 
        oven_products.product_id, product_catalog.description 
        FROM oven_products INNER JOIN product_catalog WHERE oven_products.product_id = product_catalog.id`);
    }

    async getOvenProductById(ovenProduct_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`SELECT * FROM oven_products WHERE id = ${ovenProduct_id}`)
    }

    async getOvenProductByProductId(product_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`SELECT * FROM oven_products WHERE product_id = ${product_id}`)
    }

    async getOvenProductByLot(newLote:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`SELECT * FROM oven_products WHERE new_lote = ${newLote}`)
    }

    async findOvenProductById(id: number){
        await this.getConnection();
        return await this.ovenRepository.createQueryBuilder()
        .where("id = :id",{id})
        .getOne();
    }

    async saveOvenProduct(ovenProduct: OvenProducts){
        await this.getConnection();
        return await this.ovenRepository.save(ovenProduct);
    }

    async getOvenProductsById(id:number){
        await this.getConnection();
        return await this.ovenRepository.query(`SELECT 
        oven_products.id, oven_products.pcc, oven_products.new_lote, oven_products.date, 
        oven_products.product_id, product.description, revisions_oven_products.hour, 
        revisions_oven_products.inter_temp, revisions_oven_products.oven_temp, 
        revisions_oven_products.humidity, 
        revisions_oven_products.observations 
        FROM oven_products 
        INNER JOIN revisions_oven_products ON revisions_oven_products.id = oven_products.id 
        INNER JOIN product ON product.id = oven_products.product_id 
        WHERE oven_products.id = ${id}`);
    }

    async getLastOven(){
        await this.getConnection();
        return await this.ovenRepository.query(`SELECT * FROM oven_products ORDER BY id DESC LIMIT 1`)
    }

    async saveOvenUser(ovenUser: OvenProducts){
        await this.getConnection();
        return await this.ovenRepository.save(ovenUser);
    }
}