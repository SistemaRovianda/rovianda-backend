import {Request,Response} from 'express';
import { SalesRequestService } from '../Services/Sales.Request.Service';
import { times } from 'lodash';


export class SalesRequestController{

   
    private salesRequestService: SalesRequestService;

    constructor(){
        this.salesRequestService = new SalesRequestService();
    }
    
    async saveOrderSeller(req:Request,res:Response){
        let uid = req.params.sellerUid;//req.headers.uid as string;
        if(!uid.length){
            throw new Error("[403],Error en las credenciales del request");
        }
        await this.salesRequestService.saveOrderSeller(uid,req.body);
        return res.status(201).send();
    }

    async getOrdersOfSeller(req:Request,res:Response){
        let uid = req.params.sellerUid;//req.headers.uid as string;
        if(!uid.length){
            throw new Error("[403],Error en las credenciales del request");
        }

        return res.status(200).send(await this.salesRequestService.getOrdersBySeller(uid));
    }

    async getProductOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        return res.status(200).send(await this.salesRequestService.getProductsOfOrderSeller(orderId));
    }

    async getPresentationsOfProductOfOrderSeller(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        let productId:number =+req.params.productId;
        if(orderId<1) throw new Error("[400], el valor de la orden debe ser mayor a cero");
        if(productId<1) throw new Error("[400], el valor del producto debe ser mayor a cero");
        return res.status(200).send(await this.salesRequestService.getPresentationsOfProductOfOrder(orderId,productId));
    }

    async getSellerPackagingInventory(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getRoviandaInventory());
    }

    async getSellerPackagingInventoryProduct(req:Request,res:Response){
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.salesRequestService.getRoviandaInventoryProduct(productId));
    }

    async getSellerInventory(req:Request,res:Response){
        let sellerUid = req.params.sellerUid;
        return res.status(200).send(await this.salesRequestService.getSellerInventory(sellerUid));
    }

    async getSellerInventoryProduct(req:Request,res:Response){
        let sellerUid:string =req.params.sellerUid;
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.salesRequestService.getSellerInventoryProductPresentation(sellerUid,productId));
    }

    async getClientPending(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        return res.status(200).send(await this.salesRequestService.getClientsOfSeller(sellerUid));
    }

    async payDebPending(req:Request,res:Response){
        let debId:number = +req.params.debId;
        await this.salesRequestService.payDeb(debId);
        return res.status(204).send();
    }

    
    // async getSalesRequest(req:Request, res:Response){ 
             
    //     let sales_request = await this.salesRequestService.getSales(); 
    //     return res.status(200).send(sales_request);
    // }

    
} 