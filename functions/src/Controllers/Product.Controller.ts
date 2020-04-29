import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { ProductService } from '../Services/Product.Services';
import { Product } from '../Models/Entity/Product';

export class ProductController{

    private productService:ProductService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.productService = new ProductService();
    }


    async createProduct(req:Request,res:Response){
        await this.productService.createProduct(req);
        return res.status(201).send();
    }

    async getAllProducts(req:Request,res:Response){
        let products:Product[] = await this.productService.getAllProducts(req.params.type);   
        return res.status(200).send(products);
    }
}