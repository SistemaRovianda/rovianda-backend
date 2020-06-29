import { FormulationService } from "../Services/Formulation.Service";
import { Request, Response } from "express";
import { FirebaseHelper } from "../Utils/Firebase.Helper";

export class FormulationController {
    private formulationService: FormulationService;
    constructor(
        private firebaseInstance: FirebaseHelper
    ) {
        this.formulationService = new FormulationService();
    }

    async createFormulation(req: Request, res: Response) {
        let id = await this.formulationService.createFormulation(req);
        return res.status(201).send({formulationId: id});
    }

    async getFormulation(req:Request,res:Response){
        let products = await this.formulationService.getFormulation();   
        return res.status(200).send(products);
    }
}