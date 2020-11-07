import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { OvenService } from '../Services/Oven.Service';
import { RevisionOvenProductService } from '../Services/Revision.Oven.Product.Service';
export class OvenController{

   
    private ovenService: OvenService;
    private revisionOvenProductService: RevisionOvenProductService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.ovenService = new OvenService();
        this.revisionOvenProductService = new RevisionOvenProductService();
    }

    async saveOvenProduct(req:Request,res:Response){
        await this.ovenService.saveOvenProduct(req.body);
        return res.status(201).send();
    }

    async getOvenProducts(req:Request, res:Response){   
        let oven_products = await this.ovenService.getOvenProducts(req.query.status); 
        return res.status(200).send(oven_products);
    }

    async getOvenProductsById(req:Request,res:Response){
        let oven = await this.ovenService.getOvenProductsById(req);
        return res.status(200).send(oven);
    }

    async updateOvenProduct(req:Request,res:Response){
        let id = req.params.productId;
        await this.ovenService.updateOvenProductStatus(+id);
        return res.status(204).send();
    }

    async markUsedOvenProductStatus(req:Request,res:Response){
        let ovenProductId:number = +req.params.ovenProductId;
        await this.ovenService.markUsedOvenProductStatus(ovenProductId);
        return res.status(204).send();
    }

    async saveOvenUser(req:Request,res:Response){
        await this.ovenService.saveOvenUser(+req.params.processId , req.body);
        return res.status(201).send();
    }  
    
    async createRevisionOvenProduct(req:Request, res:Response){
        await this.revisionOvenProductService.createRevisionOvenProduct(req);
        return res.status(204).send();
    }

    async getOvenProductUser(req:Request,res:Response){
        let id = req.params.productId;
        if(isNaN(+id) || +id<1)
            throw new Error(`[400], invalid param 'id'`);
        let response = await this.ovenService.getOvenProductUserById(+id);
        return res.status(200).send(response);
    }

    async getProductsByOvenClosed(req: Request, res: Response){
        const result = await this.ovenService.getProductsByOvenClosed();
        return res.status(200).send(result);
    }
  
    //     let oven_products:OvenProducts[] = await this.ovenService.getOvenProducts(); 
    //     let response:any = [];
    //     oven_products.forEach((i:any) => {
    //         response.push({
    //             oven_product_id: `${i.id}`,
    //             pcc: `${i.pcc}`,
    //             product: {
    //                 id: `${i.product_id}`,
    //                 description: `${i.description}`, 
    //             },
    //             newLotId: `${i.new_lote}`,
    //             date: `${i.date}`
    //         });
    //     });
    //     return res.status(200).send(response);
    // }
}