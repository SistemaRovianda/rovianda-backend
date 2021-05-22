import {connect} from '../Config/Db';
import {  Between, Not, Repository } from 'typeorm';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { User } from '../Models/Entity/User';

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


}