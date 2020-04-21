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
}