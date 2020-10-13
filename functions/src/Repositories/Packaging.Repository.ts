import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Packaging } from '../Models/Entity/Packaging';
import { OrderSellerRequestProduct, PackagingProperties } from '../Models/DTO/Sales.ProductDTO';
import { PackagingProductPresentationLot } from '../Models/DTO/PackagingDTO';
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
        return await this.packagingRepository.findOne({
            where: {lotId: `${lotId}`}
        });
    }
  
    async findPackagingById(id:number){
        await this.getConnection();
        return await this.packagingRepository.findOne({
            where:{id:`${id}`},
            relations:["productId","userId"]
        });
    }

    async getLastPackaging(){
        await this.getConnection();
        return await this.packagingRepository.query(`SELECT * FROM packaging ORDER BY id DESC LIMIT 1`)
    }

    async getPackaging(){
        await this.getConnection();
        return await this.packagingRepository.find({
            relations:["productId","propertiesPackaging"]
         }
        );
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
            ids+=` pack.id = ${product.productId} or `;
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
            ,prep.price_presentation_min as pricePresentationMin,prep.price_presentation_liquidation as pricePresentationLiquidation,prep.type_price as typePrice,sum(prop.units) as quantity from properties_packaging as prop 
            inner join presentation_products as prep on prop.presentation_id=prep.presentation_id inner join packaging pack 
            on prop.packaging_id= pack.id where pack.product_id=${productId} and pack.active=1 group by prop.presentation_id; `
        );
    }

    async getPackagingAvailableProductLotsPresentation(productId:number):Promise<Array<PackagingProductPresentationLot>>{
        await this.getConnection();
        return await this.packagingRepository.query(
            `select pack.product_id as productId,pack.lot_id as loteId,sum(propack.units) as quantity,propack.presentation_id as presentationId,
            pp.presentation,pp.type_presentation as typePresentation,pp.price_presentation as pricePresentation
             from packaging as pack inner join properties_packaging as propack on pack.id=propack.packaging_id inner join presentation_products as pp
             on pp.presentation_id=propack.presentation_id where pack.active=1 and propack.active=1 and pack.product_id=${productId} group by pack.lot_id,pack.product_id,propack.presentation_id;`
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

    async getPackagingByProcessId(lotId:string){
        await this.getConnection();
        return await this.packagingRepository.find({lotId})
    }

    async getPackagingOrdeByProduct(){
        await this.getConnection();
        return await this.packagingRepository.query(`
        SELECT * FROM packaging  ORDER BY packaging.product_id
        `);
    }

    async findPackagingByProduc(productId:ProductRovianda){
        await this.getConnection();
        return await this.packagingRepository.find({
            where:{ productId},
            relations:["productId","userId"]
        });
    }
}