import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Fridges } from '../Models/Entity/Fridges';
export class FridgesRepository{
    private fridgesRepository:Repository<Fridges>;

    async getConnection(){
        if(!this.fridgesRepository){
            this.fridgesRepository = (await connect()).getRepository(Fridges);
        }
    }

    async saveFridges(fridges:Fridges){
        await this.getConnection();
        return await this.fridgesRepository.save(fridges);
    }

    async getAllFridges(){
        await this.getConnection();
        return await this.fridgesRepository.find();
    }

    async getFridgesById(id:number){
        await this.getConnection();
        return await this.fridgesRepository.query(`SELECT * FROM fridges WHERE fridge_id = ${id}`)
    }
}