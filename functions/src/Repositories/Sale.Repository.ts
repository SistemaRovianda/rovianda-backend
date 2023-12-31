import { Sale } from "../Models/Entity/Sales";
import { Between, Equal, In, MoreThanOrEqual, Not, Repository } from "typeorm";
import { connect } from "../Config/Db";

import { Client } from "../Models/Entity/Client";
import { User } from "../Models/Entity/User";
import { SaleMetricsAcumulated, SalesToSuperAdmin } from "../Models/DTO/Sales.ProductDTO";
import { isEqual } from "lodash";
import { MOSRM } from "../Models/DTO/ModeOfflineDTO";
import { AdminSalesRequest, ChartD3DataInterface, GeneralReportByDay, GeneralReportByMonth, GeneralReportByWeek, GeneralReportByYear, RankingSeller, RankingSellerByProduct, SalesTypes } from "../Models/DTO/Admin.Sales.Request";
import { SubSales } from "../Models/Entity/Sub.Sales";
import { SubSaleRepository } from "./SubSale.Repository";
import { SellerSoldPeriod } from "../Models/SellerReportRequests";
import { VisitDailyRecord } from "../Models/DTO/DailyReport";

export class SaleRepository{
    private saleRepository: Repository<Sale>;
    
    async getConnection(){
        if (!this.saleRepository)
            this.saleRepository = (await connect()).getRepository(Sale);
    }

    async getAlllSalesWithPaymentPending(){
        await this.getConnection();
        return await this.saleRepository.query(`select sale_id as saleId,folio_temp as folio from sales where type_sale="CREDITO" and status=1 and sincronized=1`) as {saleId:number,folio:string}[];
    }

    async saveSale(sale:Sale){
        await this.getConnection();
        return await this.saleRepository.save(sale);
    }

    async getSaleById(id: number){
        await this.getConnection();
        return await this.saleRepository.findOne({saleId:id},{relations:["seller"]});
    }

    async getSalleSellerByDateUser(sellerId:string,date:string){
        let from = date+"T00:00:00.000Z";
        let to = date+"T23:59:59.59.000Z";
        await this.getConnection();
        return await this.saleRepository.find({
            where:{ seller:{id:sellerId}, date:Between(from,to)},
            relations:["client"]
        });
    }

    async getSalesBySalesIds(salesIds:number[]){
        await this.getConnection();
        return await this.saleRepository.find({
            where:{
                saleId: In(salesIds)
            }
        });
    }

