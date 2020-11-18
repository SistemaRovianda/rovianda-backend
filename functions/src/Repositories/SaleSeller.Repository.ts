import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { assignWith } from 'lodash';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';

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
        return await this.salesSellerRepository.query(`select order_seller_id as orderId,date,if(urgent=1,"true","false") urgent from orders_sellers where user_id="${uid}" and status="ACTIVE";`);
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
}