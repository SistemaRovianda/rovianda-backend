import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";
import { Request, Response } from "express";
import { ProcessUpdateDTO, ProcessDTO, UserProcessDTO } from '../Models/DTO/ProcessDTO';
import { ProductRoviandaService } from './Product.Rovianda.Service';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { OutputsCoolingService } from './Outputs.Cooling.Service';
import { ProcessStatus, ProcessAvailablesToOven, ProcessAvailablesByLots } from '../Models/Enum/ProcessStatus';
import { FormulationService } from './Formulation.Service';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';
import { OutputsCoolingStatus } from '../Models/Enum/OutputsCoolingStatus';
import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { RawService } from './Raw.Service';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationRepository } from '../Repositories/Formulation.Repository';
import { Raw } from '../Models/Entity/Raw';

export class ProcessService{
    private processRepository:ProcessRepository;
    private productRoviandaService:ProductRoviandaService;
    private outputCoolingService:OutputsCoolingService;
    private formulationService:FormulationService;
    private userRepository:UserRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    private rawService:RawService;
    private formulationRepository:FormulationRepository;
    constructor(private firebaseHelper: FirebaseHelper){
        this.processRepository = new ProcessRepository();
        this.productRoviandaService= new ProductRoviandaService(this.firebaseHelper);
        this.outputCoolingService = new OutputsCoolingService();
        this.formulationService = new FormulationService();
        this.userRepository = new UserRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.rawService = new RawService();
        this.formulationRepository = new FormulationRepository();
    }

    async createProcessInter(){
        let process:Process = new Process();
        let today = new Date();
        today.setHours(today.getHours()-5)
        let dd:any = today.getDate();
        let mm:any = today.getMonth()+1; 
        let yyyy:any = today.getFullYear();
        if(dd<10) { dd='0'+dd; } 
        if(mm<10) { mm='0'+mm; }
        let date = `${yyyy}-${mm}-${dd}`;
        process.status = ProcessStatus.ACTIVE;
        process.createAt = date;
        await this.processRepository.saveProcess(process);
        let id:any = await this.processRepository.getLastProcess();
        return id[0].id;
    }

