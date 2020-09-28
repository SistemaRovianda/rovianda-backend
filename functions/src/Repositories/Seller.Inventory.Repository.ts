import { Repository } from "typeorm";
import { SellerInventory } from "../Models/Entity/Seller.Inventory";
import { connect } from "../Config/Db";
import { Request } from "express";

export class SellerInventoryRepository{
    private repository:Repository<SellerInventory>;
    async getConnection(){
        if(!this.repository){
            this.repository = (await connect()).getRepository(SellerInventory);
        }
    }

    async saveSellerInventory(sellerInvetory:SellerInventory){
        await this.getConnection();
        return await this.repository.save(sellerInvetory);
    }

    async getSellerInventoryBySellerId(sellerUid:string){
        await this.getConnection();
        return await this.repository.query(`select distinct(selinv.productId) as productId,
        prorov.name,prorov.img_s3 as imgS3
        from seller_inventory as selinv inner join products_rovianda as prorov 
        on selinv.productId = prorov.id where selinv.seller_id="${sellerUid}"`);
    }

    async getSellerInventoryProductPresentation(sellerUid:string,productId:number){
        await this.getConnection();
        return await this.repository.query(`select si.presentation_id as presentationId,prp.presentation,prp.type_presentation as typePresentation,prp.price_presentation as pricePresentation
        ,sum(si.quantity) as quantity from seller_inventory as si inner join presentation_products as prp 
        on si.presentation_id = prp.presentation_id where si.productId=${productId} and seller_id="${sellerUid}"
        group by si.presentation_id;`);
    }

    async getSellerBySellerId(sellerUid:string){
        await this.getConnection();
        return await this.repository.find({
            where:{seller:`${sellerUid}`},
            relations:["product"]
        });
    }

    async getPresentationsSeller(productId:number,sellerUid:string){
        await this.getConnection();
        return await this.repository.query(`select selinv.presentation_id as presentationId ,selinv.quantity, prepro.presentation,prepro.type_presentation as typePresentation 
        from presentation_products as prepro
        inner join seller_inventory as selinv on selinv.presentation_id = prepro.presentation_id
        where selinv.productId = ${productId} and selinv.seller_id = "${sellerUid}"; `);
    }
}