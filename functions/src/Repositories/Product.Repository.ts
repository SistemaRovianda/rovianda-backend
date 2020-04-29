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

    async getAllProducts(type: string){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.find({where:{type}})
    }

    async getProductById(id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.findOne({id});
    }
}