import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Inspection } from '../Models/Entity/Inspection';
export class InspectionRepository{
    private inspectionRepository:Repository<Inspection>;

    async getConnection(){
        if(!this.inspectionRepository){
            this.inspectionRepository = (await connect()).getRepository(Inspection);
        }
    }

    async getInspectionById(id:number){
        await this.getConnection();
        return await this.inspectionRepository.findOne({
            where: {id}
        });
    }

    async getLastInspection(){
        await this.getConnection();
        return await this.inspectionRepository.query(`SELECT * FROM inspection ORDER BY id DESC LIMIT 1`)
    }

}