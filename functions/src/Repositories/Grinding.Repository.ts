import { Repository } from "typeorm";
import { Grinding } from "../Models/Entity/Grinding";
import { connect } from "../Config/Db";

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
}