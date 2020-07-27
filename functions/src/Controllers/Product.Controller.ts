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

    async getAllProductsCatalogByType(req:Request,res:Response){
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

    async getProductsByLotId(req:Request,res:Response){
        let products:Product[] = await this.productService.getProductsByLotId(+req.params.lotId);
        return res.status(200).send(products);
    }

    async getProductsPresentationByRoviandaId(req: Request, res: Response){
        const response = await this.productRoviandaService.getProductsPresentationByRoviandaId(req);
        return res.status(200).send(response)
    }

    async saveProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.createProductRovianda(req.body);
        return res.status(201).send();
    }

    async addIngredent(req:Request,res:Response){
        await this.productService.addIngredent(req.body);
        return res.status(201).send();
    }

    async getAllIngredents(req:Request,res:Response){
        let response = await this.productService.getAllIngredents(req.query.type);
        return res.status(200).send(response);
    }

    async deleteIngredent(req:Request,res:Response){
        await this.productService.deleteIngredent(+req.params.ingredientId);
        return res.status(204).send();
    }

    async getAllProductRovianda(req:Request,res:Response){
        let response = await this.productRoviandaService.getAllProductRoviandaState();
        return res.status(200).send(response);
    }

    async deleteProductRoviandaLogic(req:Request,res:Response){
        await this.productRoviandaService.deleteProductRoviandaLogic(+req.params.roviandaId);
        return res.status(204).send();
    }

    async deletePresentation(req:Request,res:Response){
        await this.productRoviandaService.deletePresentation(+req.params.presentationId);
        return res.status(204).send();
    }


    async getProductRoviandaByRoviandaId(req:Request,res:Response){
        let response = await this.productRoviandaService.getProductsRoviandaByRoviandaId(req);
        return res.status(200).send(response);
    }

    async updateProductRovianda(req:Request,res:Response){
        await this.productRoviandaService.updateProductRovianda(req.body,req);
        return res.status(201).send();
    }

    async getProductRoviandaByCode(req:Request,res:Response){
        let response = await this.productRoviandaService.getProductsRoviandaByCode(req);
        return res.status(200).send(response);
    }
}