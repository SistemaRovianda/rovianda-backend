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

    async getFormulationByProductRovianda(req:Request,res:Response){
        let productRoviandaId:number = +req.params.productRoviandaId;
        let products = await this.formulationService.getFormulationByProductRovianda(productRoviandaId);   
        return res.status(200).send(products);
    }

    async getFormulationByRawMaterial(req:Request,res:Response){ //Servicio que retorna todos los registros de formulacion activo que tienen la materia prima indicada
        let rawMaterialId:number = +req.params.rawMaterialId;
        return res.status(200).send(await this.formulationService.getByRawMaterial(rawMaterialId));
    }

    // async getAllFormulationLoteMeat(req:Request,res:Response){
    //     let loteMeat = await this.formulationService.getAllFormulationLoteMeat();
    //     return res.status(200).send(loteMeat);
    // }

    async getAllLotMeatByProductId(req:Request,res:Response){
        let response = await this.formulationService.getAllLotMeatByProductId(+req.query.rawMaterialId,req.query.status)
        return res.status(200).send(response);
    }
}