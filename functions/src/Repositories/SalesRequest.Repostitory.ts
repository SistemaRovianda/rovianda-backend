import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';
import { reduce } from 'lodash';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';

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

    async getByProductAndPresentation(productRovianda:ProductRovianda,presentation:PresentationProducts,active:boolean){
        await this.getConnection();
        return await this.salesRequestRepository.find({
            where:{productRovianda,presentation,active}
        });
    }
    async getSubOrderById(subOrderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.findOne({
            subOrderId
        },{relations:["orderSeller"]});
    }

    async saveSalesProduct(sale:SubOrder){
        await this.getConnection();
        return await this.salesRequestRepository.save(sale);
    }

    async getByOrderSeller(orderSeller:OrderSeller){
        await this.getConnection();
        return await this.salesRequestRepository.find({
            orderSeller
        });
    }

    async getProductsOfOrder(orderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(
            `select distinct(sub.product_id),prorov.name,prorov.img_s3 as imgS3 
            from suborders as sub left join products_rovianda as prorov
            on sub.product_id = prorov.id where sub.order_seller_id=${orderId} and sub.active="1" group by sub.order_seller_id,sub.product_id;`
            );
    }

    async getPresentationOfProductOfOrder(orderId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(
            `select sub.suborder_id as subOrderId,sub.product_id as productId,(sub.units-ifnull(sm.quantity,0)) as units,pp.presentation_id as presentationId,
            pr.name,pp.presentation,pp.type_presentation as typePresentation
            from suborders as sub left join presentation_products as pp on sub.presentation_id = pp.presentation_id
            inner join products_rovianda as pr on pr.id=sub.product_id left join (select sum(quantity) as quantity,sub_order_id from suborder_metadata group by sub_order_id) as sm on sm.sub_order_id=sub.suborder_id
            where sub.order_seller_id=${orderId};`
            );
    }
    async getPresentationOfProductOfOrderApp(orderId:number,productId:number){
        await this.getConnection();
        return await this.salesRequestRepository.query(
            `select sub.suborder_id as subOrderId,sub.product_id as productId,sub.units,pp.presentation_id as presentationId,
            pp.presentation,pp.type_presentation as typePresentation,pp.price_presentation_public as pricePresentationPublic,
            pp.price_presentation_min as pricePresentationMin,pp.price_presentation_liquidation as pricePresentationLiquidation
            from suborders as sub left join presentation_products as pp on sub.presentation_id = pp.presentation_id
             where sub.order_seller_id=${orderId} and sub.product_id=${productId};`
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