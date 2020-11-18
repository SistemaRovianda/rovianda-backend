import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Cheese } from "../Models/Entity/Cheese";

export class CheeseRepository{

    private cheeseRepository:Repository<Cheese>;
    
    async getConnection(){
        if(!this.cheeseRepository){
            this.cheeseRepository = (await connect()).getRepository(Cheese);
        }
    }

    async saveCheese(cheese:Cheese){
        await this.getConnection();
        return await this.cheeseRepository.save(cheese);
    }
    async getAllCheeses(){
        await this.getConnection();
        return await this.cheeseRepository.find();
    }
    async getCheeseByCode(code:string){
        await this.getConnection();
        return await this.cheeseRepository.findOne({code});
    }

}