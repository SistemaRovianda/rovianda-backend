import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Product } from '../Models/Entity/Product';
import { OvenService } from '../Services/Oven.Service';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { ErrorHandler } from '../Utils/Error.Handler';

export class OvenController{

   
    private ovenService: OvenService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.ovenService = new OvenService();
    }

    async saveOvenProduct(req:Request,res:Response){
        await this.ovenService.saveOvenProduct(req.body);
        return res.status(201).send();
    }

    async getOvenProducts(req:Request, res:Response){ 
             
        let oven_products:OvenProducts[] = await this.ovenService.getOvenProducts(); 
        let response:any = [];
        oven_products.forEach((i:any) => {
            response.push({
                oven_product_id: `${i.id}`,
                pcc: `${i.pcc}`,
                product: {
                    id: `${i.product_id}`,
                    description: `${i.description}`, 
                },
                newLotId: `${i.new_lote}`,
                date: `${i.date}`
            });
        });
        return res.status(200).send(response);
    }

    async getOvenProductsByProductId(req:Request,res:Response){
        let oven = await this.ovenService.getOvenProductsByProductId(req);
        return res.status(200).send(oven);
    }

    async updateOvenProduct(req:Request,res:Response){
        let id = req.params.productId;
        await this.ovenService.updateOvenProductStatus(+id);
        return res.status(204).send();
    }
  
}