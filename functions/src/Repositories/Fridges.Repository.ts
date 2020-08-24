import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Fridge } from '../Models/Entity/Fridges';
export class FridgeRepository{
    private fridgesRepository:Repository<Fridge>;

    async getConnection(){
        if(!this.fridgesRepository){
            this.fridgesRepository = (await connect()).getRepository(Fridge);
        }
    }

    async saveFridge(fridges:Fridge){
        await this.getConnection();
        return await this.fridgesRepository.save(fridges);
    }

    async getAllFridges(){
        await this.getConnection();
        return await this.fridgesRepository.find({status:"ACTIVE"});
    }

    async getFridgeById(id:number){
        await this.getConnection();
        return await this.fridgesRepository.query(`SELECT * FROM fridges WHERE fridge_id = ${id}`)
    }

    async getFridgeByIdFridge(id:number){
        await this.getConnection();
        return await this.fridgesRepository.findOne({fridgeId:id})
    }

    async getByTemp(temp:string){
        await this.getConnection();
        return await this.fridgesRepository.findOne({temp});
    }

    async deleteFridgeById(fridgeId:number){
        await this.getConnection();
        await this.fridgesRepository.delete({fridgeId});
    }
}