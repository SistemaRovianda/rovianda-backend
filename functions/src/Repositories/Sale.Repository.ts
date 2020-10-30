import { Sale } from "../Models/Entity/Sales";
import { Repository } from "typeorm";
import { connect } from "../Config/Db";

import { Client } from "../Models/Entity/Client";

export class SaleRepository{
    private saleRepository: Repository<Sale>;

    async getConnection(){
        if (!this.saleRepository)
            this.saleRepository = (await connect()).getRepository(Sale);
    }

    async saveSale(sale:Sale){
        await this.getConnection();
        return await this.saleRepository.save(sale);
    }

    async getSaleById(id: number){
        await this.getConnection();
        return await this.saleRepository.findOne({saleId:id});
    }

    async getSalleSellerByDateUser(seller:string,date:string){
        await this.getConnection();
        return await this.saleRepository.find({
            where:{ seller, date},
            relations:["client"]
        });
    }

    async getSalesBySaleIdSeller(saleId:number,seller:string){
        await this.getConnection();
        return await this.saleRepository.findOne({
            where:{ saleId, seller},
            relations:["client"]
        });
    }

    async getSalesBySellerId(sellerUid:string,date:string){
        await this.getConnection();
        return await this.saleRepository.find({
            where:{ sellerUid,date},
            relations:["client"]
        });
    }

    async getSaleWithDebts(saleId:number){
        await this.getConnection();
        return await this.saleRepository.findOne({saleId});
    }

    async getSalesPendingByClient(client:Client){
        await this.getConnection();
        return await this.saleRepository.find({client,status:true});
    }

    async getSaleByIdWithClientAndSeller(saleId:number){
        await this.getConnection();
        return await this.saleRepository.findOne({saleId});
    }

    async getAllDebsActive(client:Client){
        await this.getConnection();
        return await this.saleRepository.find({
            client,withDebts:true
        });
    }
}