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
        return await this.ovenRepository.query(`SELECT oven_products.id, oven_products.pcc, oven_products.new_lote, oven_products.date
        ,product.id,product.description FROM oven_products INNER JOIN products WHERE oven_products.id = product.id`);
    }

    async getOvenProductById(ovenProduct_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.ovenRepository.query(`SELECT * FROM oven_products WHERE id = ${ovenProduct_id}`)
    }
}