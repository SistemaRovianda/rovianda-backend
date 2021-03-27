import { ProcessRepository } from '../Repositories/Process.Repository';
import { Process } from "../Models/Entity/Process";
import { Request, response } from "express";
import { ProcessUpdateDTO, UserProcessDTO, DefrostDTO, DefrostFormUpdate, processIngredient, processIngredientItem } from '../Models/DTO/ProcessDTO';
import { ProductRoviandaService } from './Product.Rovianda.Service';

import { OutputsCoolingService } from './Outputs.Cooling.Service';
import { ProcessStatus, ProcessAvailablesToOven, ProcessAvailablesByLots } from '../Models/Enum/ProcessStatus';
import { FormulationService } from './Formulation.Service';

import { UserRepository } from '../Repositories/User.Repository';

import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';

import { FirebaseHelper } from "../Utils/Firebase.Helper";
import { RawService } from './Raw.Service';

import { FormulationRepository } from '../Repositories/Formulation.Repository';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { Defrost } from '../Models/Entity/Defrost';
import { DefrostRepository } from '../Repositories/Defrost.Repository';
import { ReprocessingDTO, ReprocessingOfProcessDTO, UseReprocesingDTO } from '../Models/DTO/ReprocessingDTO';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { DefrostFormulation } from '../Models/Entity/Defrost.Formulation';
import { Formulation } from '../Models/Entity/Formulation';
import { SausagedRepository } from '../Repositories/Sausaged.Repository';
import { TenderizedRepository } from '../Repositories/Tenderized.Repository';
import { ConditioningRepository } from '../Repositories/Conditioning.Repository';
import { Conditioning } from '../Models/Entity/Conditioning';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { GrindingRepository } from '../Repositories/Grinding.Repository';
import { Grinding } from '../Models/Entity/Grinding';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';



export class ProcessService{
    private processRepository:ProcessRepository;
    
    private userRepository:UserRepository;
    
    private outputsCoolingRepository:OutputsCoolingRepository;
    private reprocesingRepository:ReprocessingRepository;
    private defrostRepository:DefrostRepository;
    private formulationRepository:FormulationRepository;
    private sausageRepository:SausagedRepository;
    private tenderizeRepository:TenderizedRepository;
    private conditioningRepository:ConditioningRepository;
    private grindingRepository:GrindingRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    constructor(private firebaseHelper: FirebaseHelper){
        this.processRepository = new ProcessRepository();
        
        this.userRepository = new UserRepository();
        
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        
        this.defrostRepository = new DefrostRepository();

        this.reprocesingRepository = new ReprocessingRepository();

        this.formulationRepository = new FormulationRepository();

        this.sausageRepository = new SausagedRepository();
        this.tenderizeRepository= new TenderizedRepository();
        this.conditioningRepository = new ConditioningRepository();
        this.grindingRepository= new GrindingRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
    }

     async createProcessInter():Promise<Process>{
        let process:Process = new Process();
        let today = new Date();
        today.setHours(today.getHours()-6)
        let dd:any = today.getDate();
        let mm:any = today.getMonth()+1; 
        let yyyy:any = today.getFullYear();
        if(dd<10) { dd='0'+dd; } 
        if(mm<10) { mm='0'+mm; }
        let date = `${yyyy}-${mm}-${dd}`;
        process.status = ProcessStatus.ACTIVE;
        process.createAt = date;
        return await this.processRepository.saveProcess(process);
    }

