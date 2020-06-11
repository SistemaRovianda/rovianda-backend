import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SalesRequest } from "../Models/Entity/Sales.Request";
import { Request } from "express";



export class SalesRequestService{
    private salesRequestRepository:SalesRequestRepository;
    constructor(){
        this.salesRequestRepository = new SalesRequestRepository();
    }
    
    async getSales(){

      let sales_request : SalesRequest[] = await this.salesRequestRepository.getSalesRequest();
      
      let response = [];
        sales_request.forEach(i => {
          response.push({
            userId: `${i.userId}`,
            noOrder: `${i.requestId}`,
            vendedor: `${i.vendedor}`,  
          });
        });
      return response;
    }
}