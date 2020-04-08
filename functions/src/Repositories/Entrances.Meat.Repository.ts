import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Entrances_Meat } from '../Models/Entity/Entrances.Meat';

export class EntrancesMeatRepository{
    private entrances_meat_Repository:Repository<Entrances_Meat>;

    async getConnection(){
        if(!this.entrances_meat_Repository){
            this.entrances_meat_Repository = (await connect()).getRepository(Entrances_Meat);
        }
    }

    async saveEntrancesMeat(entrances_meat:Entrances_Meat){
        await this.getConnection();
        return await this.entrances_meat_Repository.save(entrances_meat);
    }
}
