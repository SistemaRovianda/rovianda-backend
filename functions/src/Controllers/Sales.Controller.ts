import {Request,Response} from 'express';
import { SalesRequestService } from '../Services/Sales.Request.Service';

import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { Sale } from '../Models/Entity/Sales';


export class SalesRequestController{

   
    private salesRequestService: SalesRequestService;
    private productRoviandaService:ProductRoviandaService;
    constructor(firebaseHelper:FirebaseHelper){
        this.salesRequestService = new SalesRequestService(firebaseHelper);
        this.productRoviandaService = new ProductRoviandaService(firebaseHelper);
    }
    
    async createSeller(req:Request,res:Response){
        await this.salesRequestService.createSeller(req.body);
        return res.status(201).send();
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
        await this.salesRequestService.payDeb(debId,req.body);
        return res.status(204).send();
    }

    async saveSellerOperation(req:Request,res:Response){
        await this.salesRequestService.saveSellerOperation(req.body);
        return res.status(201).send();
    }

    async updateHourSellerOperation(req:Request,res:Response){
        await this.salesRequestService.updateHourSellerOperation(req.params.sellerUid);
        return res.status(204).send();
    }

    async timesMovents(req:Request,res:Response){
        let response = await this.salesRequestService.timesMovents(req.params.sellerUid);
        return res.status(200).send(response);
    }

    async saleClient(req:Request,res:Response){
        let response = await this.salesRequestService.saleClient(req.params.sellerUid,+req.params.saleId);
        return res.status(200).send(response);
    }
    
    async reportSales(req:Request,res:Response){
        let response = await this.salesRequestService.reportSales(req.params.sellerUid);
        return res.status(200).send(response);
    }

    
    // async getSalesRequest(req:Request, res:Response){ 
             
    //     let sales_request = await this.salesRequestService.getSales(); 
    //     return res.status(200).send(sales_request);
    // }

    async getSellerGuard(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getSellerGuards(req.params.sellerUid));
    }

    async getAllClients(req:Request,res:Response){
        let sellerUid:string = req.params.sellerUid;
        let hint:number = !req.query.hint?0:+req.query.hint;
        return res.status(200).send(await this.salesRequestService.getAllSellerClientsBySellerUid(sellerUid,hint));
    }

    async getAllProductRoviandaCatalog(req:Request,res:Response){
        return res.status(200).send(await this.productRoviandaService.getAllproductsRoviandaCatalog());
    }

    async getAllProductRoviandaCatalogPresentation(req:Request,res:Response){
        let productId:number = +req.params.productId;
        return res.status(200).send(await this.productRoviandaService.getProductsPresentation(productId));
    }
    
    async createSaleSae(req:Request,res:Response){
        let sale:Sale =await this.salesRequestService.createSaleSae(req.body);
        return res.status(200).send({saleId:sale.saleId});
    }

    async getAllTaxScheme(req:Request,res:Response){
        let result = await this.salesRequestService.getAllTaxSchemas();
        return res.status(200).send(result);
    }

    async getSellerCountKey(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getSellerCount());
    }

    async getTaxSchema(req:Request,res:Response){
        return res.status(200).send(await this.salesRequestService.getAllTaxSchemas());
    }

    async getClientDebts(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        return res.status(200).send(await this.salesRequestService.getDebtsOfClient(clientId));
    }

    async getSaleTicket(req:Request,res:Response){
        let saleId:number = +req.params.saleId;
        return res.status(200).send(await this.salesRequestService.getTicketOfSale(saleId));
    }

} 