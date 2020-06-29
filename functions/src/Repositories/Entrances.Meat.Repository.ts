import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';

export class EntranceMeatRepository{
    private entrancesMeatRepository:Repository<EntranceMeat>;

    async getConnection(){
        if(!this.entrancesMeatRepository){
            this.entrancesMeatRepository = (await connect()).getRepository(EntranceMeat);
        }
    }

    async saveEntrancesMeat(entranceMeat:EntranceMeat){
        await this.getConnection();
        return await this.entrancesMeatRepository.save(entranceMeat);
    }

    async getLastEntrnaceMeat(){
        await this.getConnection();
        return await this.entrancesMeatRepository.query(`SELECT * FROM entrances_meat ORDER BY id DESC LIMIT 1`)
    }
    
}
