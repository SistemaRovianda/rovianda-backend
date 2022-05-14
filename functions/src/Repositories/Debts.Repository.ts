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

    async getStatusOfFolios(oldDebs:string[]){
        await this.getConnection();
        if(oldDebs.length){
            let subQuery ="(";
            for(let folio of oldDebs){
                subQuery+=` "${folio}",`;
            }
            subQuery+=";"
            subQuery=subQuery.replace(",;",");");
            return await this.debtsRepository.query(`select folio from sales where status=0 and folio in `+subQuery) as {folio:string}[];
        }else{
            return [];
        }
    }

    async getAllDebtsPaymentCreatedInDate(date:string){
        await this.getConnection();
        return await this.debtsRepository.query(`
        SELECT distinct(debt.sale_id) as saleId,sa.folio_temp as folio,cl.name,cl.key_sae_new as keySae,upper(debt.type_pay) as typePay,
        date_format (str_to_date(sa.date,'%Y-%m-%dT%T.%fZ'),'%Y-%m-%d') as createDay,
        date_format(str_to_date(debt.create_day,'%Y-%m-%dT%T.%fZ'),'%Y-%m-%d') as solpedAt,sa.amount,
        us.saeKey,str_to_date(debt.create_day,'%Y-%m-%dT%T.%fZ') as fechaElab
        FROM debts_sale  as debt left join sales as sa on debt.sale_id=sa.sale_id
        left join clients as cl on sa.client_id=cl.clients_client_id
        left join users as us on sa.seller_id=us.id
        where upper(debt.type_pay)<>"CHEQUE" AND upper(debt.type_pay)<>"TRANSFERENCIA" AND debt.create_day between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z"
        `) as any[];
    }
    

}