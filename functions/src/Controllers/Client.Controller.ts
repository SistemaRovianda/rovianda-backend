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
}
