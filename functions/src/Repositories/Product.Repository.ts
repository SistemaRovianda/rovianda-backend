import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Product } from '../Models/Entity/Product';
import { TYPE } from '../Models/Enum/Type.Lot';

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

    

    async getProductByDescription(description:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.findOne({
            where: {description}
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
}
