import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { Product } from '../Models/Entity/Product';

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

    async getAllProductsDrief(type: string){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(
            `SELECT product_catalog.id, product_catalog.description 
                FROM product_catalog 
                INNER JOIN warehouse_drief ON
                product_catalog.id = warehouse_drief.productId`
            );
    }

    async getAllProductsPacking(type: string){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(
            `SELECT product_catalog.id, product_catalog.description 
                FROM product_catalog 
                INNER JOIN warehouse_packing ON
                product_catalog.id = warehouse_packing.productId`
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
        where ingredients.productsRoviandaId = ${roviandaId} and ingredients.productCatalogId = ${catalogId};`
            );  
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

    async saveIngredients(rovianda:number,catalog:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`INSERT INTO ingredients (productsRoviandaId,productCatalogId) VALUES (${rovianda},${catalog})`)
    }

    async getIngredientsByProduct(id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`select 
        product_catalog.id as ingredentId,
        product_catalog.description,
        product_catalog.mark, 
        product_catalog.variant, 
        product_catalog.presentation 
        from product_catalog 
        inner join ingredients
        on ingredients.productsRoviandaId = ${id}
        where ingredients.productCatalogId = product_catalog.id;`)
    
    }
}
