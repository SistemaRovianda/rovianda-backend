import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Grinding } from '../Models/Entity/Grinding';
export class GrindingRepository{
    private grindingRepository:Repository<Grinding>;

    async getConnection(){
        if(!this.grindingRepository){
            this.grindingRepository = (await connect()).getRepository(Grinding);
        }
    }

    async getGrindingById(id:number){
        await this.getConnection();
        return await this.grindingRepository.findOne({
            where: {id}
        });
    }
    async saveGrinding(grinding:Grinding){
        await this.getConnection();
        return await this.grindingRepository.save(grinding);
    }

    async getLastGrinding(){
        await this.getConnection();
        return await this.grindingRepository.query(`SELECT * FROM grinding ORDER BY id DESC LIMIT 1`)
    }

}