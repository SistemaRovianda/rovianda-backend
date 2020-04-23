import { ProductRepository } from "../Repositories/Product.Repository";
import { Product } from "../Models/Entity/Product";

export class ProductService{
    private productRepository:ProductRepository;
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(){
        return await this.productRepository.getAllProducts();
    }

    async createProduct(product:Product){
        return await this.productRepository.createProduct(product);
    }

    async getProductById(product_id:number){
        return await this.productRepository.getProductById(product_id);
    }
}