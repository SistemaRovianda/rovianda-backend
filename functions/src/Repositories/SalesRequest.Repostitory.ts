import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';
import { reduce } from 'lodash';

export class SalesRequestRepository{
    private salesRequestRepository:Repository<SubOrder>;

    async getConnection(){
        if(!this.salesRequestRepository){
            this.salesRequestRepository = (await connect()).getRepository(SubOrder);
        }
    }


    async getSalesRequest(){
        await this.getConnection();
        return await this.salesRequestRepository.find({
            where: {status: 0}
        });
    }

    async getSubOrderById(subOrderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(`
        SELECT * FROM suborders WHERE suborder_id = ${subOrderId}
        `);
    }

    async saveSalesProduct(sale:SubOrder){
        await this.getConnection();
        return await this.salesRequestRepository.save(sale);
    }

    async getProductsOfOrder(orderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(
            `select distinct(sub.product_id),prorov.name,prorov.img_s3 as imgS3 
            from suborders as sub left join products_rovianda as prorov
            on sub.product_id = prorov.id where sub.order_seller_id=${orderId} group by sub.order_seller_id,sub.product_id;`
            );
    }

    async getPresentationOfProductOfOrder(orderId:number,productId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(
            `select sub.suborder_id as subOrderId,sub.product_id as productId,sub.units,pp.presentation,pp.type_presentation as typePresentation,pp.price_presentation as pricePresentation 
            from suborders as sub left join presentation_products as pp on sub.presentation_id = pp.presentation_id where sub.order_seller_id=${orderId} and sub.product_id=${productId};`
            );
    }

    async getSubOrder(subOrderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.findOne({subOrderId});
    }

    async deleteByOrderSeller(orderSellerId:number){
        await this.getConnection();
        await this.salesRequestRepository.query(
            `delete from suborders_metadata as subm inner join suborders as sub on subm.sub_order_metadata_id=sub.sub_order_metadata_id
             inner join orders_sellers as ors on sub.order_seller_id=ors.order_seller_id where ors.order_seller_id=${orderSellerId}`
            );
    }

}