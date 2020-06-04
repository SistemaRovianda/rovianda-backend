import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { Inspection } from '../Models/Entity/Inspection';
import { Request, Response } from "express";
import { InspectionDTO } from '../Models/DTO/InspectionDTO';

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

    async createInspection(inspectionDTO:InspectionDTO){
        console.log(inspectionDTO);
        if (!inspectionDTO.lotId)  throw new Error("[400],lotId is required");
        if (!inspectionDTO.expirationDate)  throw new Error("[400],expirationDate is required");
        if (!inspectionDTO.productId)  throw new Error("[400],productId is required");
        if (!inspectionDTO.numberPackages)  throw new Error("[400],numberPackages is required");
        if (!inspectionDTO.observations)  throw new Error("[400],observations is required");
        if (inspectionDTO.validations.packagingControl == null)  throw new Error("[400],packaginControl is required");
        if (inspectionDTO.validations.foreignMatter == null)  throw new Error("[400],foreignMatter is required");
        if (inspectionDTO.validations.transport == null)  throw new Error("[400],transport is required");
        if (inspectionDTO.validations.weightPerPiece == null)  throw new Error("[400],weightPerPiece is required");
        if (inspectionDTO.validations.temperature == null)  throw new Error("[400],temperature is required");
        if (inspectionDTO.validations.odor == null)  throw new Error("[400],odor is required");
        if (inspectionDTO.validations.colour == null)  throw new Error("[400],colour is required");
        if (inspectionDTO.validations.texture == null)  throw new Error("[400],texture is required");

        let product = await this.inspectionRepository.getProductInspection(+inspectionDTO.productId);
        if (!product)  throw new Error("[400],producto no encontrado en tabla packaging");
        let lot = await this.inspectionRepository.getLotInspection(+inspectionDTO.lotId);
        if (!lot)  throw new Error("[400],lot no encontrado en tabla packaging");

            let inspection :Inspection = new Inspection();
            inspection.lotId = inspectionDTO.lotId;
            inspection.expirationDate = inspectionDTO.expirationDate;
            inspection.productId = inspectionDTO.productId;
            inspection.numberPackages = inspectionDTO.numberPackages;
            inspection.observations = inspectionDTO.observations;
            inspection.packagingControl = inspectionDTO.validations.packagingControl;
            inspection.foreingMatter = inspectionDTO.validations.foreignMatter;
            inspection.transport = inspectionDTO.validations.transport;
            inspection.weightPerPiece = inspectionDTO.validations.weightPerPiece;
            inspection.temperature = inspectionDTO.validations.temperature;
            inspection.odor = inspectionDTO.validations.odor;
            inspection.colour = inspectionDTO.validations.colour;
            inspection.texture = inspectionDTO.validations.texture;
    
            await this.inspectionRepository.createInspection(inspection);   
    }
}