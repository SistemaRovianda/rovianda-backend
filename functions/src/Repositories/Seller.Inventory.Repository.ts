import { MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { SellerInventory } from "../Models/Entity/Seller.Inventory";
import { connect } from "../Config/Db";
import { Request, Response } from "express";
import { PresentationProducts } from "../Models/Entity/Presentation.Products";
import { User } from "../Models/Entity/User";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { LotsStockInventoryPresentation } from "../Models/DTO/PackagingDTO";

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
        return await this.repository.query(`select si.presentation_id as presentationId,prp.presentation,prp.type_presentation as typePresentation,prp.price_presentation_public as pricePresentationPublic,
        prp.price_presentation_min as pricePresentationMin,prp.price_presentation_liquidation as pricePresentationLiquidation,prp.key_sae as keySae
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

    async getInventoryMoreThanOneBySeller(seller:User){
        await this.getConnection();
        return await this.repository.query(`select distinct(presentation_id) as presentationId from seller_inventory where seller_id="${seller.id}" and quantity>0`) as Array<{presentationId:number}>;
    }

    async getPresentationsSeller(productId:number,sellerUid:string){
        await this.getConnection();
        return await this.repository.query(`select selinv.presentation_id as presentationId ,selinv.quantity, prepro.presentation,prepro.type_presentation as typePresentation 
        from presentation_products as prepro
        inner join seller_inventory as selinv on selinv.presentation_id = prepro.presentation_id
        where selinv.productId = ${productId} and selinv.seller_id = "${sellerUid}"; `);
    }

    async getInventoyOfProductPresentationId(presentation:PresentationProducts,units:number,seller:User){
        await this.getConnection();
        return await this.repository.findOne({
            where:{presentation,quantity: MoreThanOrEqual(units),seller}
        });
    }

    async getByProductPresentationAndSeller(product:ProductRovianda,presentation:PresentationProducts,seller:User){
        await this.getConnection();
        return await this.repository.find(
            {
                where:{
                    product,
                    presentation,
                    seller
                }
            }
        );
    }

    async getInventoryByProductStockOfSeller(user:User){
        await this.getConnection();
        return (await this.repository.query(
            `
            select round(sum(si.weigth),2) as weight,sum(si.quantity) as units,si.presentation_id,pro.name,pp.type_presentation,si.lote_id as lot_id
        from seller_inventory as si inner join presentation_products as pp on pp.presentation_id=si.presentation_id inner join products_rovianda as pro on pro.id=si.productId
        where seller_id="${user.id}" group by si.lote_id,si.presentation_id,si.productId;
            `
        ) )as LotsStockInventoryPresentation[];
    }

    async getInventoryByProductStockOfSellerModeOffline(user:User){
        await this.getConnection();
        return (await this.repository.query(
            `
            select round(sum(si.weigth),2) as weight,sum(si.quantity) as units,si.presentation_id,pro.name,pp.type_presentation,si.lote_id as lot_id,pp.key_sae,
            pp.price_presentation_public as price,pp.uni_med,pp.price_presentation_min,pp.product_rovianda_id
        from seller_inventory as si inner join presentation_products as pp on pp.presentation_id=si.presentation_id inner join products_rovianda as pro on pro.id=si.productId
        where seller_id="${user.id}" group by si.lote_id,si.presentation_id,si.productId;
            `
        ) )as LotsStockInventoryPresentation[];
    }

    async insertNewProductToSellerInventory(presentationId:number,productId:number){
        await this.getConnection();
        let sellersIds= await this.repository.query(`
            select id from users where rol_id=10 and cve is not null and cve <>""
        `) as {id:string}[];
        let dateAdded = new Date();
        dateAdded.setHours(dateAdded.getHours()-5);
        for(let seller of sellersIds){
            await this.repository.query(`
            insert into seller_inventory(quantity,lote_id,date_entrance,weigth,seller_id,productId,presentation_id)
            values(100,'RESGUARDO','${dateAdded.toISOString()}',200,"${seller.id}",${productId},${presentationId});
            `);
        }
    }

    async deletePresentationOfInventoryOfSeller(presentationId:number){
        await this.getConnection();
        return await this.repository.query(`
            delete from seller_inventory where 
            seller_id in (select id from users where rol_id=10 and cve is not null and cve <>"") and presentation_id=${presentationId};
        `);
    }
}