    async createDefrost(defrostForm:DefrostDTO){
        if(!defrostForm.dateInit || defrostForm.dateInit=="") throw new Error("[400], falta el parametro dateInit");
        if(!defrostForm.entranceHour || defrostForm.entranceHour=="") throw new Error("[400], falta el parametro entranceHour");
        if(!defrostForm.temp || defrostForm.temp=="") throw new Error("[400], falta el parametro temperature");
        if(!defrostForm.weight) throw new Error("[400], falta el parametro weigth");
        if(+defrostForm.weight<1) throw new Error("[400],el peso no debe ser menor a 1");
        
        let outputCooling:OutputsCooling = await this.outputsCoolingRepository.getOutputsCoolingById(defrostForm.outputCoolingId);
        if(outputCooling.status=="TAKED") throw new Error("[409], la salida de carne ya fue tomada para descongelamiento");
        outputCooling.status ="TAKED";
        await this.outputsCoolingRepository.createOutputsCooling(outputCooling);
        let defrost:Defrost = new Defrost();
        defrost.weigth=defrostForm.weight;
        defrost.temp = defrostForm.temp;
        defrost.status ="ACTIVE";
        defrost.dateInit = defrostForm.dateInit;
        defrost.entranceHour=defrostForm.entranceHour;
        defrost.outputCooling =outputCooling;
        return await this.defrostRepository.saveDefrost(defrost);
    }
    
    async updateDefrost(defrostId:number,defrostFormUpdate:DefrostFormUpdate){ 
        let defrost:Defrost = await this.defrostRepository.getDefrostById(defrostId);
        if(!defrost) throw new Error("[404], descongelamiento de carne no encontrado");
        if(!defrostFormUpdate.dateEnd) throw new Error("[400],dateEnd is required");
        if(!defrostFormUpdate.outputHour) throw new Error("[400],outputHour is required");
        defrost.dateEnd = defrostFormUpdate.dateEnd;
        defrost.outputHour = defrostFormUpdate.outputHour;
        defrost.status ="INACTIVE";
        return await this.defrostRepository.saveDefrost(defrost);
    }

    async closeDefrostById(defrostId:number){
        let defrost:Defrost = await this.defrostRepository.getDefrostById(defrostId);
        if(defrost.status=="INACTIVE") throw new Error("[409], el lote de descongelamiento ya fue cerrado");
        defrost.status ="INACTIVE";
        await this.defrostRepository.saveDefrost(defrost);
    }

