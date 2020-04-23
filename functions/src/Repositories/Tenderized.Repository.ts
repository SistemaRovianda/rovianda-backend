import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Tenderized } from '../Models/Entity/Tenderized';
export class TenderizedRepository{
    private tenderizedRepository:Repository<Tenderized>;

    async getConnection(){
        if(!this.tenderizedRepository){
            this.tenderizedRepository = (await connect()).getRepository(Tenderized);
        }
    }

    async createTenderized(tenderized:Tenderized){
        await this.getConnection();
        return await this.tenderizedRepository.save(tenderized);
    }

    async getTenderizedById(id:number){
        await this.getConnection();
        return await this.tenderizedRepository.findOne({id})
    }

    async getProductTenderized(processid:number){
        await this.getConnection();
        return await this.tenderizedRepository.query(`SELECT  
        tenderized.temperature,tenderized.weight,tenderized.weight_salmuera,
        tenderized.percent_inject ,tenderized.date,product.id,product.description,
        process.id FROM tenderized 
        INNER JOIN product ON tenderized.product_id = product.id
        INNER JOIN process ON tenderized.id = process.tenderized_id
        WHERE process.id= ${processid};`)
    }

    async getAllTenderized(){
        await this.getConnection();
        return await this.tenderizedRepository.find();
    }
}