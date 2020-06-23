import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Raw } from '../Models/Entity/Raw';


export class RawRepository{
    private rawRepository:Repository<Raw>;

    async getConnection(){
        if(!this.rawRepository){
            this.rawRepository = (await connect()).getRepository(Raw);
        }
    }
    async saveRaw(raw:Raw){
        await this.getConnection();
        return await this.rawRepository.save(raw);
    }

    async getAllRaw(){
        await this.getConnection();
        return await this.rawRepository.find();
    }
    
    async getById(id:number){
        await this.getConnection();
        return await this.rawRepository.findOne({id});
    }

    async getByName(rawMaterial:string){
        await this.getConnection();
        return await this.rawRepository.findOne({rawMaterial});
    }

    async getLastRaw(){
        await this.getConnection();
        return await this.rawRepository.query(`SELECT * FROM raw ORDER BY id DESC LIMIT 1`)
    }


}