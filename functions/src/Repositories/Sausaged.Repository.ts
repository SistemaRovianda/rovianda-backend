import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Sausaged } from '../Models/Entity/Sausaged';
export class SausagedRepository{
    private sausagedRepository:Repository<Sausaged>;

    async getConnection(){
        if(!this.sausagedRepository){
            this.sausagedRepository = (await connect()).getRepository(Sausaged);
        }
    }

    async saveSausaged(sausaged:Sausaged){
        await this.getConnection();
        return await this.sausagedRepository.save(sausaged);
    }

    async getLastSausaged(){
        await this.getConnection();
        return await this.sausagedRepository.query(`SELECT * FROM sausaged ORDER BY id DESC LIMIT 1`)
    }

}