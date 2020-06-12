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
        await this.packagingService.savePackaging(req);
        return res.status(201).send();
    }

    async getProducts(req:Request,res:Response){
        let products:ProductRovianda[] = await this.packagingService.getProducts();
        return res.status(200).send(products);
    }
  
    async getHistoryPackaging(req:Request,res:Response){
        let packaging = await this.packagingService.getHistoryPackaging(req.params.lotId);
        return res.status(200).send(packaging);
    }

    async saveReprocessing(req:Request,res:Response){
        await this.packagingService.saveReprocessing(req.body);
        return res.status(201).send();
    }
  
    async saveUsersPackaging(req:Request,res:Response){
        await this.packagingService.saveUsersPackaging(req.body, req.params.packagingId);
        return res.status(201).send();
    }

    async getPackagingColaboratedById(req:Request,res:Response){
        let packaging = await this.packagingService.getPackagingColaboratedById(+req.params.packagingId);
        return res.status(200).send(packaging);
    }

    async getPackagingAssignedBoxes(req: Request, res: Response){
        let response = await this.packagingService.getPackagingAssignedBoxes(req);
        return res.status(200).send(response);
    }
}