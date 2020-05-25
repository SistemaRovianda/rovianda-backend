import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";
import { Request, Response } from "express";
import { ProcessUpdateDTO, ProcessCreationDTO } from '../Models/DTO/ProcessDTO';
import { ProductService } from './Product.Services';
import { ProductRoviandaService } from './Product.Rovianda.Service';
import { EntranceMeatService } from './Entrances.Meat.Services';
import { EntranceMeatRepository } from '../Repositories/Entrances.Meat.Repository';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { Cooling } from '../Models/Entity/Cooling';
import { CoolingService } from './Cooling.Service';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsCoolingService } from './Outputs.Cooling.Service';
import { ProcessStatus } from '../Models/Enum/ProcessStatus';

export class ProcessService{
    private processRepository:ProcessRepository;
    private productRoviandaService:ProductRoviandaService;
    private outputCoolingService:OutputsCoolingService;
    constructor(){
        this.processRepository = new ProcessRepository();
        this.productRoviandaService= new ProductRoviandaService();
        this.outputCoolingService = new OutputsCoolingService();
    }

    async createProcess(process:ProcessCreationDTO){
        if(!process.lotId || process.lotId=="") throw new Error("[400], falta el parametro loteId");
        if(!process.productId) throw new Error("[400], falta el parametro productId");
        let productCatalog = await this.productRoviandaService.getProductoRoviandaById(process.productId);
        if(!productCatalog) throw new Error("[404], el producto a registrar no existe");
        let outputCooling:OutputsCooling = await this.outputCoolingService.getOutputsCoolingByLot(process.lotId);
        if(!outputCooling) throw new Error("[404], el lote de carne no existe en salidas de refrigeración"); 
        let processEntity:Process = new Process();
        if(!process.dateIni || process.dateIni=="") throw new Error("[400], falta el parametro dateIni");
        if(!process.hourEntrance || process.hourEntrance=="") throw new Error("[400], falta el parametro hourEntrance");
        if(!process.temperature || process.temperature=="") throw new Error("[400], falta el parametro temperature");
        if(!process.weight) throw new Error("[400], falta el parametro weigth");
        if(process.weight<1) throw new Error("[400],el peso no debe ser menor a 1");
        processEntity.productId = productCatalog;
        processEntity.entranceHour= process.dateIni;
        processEntity.weigth=process.weight.toString();
        processEntity.loteInterno = process.lotId;
        processEntity.temperature = process.temperature;
        processEntity.startDate = process.dateIni;
        processEntity.status=ProcessStatus.ACTIVE;
        return await this.processRepository.createProcess(processEntity);
    }
    
    async updateProcessProperties(process:Process){
        return await this.processRepository.createProcess(process);
    }

    async getProcessByStatus(status:string){
        return await this.processRepository.getProcessByStatus(status);
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
                return res.status(204).send({ msg: "CLOSED" });
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