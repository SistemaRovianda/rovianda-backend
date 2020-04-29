import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { ProductRoviandaDTO } from "../Models/DTO/ProductRoviandaDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { Request } from "express";

export class ProductRoviandaService{
    private productRoviandaRepository:ProductRoviandaRepository;
    private productRepository:ProductRepository;
    constructor(){
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.productRepository = new ProductRepository();
    }


    async saveProductRovianda(productRoviandaDTO:ProductRoviandaDTO){
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByName(productRoviandaDTO.name);
        if(product) throw new Error("[409], Ya existe un producto con ese nombre");
        let ingredients:Array<Product>=[];
        for(let ingredient of productRoviandaDTO.ingredients){
            let productIngredient:Product = await this.productRepository.getProductById(ingredient);
            if(!productIngredient) throw new Error("[404], no existe el producto con el id: "+ingredient);
            ingredients.push(productIngredient);
        }

        let productRovianda:ProductRovianda = new ProductRovianda();
        productRovianda.name = productRoviandaDTO.name;
        productRovianda.ingredients = ingredients;
        await this.productRoviandaRepository.saveProductRovianda(productRovianda);
    }

    async getProductRovianda(req:Request){
        let productRoviandaId:number = +req.params.productId;
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productRoviandaId);
        if(!productRovianda) throw new Error("[404],el produto no existe");
        return productRovianda;
    }

    async deleteProductRovianda(req:Request){
        let productRoviandaId:number = +req.params.productId;
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productRoviandaId);
        if(!productRovianda) throw new Error("[404],el produto no existe");
        await this.productRoviandaRepository.deleteProductRoviandaById(productRoviandaId);
    }

    async getAllProductsRovianda(){
        return await this.productRoviandaRepository.getAllProducts();
    }
}