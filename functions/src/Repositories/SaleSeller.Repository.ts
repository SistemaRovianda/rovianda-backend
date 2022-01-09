import {connect} from '../Config/Db';
import {  Between, Not, Repository } from 'typeorm';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { User } from '../Models/Entity/User';
import { OrderSellerInterface, SubOrderSellerInterface } from '../Models/Enum/order.seller.interface';

export class SalesSellerRepository{
    private salesSellerRepository:Repository<OrderSeller>;

    async getConnection(){
        if(!this.salesSellerRepository){
            this.salesSellerRepository= (await connect()).getRepository(OrderSeller);
        }
    }

    async saveSalesSeller(sale:OrderSeller){
        await this.getConnection();
        return await this.salesSellerRepository.save(sale);
    }

    async getLastSaleSeller(){
        await this.getConnection();
        return await this.salesSellerRepository.findOne({
            order: {
                id: 'DESC'
                }
        });
    }
   

    async getOrders(uid:string){
        await this.getConnection();
        return await this.salesSellerRepository.query(`select order_seller_id as orderId,date,if(urgent=1,"true","false") urgent from orders_sellers where seller_id="${uid}" and status="ACTIVE";`);
    }

    async getOrderById(id:number){
        await this.getConnection();
        return await this.salesSellerRepository.findOne({id},{relations:["seller"]});
    }

    async getOrderSellerByUrgent(urgent:boolean){
        await this.getConnection();
        return await this.salesSellerRepository.find({urgent,status:"ACTIVE"});
    }

    async getOrderSellerByUrgentCheese(urgent:boolean){
        await this.getConnection();
        return await this.salesSellerRepository.createQueryBuilder()
        .where("urgent=:urgent && status = :active OR status = :active2", {
          urgent,
          active: "ACTIVE",
          active2: "CHEESE"
        })
        .getMany();
    }

    async getOrderSellerByUrgentByDate(urgent:boolean){
        
        await this.getConnection();
        return await this.salesSellerRepository.find({
           where:{ status:Not("INACTIVE"),urgent},relations:["seller"]
        });
    }

    async getOrderByIdWithSuborders(subOrderId:number){
        await this.getConnection();
        return await this.salesSellerRepository.findOne({id:subOrderId},{relations:["subOrders","seller"]});
    }

    async getAllOrdersSellers(){
        await this.getConnection();
        return await this.salesSellerRepository.find({
            status:"ACTIVE"
        });
    }

    async getCurrentRequestedByProductPresentationId(presentationId:number){
        await this.getConnection();
        return await this.salesSellerRepository.query(
            `select sum(sub.units) as unitsRequested,pre.presentation_id as presentationId from suborders as sub left join orders_sellers as ord on sub.order_seller_id=ord.order_seller_id 
            left join presentation_products as pre on sub.presentation_id=pre.presentation_id
            where ord.status="ACTIVE" and pre.presentation_id=${presentationId}`
        ) as {unitsRequested:number,presentationId:number}[];
    }

    async getAllOrdersDispached(seller:User){
        await this.getConnection();
        return await this.salesSellerRepository.find(
            {
                where:{seller,status:"INACTIVE"}
            }
        );
    }

    async getDetailsOfOrderOfSellerToEdit(orderId:number){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
        select suborder_id as subOrderId,units as quantity,pr.name,pp.type_presentation as presentation,out_of_stock as outOfStock from suborders as sub left join products_rovianda as pr
        on sub.product_id=pr.id left join presentation_products as pp on sub.presentation_id=pp.presentation_id
        where order_seller_id=${orderId};
        `) as Array<{
            subOrderId:number,quantity:number,name:string,presentation:string
        }>;
    }

    async updateSubOrderQuantity(subOrderId:number,quantity:number,outOfStock:boolean){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
        update suborders set units=${quantity},out_of_stock=${(outOfStock?1:0)} where suborder_id=${subOrderId}
        `);
    }

    async deleteSubordersOmit(subOrdersId:number[],orderSellerId:number){
        let ids ="(";
        for(let id of subOrdersId){
            ids+=`${id},`
        }
        ids+=")";
        ids=ids.replace(",)",")");
        await this.getConnection();
        return await this.salesSellerRepository.query(`
        delete from  suborders  where order_seller_id=${orderSellerId} and suborder_id not in ${ids}
        `);
    }

    async getAllOrdersSellersByDate(date:string){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
            select os.order_seller_id as orderSellerId,os.date_attended as dateAttended,'         1' as clientCode,50 as warehouseCode,os.folio_remission as folioRemission,us.saeKey
            from orders_sellers as os
            left join users as us on os.seller_id=us.id
            where status="INACTIVE" and sincronized=0 and date_attended between "${date}T00:00:00.000Z" and "${date}T23:59:59.000Z";  
        `) as OrderSellerInterface[];
    }

    async getAllOrdersSellersByOrderSellerId(orderSellerId:number){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
            select os.order_seller_id as orderSellerId,os.date_attended as dateAttended,'         1' as clientCode,50 as warehouseCode,os.folio_remission as folioRemission,us.saeKey
            from orders_sellers as os
            left join users as us on os.seller_id=us.id
            where order_seller_id=${orderSellerId};  
        `) as OrderSellerInterface[];
    }

    async getAllOrdersSellersBetweenDates(date1:string,date2:string){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
            select os.order_seller_id as orderSellerId,os.date_attended as dateAttended,'         1' as clientCode,50 as warehouseCode,os.folio_remission as folioRemission
            from orders_sellers as os
            where date_attended between "${date1}T00:00:00.000Z" and "${date2}T23:59:59.000Z" order by folio_remission desc;  
        `) as OrderSellerInterface[];
    }
    
   async updateNumberRemission(orderSellerId:number,folioRemission:number){
        await this.getConnection();
        await this.salesSellerRepository.query(`
            update orders_sellers set folio_remission=${folioRemission},sincronized=1 where order_seller_id=${orderSellerId}
        `);
   }

    async getAllSubOrdersSellersByOrderSellerId(orderSellerId:number){
        await this.getConnection();
        return await this.salesSellerRepository.query(`
        select sub.product_id as productId,sub.presentation_id as presentationId,pp.esq_key as esqImp,round((if(pp.uni_med='PZ',sm.quantity*pp.price_presentation_public,(sm.quantity*pp.price_presentation_min)*pp.price_presentation_public)),2) as amount,
        sm.quantity,
        pp.price_presentation_liquidation as quantityByAbarrotes,pp.key_sae as presentationCode, pp.type_product as typeProduct,pp.key_altern as presentationCodeAltern,pp.uni_med as uniMed
        from suborders as sub
        left join suborder_metadata as sm on sub.suborder_id = sm.sub_order_id
        left join presentation_products as pp on sub.presentation_id = pp.presentation_id
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id
        where sub.order_seller_id=${orderSellerId} and sub.active=0 and os.sincronized=0;
        `) as SubOrderSellerInterface[];
    }

    async getLastCountOrderSellerRemission(){
        await this.getConnection();
        return await this.salesSellerRepository.query(
            `
            SELECT folio_remission as folioRemission FROM bd_rovianda.orders_sellers where folio_remission is not null and sincronized=1 order by folio_remission desc limit 1;
            `
        ) as { folioRemission:number}[];
    }
}