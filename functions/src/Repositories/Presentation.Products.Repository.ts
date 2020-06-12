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
}