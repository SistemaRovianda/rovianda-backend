import { Between, Repository } from "typeorm";
import { Debts } from "../Models/Entity/Debts";
import { connect } from "../Config/Db";
import { Client } from "../Models/Entity/Client";
import { Sale } from "../Models/Entity/Sales";

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

    async getDebtsBySellerId(sellerId:string,date:string){
        let from = date+"T00:00:00.000Z";
        let to = date+"T23:59:59.59.000Z";
        await this.getConnection();
        return await this.debtsRepository.query(
            `
                select sale_id from debts_sale where seller_id="${sellerId}" and create_day between "${from}" and "${to}"
            `
        ) as {sale_id:number}[];
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

    async getBySale(sale:Sale){
        await this.getConnection();
        return await this.debtsRepository.findOne({sale});
    }
    

}