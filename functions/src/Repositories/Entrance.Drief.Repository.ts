import { Repository } from "typeorm";
import { EntranceDrief } from "../Models/Entity/Entrances.Drief";
import { connect } from "../Config/Db";

export class EntranceDriefRepository{
    private repository:Repository<EntranceDrief>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(EntranceDrief);
        }
    }

    async saveDrief(entranceDrief:EntranceDrief){
        await this.getConnection();
        return await this.repository.save(entranceDrief);
    }

    async getEntranceDrief(entranceDriefId:number){
        await this.getConnection();
        return await this.repository.findOne({id:entranceDriefId});
    }

    async deleteEntranceDrief(entranceDriefId:number){
        await this.getConnection();
        return await this.repository.delete({id:entranceDriefId});
    }

}