import {Request,Response} from 'express';
import { SalesRequestService } from '../Services/Sales.Request.Service';


export class SalesRequestController{

   
    private salesRequestService: SalesRequestService;
    constructor(){
        this.salesRequestService = new SalesRequestService();
    }

    async getSalesRequest(req:Request, res:Response){ 
             
        let sales_request = await this.salesRequestService.getSales(); 
        return res.status(200).send(sales_request);
    }

    async saveSalesProducts(req:Request,res:Response){
        await this.salesRequestService.saveSalesProduct(req.body);
        return res.status(201).send();
    }
  
}