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
}