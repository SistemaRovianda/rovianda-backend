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
        await this.formulationService.createFormulation(req);
        return res.status(200).send();
    }
}