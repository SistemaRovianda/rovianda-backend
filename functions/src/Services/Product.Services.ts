import { ProductRepository } from "../Repositories/Product.Repository";
import { Product } from "../Models/Entity/Product";
import { Request } from "express";
import { TYPE } from "../Models/Enum/Type.Lot";

export class ProductService{
    private productRepository:ProductRepository;
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(type:string){
        if(type==TYPE.DRIEF || type == TYPE.PACKING){
        return await this.productRepository.getAllProducts(type);
        }else{
            throw new Error("[400], type parameter has a invalid value")
        }
    }

    async createProduct(req:Request){
        let {description,type} = req.body;
        if(!type && (type == TYPE.DRIEF || type == TYPE.PACKING) ) throw new Error("[400],type is missing or type has a invalid value");
        if (!description) throw new Error('[400],description is required');
        let productToSave = new Product();   
        console.log("inicio")
        productToSave.description = description;
        productToSave.type = type;
        console.log("creando")
        return await this.productRepository.createProduct(productToSave);
    }

    async getProductById(productId:number){
        return await this.productRepository.getProductById(productId);
    }

    async getProductsByLotId(lotId:number){
        return await this.productRepository.getProductsByLotId(lotId)
    }
}

