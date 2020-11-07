import {Request,Response} from 'express';
import { ProductService } from '../Services/Product.Services';
import { Product } from '../Models/Entity/Product';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { FileInterface, SaveProductRoviandaDTO } from '../Models/DTO/ProductRoviandaDTO';
import {keys} from "ts-transformer-keys";
import { keysIn } from 'lodash';
export class ProductController{

    private productService:ProductService;
    private productRoviandaService:ProductRoviandaService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.productService = new ProductService();
        this.productRoviandaService = new ProductRoviandaService(this.firebaseInstance);
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
        let productId:number = +req.params.productId;
        let imageProduct= (req.files.length)?req.files[0] :null;
        await this.productRoviandaService.updateProductRovianda(req.body,productId,imageProduct);
        return res.status(201).send();
    }

    async getProductRoviandaByCode(req:Request,res:Response){
        let response = await this.productRoviandaService.getProductsRoviandaByCode(req);
        return res.status(200).send(response);
    }

    async getProductsLines(req:Request,res:Response){
        return res.status(200).send(await this.productRoviandaService.getLinesOfProductsSae());
    }

    async createProductLine(req:Request,res:Response){
        await this.productRoviandaService.createProductLineSae(req.body);
        return res.status(201).send();
    }

    async getAllProductsLines(req:Request,res:Response){
        let result = await this.productRoviandaService.getAllProductLines();
        return res.status(200).send(result);
    }
}