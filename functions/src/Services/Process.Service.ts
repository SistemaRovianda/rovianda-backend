import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";
import { Request, Response } from "express";
import { ProcessUpdateDTO } from '../Models/DTO/ProcessDTO';

export class ProcessService{
    private processRepository:ProcessRepository;
    constructor(){
        this.processRepository = new ProcessRepository();
    }

    async createProcess(process:Process){
        return await this.processRepository.createProcess(process);
    }

    async getProcessActive(){
        return await this.processRepository.getProcessActive();
    }

    async getProcessById(id:number){
        return await this.processRepository.getProcessById(id);
    }

    async getProcessWithGrindingById(id:number){
        return await this.processRepository.getProcessWithGrindingById(id);
    }

    async updateProcess(req:Request){
        let process:Process = await this.processRepository.getProcessById(+req.params.processId);
        console.log(process)
        if(!process[0]) throw new Error("[404], process not found");
        let updateProcess:ProcessUpdateDTO = req.body;
        if(!updateProcess.dateFin) throw new Error("[400],dateFin is required");
        if(!updateProcess.hourExit) throw new Error("[400],hourExit is required");
        process[0].endDate = updateProcess.dateFin;
        process[0].outputHour = updateProcess.hourExit;
        return await this.processRepository.createProcess(process);
    }

    async updateStatusProcess(res:Response, req:Request){
        let process:Process = await this.processRepository.getProcessById(+req.params.processId);
        console.log(process);

        if(!process[0]) throw new Error("[404], process not found");
       
        let processToClose = process[0];
        if(processToClose.status = "CLOSED"){
            return res.status(403).send({ msg: "PROCESO ANTERIORMENTE CERRADO" });
        }else{
            processToClose.status = "CLOSED";
            await this.processRepository.createProcess(processToClose);
                return res.status(204).send({ msg: "CERRADA" });
        }
    }
      
    async getUserProcessVerifier(id: number) {
        let process: Process = await this.processRepository.findProcessById(+id);

        if (!process)
            throw Error(`[400], Process with id ${id} was not found`);
        console.log(process);
        let response = {
            nameElaborated: process.nameElaborated? process.nameElaborated : null,
            jobElaborated: process.jobElaborated? process.jobElaborated : null,
            nameVerify: process.nameVerify? process.nameVerify : null,
            jobVerify: process.jobVerify? process.jobVerify : null
        }
        return response;
    }
}