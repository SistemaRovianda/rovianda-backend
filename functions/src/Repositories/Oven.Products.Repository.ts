import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OvenProducts } from '../Models/Entity/Oven.Products';
export class OvenProductsRepository{
    private ovenProductsRepository:Repository<OvenProducts>;

    async getConnection(){
        if(!this.ovenProductsRepository){
            this.ovenProductsRepository = (await connect()).getRepository(OvenProducts);
        }
    }

    async getOvenProductsById(id:number){
        await this.getConnection();
        return await this.ovenProductsRepository.findOne({
            where: {id},
            relations:["productId"]
        });
    }

}