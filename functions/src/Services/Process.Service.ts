import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";
import { Request, Response } from "express";
import { ProcessUpdateDTO, ProcessDTO, UserProcessDTO } from '../Models/DTO/ProcessDTO';
import { ProductRoviandaService } from './Product.Rovianda.Service';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsCoolingService } from './Outputs.Cooling.Service';
import { ProcessStatus } from '../Models/Enum/ProcessStatus';
import { FormulationService } from './Formulation.Service';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';
import { OutputsCoolingStatus } from '../Models/Enum/OutputsCoolingStatus';

export class ProcessService{
    private processRepository:ProcessRepository;
    private productRoviandaService:ProductRoviandaService;
    private outputCoolingService:OutputsCoolingService;
    private formulationService:FormulationService;
    private userRepository:UserRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    constructor(){
        this.processRepository = new ProcessRepository();
        this.productRoviandaService= new ProductRoviandaService();
        this.outputCoolingService = new OutputsCoolingService();
        this.formulationService = new FormulationService();
        this.userRepository = new UserRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
    }

    async createProcess(process:ProcessDTO){
        if(!process.lote.loteId) throw new Error("[400], falta el parametro loteId");
        if(!process.lote.outputId) throw new Error("[400], falta el parametro outputId");
        if(!process.productId) throw new Error("[400], falta el parametro productId");
        let productCatalog = await this.productRoviandaRepository.getProductRoviandaByIds(process.productId);
        if(!productCatalog) throw new Error("[404], el producto a registrar no existe");
        let outputCooling:OutputsCooling = await this.outputCoolingService.getOutputsCoolingByLot(process.lote.loteId);
        if(!outputCooling) throw new Error("[404], el lote de carne no existe en salidas de refrigeración"); 
        if(!process.dateIni || process.dateIni=="") throw new Error("[400], falta el parametro dateIni");
        if(!process.hourEntrance || process.hourEntrance=="") throw new Error("[400], falta el parametro hourEntrance");
        if(!process.temperature || process.temperature=="") throw new Error("[400], falta el parametro temperature");
        if(!process.weight) throw new Error("[400], falta el parametro weigth");
        if(+process.weight<1) throw new Error("[400],el peso no debe ser menor a 1");
        let formulation = await this.formulationService.getbyLoteIdAndProductId(process.lote.loteId,productCatalog);
        if(!formulation) throw new Error("[404], el lote no existe en formulacion");
        let updateoutputCooling:OutputsCooling = await this.outputsCoolingRepository.getOutputsCoolingById(process.lote.outputId);
        if(!updateoutputCooling) throw new Error("[404], no existe outputId");
        updateoutputCooling.status = OutputsCoolingStatus.USED;
        let processEntity:Process = new Process();
        processEntity.product = productCatalog;
        processEntity.entranceHour= process.dateIni;
        processEntity.weigth=+process.weight;
        processEntity.loteInterno = process.lote.loteId;
        processEntity.temperature = process.temperature;
        processEntity.startDate = process.dateIni;
        processEntity.status=ProcessStatus.ACTIVE;
        processEntity.newLote = formulation.newLote;
        await this.outputsCoolingRepository.createOutputsCooling(updateoutputCooling);
        return await this.processRepository.createProcess(processEntity);
    }
    
    async updateProcessProperties(process:Process){
        return await this.processRepository.createProcess(process);
    }

    async getProcessByStatus(status:string){
        let process:Process[] = await this.processRepository.getProcessByStatus(status);
        let response:any = [];
        console.log(process)
        process.forEach(i => {
            response.push({
                processId:`${i.id}`,
                productName: i.product.name,
                lotId: `${i.loteInterno}`,
                date: `${i.startDate}`,
                currentProccess: `${i.currentProcess}`,
                weigth: `${i.weigth}`,
                temperature: `${i.temperature}`,
                start_date: `${i.startDate}`,
                end_date: `${i.endDate}`,
                entrance_hour: `${i.entranceHour}`,
                output_hour: `${i.outputHour}`
            });
        });
        return response;
    }

    async getProcessById(id:number){
        return await this.processRepository.findProcessById(id);
    }

    async getProcessWithGrindingById(id:number){
        return await this.processRepository.getProcessWithGrindingById(id);
    }

    async updateProcess(req:Request){ 
        let process:Process = await this.processRepository.findProcessById(+req.params.processId);
        console.log(process)
        if(!process) throw new Error("[404], process not found");
        let updateProcess:ProcessUpdateDTO = req.body;
        if(!updateProcess.dateFin) throw new Error("[400],dateFin is required");
        if(!updateProcess.hourExit) throw new Error("[400],hourExit is required");
        process.endDate = updateProcess.dateFin;
        process.outputHour = updateProcess.hourExit;
        return await this.processRepository.createProcess(process);
    }

    async updateStatusProcess(processId:number){
        let process:Process = await this.processRepository.findProcessById(processId);
        console.log(process);

        if(!process) throw new Error("[404], process not found");
       
        if(process.status == "CLOSED"){
            throw new Error("[403], PROCESO ANTERIORMENTE CERRADO");
        }else{
            process.status = "CLOSED";
            await this.processRepository.createProcess(process);
                return "cerrado";
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

    async createUserProcess(userProcessDTO:UserProcessDTO, processId:string){

        if(!userProcessDTO.jobElaborated) throw new Error("[400], falta el parametro jobElaborated");
        if(!userProcessDTO.jobVerify) throw new Error("[400], falta el parametro jobVerify");
        if(!userProcessDTO.nameElaborated) throw new Error("[400], falta el parametro nameElaborated");
        if(!userProcessDTO.nameVerify) throw new Error("[400], falta el parametro nameVerify");

        let userVerify : User = await this.userRepository.getUserByName(userProcessDTO.nameVerify);
        if(!userVerify) throw new Error(`[400], no existe usuario${userVerify}`);

        let userElaborated : User = await this.userRepository.getUserByName(userProcessDTO.nameElaborated);
        if(!userElaborated) throw new Error(`[400], no existe usuario${userElaborated}`);

        let process: Process = await this.processRepository.findProcessById(+processId);
        if(!process) throw new Error("[400], no existe proceso");

        let productId:Process = await this.processRepository.findProductByProcessId(+processId);
        if(productId.product==null) throw new Error("[404], no existe producto relacionado a este proceso");
        console.log(productId.product.id);
        let product: ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+productId.product.id);

        process.jobElaborated = userProcessDTO.jobElaborated;
        process.nameElaborated = userProcessDTO.nameElaborated;
        process.nameVerify = userProcessDTO.nameVerify;
        process.jobVerify = userProcessDTO.jobVerify;

        return await this.processRepository.createProcess(process);
    }
}