    async getSalleSellerByDateUserDebts(sellerId:string){
        
        await this.getConnection();
        return await this.saleRepository.find({
            where:{ seller:{id:sellerId},status:true},
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
        return (await this.saleRepository.query(`select * from sales order by cast(folio as decimal) desc limit 1`) as any[])[0];
    }

    async getAllSalesForSuperAdmin(page:number,peerPage:number,salesIds:Array<number>,date:string,hint:string,dateTo:string){
        
        if(!salesIds.length){
            salesIds=[0];
        }
        let date1=date+"T00:00:00.000Z";
        let date2=(dateTo)?dateTo:date;
        date2+="T23:59:59.000Z";
        await this.getConnection();
        let sales:Sale[]=[];
        let salesTotal:Sale[]=[];
        if(hint){
            sales=await this.saleRepository.createQueryBuilder("sale").where(`sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds)  and sale.status_str <> :typeSale2 and  sale.folio like  "%${hint}%"`,{date1,date2,salesIds,typeSale2:"DELETED"}).skip(page*peerPage).take(peerPage).leftJoinAndSelect("sale.seller","seller").getMany();
            salesTotal=await this.saleRepository.createQueryBuilder("sale").where(`sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds)  and sale.status_str <> :typeSale2  and sale.folio like  "%${hint}%"`,{date1,date2,salesIds,typeSale2:"DELETED"}).getMany();
        }else{
            sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds)   and sale.status_str <> :typeSale2 ",{date1,date2,salesIds,typeSale2:"DELETED"}).skip(page*peerPage).take(peerPage).leftJoinAndSelect("sale.seller","seller").getMany();
            salesTotal=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :date1 and :date2 and sale.saleId not in(:...salesIds)   and sale.status_str <> :typeSale2  ",{date1,date2,salesIds,typeSale2:"DELETED"}).getMany();
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
        let dateInit=date+"T00:00:00.000Z";
        let dateEnd=date+"T23:59:59.000Z";
        await this.getConnection();
        // let dateInit=date+'T00:00:00';
        // let dateEnd=date+'T23:59:59';

        let sales=await this.saleRepository.createQueryBuilder("sale").where("sale.date between :dateInit and :dateEnd and sale.statusStr <> :typeSale2 and sale.statusStr <> :typeSale3 and sale.amount>0",{dateInit,dateEnd,typeSale2:"DELETED",typeSale3:"CANCELED"})
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

    async getAmountSales(from:string,to:string,sellerId:string){
        await this.getConnection();
        let dateFrom = from+"T00:00:00.OOOZ";
        let dateTo = to+"T23:59:59.000Z";
        let totalSolded= await this.saleRepository.query(`
            select format(sum(amount),2) as totalVendido from sales where date between "${dateFrom}" and "${dateTo}" and seller_id="${sellerId}" and status_str<>"CANCELED"
        `) as Array<{totalVendido:string}>;

        let items:any[] = await this.saleRepository.query(`
        SELECT * FROM  sub_sales as ss left join presentation_products as pp 
        on ss.presentation_id =pp.presentation_id where sale_id in 
        (select sale_id from sales where seller_id ="${sellerId}" 
        and date between "${dateFrom}" and "${dateTo}" and status_str<>"CANCELED");
        `);
        let totalWeight=items.map((x:any)=>{
            if(x.uni_med=="PZ"){
                if(x.type_product!="ABARROTES"){
                    return ((x.quantity*x.price_presentation_min) as number) ;
                }else{
                    return 0;
                }
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

    async getLastFolioOfSeller(seller:User){
        await this.getConnection();
        let val1= await this.saleRepository.query(`
        select REPLACE(folio,"${seller.cve}","") as folio from sales where seller_id="${seller.id}" 
        and folio like "%${seller.cve}%"
        order by CAST(REPLACE(folio,"${seller.cve}","")  AS DECIMAL) DESC  limit 1;
        `) as {folio:string}[];

        let val2= await this.saleRepository.query(`
            select REPLACE(folio_temp,"${seller.cve}","") as folio_temp from sales where seller_id="${seller.id}" 
            and folio_temp is not null and folio_temp like "%${seller.cve}%"
            order by CAST(REPLACE(folio_temp,"${seller.cve}","") AS DECIMAL)  desc limit 1;            
        `) as {folio_temp:string}[];
        let folio="";
        if(val1.length){
            if(val2.length){
                if(val1[0].folio>val2[0].folio_temp){
                    folio=seller.cve+val1[0].folio;
                }else{
                    folio=seller.cve+val2[0].folio_temp;
                }
            }else{
                folio=seller.cve+val1[0].folio;
            }
        }else if(val2.length){
            folio=seller.cve+val2[0].folio_temp;
        }else{
            folio=`${seller.cve}0`;
        }
        return folio;
    }

    async createSimpleSale(sale:MOSRM,sellerId:string){
        await this.getConnection();
        let date = new Date(sale.date);
        date.setHours(date.getHours()-5);
        //let hours = date.getHours().toString();
        //if(+hours<10) hours="0"+hours;
        //let minutes = date.getMinutes().toString();
        //if(+minutes<10) minutes="0"+minutes;
        let saleFinded:any[] =[];//await this.saleRepository.query(`select * from sales where folio="${sale.folio}" and status_str<>"CANCELED"`) as any[];
        let dateSincronized= new Date();
        dateSincronized.setHours(dateSincronized.getHours()-5);
        let hours = (sale.date.split("T")[1]).split(":");
        let hourStr = hours[0]+":"+hours[1];
        if(!saleFinded.length){
            await this.saleRepository.query(`
            insert into sales(date,hour,amount,payed_with,credit,type_sale,status,folio,with_debts,status_str,seller_id,client_id,new_folio,sincronized,folio_temp,date_sincronized)
            value("${date.toISOString()}","${hourStr}",${sale.amount.toFixed(2)},${sale.payedWith.toFixed(2)},${sale.credit?sale.credit.toFixed(2):null},
            "${sale.typeSale}",${sale.status},"${sale.folio}",0,"${sale.statusStr}","${sellerId}",${sale.clientId},"${sale.folio}",0,"${sale.folio}","${dateSincronized.toISOString()}");
            `);
            let saleFinded:any[] =await this.saleRepository.query(`select * from sales where folio="${sale.folio}" order by sale_id desc limit 1`) as any[];
            let saleId=saleFinded[0].sale_id;
            for(let sub of sale.products){
                await this.saleRepository.query(`

                    insert into sub_sales(quantity,lote_id,amount,sale_id,product_id,presentation_id,create_at)
                    values(${sub.quantity},"desconocido",${sub.amount},${saleId},${sub.productId},${sub.presentationId},"${sale.date}");

                `);
            }
        }
    }


    async getLastSalesMaked(sellerId:string)  {
            await this.getConnection();
            return this.saleRepository.query(`
            select * from sales where  seller_id="${sellerId}" and sincronized=1 and folio_temp is not null order by sale_id desc limit 1;
            `);
    }
    async getSalesMaked(sellerId:string)  {
        let date = new Date();
        date.setHours(date.getHours()-24);
        let month = ( date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if(+month<10) month="0"+month;
        if(+day<10) day="0"+day;
        await this.getConnection();
        return this.saleRepository.query(`
        select * from sales where  seller_id="${sellerId}" and sincronized=0 and amount>0 and status_str<>"CANCELED" and status_str<>"DELETED" and 
        date between "${date.getFullYear()}-${month}-${day}T00:00:00.000Z" and "${date.getFullYear()}-${month}-${day}T23:59:59.000Z";
        `);
}

async updateSaleFolio(folio:string,saleId:number)  {
    await this.getConnection();
    return await this.saleRepository.query(`
    update sales set folio_temp="${folio}" where sale_id=${saleId}
    `);
}

async getDiffDates(dateStart:string,dateEnd:string){
    await this.getConnection();
    return await this.saleRepository.query(`
        async select distinct(date(date)) as dateStr from sales where date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z";
    `) as {dateStr:string}[];
}

async getGeneralChartDataSales(dateStart:string,dateEnd:string,type:string){
    await this.getConnection();
    return await this.saleRepository.query(
        `
        select sum(sub.amount) as amount,sum(sub.quantity) as quantity,sum(if(pp.uni_med="PZ",sub.quantity*pp.price_presentation_min,sub.quantity)) as weight,pr.name,pp.type_presentation as typePresentation,pp.price_presentation_public as price,pp.uni_med as uniMed,pp.presentation_id as presentationId,
        pp.type_product as typeProduct,"${type}" as comparation from sub_sales as sub left join presentation_products as pp on sub.presentation_id = pp.presentation_id left join products_rovianda as pr on pp.product_rovianda_id=pr.id
        left join sales as sa on sub.sale_id=sa.sale_id where 
        sa.status_str<>"CANCELED" and
        sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by pp.presentation_id
        union (
                select 0 as amount,0 as quantity,0 as weight,pr.name,pp.type_presentation as typePresentation,pp.price_presentation_public as price,pp.uni_med as uniMed,pp.presentation_id as presentationId,
                pp.type_product as typeProduct,"${type}" as comparation from  presentation_products as pp left join products_rovianda as pr on pp.product_rovianda_id=pr.id
                where pp.status=1 and pp.presentation_id not in (
                        select pp.presentation_id from sub_sales as sub left join presentation_products as pp on sub.presentation_id = pp.presentation_id left join products_rovianda as pr on pp.product_rovianda_id=pr.id
                        left join sales as sa on sub.sale_id=sa.sale_id where 
                        sa.status_str<>"CANCELED" and
                        sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by pp.presentation_id
                )
        ) order by presentationId;
        `
    ) as ChartD3DataInterface[];
}

async getRankingSellersByDate(dateStart:string,dateEnd:string){
    await this.getConnection();
    return await this.saleRepository.query(`
    select sum(sub.amount) as amount,sum(if(pp.uni_med="PZ",sub.quantity*pp.price_presentation_min,sub.quantity)) as weight, us.name,us.id as sellerId from sub_sales as sub
left join presentation_products as pp on sub.presentation_id=pp.presentation_id left join sales as sa on sub.sale_id=sa.sale_id left join users as us on 
sa.seller_id=us.id where sa.status_str<>"CANCELED" and sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" 
group by sa.seller_id;
    `) as RankingSeller[];
}

async getRankingSalesByPresentationProduct(presentationId:number,dateStart:string,dateEnd:string){
    await this.getConnection();
    return await this.saleRepository.query(`
    select sum(sub.amount) as amount,sum(sub.quantity) as quantity,sa.seller_id as sellerId,us.name
    from sub_sales as sub left join presentation_products as pp on sub.presentation_id=pp.presentation_id
    left join sales as sa on sub.sale_id=sa.sale_id
    left join users as us on sa.seller_id=us.id
    where sa.status_str<>"CANCELED" and sub.presentation_id=${presentationId} and sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by sa.seller_id;
    `) as RankingSellerByProduct[];
}

async getHistoryGeneralByDay(body:AdminSalesRequest,dateStart:string,dateEnd:string){
    await this.getConnection();
    let sellers="";
    let clients="";
    let products = "";
    if(body.sellersIds.length){
        sellers+="  ("
        for(let sellerId of body.sellersIds){
            sellers+=` sa.seller_id="${sellerId}" or `;
        }
        sellers+=";";
        sellers=sellers.replace("or ;",") and ");
    }
    if(body.clientsIds.length){
        clients+="  (";
        for(let clientId of body.clientsIds){
            clients+=` sa.client_id=${clientId} or `;
        }
        clients+=";";
        clients=clients.replace("or ;",") and ");
    }
    if(body.productsIds.length){
        products+="  (";
        for(let productId of body.productsIds){
            products+=`pp.presentation_id = ${productId} or `;
        }
        products+=";";
        products=products.replace("or ;",") and ");
    }

    return await this.saleRepository.query(`
    select sub.amount as subAmount,sub.quantity,pr.name as product,pp.type_presentation as presentation,sa.folio,sa.type_sale as typeSale,us.name,
    DATE_FORMAT(sa.date,'%Y-%m-%d') as date,sa.amount,cl.name as client,cl.key_client as keyClient
    from sub_sales as sub left join 
    presentation_products as pp on sub.presentation_id=pp.presentation_id left join sales as sa 
    on sub.sale_id=sa.sale_id left join products_rovianda as pr on sub.product_id=pr.id
    left join users as us on sa.seller_id=us.id left join clients as cl on sa.client_id=cl.clients_client_id
    where 
    ${sellers} ${clients} ${products}
    sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date;
    `) as GeneralReportByDay[];
}

async getHistoryGeneralByWeek(body:AdminSalesRequest,dateStart:string,dateEnd:string){
    let sellers="";
    let clients="";
    let products = "";
    if(body.sellersIds.length){
        sellers+="  ("
        for(let sellerId of body.sellersIds){
            sellers+=` sa.seller_id="${sellerId}" or `;
        }
        sellers+=";";
        sellers=sellers.replace("or ;",") and ");
    }
    if(body.clientsIds.length){
        clients+="  (";
        for(let clientId of body.clientsIds){
            clients+=` sa.client_id=${clientId} or `;
        }
        clients+=";";
        clients=clients.replace("or ;",") and ");
    }
    if(body.productsIds.length){
        products+="  (";
        for(let productId of body.productsIds){
            products+=`pp.presentation_id = ${productId} or `;
        }
        products+=";";
        products=products.replace("or ;",") and ");
    }
    await this.getConnection();
    return await this.saleRepository.query(`
    select pp.presentation_id as presentationId,pr.name as product,pp.type_presentation as presentation,us.name,cl.name as client,cl.clients_client_id as clientId,sum(sub.amount) as subAmount,sum(sub.quantity) as quantity,
 sum(if(pp.uni_med="PZ",if(pp.type_product<>"ABARROTES",sub.quantity*pp.price_presentation_min,0),sub.quantity)) as weight,
 pp.uni_med,week(sa.date) as week
    from sub_sales as sub left join 
    presentation_products as pp on sub.presentation_id=pp.presentation_id left join sales as sa 
    on sub.sale_id=sa.sale_id left join products_rovianda as pr on sub.product_id=pr.id
    left join users as us on sa.seller_id=us.id left join clients as cl on sa.client_id=cl.clients_client_id
    where 
    ${sellers} ${products} ${clients}
    sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by week(sa.date),pr.id,sub.presentation_id,sa.seller_id,sa.client_id;
    `) as GeneralReportByWeek[];
}
async getWeeksCountsBetweenDates(dateStart:string,dateEnd:string){
    await this.getConnection();
    let mapWeeks = new Map<number,string>();
    let weeks = await this.saleRepository.query(`
        select distinct(week(date)) as week from sales where date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z";
    `) as {week:number}[];
    for(let week of weeks){
        let limits = await this.saleRepository.query(`
        select (select date_format(sa.date,'%Y-%m-%d') from sales as sa 
        where sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" and week(sa.date)=${week.week} order by sa.date asc limit 1) as init,
        (select date_format(sa.date,'%Y-%m-%d') from sales as sa 
        where sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" and week(sa.date)=${week.week} order by sa.date desc limit 1) as limite
        `) as {init:string,limite:string}[];
        if(limits.length){
            mapWeeks.set(week.week,`${limits[0].init} a ${limits[0].limite}`);
        }
    }
    return mapWeeks;
}
async getHistoryGeneralByMonth(body:AdminSalesRequest,dateStart:string,dateEnd:string){
    let sellers="";
    let clients="";
    let products = "";
    if(body.sellersIds.length){
        sellers+="  ("
        for(let sellerId of body.sellersIds){
            sellers+=` sa.seller_id="${sellerId}" or `;
        }
        sellers+=";";
        sellers=sellers.replace("or ;",") and ");
    }
    if(body.clientsIds.length){
        clients+="  (";
        for(let clientId of body.clientsIds){
            clients+=` sa.client_id=${clientId} or `;
        }
        clients+=";";
        clients=clients.replace("or ;",") and ");
    }
    if(body.productsIds.length){
        products+="  (";
        for(let productId of body.productsIds){
            products+=`pp.presentation_id = ${productId} or `;
        }
        products+=";";
        products=products.replace("or ;",") and ");
    }
    await this.getConnection();
    await this.saleRepository.query(`
        set lc_time_names='es_MX';
    `);
    return await this.saleRepository.query(`
    select pp.presentation_id as presentationId,pr.name as product,pp.type_presentation as presentation,us.name,cl.name as client,cl.clients_client_id as clientId,sum(sub.amount) as subAmount,sum(sub.quantity) as quantity,
 sum(if(pp.uni_med="PZ",if(pp.type_product<>"ABARROTES",sub.quantity*pp.price_presentation_min,0),sub.quantity)) as weight,
 pp.uni_med,monthname(sa.date) as month
    from sub_sales as sub left join 
    presentation_products as pp on sub.presentation_id=pp.presentation_id left join sales as sa 
    on sub.sale_id=sa.sale_id left join products_rovianda as pr on sub.product_id=pr.id
    left join users as us on sa.seller_id=us.id left join clients as cl on sa.client_id=cl.clients_client_id
    where 
    ${sellers} ${products} ${clients}
    sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by monthname(sa.date),pr.id,sub.presentation_id,sa.seller_id,sa.client_id;
    `) as GeneralReportByMonth[];
}

async getHistoryGeneralByYear(body:AdminSalesRequest,dateStart:string,dateEnd:string){
    let sellers="";
    let clients="";
    let products = "";
    if(body.sellersIds.length){
        sellers+="  ("
        for(let sellerId of body.sellersIds){
            sellers+=` sa.seller_id="${sellerId}" or `;
        }
        sellers+=";";
        sellers=sellers.replace("or ;",") and ");
    }
    if(body.clientsIds.length){
        clients+="  (";
        for(let clientId of body.clientsIds){
            clients+=` sa.client_id=${clientId} or `;
        }
        clients+=";";
        clients=clients.replace("or ;",") and ");
    }
    if(body.productsIds.length){
        products+="  (";
        for(let productId of body.productsIds){
            products+=`pp.presentation_id = ${productId} or `;
        }
        products+=";";
        products=products.replace("or ;",") and ");
    }
    await this.getConnection();
    return await this.saleRepository.query(`
    select pp.presentation_id as presentationId,pr.name as product,pp.type_presentation as presentation,us.name,cl.name as client,cl.clients_client_id as clientId,sum(sub.amount) as subAmount,sum(sub.quantity) as quantity,
    sum(if(pp.uni_med="PZ",if(pp.type_product<>"ABARROTES",sub.quantity*pp.price_presentation_min,0),sub.quantity)) as weight,
    pp.uni_med,year(sa.date) as year
    from sub_sales as sub left join 
    presentation_products as pp on sub.presentation_id=pp.presentation_id left join sales as sa 
    on sub.sale_id=sa.sale_id left join products_rovianda as pr on sub.product_id=pr.id
    left join users as us on sa.seller_id=us.id left join clients as cl on sa.client_id=cl.clients_client_id
    where 
    ${sellers} ${products} ${clients}
    sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" group by year(sa.date),pr.id,sub.presentation_id,sa.seller_id,sa.client_id;
    `) as GeneralReportByYear[];
}

    async getByFolio(folio:string){
        await this.getConnection();
        return await this.saleRepository.findOne({where:{folio},relations:["seller"]});
    }

    async getSalesPendingBySeller(sellerId:string){
        await this.getConnection();
        return await this.saleRepository.find({where:{seller:{id:sellerId},status:true}});
    }

    async getAllSalesByTypeDatesAndSellers(type:string,sellers:string[],dateStart:string,dateEnd:string){
        await this.getConnection();
        
        let conditions ="";
        if(type=="OMITED"){
            conditions+=` sa.status_str= "DELETED" and `;
        }else if(type=="CANCELED"){
            conditions+=`sa.status_str="CANCELED" and `;
        }
        if(sellers.length){
            let toReplace="and"
            if(conditions!=""){
                conditions+="  ("
                toReplace=") and";
            }
            for(let seller of sellers){
            conditions+=`sa.seller_id="${seller}" or `;
            }
            conditions+=";";
            conditions=conditions.replace("or ;",toReplace);
        }
        return await this.saleRepository.query(`
            select sa.folio,sa.amount,sa.date,us.name as sellerName,cl.name as clientName ,sa.status_str as status,date_format(date,'%Y-%m-%d') AS dateSort
            from sales as sa
            left join users as us on sa.seller_id=us.id left join clients as cl on 
            sa.client_id=cl.clients_client_id
            where ${(conditions!="(")?conditions:""} sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date_format(date,'%Y-%m-%d'),sa.seller_id
        `) as SalesTypes[];
    }

    async getCountFolioBetweenDateBySeller(sellerId:string,dateStart:string,dateEnd:string,cve:string){
        await this.getConnection();
        return await this.saleRepository.query(`
        select * from sales where (status_str<>"CANCELED" and status_str<>"DELETED") and seller_id="${sellerId}"  and
        date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"  order by cast(replace(folio_temp,"${cve}","") as decimal) desc limit 1;
        `) as any[];
    }

    async getAllSalesOfSellerByDateToRewrite(sellerId:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.saleRepository.query(`
            select * from sales where  seller_id="${sellerId}"
            and amount>0 and status_str="ACTIVE"
            and date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" order by date;
        `) as any[];
    }

    async updateRewriteFolio(saleId:number,folio:string){
        await this.getConnection();
        return await this.saleRepository.query(`
        update sales set folio_temp="${folio}" where sale_id=${saleId};
        `);
    }

    async getGeneralDataSalesChart(dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.saleRepository.query(`
        select round(sum(sa.amount),2) as amount,date_format(date,"%Y-%m-%d") as dateP from sales as sa 
        where sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"
         group by date_format(date,"%Y-%m-%d");
        `);
    }

    async getSalesMetricsAcumulated(dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.saleRepository.query(`
        select (select round(sum(sa.amount),2) as amount from sales as sa
        where sa.status_str<>"CANCELED" and
        sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z") as amount,
        (select count(*)  from sales as sa
        where sa.status_str<>"CANCELED" and
        sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z") as tickets,
        (select count(*)  from sales as sa
        where sa.status_str="CANCELED" and
        sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z") as ticketsCanceled;
        `) as SaleMetricsAcumulated[];
    }
    async getCountByDates(sellerId:string,from:string,to:string){
        await this.getConnection();
        return await this.saleRepository.query(`
        select count(*) as count 
        from sales 
        where 
        seller_id = "${sellerId}" and
        date between "${from}T00:00:00.000Z" 
        and "${to}T23:59:59.000Z"`) as {count:number}[];
    }

    async getReportSoldPeriod(oldYear:number,newYear:number,month:string,fromDay:string,toDay:string,sellersIds:string[]){
        await this.getConnection();
        let subQuery = "";
        if(sellersIds!=null && sellersIds.length){
            subQuery+=" and (";
            for(let sellerId  of sellersIds){
                subQuery+=` sa.seller_id="${sellerId}" or `;
            }
            subQuery+=";";
            subQuery=subQuery.replace("or ;",")");
        }
        let q=`select * from (select t2.*,pr.name as product,pr.code,sel.name as sellerName,1 as period from (select round(sum(t.quantity),2) as quantity,t.productId,t.sellerId from 
        (select round(sum(if(pre.type_product="ABARROTES",sub.quantity*pre.price_presentation_liquidation,sub.quantity)),2) as quantity,sub.product_id as productId,sub.presentation_id as presentationId
        ,pre.price_presentation_liquidation as units,sa.seller_id as sellerId,pre.type_product as typeProduct
        from sub_sales as sub
        left join sales as sa on sub.sale_id=sa.sale_id 
        left join presentation_products as pre on sub.presentation_id=pre.presentation_id
        where sa.status_str="ACTIVE" ${subQuery} and  sa.date between "${oldYear}-${month}-${fromDay}T:00:00:00.000Z" and "${oldYear}-${month}-${toDay}T23:59:59.000Z"
        group by sub.product_id,sub.presentation_id,sa.seller_id) as t group by t.sellerId,t.productId order by t.sellerId)
        as t2 left join products_rovianda as pr on pr.id=t2.productId
        left join users as sel on t2.sellerId=sel.id) as periodOne union 
        (select t2.*,pr.name as product,pr.code,sel.name as sellerName,2 as period from (select round(sum(t.quantity),2) as quantity,t.productId,t.sellerId from 
        (select round(sum(if(pre.type_product="ABARROTES",sub.quantity*pre.price_presentation_liquidation,sub.quantity)),2) as quantity,sub.product_id as productId,sub.presentation_id as presentationId
        ,pre.price_presentation_liquidation as units,sa.seller_id as sellerId,pre.type_product as typeProduct
        from sub_sales as sub
        left join sales as sa on sub.sale_id=sa.sale_id 
        left join presentation_products as pre on sub.presentation_id=pre.presentation_id
        where sa.status_str="ACTIVE" ${subQuery} and  sa.date between "${newYear}-${month}-${fromDay}T:00:00:00.000Z" and "${newYear}-${month}-${toDay}T23:59:59.000Z"
        group by sub.product_id,sub.presentation_id,sa.seller_id) as t group by t.sellerId,t.productId order by t.sellerId)
        as t2 left join products_rovianda as pr on pr.id=t2.productId
        left join users as sel on t2.sellerId=sel.id);`;
        
        return await this.saleRepository.query(`
            select * from (select t2.*,pr.name as product,pr.code,sel.name as sellerName,1 as period from (select round(sum(t.quantity),2) as quantity,t.productId,t.sellerId from 
            (select round(sum(if(pre.type_product="ABARROTES",sub.quantity*pre.price_presentation_liquidation,sub.quantity)),2) as quantity,sub.product_id as productId,sub.presentation_id as presentationId
            ,pre.price_presentation_liquidation as units,sa.seller_id as sellerId,pre.type_product as typeProduct
            from sub_sales as sub
            left join sales as sa on sub.sale_id=sa.sale_id 
            left join presentation_products as pre on sub.presentation_id=pre.presentation_id
            where sa.status_str="ACTIVE" ${subQuery} and  sa.date between "${oldYear}-${month}-${fromDay}T:00:00:00.000Z" and "${oldYear}-${month}-${toDay}T23:59:59.000Z"
            group by sub.product_id,sub.presentation_id,sa.seller_id) as t group by t.sellerId,t.productId order by t.sellerId)
            as t2 left join products_rovianda as pr on pr.id=t2.productId
            left join users as sel on t2.sellerId=sel.id) as periodOne union 
            (select t2.*,pr.name as product,pr.code,sel.name as sellerName,2 as period from (select round(sum(t.quantity),2) as quantity,t.productId,t.sellerId from 
            (select round(sum(if(pre.type_product="ABARROTES",sub.quantity*pre.price_presentation_liquidation,sub.quantity)),2) as quantity,sub.product_id as productId,sub.presentation_id as presentationId
            ,pre.price_presentation_liquidation as units,sa.seller_id as sellerId,pre.type_product as typeProduct
            from sub_sales as sub
            left join sales as sa on sub.sale_id=sa.sale_id 
            left join presentation_products as pre on sub.presentation_id=pre.presentation_id
            where sa.status_str="ACTIVE" ${subQuery} and  sa.date between "${newYear}-${month}-${fromDay}T:00:00:00.000Z" and "${newYear}-${month}-${toDay}T23:59:59.000Z"
            group by sub.product_id,sub.presentation_id,sa.seller_id) as t group by t.sellerId,t.productId order by t.sellerId)
            as t2 left join products_rovianda as pr on pr.id=t2.productId
            left join users as sel on t2.sellerId=sel.id);
        `) as SellerSoldPeriod[];
    }

    async getVisitsADaySellersReport(date:string,day:number){
        await this.getConnection();
        let dayStr = "";
        switch(day){
            case 2:
                dayStr=` dv.monday=1 `;
                break;
            case 3:
                dayStr=` dv.tuesday=1 `;
                break;
            case 4:
                dayStr=` dv.wednesday=1 `;
                break;
            case 5:
                dayStr=` dv.thursday=1 `;
                break;
            case 6:
                dayStr=` dv.friday=1 `;
                break;
            case 0:
                dayStr=` dv.saturday=1 `;
                break;
        }
        return await this.saleRepository.query(`
        select t.vendedorId,t.vendedor,t.cliente,if(t2.client_id is null,0,1) as visito,"${date}" as section
        from (select cl.name as cliente,us.id as vendedorId,us.name as vendedor,cl.clients_client_id as client_id
            from clients as cl
            left join days_visited as dv on cl.clients_client_id=dv.client_id
            left join users as us on cl.seller_owner=us.id
            where ${dayStr} order by cl.seller_owner) as t
        left join (select sa.client_id
            from sales as sa 
            where sa.date between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z") as t2
            on t.client_id=t2.client_id;
        `) as VisitDailyRecord[];
    }
}