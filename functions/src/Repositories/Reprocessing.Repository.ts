import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Reprocessing } from '../Models/Entity/Reprocessing';


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

    async getByArea(area:string){
        await this.getConnection();
        return await this.reprocessingRepository.find({area});
    }

    async getReprocessingById(id:number){
        await this.getConnection();
        return await this.reprocessingRepository.findOne({id})
    }

    async getReprocessingByLotRepro(lotRepro:string){
        await this.getConnection();
        return await this.reprocessingRepository.find({lotRepro})
    }


}