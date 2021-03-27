import { Request, Response } from "express";
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { ClientService } from "../Services/Client.Service";

export class ClientController{
    private clientService: ClientService;
    constructor(private firebaseInstance:FirebaseHelper){
        this.clientService = new ClientService();
    }

    async createCustomer(req: Request, res: Response){
        await this.clientService.createCustomer(req);
        return res.status(201).send();
    }

    async getCustomerCount(req:Request,res:Response){
        return res.status(200).send(await this.clientService.getCurrentCountCustomer());
    }

    async createSellerCustomer(req:Request,res:Response){
        return res.status(201).send({clientId:await this.clientService.createSellerCustomer(req.body)});
    }

    async getClientByKey(req:Request,res:Response){
        let key:string = req.params.key;
        return res.status(200).send(await this.clientService.getClientByKey(key));
    }

    async getScheduleCustomerBySeller(req:Request,res:Response){
        let sellerUid = req.query.sellerUid;
        let date = req.query.date;
        return res.status(200).send(await this.clientService.getScheduleByDate(sellerUid,date));
    }

    async createVisitToClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.clientService.createVisit(clientId);
        return res.status(201).send();
    }

    async endVisitToClient(req:Request,res:Response){
        let clientId:number = +req.params.clientId;
        await this.clientService.endVisitToClient(clientId);
        return res.status(204).send();
    }

   async deleteClient(req:Request,res:Response){
        let clientId:number = +req.params.id;
        await this.clientService.deleteClientById(clientId);
        return res.status(204).send();
   }
}
