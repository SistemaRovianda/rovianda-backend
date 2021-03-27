import {connect} from '../Config/Db';
import { Like, Repository } from 'typeorm';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
export class PresentationsProductsRepository{
    private presentationsProductsRepository:Repository<PresentationProducts>;

    async getConnection(){
        if(!this.presentationsProductsRepository){
            this.presentationsProductsRepository = (await connect()).getRepository(PresentationProducts);
        }
    }

    async getPresentationProductByProductRovianda(productRovianda:ProductRovianda){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({
            productRovianda
        });
    }

    async getPresentationProductsById(presentationId:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({id:presentationId},{relations:["productRovianda"]});
    }
  
    async savePresentationsProduct(presentation:PresentationProducts){
        await this.getConnection();
        return await this.presentationsProductsRepository.save(presentation);
    }

    async getLastProductPresentation(){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({
            order: {
                id: 'DESC'
                }
        });
    }

    async getAllPresentations(){
        await this.getConnection();
        return await this.presentationsProductsRepository.find({
            relations:["productRovianda"]
        });
    }

    async savePresentationsProducts(presentation:number,product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`INSERT INTO products_rovianda_presentation (presentation_id ,product_id) VALUES (${presentation},${product})`)
    }

    async getPresentationsProducts(presentation:number,product:number){
        await this.getConnection();
        console.log("consulta")
        return await this.presentationsProductsRepository.query(`
        SELECT * FROM products_rovianda_presentation 
        WHERE presentation_id = ${presentation} 
        AND product_id = ${product}
        `)
    }

    async createPresentation(presentation:PresentationProducts){
        await this.getConnection();
        return await this.presentationsProductsRepository.save(presentation);
    }

    async getPresentatiosProductsByProductRovianda(product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select 
        presentation_products.presentation_id as presentationId,
        presentation_products.presentation,
        presentation_products.type_presentation as typePresentation,presentation_products.key_sae as keySae,
        presentation_products.price_presentation_public as pricePresentationPublic,
        presentation_products.price_presentation_min as pricePresentationMin,
        presentation_products.price_presentation_liquidation as pricePresentationLiquidation
        from presentation_products where product_rovianda_id=${product}
        `)
    }

    async belongToProduct(product:number,presentation:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select * from products_rovianda_presentation
        where products_rovianda_presentation.presentation_id = ${presentation} and products_rovianda_presentation.product_id = ${product}`)
    }

    async deleteById(presentationProductId:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.delete({id:presentationProductId});
    }

    async findByKeySae(presentationKey:string){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({keySae:presentationKey},{relations:["productRovianda"]});
    }
    async findByKeySaeByLike(presentationKey:string){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({keySae:Like(`%${presentationKey}`)},{relations:["productRovianda"]});
    }
}