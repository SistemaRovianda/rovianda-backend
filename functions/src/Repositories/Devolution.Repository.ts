import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { Devolution } from "../Models/Entity/Devolution";

export class DevolutionRepository{
    private repository:Repository<Devolution>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(Devolution);    
        }
    }

    async saveDevolution(devolution:Devolution){
        await this.getConnection();
        return await this.repository.save(devolution);
    }

    async getDevolutionById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id});
    }
}