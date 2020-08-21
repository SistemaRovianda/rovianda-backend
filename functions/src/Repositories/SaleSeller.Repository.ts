import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { assignWith } from 'lodash';

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
        return await this.salesSellerRepository.query(`select order_seller_id as orderId,date,urgent from orders_sellers where user_id="${uid}"`);
    }

    async getOrderById(id:number){
        await this.getConnection();
        return await this.salesSellerRepository.findOne({id},{relations:["user"]});
    }

    async getOrderSellerByUrgent(urgent:boolean){
        await this.getConnection();
        return await this.salesSellerRepository.find({
            where:{ urgent : urgent},
            relations:["user"]
        });
    }

    


}