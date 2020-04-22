import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Conditioning } from '../Models/Entity/Conditioning';
export class ConditioningRepository{
    private conditioningRepository:Repository<Conditioning>;

    async getConnection(){
        if(!this.conditioningRepository){
            this.conditioningRepository = (await connect()).getRepository(Conditioning);
        }
    }

    async createConditioning(conditioning:Conditioning){
        await this.getConnection();
        return await this.conditioningRepository.save(conditioning);
    }

    async getProductConditioning(processid:number){
        await this.getConnection();
        return await this.conditioningRepository.query(`SELECT  
        conditioning.raw, conditioning.bone, conditioning.clean, 
        conditioning.healthing,conditioning.weight,conditioning.temperature,
        product.id,product.description,process.id FROM conditioning 
        INNER JOIN product ON conditioning.product_id = product.id
        INNER JOIN process ON conditioning.id = process.conditioning_id
        WHERE process.id= ${processid};`)
    }

}