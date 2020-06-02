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

    async getConditioningById( id:number){
        await this.getConnection();
        return await this.conditioningRepository.findOne({id});
    }

    async getAllConditioning(){
        await this.getConnection();
        console.log("consulta")
        return await this.conditioningRepository.find();
    }

    async getLastConditioning(){
        await this.getConnection();
        console.log("consulta")
        return await this.conditioningRepository.findOne({ 
            order : {  
                id:"DESC" 
                } 
        });
    }

    async getConditioningByProductId( id:number){
        await this.getConnection();
        return await this.conditioningRepository.findOne({
            where: {productId: `${id}`},
        });
    }
}