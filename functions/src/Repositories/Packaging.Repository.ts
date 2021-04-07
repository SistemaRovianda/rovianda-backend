import {connect} from '../Config/Db';
import { In, Repository } from 'typeorm';
import { Packaging } from '../Models/Entity/Packaging';
import { OrderSellerRequestProduct, PackagingProperties } from '../Models/DTO/Sales.ProductDTO';
import { OutputsDeliveryPlant, PackagingProductPresentationLot } from '../Models/DTO/PackagingDTO';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
export class PackagingRepository{
    private packagingRepository:Repository<Packaging>;

    async getConnection(){
        if(!this.packagingRepository){
            this.packagingRepository = (await connect()).getRepository(Packaging);
        }
    }

    async savePackaging(packaging:Packaging){
        await this.getConnection();
        return await this.packagingRepository.save(packaging);
    }

    async getAllPackaging(){
        await this.getConnection();
        return await this.packagingRepository.find();
    }

    async getHistoryPackaging(lotId:number){
        await this.getConnection();
        return await this.packagingRepository.createQueryBuilder("packaging")
        .innerJoin("packaging.productId", "*")
        .innerJoin("products_rovianda.id", "*")
        .innerJoin("process.id", "*")
        .getMany();
    }
    
    async getPackagingByLotId(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.find({
            where: {lotId: `${lotId}`,active:true}
        });
    }

    async getPackagingsByLotId(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.find({where:lotId});
    }

    async getPackagingByLotIdAndPropertiesPackaging(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.findOne({
            lotId: `${lotId}`
        },
        {relations:["propertiesPackaging"]}
        );
    }
  
    async findPackagingById(id:number){
        await this.getConnection();
        return await this.packagingRepository.findOne({
            where:{id:`${id}`},
            relations:["productId"]
        });
    }

    async getLastPackaging(){
        await this.getConnection();
        return await this.packagingRepository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }

    async getBynewLotsIds(lotsIds:string[]){
        await this.getConnection();
        return await this.packagingRepository.find({lotId:In(lotsIds)});
    }
    async getPackaging(){
        await this.getConnection();
        return await this.packagingRepository.find({
            relations:["productId","propertiesPackaging"]
         }
        );
    }

    async getAllPackagingByLotId(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.find({lotId});
    }

    async getPackagingWithPropertiesPackaging(id){
        await this.getConnection()
        return await this.packagingRepository.findOne({id},{relations:["propertiesPackaging"]});
    }

    async findPropiertiesPackagingById(id:number){
        await this.getConnection();
        return await this.packagingRepository.query(`
        SELECT * FROM properties_packaging
        WHERE properties_packaging.packaging_id = ${id};`);
    }

  async getPackagingWithProperties(products:OrderSellerRequestProduct[]){
        let ids = "and";
        for(let product of products){
            ids+=` pack.id = ${product.keySae} or `;
        }
        ids+=";";
        ids = ids.replace("or ;",";");
        let query = `select pack.product_id as productId,proppack.presentation_id as presentationId,proppack.units from packaging as pack left join properties_packaging as proppack or proppack.packaging_id = pack.id ${(ids!="and")?ids:""}`;

        let properties:PackagingProperties[] = await this.packagingRepository.query(query) as PackagingProperties[];
        return properties;
    }

    async getPackagingAvailable(){
        await this.getConnection();
        return await this.packagingRepository.query(
            `select distinct(pack.product_id) as productId,prorov.name,prorov.img_s3 as imgS3 from packaging as pack 
            inner join products_rovianda as prorov on pack.product_id = prorov.id where active=1 group by pack.product_id`
            );
    }

    async getPackagingAvailableProduct(productId:number){
        await this.getConnection();
        return await this.packagingRepository.query(
            `select prop.presentation_id as presentationId,prep.presentation,prep.price_presentation_public as pricePresentationPublic
            ,prep.price_presentation_min as pricePresentationMin,prep.price_presentation_liquidation as pricePresentationLiquidation,prep.type_price as typePrice,sum(prop.units) as quantity,prep.key_sae as keySae,prep.type_presentation as typePresentation from properties_packaging as prop
            inner join presentation_products as prep on prop.presentation_id=prep.presentation_id inner join packaging pack 
            on prop.packaging_id= pack.id where pack.product_id=${productId} and pack.active=1 group by prop.presentation_id; `
        );
    }

    async getPackagingsByProduct(product:ProductRovianda){
        await this.getConnection();
        return await this.packagingRepository.find({where:{productId:product,active:true}});
    };

