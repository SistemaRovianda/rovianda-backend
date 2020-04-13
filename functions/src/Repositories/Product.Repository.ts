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

    async getAllProducts(){
        await this.getConnection();
        
        try {
           let products= await this.productRepository.query(`select * from product inner join warehouse_packing on product.id= warehouse_packing.id inner join warehouse_drief on product.id=warehouse_drief.id ;`);
            return (products);
    
           } catch (error) {
            console.log(error);   
           }
    }
}