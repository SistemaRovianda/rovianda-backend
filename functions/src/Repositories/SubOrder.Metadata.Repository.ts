import { Between, In, Repository } from "typeorm";
import { SubOrderMetadata } from "../Models/Entity/SubOrder.Sale.Seller.Metadata";
import { connect } from "../Config/Db";
import { SubOrder } from "../Models/Entity/SubOrder.Sale.Seller";
import { User } from "../Models/Entity/User";
import { SubOrderMetadataOutputs } from "../Models/DTO/Sales.ProductDTO";

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

    async getAllOrdersDispached(dateStart:string,dateEnd:string,sellerUid:string){
      
        await this.getConnection();
        let query =`
        select sm.lote_id as lotId,sm.output_date as outputDate,sm.quantity ,sm.weigth as weight,os.seller_id as sellerUid,
        ps.type_presentation as presentation,pr.name,ps.key_sae as keySae from suborder_metadata as sm
        inner join suborders as sub on sub.suborder_id = sm.sub_order_id 
        inner join orders_sellers as os on os.order_seller_id=sub.order_seller_id
        inner join presentation_products as ps on ps.presentation_id=sub.presentation_id
        inner join products_rovianda as pr on pr.id = sub.product_id
        where sm.output_date between "${dateStart}T00:00:00" and "${dateEnd}T23:59:59" and os.seller_id="${sellerUid}"; 
        `;
        return (await this.repository.query(query)) as SubOrderMetadataOutputs[] ;
    }

}