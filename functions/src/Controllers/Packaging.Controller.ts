import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PackagingService } from '../Services/Packaging.Service'
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';

export class PackagingController{

   
    private packagingService: PackagingService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.packagingService = new PackagingService();
    }

    async savePackaging(req:Request,res:Response){
        await this.packagingService.savePackaging(req.body);
        return res.status(201).send();
    }

    async getProducts(req:Request,res:Response){
        let products:ProductRovianda[] = await this.packagingService.getProducts();
        return res.status(200).send(products);
    }
  
}