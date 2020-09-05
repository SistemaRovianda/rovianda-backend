import { Repository, Between } from "typeorm";
import { connect } from "../Config/Db";
import { EntrancePacking } from "../Models/Entity/Entrances.Packing";
import { times } from "lodash";
import { Product } from "../Models/Entity/Product";

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

    async getBypakingId(id:number){
        await this.getConnection();
        return await this.repository.findOne(
            {id},
            {relations: ["product","make"]}
        );
    }

    async getEntrysPacking(dateInit:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.find({
            order : { date:"ASC" },
            where:{ date : Between(dateInit, dateEnd)},
            relations: ["product","verifit","make"]
    });
    }

    async getEntrnacePackingByLotProduct(loteProveedor:string, productId:number){
        await this.getConnection();
        return await this.repository.query(`
        SELECT * FROM entrances_packing WHERE lote_proveedor = "${loteProveedor}" AND productId = ${productId}
        `);
    }

    async getEntrnacePackingByLotProveedorProduct(loteProveedor:string,product:Product){
        await this.getConnection()
        return await this.repository.findOne(
            {loteProveedor,product},
            {relations:["product"]});
    }
}