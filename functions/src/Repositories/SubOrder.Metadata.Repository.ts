import { Between, In, Repository } from "typeorm";
import { SubOrderMetadata } from "../Models/Entity/SubOrder.Sale.Seller.Metadata";
import { connect } from "../Config/Db";
import { SubOrder } from "../Models/Entity/SubOrder.Sale.Seller";
import { User } from "../Models/Entity/User";
import { SubOrderMetadataOutputs } from "../Models/DTO/Sales.ProductDTO";
import { DeliveryToSeller, DeliveryToSellerRequest } from "../Models/DTO/Quality.DTO";
import { indexOf } from "lodash";

export class SubOrderMetadataRepository{

    private repository:Repository<SubOrderMetadata>;

    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(SubOrderMetadata);
        }
    }

    async saveSubOrderMetadata(subOrderMetadata:SubOrderMetadata){
        await this.getConnection();
        return await this.repository.save(subOrderMetadata);
    }

    async getSubOrderMetadataBySubOrder(subOrder:SubOrder){
        await this.getConnection();
        return await this.repository.find({subOrder});
    }

    async findBySubOrdersIdsAndLotId(subOrdersIds:number[],loteId:string){
        await this.getConnection();
        return await this.repository.find({where:{subOrder:In(subOrdersIds),loteId},relations:["subOrder"]});
    }

    async getAllOrdersDispached(dateStart:string,dateEnd:string,sellerUid:string,type:string){
      
        await this.getConnection();
        let query="";
        if(type=="acumulated"){
            query =`
            select sum(sm.quantity) as quantity ,sum(sm.weigth) as weight,os.seller_id as sellerUid,ps.presentation_id as presentationId,
            ps.type_presentation as presentation,pr.name,ps.key_sae as keySae ,
            ps.price_presentation_public as price,truncate(sum(if(ps.uni_med="PZ",sm.quantity*ps.price_presentation_public,truncate(sm.weigth,2)*ps.price_presentation_public)),2) as total
            from suborder_metadata as sm
            inner join suborders as sub on sub.suborder_id = sm.sub_order_id 
            inner join orders_sellers as os on os.order_seller_id=sub.order_seller_id
            inner join presentation_products as ps on ps.presentation_id=sub.presentation_id
            inner join products_rovianda as pr on pr.id = sub.product_id
            where sm.output_date between "${dateStart}T00:00:00" and "${dateEnd}T23:59:59" and os.seller_id="${sellerUid}" 
            group by pr.id,ps.presentation_id;
            `;
        }else{
            query =`
            select sm.quantity as quantity ,truncate(sm.weigth,2) as weight,sm.lote_id as lotId,os.seller_id as sellerUid,ps.presentation_id as presentationId,
            ps.type_presentation as presentation,pr.name,ps.key_sae as keySae,sm.output_date as outputDate,
            ps.price_presentation_public as price,truncate(if(ps.uni_med="PZ",sm.quantity*ps.price_presentation_public,truncate(sm.weigth,2)*ps.price_presentation_public),2) as total
            from suborder_metadata as sm
            left join suborders as sub on sub.suborder_id = sm.sub_order_id 
            left join orders_sellers as os on os.order_seller_id=sub.order_seller_id
            left join presentation_products as ps on ps.presentation_id=sub.presentation_id
            left join products_rovianda as pr on pr.id = sub.product_id
            where sm.output_date between "${dateStart}T00:00:00" and "${dateEnd}T23:59:59" and os.seller_id="${sellerUid}" 
            `;
        }
        return (await this.repository.query(query)) as SubOrderMetadataOutputs[] ;
    }

    async getAllDeliversIndividual(body:DeliveryToSellerRequest){
        await this.getConnection();
        let sellersStr="";
        if(body.sellers.length){
            sellersStr+=" where (";
            for(let seller of body.sellers){
                sellersStr+=` os.seller_id="${seller}" or `;
            }
            sellersStr+=";";
            sellersStr=sellersStr.replace("or ;","");
        }
        let items =await this.repository.query(`
        select sm.sub_order_metadata_id as id,sm.lote_id as loteId,date_format(sm.output_date,'%Y-%m-%d') as outputDate,sm.quantity,
        sm.weigth as weight,pr.name as productName,pp.type_presentation as presentation,us.name
        from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join products_rovianda as pr on pp.product_rovianda_id=pr.id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        left join users as us on os.seller_id=us.id
        ${sellersStr}
        ${(body.startDate && body.endDate)?((sellersStr!="")?`) and sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`:` where sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`):""}
        limit ${body.perPage} offset ${body.page*body.perPage}
        `) as DeliveryToSeller[];
        let count =await this.repository.query(`
        select count(*) as count
        from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join products_rovianda as pr on pp.product_rovianda_id=pr.id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        left join users as us on os.seller_id=us.id
        ${sellersStr}
        ${(body.startDate && body.endDate)?((sellersStr!="")?`) and sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`:` where sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`):""}
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async getAllDeliversAccumulated(body:DeliveryToSellerRequest){
        await this.getConnection();
        let sellersStr="";
        if(body.sellers.length){
            sellersStr+=" where (";
            for(let seller of body.sellers){
                sellersStr+=` os.seller_id="${seller}" or `;
            }
            sellersStr+=";";
            sellersStr=sellersStr.replace("or ;","");
        }
        let items =await this.repository.query(`
        select round(sum(sm.quantity),2) as quantity,
        round(sum(sm.weigth),2) as weight,pr.name as productName,pp.type_presentation as presentation,us.name
        from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join products_rovianda as pr on pp.product_rovianda_id=pr.id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        left join users as us on os.seller_id=us.id
        ${sellersStr}
        ${(body.startDate && body.endDate)?((sellersStr!="")?`) and sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`:` where sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`):""}
        group by us.id,pr.id,pp.presentation_id
        limit ${body.perPage} offset ${body.page*body.perPage}
        `) as DeliveryToSeller[];
        let count =await this.repository.query(`
        select count(*) as count
        from ( select round(sum(sm.quantity),2) as quantity,
        round(sum(sm.weigth),2) as weight,pr.name as productName,pp.type_presentation as presentation,us.name
        from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        left join products_rovianda as pr on pp.product_rovianda_id=pr.id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        left join users as us on os.seller_id=us.id
        ${sellersStr}
        ${(body.startDate && body.endDate)?((sellersStr!="")?`) and sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`:` where sm.output_date between "${body.startDate}T00:00:00.000Z" and "${body.endDate}T23:59:59.000Z"`):""}
        group by us.id,pr.id,pp.presentation_id ) as t 
        `) as {count:number}[];
        return {
            items,
            count: count[0].count
        }
    }

    async updateDateCloseOrder(orderId:number,date:string){
        await this.getConnection();
        await this.repository.query(`
            update suborder_metadata set output_date="${date}" where sub_order_id in (select suborder_id from suborders where order_seller_id=${orderId})
        `);
    }

    async updateLotAllOvenOutputs(oldNewLot:string,productId:number,newLot:string){
        await this.getConnection();
        let sm=await this.repository.query(`
                select  sub_order_metadata_id as id  from suborder_metadata 
                as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
                where sm.lote_id="${oldNewLot}" and sub.product_id=${productId}
        `) as {id:number}[];
        let subQuery = "";
        if(sm.length){
            for(let item of sm){
                subQuery+=`sub_order_metadata_id = ${item.id} or `
            }
            subQuery+=";";
            subQuery=subQuery.replace("or ;",";");
            await this.repository.query(`update suborder_metadata set lote_id="${newLot}" where ${subQuery}`);
        }
    }


    async getAllEntrancesByProducts(sellerId:string,dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.repository.query(`
        select * from ((select round(sum(if(pp.uni_med="KG",sm.weigth, sm.quantity*pp.price_presentation_min)),2) as weight1Received from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        where os.seller_id="${sellerId}" and sm.output_date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z") as weight1Received,
        (select round(sum(if(pp.uni_med="PZ",pp.price_presentation_min*sub.quantity,sub.quantity)),2) as weight1Solded from sub_sales as sub left join sales as sa on sub.sale_id=sa.sale_id
        left join presentation_products as pp on sub.presentation_id=pp.presentation_id 
        where sa.seller_id="${sellerId}" and sa.date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z" and
        (sa.status="ACTIVE" or sa.status="DELETED") 
        and sub.presentation_id in (
            select distinct(sub.presentation_id) from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id
            left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
            where os.seller_id="${sellerId}" and sm.output_date between "${dateStart}T00:00:00.000Z" and "${dateEnd}T23:59:59.000Z"
        )
        ) as weight1Solded);
        `)as {weight1Received:number,weight1Solded:number}[];
    }
}