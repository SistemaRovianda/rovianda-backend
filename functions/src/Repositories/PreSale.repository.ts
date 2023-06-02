import { Between, In, Repository } from "typeorm";
import { connect } from "../Config/Db";
import { PreSale } from "../Models/Entity/PreSale";
import { User } from "../Models/Entity/User";

export class PreSaleRepository{
    private repository:Repository<PreSale>;
    async getConnection(){
        if(!this.repository) { 
            this.repository =(await connect()).getRepository(PreSale);
        }
    }
    async registerPreSale(preSale:PreSale){
        await this.getConnection();
        return await this.repository.save(preSale);
    }
    async findPreSaleByFolio(folio:string){
        await this.getConnection();
        return await this.repository.findOne({folio});
    }
    async getPreSalesByPreSaleUserAndDate(preSaleSellerId:string,date:string){
        let from = date+"T00:00:00.000Z";
        let to = date+"T23:59:59.000Z";
        await this.getConnection();
        return await this.repository.find({
            where:{ seller:{id:preSaleSellerId}, dateCreated:Between(from,to)},
            relations:["client"]
        });
    }

    async getAllPreSalesIdsForOneSellerId(sellerId:string,dateToDeliver:string){
        await this.getConnection();
        let items:{preSaleId:number}[] = await this.repository.query(`
        select ps.pre_sale_id as preSaleId from 
        pre_sales as ps
        left join clients as cl
        on cl.clients_client_id=ps.client_id 
        where cl.seller_owner="${sellerId}" and ps.date_to_deliver="${dateToDeliver}";
        `) as {preSaleId:number}[];
        return items.map(x=>x.preSaleId);    
    }

    async getPreSalesForDeliverBySellerIdAndDate(sellerId:string,date:string){
        await this.getConnection();
        let preSalesIds:number[] = await this.getAllPreSalesIdsForOneSellerId(sellerId,date);
        return await this.repository.find({
            where:{ preSaleId:In(preSalesIds), dateToDeliver:date},
            relations:["client"]
        });
    }

    async getPreSalesCreditWithPendingPayment(sellerId:string){
        let ids:{preSaleId:number}[] = await this.getPreSalesPendingPaymentIdsOfSellerId(sellerId);
        let idsOnly = ids.map(x=>x.preSaleId);
        await this.getConnection();
        return await this.repository.find({where:{preSaleId:In(idsOnly)}});
    }

    async getPreSalesPendingPaymentIdsOfSellerId(sellerId:string){
        await this.getConnection();
        return await this.repository.query(`
        select pre_sale_id as preSaleId 
        from pre_sales as ps
        left join sales as sa
        on ps.new_folio=sa.folio
        where sa.status=1 and sa.seller_id="${sellerId}";
        `) as {preSaleId:number}[];
    }

    async getLastFolioOfSeller(seller:User){
        await this.getConnection();
        let val1= await this.repository.query(`
        select REPLACE(folio,"${seller.cve}","") as folio from pre_sales where pre_seller_id="${seller.id}" 
        and folio like "%${seller.cve}%"
        order by CAST(REPLACE(folio,"${seller.cve}","")  AS DECIMAL) DESC  limit 1;
        `) as {folio:string}[];
        let folio="0";
        if(val1.length){
            folio=seller.cve+val1[0].folio;
        }else{
            folio=`${seller.cve}0`;
        }
        return folio;
    }
}