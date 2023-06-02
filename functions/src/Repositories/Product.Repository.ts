import {connect} from '../Config/Db';
import { Like, Repository } from 'typeorm';
import { Product } from '../Models/Entity/Product';
import { TYPE } from '../Models/Enum/Type.Lot';
import { OfflineNewVersionProducts } from '../Models/DTO/Admin.Sales.Request';

export class ProductRepository{
    private productRepository:Repository<Product>;

    async getConnection(){
        if(!this.productRepository){
            this.productRepository = (await connect()).getRepository(Product);
        }
    }
    async createProduct(product:Product){
        await this.getConnection();
        return await this.productRepository.save(product);
    }

    async getAllProductInformative(type:string){
        await this.getConnection();
        return await this.productRepository.find({});
    }

    async getAllProductsDriefPacking(type: string){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(
            `SELECT product_catalog.id, product_catalog.description 
                FROM product_catalog 
                where type="${type}"`
            );
    }

   

    async getProductById(id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.findOne({id});
    }

    

    async getProductByDescription(description:string){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.findOne({
            where: {description:Like(`%${description}%`)}
        });
    }

    async belongTo(roviandaId:number,catalogId:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`select * from ingredients
        where ingredients.productsRoviandaId = ${roviandaId} and ingredients.productCatalogId = ${catalogId};`);  
    }

    async getProductsByLotId(lotId:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`SELECT product.description, process.lote_interno FROM product INNER JOIN process on product.id = process.product_id WHERE process.lote_interno = ${lotId}`)
    }

    async getAllIngredents(category:string){
        await this.getConnection();
        return await this.productRepository.find({category});
    }
/*
    async saveIngredients(rovianda:number,catalog:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`INSERT INTO ingredients (productsRoviandaId,productCatalogId) VALUES (${rovianda},${catalog})`)
    }*/

    async getIngredients(rovianda:number,catalog:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`
        SELECT * FROM ingredients 
        WHERE productsRoviandaId = ${rovianda} 
        AND productCatalogId = ${catalog}
        `)
    }

    async getIngredientsByProduct(id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`select 
        product_catalog.id as ingredientId,
        product_catalog.description,
        product_catalog.mark, 
        product_catalog.variant, 
        product_catalog.presentation 
        from product_catalog 
        inner join ingredients
        on ingredients.productsRoviandaId = ${id}
        where ingredients.productCatalogId = product_catalog.id;`)
    
    }

    async getAllProductsExisting(type:string){
        await this.getConnection();
        return await this.productRepository.query(`
        select distinct(pc.description),pc.id,pc.mark,pc.variant,pc.presentation,pc.category,pc.state FROM product_catalog  as pc where pc.category="${type}" and pc.state=1
        `) as Array<Product>;
    }

    async deleteIngredientById(productRoviandaId:number,ingredientId:number){
        await this.getConnection();
        return await this.productRepository.query(
            `delete from  ingredients where productsRoviandaId=${productRoviandaId} and productCatalogId=${ingredientId}`
        );
    }
    async getAllProductsCatalogByPresentation(){
        await this.getConnection();
        return (await this.productRepository.query(
            `select pp.presentation_id as id,pr.name,pp.type_presentation as typePresentation,pp.key_sae as keySae from products_rovianda as pr left join presentation_products as pp on pr.id = pp.product_rovianda_id where pp.key_sae is not null;`
        ) ) as {id:number,name:string,typePresentation:string,keySae:string}[];
    }
    async getProductsOfflineNewVersion(sellerId:string){
        await this.getConnection();
        return await this.productRepository.query(
            `
            select pr.id as productId,pr.name,pp.type_presentation as presentationName,pp.uni_med as uniMed,pp.price_presentation_public as price,
            if(pp.key_altern is not null,pp.key_altern,pp.key_sae) as productKey,
            pp.presentation_id as presentationId,pp.price_presentation_min as weightOriginal ,if(t.quantity is null,0,t.quantity) as quantity,pp.esq_key as esqKey,pp.esq_description as esqDescription
            from products_rovianda as pr left join presentation_products as pp on pr.id=pp.product_rovianda_id
            left join 
            (select sum(quantity) as quantity, productId,presentation_id from seller_inventory where seller_id="${sellerId}" group by productId,presentation_id) as t
            on pp.presentation_id=t.presentation_id where pp.status=1 and pp.presentation_id is not null;
            `
            ) as OfflineNewVersionProducts[];
    }
}
