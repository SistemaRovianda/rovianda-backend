import { Sale } from "../Models/Entity/Sales";
import { Between, Equal, MoreThanOrEqual, Not, Repository } from "typeorm";
import { connect } from "../Config/Db";

import { Client } from "../Models/Entity/Client";
import { User } from "../Models/Entity/User";
import { SalesToSuperAdmin } from "../Models/DTO/Sales.ProductDTO";
import { isEqual } from "lodash";

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
        return await this.saleRepository.findOne({saleId},{relations:["seller"]});
    }

    async getAllDebsActive(client:Client){
        await this.getConnection();
        return await this.saleRepository.find({
            client,withDebts:true
        });
    }

    async getSaleByDate(date:string,seller:User){
        await this.getConnection();
        return await this.saleRepository.find({
            where:{seller,date: Between(date+"T00:00:00",date+"T23:59:00"),status: Not(Equal("DELETED"))},
        });
    }

    async getLastSale(){
        await this.getConnection();
        return await this.saleRepository.createQueryBuilder('sale')
        .orderBy('sale.folio', 'DESC').limit(1)
        .getOne();
    }

    async getAllSalesForSuperAdmin(page:number,peerPage:number,salesIds:Array<number>,date:string){
        
        if(!salesIds.length){
            salesIds=[0];
        }
        let date1=date+"T00:00:00";
        let date2=date+"T23:59:59";
        await this.getConnection();
        let sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale and sale.typeSale <> :typeSale2",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED"}).skip(page*peerPage).take(peerPage).leftJoinAndSelect("sale.seller","seller").getMany();
        let salesTotal=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale and sale.typeSale <> :typeSale2",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED"}).getMany();
        let response:SalesToSuperAdmin={
            sales,
            totalCount:salesTotal.length
        };
        return response;
    }


    async getSalesBetweenIds(saleId:number,date:string){
        await this.getConnection();
        let dateInit=date+'T00:00:00';
        let dateEnd=date+'T23:59:59';
        return await this.saleRepository.find({
            saleId:MoreThanOrEqual(saleId),
            date:Between(dateInit,dateEnd)
        });
    }

    async getAlldeletedByDate(date:string){
        await this.getConnection();
        let dateInit=date+'T00:00:00';
        let dateEnd=date+'T23:59:59';
        return await this.saleRepository.find({
            typeSale:"DELETED",
            date:Between(dateInit,dateEnd)
        });
    }

}