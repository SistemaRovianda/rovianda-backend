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

    async getSausagedById(id:number){
        await this.getConnection();
        return await this.sausagedRepository.findOne({id})
    }

    async getLastSausaged(){
        await this.getConnection();
        return await this.sausagedRepository.query(`SELECT * FROM sausaged ORDER BY id DESC LIMIT 1`)
    }

    async getSausagedByProcess(processid:number){
        await this.getConnection();
        return await this.sausagedRepository.query(`SELECT 
        sausaged.id, sausaged.product_id, sausaged.date, sausaged.temperature, 
        sausaged.weight_ini, sausaged.hour1, sausaged.weight_medium, sausaged.hour2, 
        sausaged.weight_exit, sausaged.hour3, product_catalog.description 
        FROM sausaged 
        INNER JOIN product_catalog ON sausaged.product_id = product_catalog.id
        INNER JOIN process ON sausaged.id = process.sausage_id
        WHERE process.id= ${processid};`)
    }
}