    async getAllDefrostActive(){
        let defrostList:Defrost[]=await this.defrostRepository.getAllActive();
        let list=[];
        for(let defrost of defrostList){
            let outputCooling:OutputsCooling = await (await this.defrostRepository.getDefrostById(defrost.defrostId)).outputCooling;
            list.push(
                {lotId:outputCooling.loteInterno,rawMaterial:outputCooling.rawMaterial.rawMaterial,defrostId:defrost.defrostId,quantity:defrost.weigth,dateDefrost:defrost.dateInit}
            );
        }
        return list;
    }
    async getAllDefrostInactive(){
        let defrostList:Defrost[]=await this.defrostRepository.getAllInactive();
        let list=[];
        for(let defrost of defrostList){
            let outputCooling:OutputsCooling = await (await this.defrostRepository.getDefrostById(defrost.defrostId)).outputCooling;
            list.push(
                {lotId:outputCooling.loteInterno,rawMaterial:outputCooling.rawMaterial.rawMaterial,defrostId:defrost.defrostId,quantity:defrost.weigth,dateDefrost:defrost.dateInit}
            );
        }
        return list;
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
                productName: `${i.product.name}`,
                //lotes: i.formulation.defrosts.map((x)=>{return {loteId:x.lotMeat,rawMaterial:x.defrost.outputCooling.rawMaterial.rawMaterial,outputId:x.defrostFormulationId}}),
                date: `${i.startDate}`,
                currentProccess: `${i.currentProcess}`,
                start_date: `${i.startDate}`,
                end_date: `${i.endDate}`,
                entrance_hour: `${i.entranceHour}`,
                output_hour: `${i.outputHour}`,
                createAt: `${i.createAt}`,
                typeProcess: i.typeProcess
            });
        });
        return response;
    }

    async getProcessById(id:number){
        if(!id) throw new Error("[400], processId is required");
        let process = await this.processRepository.findProcessById(id);
        if(!process) throw new Error("[404], process not found");
        return process;
    }

    async getProcessWithData(formulations:number[]){
        let process:Process[] = await this.processRepository.getAllProcess(formulations);
        for(let processItem of process){
            let sausages:Sausaged[] = await this.sausageRepository.getSausagesByProcessEntity(processItem);
            let conditionings:Conditioning[]= await this.conditioningRepository.getByProcessEntity(processItem);
            let tenderized:Tenderized[] = await this.tenderizeRepository.getByProcessEntity(processItem);
            let grindings:Grinding[] = await this.grindingRepository.getByProcessEntity(processItem);
            for(let grin of grindings){
                let grinding = await this.grindingRepository.getGrindingWithRaw(grin.id);
                grin.raw = grinding.raw;
            }
            //let formulation:Formulation = await this.formulationRepository.getByProcessEntity(processItem);
            processItem.sausage = sausages;
            processItem.conditioning = conditionings;
            processItem.tenderized = tenderized;
            processItem.grinding = grindings;
            for(let de of processItem.formulation.defrosts){
                
                let deFE = await this.defrostRepository.getDefrostById(de.defrost.defrostId);
                de.defrost=deFE;
            }
            let reprocesing = await this.reprocesingRepository.getByProcess(processItem);
            processItem.reprocesings =reprocesing;
            //processItem.formulation = formulation;
        }
        return process;
    }

    async getProcessWithGrindingById(id:number){
        return await this.processRepository.getProcessWithGrindingById(id);
    }

    async getDefrostDetails(defrostId:number){

        let defrost:Defrost=await this.defrostRepository.getDefrostById(defrostId);
        if(!defrost) throw new Error("[404], no existe la salida de enfriamiento con el id: "+defrostId);
        return defrost;
    }
    

    async updateStatusProcess(processId:number){
        let process:Process = await this.processRepository.getProcessById(processId);

        if(!process) throw new Error("[404], process not found");
       
        if(process.status == ProcessStatus.INACTIVE){
            throw new Error("[403], PROCESO ANTERIORMENTE CERRADO");
        }else{
            process.status = ProcessStatus.INACTIVE;
            let date:Date = new Date();
            date.setHours(date.getHours()-6);
            process.endDate = date.toISOString();
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

        // let cadena = userProcessDTO.nameVerify.split(" ");
        // let userVerify = await this.userRepository.getByFullName(cadena[0],cadena[1],cadena[2])
        // if (!userVerify[0])  throw new Error(`[400], no existe usuario ${userProcessDTO.nameVerify}`);

        // let cadena2 = userProcessDTO.nameElaborated.split(" ");
        // let userElaborated = await this.userRepository.getByFullName(cadena2[0],cadena2[1],cadena2[2])
        // if (!userElaborated[0])  throw new Error(`[400], no existe usuario ${userProcessDTO.nameElaborated}`);

        let process: Process = await this.processRepository.findProcessById(+processId);
        if(!process) throw new Error("[400], no existe proceso");
        
        process.jobElaborated = userProcessDTO.jobElaborated;
        process.nameElaborated = userProcessDTO.nameElaborated;
        process.nameVerify = userProcessDTO.nameVerify;
        process.jobVerify = userProcessDTO.jobVerify;

        return await this.processRepository.createProcess(process);
    }

    async getProcessDetails(processId:number){
        let process:Process = await this.processRepository.findProcessById(processId);
        if(!process) throw new Error("[400], no existe el proceso");
        let response:{processId:number,formulationId:number,productName:string,lotDay:string,sausage:boolean,tenderized:boolean,conditioning:boolean,grinding:boolean}={
                processId:processId,
                formulationId: process.formulation.id,
                productName:process.product.name,
                lotDay: process.formulation.lotDay,
                sausage: process.sausage.length?true:false,
                tenderized: process.tenderized.length?true:false,
                conditioning: process.conditioning.length?true:false,
                grinding: process.grinding.length?true:false
            }
        return response;
    }

    async getProcessAllAvailables(){
        let processAvailables:ProcessAvailablesToOven[]= await this.processRepository.getAllProcessAvailable();
        let processAvailableMap:Map<number,ProcessAvailablesByLots>=new Map();

        for(let process of processAvailables){
            if(processAvailableMap.get(process.productId)==null){
                processAvailableMap.set(process.productId,{
                        lots:[{recordId:process.recordId,lotDay:process.lotDay,dateEndedProcess:process.dateEndedProcess}],
                        productId: process.productId,
                        productName: process.productName
                });
            }else{
                let processMapped = processAvailableMap.get(process.productId);
                processMapped.lots.push({recordId:process.recordId,lotDay:process.lotDay,dateEndedProcess:process.dateEndedProcess});
                processAvailableMap.set(process.productId,processMapped);
            }
        }
        let processAvailablesByLots:ProcessAvailablesByLots[] =[];
        processAvailableMap.forEach((item)=>processAvailablesByLots.push(item))
        return processAvailablesByLots;
    }

  
    async getFormulationOfProcess(processId:number){
        let process:Process = await this.processRepository.getProcessById(processId);
        if(!process){
            return -1;
        }else{
            return process.formulation.id;
        }
    }

    async saveReprocesing(reprocessingDTO:ReprocessingDTO[]){ // modificacion
        for(let reprocesing of reprocessingDTO){
            let defrost:Defrost = await this.defrostRepository.getDefrostById(reprocesing.defrostId);
            if(!defrost) throw new Error("[404], no existe ese lote de descongelamiento");
            let reprocesingEntity:Reprocessing = new Reprocessing();
            reprocesingEntity.allergens = reprocesing.allergen;
            reprocesingEntity.date=reprocesing.date;
            reprocesingEntity.weigth = reprocesing.weight;
            reprocesingEntity.defrost = defrost;
            reprocesingEntity.active = true;
            reprocesingEntity.used=false;
            await this.reprocesingRepository.saveRepocessing(reprocesingEntity);
        }
    }

    async getReprocesingOfProcess(processId:number){ // modificacion
        let process:Process = await this.processRepository.findProcessById(processId);
        if(!process) throw new Error("[404], no existe el proceso");
        let formulation:Formulation = process.formulation;
        let response:ReprocessingOfProcessDTO[]=[];
        for(let defrostFormulation of formulation.defrosts){
            let reprocesings = await this.reprocesingRepository.getByDefrost(defrostFormulation.defrost);
            for(let reprocesing of reprocesings){
                response.push({
                    allergen: reprocesing.allergens,
                    date: reprocesing.date,
                    lotId: defrostFormulation.lotMeat,
                    productName: defrostFormulation.defrost.outputCooling.rawMaterial.rawMaterial,
                    weight: reprocesing.weigth,
                    active: reprocesing.active,
                    defrostId: defrostFormulation.defrost.defrostId,
                    reprocesingId: reprocesing.id,
                    used: reprocesing.used,
                    dateUsed: reprocesing.dateUsed,
                    process: reprocesing.processUsed,
                    weightUsed: reprocesing.weigthUsed
                });
            }
        }
        return response;
    }

    async getReprocesingsAsignedToProcess(processId:number){ // modificacion
        let process:Process = await this.processRepository.findProcessByIdWithReprocesings(processId);
        if(!process) return [];
        let response:ReprocessingOfProcessDTO[]= process.reprocesings.map((reprocesing)=>({
            allergen: reprocesing.allergens,
            date: reprocesing.date,
            lotId: reprocesing.defrost?reprocesing.defrost.outputCooling.loteInterno:reprocesing.packagingReprocesingOvenLot,
            productName: reprocesing.defrost?reprocesing.defrost.outputCooling.rawMaterial.rawMaterial:reprocesing.packagingProductName,
            weight: reprocesing.weigth,
            active: reprocesing.active,
            defrostId: reprocesing.defrost?reprocesing.defrost.defrostId:0,
            reprocesingId: reprocesing.id, 
            used: reprocesing.used,
            dateUsed: reprocesing.dateUsed,
            process: reprocesing.processUsed,
            weightUsed: reprocesing.weigthUsed
        }));
        return response;
    }

    async setGrindingReprocesingToProcess(processId:number,reprocesings:Array<number>){ // modificacion <pendiente de analisis>
        let process:Process=await this.processRepository.getProcessById(processId);
        process.reprocesings=new Array<Reprocessing>();
        for(let reprocesingId of reprocesings){
            let reprocesing:Reprocessing = await this.reprocesingRepository.getReprocessingById(reprocesingId);
            if(!reprocesing) throw new Error("[404], no existe el reproceso");
            reprocesing.active=false;
            reprocesing.used=false;
            process.reprocesings.push(reprocesing);
        }
        await this.processRepository.saveProcess(process);
    }

    async getAllLotsReprocesing(){ // modificacion
        let reprocesings:Reprocessing[] = await this.reprocesingRepository.getAllReprocesingActive();
        let response:ReprocessingOfProcessDTO[]=[];
        for(let reprocesing of reprocesings){
            response.push({
                allergen: reprocesing.allergens,
                date: reprocesing.date,
                lotId: reprocesing.defrost?reprocesing.defrost.outputCooling.loteInterno:reprocesing.packagingReprocesingOvenLot,
                productName: reprocesing.defrost?reprocesing.defrost.outputCooling.rawMaterial.rawMaterial:reprocesing.packagingProductName,
                weight: reprocesing.weigth,
                active: reprocesing.active,
                defrostId: reprocesing.defrost?reprocesing.defrost.defrostId:0,
                reprocesingId: reprocesing.id,
                used: reprocesing.used,
                dateUsed: reprocesing.dateUsed,
                process: reprocesing.processUsed,
                weightUsed: reprocesing.weigthUsed
            });
        }
        return response;
    }


    async useLotsReprocesing(useReprocesingDTO:UseReprocesingDTO[]){// actualizacion de reproceso record
        for(let useReprocesing of useReprocesingDTO){
            let reprocesing:Reprocessing = await this.reprocesingRepository.getReprocessingById(useReprocesing.reprocesingId);
            if(!reprocesing) throw new Error("[404], no existe el lote de reproceso");
            if(reprocesing.used==true) throw new Error("[409], el lote de reproceso ya fue utilizado");
            reprocesing.used=true;
            reprocesing.processUsed=useReprocesing.process;
            reprocesing.dateUsed=useReprocesing.date;
            reprocesing.weigthUsed=useReprocesing.weight;
            await this.reprocesingRepository.saveRepocessing(reprocesing);
        }
    }

    async getAllProcessIngredientsAvailable(){
        let ingredients:Process[]= await this.processRepository.getAllProcessIngredientsByProductRovianda();
        let processIngredients:processIngredient[]=[];
        for(let ingredient of ingredients){
            let processId = ingredient.id;
            let ingredientItems:processIngredientItem[] =[];
            for(let defrostFormulation of ingredient.formulation.defrosts ){
                let lotMeat = defrostFormulation.lotMeat;
                let defrost= defrostFormulation.defrost;
                let outputCooling:OutputsCooling = await (await this.defrostRepository.getDefrostById(defrost.defrostId)).outputCooling;
                ingredientItems.push({
                    lotId: lotMeat,
                    rawMaterial: outputCooling.rawMaterial.rawMaterial
                });
            }
            processIngredients.push({
                processId,
                dateEnded: ingredient.endDate,
                ingredients: ingredientItems,
                productName: ingredient.product.name
            });
        }
        return processIngredients;
    }
}

