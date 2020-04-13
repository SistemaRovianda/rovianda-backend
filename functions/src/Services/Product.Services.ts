import { ProductRepository } from "../Repositories/Product.Repository";

export class ProductService{
    private productRepository:ProductRepository;
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(){
        return await this.productRepository.getAllProducts();
    }
}