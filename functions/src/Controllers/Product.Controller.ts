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
        let {description} = req.body;
            if (!description) return res.status(400).send({ msg: 'description is required'});
        let productToSave = new Product();   
        try{
                console.log("inicio")
                productToSave.description = description;
                console.log("creando")
                await this.productService.createProduct(productToSave);
                return res.status(201).send();
        }catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }

    async getAllProducts(req:Request,res:Response){
        try{
            let products:Product[] = await this.productService.getAllProducts();
            let response:any = [];
            products.forEach((i:any) => {
                response.push({
                lote: `${i.lote}`,
                description: `${i.description}`
                });
            });
        return res.status(200).send(response);
        }catch(err){
            return res.status(500).send(err);
        } 
    }
}