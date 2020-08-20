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
        let response = await this.packagingService.savePackaging(req.body);
        return res.status(201).send({packaging: response});
    }

    async updateReprocessing(req:Request,res:Response){
        await this.packagingService.updateReprocessing(req.body);
        return res.status(204).send();
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

    async getReprocessingByArea(req:Request,res:Response){
        let response = await this.packagingService.getReprocessingByArea(req.params.area);
        return res.status(200).send(response);
    }
  
    async saveUsersPackaging(req:Request,res:Response){
        await this.packagingService.saveUsersPackaging(req.body, req.params.packagingId);
        return res.status(201).send();
    }

    async getPackagingColaboratedById(req:Request,res:Response){
        let packaging = await this.packagingService.getPackagingColaboratedById(+req.params.packagingId);
        return res.status(200).send(packaging);
    }

    async savePackagingAssigned(req:Request,res:Response){
            await this.packagingService.savePackagingAssigned(req.body);
            return res.status(201).send();
    }
      
    async getPackagingAssignedBoxes(req: Request, res: Response){
        let response = await this.packagingService.getPackagingAssignedBoxes(req);
        return res.status(200).send(response);
    }

    async getPackaging(req: Request, res: Response){
        let response = await this.packagingService.getPackaging();
        return res.status(200).send(response);
    }

    async getPackagingInventoryLotsProduct(req:Request,res:Response){
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.packagingService.getProductPresentationInventory(productId));
    }

    async savePackagingInventoryLotsProductOutput(req:Request,res:Response){
        let userPackingId:string = req.params.userPackingId;
        await this.packagingService.savePackagingInventoryLotsProductOutput(req.body,userPackingId)
        return res.status(201).send();
    }

    async saveSubOrderMetaData(req:Request,res:Response){
        await this.packagingService.saveSubOrderMetaData(req);
        return res.status(201).send();
    }

    async getOrderSellerByUrgent(req:Request,res:Response){
        let response = await this.packagingService.getOrderSellerByUrgent(req.params.urgent);
        return res.status(200).send(response);
    }
}