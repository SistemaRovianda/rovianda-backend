import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { Inspection } from '../Models/Entity/Inspection';
import { Request, Response } from "express";


export class InspectionService{
    private inspectionRepository:InspectionRepository;
    constructor(){
        this.inspectionRepository = new InspectionRepository();
    }


    async getUsersInspection(inspectionId: number) {
        let inspection: Inspection = await this.inspectionRepository.getInspectionById(+inspectionId);
        console.log(inspection); 
        if (!inspection)
            throw Error(`[404], Inspection not found`);
        let response = {
            nameElaborated: inspection.nameElaborated? inspection.nameElaborated : null,
            jobElaborated: inspection.jobElaborated? inspection.jobElaborated : null,
            nameVerify: inspection.nameVerify? inspection.nameVerify : null,
            jobVerify: inspection.jobVerify? inspection.jobVerify : null
        }
        return response;
    }
}