    async createProcess(process:ProcessDTO){
        if(!process.lote.loteId) throw new Error("[400], falta el parametro loteId");
        if(!process.lote.outputId) throw new Error("[400], falta el parametro outputId");
        if(!process.productId) throw new Error("[400], falta el parametro productId");
        if(!process.processId) throw new Error("[400], falta el parametro processId");
        //let productCatalog = await this.rawService.getProductRoviandaByIds(process.productId);
        //if(!productCatalog) throw new Error("[404], el producto a registrar no existe");
        let outputCooling:OutputsCooling = await this.outputCoolingService.getOutputsCoolingByLot(process.lote.loteId);
        if(!outputCooling) throw new Error("[404], el lote de carne no existe en salidas de refrigeración"); 
        if(!process.dateIni || process.dateIni=="") throw new Error("[400], falta el parametro dateIni");
        if(!process.hourEntrance || process.hourEntrance=="") throw new Error("[400], falta el parametro hourEntrance");
        if(!process.temperature || process.temperature=="") throw new Error("[400], falta el parametro temperature");
        if(!process.weight) throw new Error("[400], falta el parametro weigth");
        if(+process.weight<1) throw new Error("[400],el peso no debe ser menor a 1");
        //let formulation = await this.formulationService.getbyLoteIdAndProductId(process.lote.loteId,productCatalog);
        //if(!formulation) throw new Error("[404], el lote no existe en formulacion");
        let updateoutputCooling:OutputsCooling = await this.outputsCoolingRepository.getOutputsCoolingById(process.lote.outputId);
        if(!updateoutputCooling) throw new Error("[404], no existe outputId");
        updateoutputCooling.status = "TAKED";

        let processEntity:Process = await this.processRepository.findProcessById(process.processId);
        if(!processEntity.loteInterno) processEntity.loteInterno = process.lote.loteId;

        //updating formulation used lot
        let formulationEn:Formulation = await this.formulationService.getFormulationOutputCoolingId(process.lote.outputId);
        formulationEn.status="TAKED";
        await this.formulationService.updateFormulation(formulationEn);
        //let processEntity:Process = new Process();
        //processEntity.product = productCatalog;
        processEntity.outputLotRecordId = process.lote.outputId;
        processEntity.entranceHour= process.hourEntrance;
        processEntity.weigth=+process.weight;
        processEntity.temperature = process.temperature;
        processEntity.startDate = process.dateIni;
        processEntity.status=ProcessStatus.ACTIVE;
        //processEntity.newLote = formulation.loteInterno;
        processEntity.currentProcess = "Descongelamiento";
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
                productName: `${i.product ? i.product.name : ""}`,
                lotId: `${i.loteInterno}`,
                date: `${i.startDate}`,
                currentProccess: `${i.currentProcess}`,
                weigth: `${i.weigth}`,
                temperature: `${i.temperature}`,
                start_date: `${i.startDate}`,
                end_date: `${i.endDate}`,
                entrance_hour: `${i.entranceHour}`,
                output_hour: `${i.outputHour}`,
                createAt: `${i.createAt}`
            });
        });
        return response;
    }

    async getProcessById(id:number){
        if(!id) throw new Error("[400], processId is required");
        let process = await this.processRepository.findProcessById(id);
        process
        if(!process) throw new Error("[404], process not found");
        return process;
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
       
        if(process.status == ProcessStatus.INACTIVE){
            throw new Error("[403], PROCESO ANTERIORMENTE CERRADO");
        }else{
            let formulacion:Formulation = await this.formulationRepository.getByFormulationId(process.outputLotRecordId)
            let outputCooling:OutputsCooling =await this.outputCoolingService.getOutputsCoolingById(process.outputLotRecordId);
            outputCooling.status="TAKED";
            this.outputCoolingService.updateOutputCooling(outputCooling);
            process.status = ProcessStatus.INACTIVE;
            let date:Date = new Date();
            date.setHours(date.getHours()-5);
            process.dateEndedProcess = date.toISOString();
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

        let cadena = userProcessDTO.nameVerify.split(" ");
        let userVerify = await this.userRepository.getByFullName(cadena[0],cadena[1],cadena[2])
        if (!userVerify[0])  throw new Error(`[400], no existe usuario ${userProcessDTO.nameVerify}`);

        let cadena2 = userProcessDTO.nameElaborated.split(" ");
        let userElaborated = await this.userRepository.getByFullName(cadena2[0],cadena2[1],cadena2[2])
        if (!userElaborated[0])  throw new Error(`[400], no existe usuario ${userProcessDTO.nameElaborated}`);

        let process: Process = await this.processRepository.findProcessById(+processId);
        if(!process) throw new Error("[400], no existe proceso");
        
        process.jobElaborated = userProcessDTO.jobElaborated;
        process.nameElaborated = userProcessDTO.nameElaborated;
        process.nameVerify = userProcessDTO.nameVerify;
        process.jobVerify = userProcessDTO.jobVerify;

        return await this.processRepository.createProcess(process);
    }

    async getDefrost(processId:number){
        let response={};
        let process:Process = await this.processRepository.findProcessByProcessId(processId);
        if(!process) throw new Error("[400], no existe proceso");
        if(process.outputLotRecordId!=null && process.outputLotRecordId!=0){
            console.log("SE MUESTRA EL OUTPUTS PROCCESS ID",process.outputLotRecordId);
        let outputCoolingRecord = await this.outputsCoolingRepository.getOutputsCoolingById(+process.outputLotRecordId);
        console.log("OUTPUTS COOLING",JSON.stringify(outputCoolingRecord));
        response = {...response,...process,rawMaterialName:outputCoolingRecord.rawMaterial.rawMaterial}
        }
        response ={...response,...process}
        return response;
    }

    async getProcessAllAvailables(){
        let processAvailables:ProcessAvailablesToOven[]= await this.processRepository.getAllProcessAvailable();
        let processAvailableMap:Map<number,ProcessAvailablesByLots>=new Map();

        for(let process of processAvailables){
            if(processAvailableMap.get(process.productId)==null){
                processAvailableMap.set(process.productId,{
                        lots:[{recordId:process.recordId,lotId:process.lotId,dateEndedProcess:process.dateEndedProcess}],
                        productId: process.productId,
                        productName: process.productName
                });
            }else{
                let processMapped = processAvailableMap.get(process.productId);
                processMapped.lots.push({recordId:process.recordId,lotId:process.lotId,dateEndedProcess:process.dateEndedProcess});
                processAvailableMap.set(process.productId,processMapped);
            }
        }
        let processAvailablesByLots:ProcessAvailablesByLots[] =[];
        processAvailableMap.forEach((item)=>processAvailablesByLots.push(item))
        return processAvailablesByLots;
    }
}