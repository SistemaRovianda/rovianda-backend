import { Repository } from "typeorm";
import { Debts } from "../Models/Entity/Debts";
import { connect } from "../Config/Db";
import { Client } from "../Models/Entity/Client";

export class DebtsRepository{
    private debtsRepository:Repository<Debts>;
    async getConnection(){
        if(!this.debtsRepository){
            this.debtsRepository = (await connect()).getRepository(Debts);
        }
    }

    async saveDebts(deb:Debts){
        await this.getConnection();
        return await this.debtsRepository.save(deb);
    }

    async getDebts(debId:number){
        await this.getConnection();
        return await this.debtsRepository.findOne({debId},{relations:["seller"]});
        /*return await this.debtsRepository.createQueryBuilder("debts")
            .leftJoinAndSelect("debts.client", "client")
            .leftJoinAndSelect("debts.sale","sale")
            .leftJoinAndSelect("sale.subSales", "subSales")
            .where("debts.debId = :debId",{debId:debId})
            .getOne();*/
    }

    async getSaleIdFromDebtId(debId:number){
        await this.getConnection();
        return await this.debtsRepository.findOne({
            debId
        },{
            relations:["sale"]
        });
    }
    async payDeb(debId:number){
        await this.getConnection();
        await this.debtsRepository.query(`update debts_sale set status=0 where deb_id=${debId}`);
    }
    

}