import {Request,Response, response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { InspectionService } from '../Services/Inspection.Service';

export class InspectionController{

    private inspectionService:InspectionService;

    constructor(private firebaseInstance:FirebaseHelper){
        this.inspectionService = new InspectionService();
    }
  
    async getUserInspection(req: Request, res: Response) {
        let id = req.params.inspectionId;
        if (isNaN(+id) || +id < 1)
            throw Error(`[400], Invalid id path param `);
        let response = await this.inspectionService.getUsersInspection(+id);
        return res.status(200).send(response);
    }

    async createInspection(req:Request,res:Response){
        await this.inspectionService.createInspection(req.body);
        return res.status(201).send();
    }

}