import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { Defrost } from '../Models/Entity/Defrost';


export class ReprocessingRepository{
    private reprocessingRepository:Repository<Reprocessing>;

    async getConnection(){
        if(!this.reprocessingRepository){
            this.reprocessingRepository = (await connect()).getRepository(Reprocessing);
        }
    }
    async saveRepocessing(reprocessing:Reprocessing){
        await this.getConnection();
        return await this.reprocessingRepository.save(reprocessing);
    }


    async getReprocessingById(id:number){
        await this.getConnection();
        return await this.reprocessingRepository.findOne({id})
    }

    async getByDefrost(defrost:Defrost){
        await this.getConnection();
        return await this.reprocessingRepository.find({defrost});
    }

    async getAllReprocesingActive(){
        await this.getConnection();
        return await this.reprocessingRepository.find({active:true});
    }



}