import {connect} from '../Config/Db';
import { Repository } from 'typeorm';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
export class PresentationsProductsRepository{
    private presentationsProductsRepository:Repository<PresentationProducts>;

    async getConnection(){
        if(!this.presentationsProductsRepository){
            this.presentationsProductsRepository = (await connect()).getRepository(PresentationProducts);
        }
    }

    async getPresentatiosProductsById(id:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.findOne({id});
    }

    async createPresentation(presentation:PresentationProducts){
        await this.getConnection();
        return await this.presentationsProductsRepository.save(presentation);
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

    async savePresentationsProducts(presentation:number,product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`INSERT INTO products_rovianda_presentation (presentation_id ,product_id) VALUES (${presentation},${product})`)
    }

    async getPresentatiosProductsByProductRovianda(product:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select 
        presentation_products.presentation_id as presentationId,
        presentation_products.presentation,
        presentation_products.type_presentation as typePresentation,
        presentation_products.price_presentation as pricePresentation
        from presentation_products
        left join products_rovianda_presentation
        on products_rovianda_presentation.product_id = ${product}
        where products_rovianda_presentation.presentation_id = presentation_products.presentation_id;
        
        `)
    }

    async belongToProduct(product:number,presentation:number){
        await this.getConnection();
        return await this.presentationsProductsRepository.query(`select * from products_rovianda_presentation
        where products_rovianda_presentation.presentation_id = ${presentation} and products_rovianda_presentation.product_id = ${product}`)
    }
}