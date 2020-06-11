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


}