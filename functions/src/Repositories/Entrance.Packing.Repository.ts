import { Repository } from "typeorm";
import { connect } from "../Config/Db";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";

export class EntrancePackingRepository{
    private repository:Repository<EntrancePacking>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(EntrancePacking);
        }
    }

    async saveEntracenPacking(entranceDrief:EntrancePacking){
        await this.getConnection();
        return await this.repository.save(entranceDrief);
    }

    async getEntrancePacking(entrancePackingId:number){
        await this.getConnection();
        return await this.repository.findOne({id:entrancePackingId});
    }

    async deleteEntracePacking(entrancePackingId:number){
        await this.getConnection();
        return await this.repository.delete({id:entrancePackingId});
    }

    async getLastEntrnacePacking(){
        await this.getConnection();
        return await this.repository.query(`SELECT * FROM entrances_packing ORDER BY id DESC LIMIT 1`)
    }
}