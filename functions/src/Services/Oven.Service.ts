import { OvenRepository } from "../Repositories/Oven.Repository";
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenDTO } from "../Models/DTO/Oven.Products.DTO";
import { ProductRepository } from '../Repositories/Product.Repository';

export class OvenService{

    private ovenRepository:OvenRepository;
    private productRepository:ProductRepository;
    
    constructor(){
        this.ovenRepository = new OvenRepository();
        this.productRepository = new ProductRepository();
    }

    async getOvenProducts(){
        return await this.ovenRepository.getOvenProducts();
    }
}