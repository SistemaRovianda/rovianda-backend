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

        if(type==TYPE.DRIEF )
            return await this.productRepository.getAllProductsDrief(TYPE.DRIEF);
        
        if(type == TYPE.PACKING){
            return await this.productRepository.getAllProductsPacking(TYPE.PACKING);
        }else{
            throw new Error("[400], type parameter has a invalid value")
        }
    }

    async createProduct(req:Request){
        let {description,type} = req.body;
        if(!type && (type == TYPE.DRIEF || type == TYPE.PACKING) ) throw new Error("[400],type is missing or type has a invalid value");
        if (!description) throw new Error('[400],description is required');
        let objProdcuts:Product = await this.productRepository.getProductByDescription(description);
        if(!objProdcuts){
            let productToSave = new Product();   
            console.log("inicio")
            productToSave.description = description;
            //productToSave.type = type;
            console.log("creando")
            return await this.productRepository.createProduct(productToSave);
        }else{
            throw new Error('[409],There is already a product with that name');
        }
    }

    async getProductById(productId:number){
        return await this.productRepository.getProductById(productId);
    }

    async getProductsByLotId(lotId:number){
        return await this.productRepository.getProductsByLotId(lotId)
    }
}

