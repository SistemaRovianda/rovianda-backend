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

    async getAllProducts(){
        await this.getConnection();
        try {
            console.log("consulta")
            return await this.productRepository.find()
           } catch (error) {
            console.log(error);   
           }
    }

    async getProductById(product_id:number){
        await this.getConnection();
        console.log("consulta")
        return await this.productRepository.query(`SELECT * FROM product WHERE id = ${product_id}`)
    }
}