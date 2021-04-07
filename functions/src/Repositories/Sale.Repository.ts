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
            where:{seller,date: Between(date+"T00:00:00.000Z",date+"T23:59:00.000Z")},
        });
    }

    async getLastSale(){
        await this.getConnection();
        return await this.saleRepository.createQueryBuilder('sale')
        .orderBy('sale.folio', 'DESC').limit(1)
        .getOne();
    }

    async getAllSalesForSuperAdmin(page:number,peerPage:number,salesIds:Array<number>,date:string,hint:string){
        
        if(!salesIds.length){
            salesIds=[0];
        }
        let date1=date+"T00:00:00";
        let date2=date+"T23:59:59";
        await this.getConnection();
        let sales:Sale[]=[];
        let salesTotal:Sale[]=[];
        if(hint){
            sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale and sale.status_str <> :typeSale2 and sale.folio like '%:hint%'",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED",hint:+hint}).skip(page*peerPage).take(peerPage).leftJoinAndSelect("sale.seller","seller").getMany();
            salesTotal=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale and sale.status_str <> :typeSale2 and sale.folio like '%:hint%'",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED",hint:+hint}).getMany();
        }else{
            sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale   and sale.status_str <> :typeSale2 ",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED"}).skip(page*peerPage).take(peerPage).leftJoinAndSelect("sale.seller","seller").getMany();
            salesTotal=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds) and sale.typeSale <> :typeSale  and sale.status_str <> :typeSale2 ",{date1,date2,salesIds,typeSale:"CREDITO",typeSale2:"DELETED"}).getMany();
        }
    let response:SalesToSuperAdmin={
        sales,
        totalCount:salesTotal.length
    };
        return response;
    }

    async getAllSalesOfSellerUid(seller:User,date:string){
        let date1=date+"T00:00:00";
        let date2=date+"T23:59:59";
        
        await this.getConnection();
        let sales = await this.saleRepository.find({where:{seller,date:Between(date1,date2)},relations:["seller"]});
        return sales;
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
            statusStr:"DELETED",
            date:Between(dateInit,dateEnd)
        });
    }

    async getSalesBetweenDates(date:string){
        let dateInit="2021-04-02"+"T00:00:00";
        let dateEnd="2021-04-03"+"T23:59:59";
        await this.getConnection();
        // let dateInit=date+'T00:00:00';
        // let dateEnd=date+'T23:59:59';

        let sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :dateInit and :dateEnd and sale.typeSale <> :typeSale2 and sale.typeSale <> :typeSale3",{dateInit,dateEnd,typeSale2:"DELETED",typeSale3:"CANCELED"})
        .leftJoinAndSelect("sale.seller","seller").leftJoinAndSelect("sale.client","client").getMany();
        return sales;
    }

    async getSalesByClientRange(client:Client,page:number,perPage:number,from:string,to:string){
        await this.getConnection();
        let dateInit=from+'T00:00:00Z';
        let dateEnd=to+'T23:59:59Z';
        
        let skip = (page)*perPage;
        let count= await this.saleRepository.count({where:{client,date:Between(dateInit,dateEnd)}});
        let items= await this.saleRepository.query(`
        select sale_id as saleId,folio,date,amount,users.name as seller from 
        sales left join users on sales.seller_id = users.id
         where client_id=${client.id} and date between "${dateInit}" and "${dateEnd}" limit ${perPage} offset ${skip};
        `);
        return {
            count,
            items: items as Array<any>
        }
    }

    async getPendingCreditBySeller(seller:User){
        await this.getConnection();
        return await this.saleRepository.find({where:{seller,status:true}});
    }

    async getAmountSales(dateStr:string,sellerId:string){
        await this.getConnection();
        let dateFrom = dateStr+"T00:00:00.OOOZ";
        let dateTo = dateStr+"T23:59:59.000Z";
        let totalSolded= await this.saleRepository.query(`
            select format(sum(amount),2) as totalVendido from sales where date between "${dateFrom}" and "${dateTo}" and seller_id="${sellerId}" and status_str<>"CANCELED"
        `) as Array<{totalVendido:string}>;

        let items:any[] = await this.saleRepository.query(`
        SELECT * FROM bd_rovianda.sub_sales as ss left join presentation_products as pp 
        on ss.presentation_id =pp.presentation_id where sale_id in 
        (select sale_id from sales where seller_id ="${sellerId}" 
        and date between "${dateFrom}" and "${dateTo}" and status_str<>"CANCELED");
        `);
        let totalWeight=items.map((x:any)=>{
            if(x.uni_med=="PZ"){
                return ((x.quantity*x.price_presentation_min) as number) ;
            }else{
                return x.quantity as number;
            }
        }).reduce((a,b)=>a+b,0);
        let totalVendido="0";
        if(totalSolded.length){
            totalVendido=totalSolded[0].totalVendido;
        }
        return {
            totalSolded:totalVendido,
            totalWeight:totalWeight.toFixed(2)
        }
    }

}