    async getPackagingAvailableProductLotsPresentation(orderId:number):Promise<Array<PackagingProductPresentationLot>>{
        await this.getConnection();
        return await this.packagingRepository.query(
            `select pack.product_id as productId,pack.lot_id as loteId,sum(propack.units) as quantity,propack.presentation_id as presentationId,
            pp.presentation,pp.type_presentation as typePresentation,pp.price_presentation_public as pricePresentationPublic,pp.price_presentation_min as pricePresentationMin,pp.price_presentation_liquidation as pricePrecentationLiquidation
             from packaging as pack inner join properties_packaging as propack on pack.id=propack.packaging_id inner join presentation_products as pp
             on pp.presentation_id=propack.presentation_id where pack.active=1 and propack.active=1 and pp.presentation_id in (select presentation_id from suborders where order_seller_id=${orderId}) group by propack.presentation_id,pack.lot_id,pack.product_id;`
        ) as Array<PackagingProductPresentationLot>;
    }

    async getPackagingAvailableProductLotsPresentationByProduct(productId:number):Promise<Array<PackagingProductPresentationLot>>{
        await this.getConnection();
        return await this.packagingRepository.query(
            `select pack.product_id as productId,pack.lot_id as loteId,sum(propack.units) as quantity,propack.presentation_id as presentationId,
            pp.presentation,pp.type_presentation as typePresentation,pp.price_presentation_public as pricePresentationPublic,pp.price_presentation_min as pricePresentationMin,pp.price_presentation_liquidation as pricePrecentationLiquidation
             from packaging as pack inner join properties_packaging as propack on pack.id=propack.packaging_id inner join presentation_products as pp
             on pp.presentation_id=propack.presentation_id where pack.active=1 and propack.active=1 and propack.presentation_id="${productId}" group by propack.presentation_id,pack.lot_id,pack.product_id;`
        ) as Array<PackagingProductPresentationLot>;
    }

    async getPackagingByLot(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.query(`
        SELECT packaging.register_date as date,
        presentation_products.presentation as presentation,
        properties_packaging.units as quantity
        FROM packaging
        INNER JOIN properties_packaging ON properties_packaging.packaging_id = packaging.id
        INNER JOIN presentation_products ON properties_packaging.presentation_id = presentation_products.presentation_id
        WHERE packaging.lot_id ="${lotId}";`);
    }

    async getPackagingById(id:number){
        await this.getConnection();
       return await this.packagingRepository.findOne({id},{relations:["propertiesPackaging"]});
    }

    async getPackagingByProcessId(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.find({lotId})
    }

    async getPackagingByOvenProduct(ovenProductId:number){
        await this.getConnection();
        return await this.packagingRepository.find({where:{ovenProduct:{id:ovenProductId}}})
    }

    async getAllProductsToInspection(){
        await this.getConnection();
        return await this.packagingRepository.query(`
            select pr.id,pr.name from products_rovianda as pr where pr.id not in (select productId from cheeses);
        `);
    }

    async getPackagingsByProductAndActive(productId:number){
        await this.getConnection();
        return await this.packagingRepository.query(`
        select pack.lot_id as lotId,oven.processId,oven.id as 
        ovenProductId from packaging as pack inner join oven_products as oven 
        on pack.oven_product_id = oven.id where pack.product_id=${productId}; 
        `);
    }

    async findPackagingByProduc(productId:ProductRovianda){
        await this.getConnection();
        return await this.packagingRepository.find({
            where:{ productId},
            relations:["productId"]
        });
    }

    async getAllDispatched(dateStart:string,dateEnd:string){
        await this.getConnection();
        return await this.packagingRepository.query(`
        select pres.key_sae as keySae,pro.output_of_warehouse as quantity,
            pro.weight_of_warehouse as weight,pack.lot_id as lotId,pack.register_date as outputDate,pack.expiration,pro.observations,
            prod.name,pres.type_presentation as presentation from properties_packaging as pro right join packaging as pack on 
            pro.packaging_id=pack.id right join products_rovianda as prod on pack.product_id=prod.id right join
            presentation_products as pres on pro.presentation_id=pres.presentation_id where register_date between "${dateStart}" and "${dateEnd}";
        `);
    }

    async getLotsToInspectionOfProducts(productId:number){
        await this.getConnection();
        return await this.packagingRepository.query(`
        select oven.new_lote as lotId,oven.processId,oven.id as ovenProductId 
        from oven_products  as oven where oven.product_rovianda_id=${productId} oven.status=='USED'";
        `);    
    }

    async getAllOutputsByPlant(from:string,to:string){
        await this.getConnection();
        let fromStr = from+"T00:00:00.000Z"
        let toSTR = to+"T23:59:59.000Z"
        return (await this.packagingRepository.query(`
        select us.name as seller,pr.code,pr.name,pp.type_presentation as presentation,sm.lote_id as loteId,sm.quantity as units,sm.weigth as weight,sm.output_date as outputDate from suborder_metadata as sm left join suborders as sub on sm.sub_order_id=sub.suborder_id 
        left join orders_sellers as os on sub.order_seller_id=os.order_seller_id left join users as us on os.seller_id = us.id
        left join products_rovianda as pr on sub.product_id =pr.id left join presentation_products as pp 
        on sub.presentation_id = pp.presentation_id where output_date 
        between "${fromStr}" and "${toSTR}";
        `)) as Array<OutputsDeliveryPlant>;
    }
}