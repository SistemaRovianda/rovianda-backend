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

    async getConditioningById(conditioning_id:number){
        await this.getConnection();
        return await this.conditioningRepository.query(`SELECT * FROM conditioning WHERE id = ${conditioning_id}`)
    }

    async getAllConditioning(){
        await this.getConnection();
        console.log("consulta")
        return await this.conditioningRepository.find();
    }
}