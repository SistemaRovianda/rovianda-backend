import { GrindingRepository } from "../Repositories/Grinding.Repository";
import { Grinding } from "../Models/Entity/Grinding";
import { Request } from "express";
import { Process } from "../Models/Entity/Process";
import { ProcessRepository } from "../Repositories/Process.Repository";

export class GrindingService{
    private grindingRepository:GrindingRepository;
    private processRepository: ProcessRepository;
    constructor(){
        this.grindingRepository = new GrindingRepository();
        this.processRepository = new ProcessRepository();
    }

    async getGrindingById(id:number){
        return await this.grindingRepository.getGrindingById(id);
    }

    async getGrindingByProcessId(req: Request){
        let id = req.params.processId;
        let process: Process = await this.processRepository.getProcessWithGrindingById(+id);
        if(!process)
            throw new Error(`[409],process with id ${id} wasn't found`);
        if(!process.moliendaId)
            return {};
            
        let response = {
            rawMaterial: process.moliendaId.raw,
            process: process.moliendaId.process,
            weight: process.moliendaId.weight,
            date: process.moliendaId.date
        }
        return response;
    }

    async saveGrinding(grinding:Grinding){
        return await this.grindingRepository.saveGrinding(grinding);
    }

    async getLastGrinding(){
        return await this.grindingRepository.getLastGrinding();
    }
    
}