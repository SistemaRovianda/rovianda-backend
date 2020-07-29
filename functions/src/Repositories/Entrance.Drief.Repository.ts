import { Repository, Between } from "typeorm";
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

    async getEntranceDriefById(id:number){
        await this.getConnection();
        return await this.repository.findOne({id}, {relations:["product"]});
    }

    async deleteEntranceDrief(entranceDriefId:number){
        await this.getConnection();
        return await this.repository.delete({id:entranceDriefId});
    }

    async getLastEntrnaceDrief(){
        await this.getConnection();
        return await this.repository.query(`SELECT * FROM entrances_drief ORDER BY id DESC LIMIT 1`)
    }

    async getEntrancesDriefs(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.find({
            where:{ date : Between(dateInit, dateEnd)},
            relations:["product"]
        });
    }

    async getEntrnaceDriefByLotProduct(loteProveedor:string, productId:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM entrances_drief WHERE lote_proveedor = "${loteProveedor}" AND productId = ${productId}
        `);
    }

}