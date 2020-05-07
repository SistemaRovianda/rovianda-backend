import {Request,Response} from 'express';
import { ProductService } from '../Services/Product.Services';
import { Product } from '../Models/Entity/Product';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';

export class ProductController{

    private productService:ProductService;
    private productRoviandaService:ProductRoviandaService;
    constructor(){
        this.productService = new ProductService();
        this.productRoviandaService = new ProductRoviandaService();
    }


    async createProductCatalog(req:Request,res:Response){
        await this.productService.createProduct(req);
        return res.status(201).send();
    }

    async getAllProductsCatalog(req:Request,res:Response){
        let products:Product[] = await this.productService.getAllProducts(req.params.type);   
        return res.status(200).send(products);
    }

     async createProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.saveProductRovianda(req.body);
        return res.status(201).send();
    } 

    async getProductRovianda(req:Request,res:Response){
        let productRovianda = await this.productRoviandaService.getProductRovianda(req);
        return res.status(200).send(productRovianda);    
    }

    async deleteProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.deleteProductRovianda(req);
        return res.status(204).send();
    }

    async getAllProductsRovianda(req:Request,res:Response){
        let productsRovianda:Array<ProductRovianda> = await this.productRoviandaService.getAllProductsRovianda();
        return res.status(200).send(productsRovianda);
    }
}   