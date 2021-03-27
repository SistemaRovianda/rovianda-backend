import { EntranceMeatRepository } from '../Repositories/Entrances.Meat.Repository';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { EntranceMeatDTO } from '../Models/DTO/EntranceMeatDTO';
import { Fridge } from '../Models/Entity/Fridges';
import { FridgeRepository } from '../Repositories/Fridges.Repository';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { File } from '../Models/Entity/Files';
import { CoolingRepository } from '../Repositories/Cooling.Repository';
import { Cooling } from '../Models/Entity/Cooling';
import { WarehouseStatus } from '../Models/Enum/WarehouseStatus';
import { UserRepository } from '../Repositories/User.Repository';
import { User } from '../Models/Entity/User';
import { Raw } from '../Models/Entity/Raw';
import { RawRepository } from '../Repositories/Raw.Repository';
import { FormulatioIngredientsRepository } from '../Repositories/Formulation.Ingredients.Repository';
import { ProcessRepository } from '../Repositories/Process.Repository';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { OutputsCoolingRepository } from '../Repositories/Outputs.Cooling.Repository';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationRepository } from '../Repositories/Formulation.Repository';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { Process } from '../Models/Entity/Process';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { Packaging } from '../Models/Entity/Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { Inspection } from '../Models/Entity/Inspection';
import { RevisionsOvenProductsRepository } from '../Repositories/Revisions.Oven.Products.Repository';
import { RevisionsOvenProducts } from '../Models/Entity/Revisions.Oven.Products';
import { DefrostRepository } from '../Repositories/Defrost.Repository';
import { OutputsCooling } from '../Models/Entity/outputs.cooling';
import { Defrost } from '../Models/Entity/Defrost';
import { DefrostFormulation } from '../Models/Entity/Defrost.Formulation';
import { DefrostFormulationRepository } from '../Repositories/DefrostFormulation.Repository';
import { Devolution } from '../Models/Entity/Devolution';
import { DevolutionRepository } from '../Repositories/Devolution.Repository';

export class EntranceMeatService {
    private entrancesMeatRepository: EntranceMeatRepository;
    private userRepository: UserRepository;
    private fridgeRepository: FridgeRepository;
    private coolingRepository: CoolingRepository;
    private formulatioIngredientsRepository: FormulatioIngredientsRepository;
    
    private ovenRepository: OvenRepository;
    private packagingRepository: PackagingRepository;
    private inspectionRepository: InspectionRepository;
    private outputsCoolingRepository: OutputsCoolingRepository;
    private rawRepository: RawRepository;
    private formulationRepository: FormulationRepository;
    private propertiesPackagingRepository: PropertiesPackagingRepository;
    private reprocessingRepository: ReprocessingRepository;
    private revisionsOvenProductsRepository: RevisionsOvenProductsRepository;
    private defrostRepository: DefrostRepository;
    private defrostFormulation: DefrostFormulationRepository;
    private devolutionRepository:DevolutionRepository;
    private processRepository =new ProcessRepository();
    constructor(private firebaseHelper: FirebaseHelper) {
        this.entrancesMeatRepository = new EntranceMeatRepository();
        this.userRepository = new UserRepository();
        this.fridgeRepository = new FridgeRepository();
        this.coolingRepository = new CoolingRepository();
        this.rawRepository = new RawRepository();
        this.formulatioIngredientsRepository = new FormulatioIngredientsRepository();
        this.devolutionRepository= new DevolutionRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.inspectionRepository = new InspectionRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.formulationRepository = new FormulationRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.reprocessingRepository = new ReprocessingRepository();
        this.revisionsOvenProductsRepository = new RevisionsOvenProductsRepository();
        this.defrostRepository = new DefrostRepository();
        this.defrostFormulation = new DefrostFormulationRepository();
        this.processRepository = new ProcessRepository();
    }

    async getEntracencesByLoteId(loteId: string, date: string, page: number, peerPage: number) {
        let entrances:EntranceMeat[] = await this.entrancesMeatRepository.findByLotId(loteId, date, page, peerPage);
        return entrances;
    }

    async getEntranceMeatById(entranceId:number){
        return await this.entrancesMeatRepository.getEntranceMeatById(entranceId);
    }

    async saveEntrancesMeat(req: any) {
        let entranceMeatDTO: EntranceMeatDTO = req.body;
        //let photo:any= req.files[0];
        console.log("REVISION DE CUERPO DE REQUEST", JSON.stringify(entranceMeatDTO));
        let date = new Date();
        date.setHours(date.getHours() - 6);
        let day: string = date.getDate().toString();
        let month: string = (date.getMonth() + 1).toString();
        if (+day < 10) {
            day = '0' + day;
        }
        if (+month < 10) {
            month = '0' + month;
        }
        entranceMeatDTO.createdAt = `${date.getFullYear()}-${month}-${day}`;
        if (!entranceMeatDTO.lotInternal) throw new Error("[400],Falta la propiedad loteInterno");
        if (!entranceMeatDTO.lotProveedor) throw new Error("[400],Falta la propiedad loteProveedor");
        if (!entranceMeatDTO.proveedor) throw new Error("[400],Falta la propiedad proveedor");
        if (!entranceMeatDTO.rawMaterial) throw new Error("[400],Falta la propiedad rawMaterial");
        if (!entranceMeatDTO.temperature) throw new Error("[400],Falta la propiedad temperature");
        if (!entranceMeatDTO.texture) throw new Error("[400],Falta la propiedad texture");
        if (!entranceMeatDTO.transport) throw new Error("[400],Falta la propiedad transport");
        if (!entranceMeatDTO.weight) throw new Error("[400],Falta la propiedad weight");
        if (!entranceMeatDTO.strageMaterial) throw new Error("[400],Falta la propiedad strageMaterial");
        if (!entranceMeatDTO.slaughterDate) throw new Error("[400],Falta la propiedad slaughterDate");
        if (!entranceMeatDTO.packing) throw new Error("[400],Falta la propiedad packing");
        if (!entranceMeatDTO.odor) throw new Error("[400],Falta la propiedad odor");
        if (!entranceMeatDTO.color) throw new Error("[400],Falta la propiedad odor");
        if (!entranceMeatDTO.job) throw new Error("[400],Falta la propiedad job");
        if (!entranceMeatDTO.fridge) throw new Error("[400],Falta la propiedad fridge");
        if (!entranceMeatDTO.expiration) throw new Error("[400],Falta la propiedad expiration");
        if (!entranceMeatDTO.photo) throw new Error("[400],Falta la propiedad photo");
        if (!entranceMeatDTO.qualityInspector) throw new Error("[400], qualitiInspector is required")

        let userInspector: User = await this.userRepository.getUserById(entranceMeatDTO.qualityInspector);
        console.log(userInspector);
        if (!userInspector) throw new Error("[404],Usuario inspector de calidad no existe");

        let fridge: Fridge = await this.fridgeRepository.getFridgeByIdFridge(+entranceMeatDTO.fridge.fridgeId);

        if (!fridge) throw new Error("[404],Refrigerador no existe");


        let photo = Buffer.from(entranceMeatDTO.photo, 'base64');
        let urlOfImage: string = await this.firebaseHelper.uploadImage(`${entranceMeatDTO.createdAt.replace(/\//g, "")}/${entranceMeatDTO.lotInternal}/`, photo);
        let file: File = {
            fileId: 0,
            url: urlOfImage
        }
        let entranceMeat: EntranceMeat = {
            createdAt: entranceMeatDTO.createdAt,
            loteInterno: entranceMeatDTO.lotInternal,
            loteProveedor: entranceMeatDTO.lotProveedor,
            proveedor: entranceMeatDTO.proveedor,
            rawMaterial: entranceMeatDTO.rawMaterial,
            temperature: entranceMeatDTO.temperature,
            texture: entranceMeatDTO.texture,
            transport: entranceMeatDTO.transport,
            weight: entranceMeatDTO.weight,
            strangeMaterial: entranceMeatDTO.strageMaterial,
            slaughterDate: entranceMeatDTO.slaughterDate,
            packing: entranceMeatDTO.packing,
            odor: entranceMeatDTO.odor,
            color: entranceMeatDTO.color,
            job: entranceMeatDTO.job,
            qualityInspector: userInspector,
            fridge: entranceMeatDTO.fridge,
            id: 0,
            expiration: entranceMeatDTO.expiration,
            photo: file
        }

        if (entranceMeatDTO.color.accepted == true
            && entranceMeatDTO.expiration.accepted == true && entranceMeatDTO.odor.accepted == true && entranceMeatDTO.packing.accepted == true
            && entranceMeatDTO.slaughterDate.accepted == true && entranceMeatDTO.strageMaterial.accepted == true && entranceMeatDTO.temperature.accepted == true &&
            entranceMeatDTO.texture.accepted == true && entranceMeatDTO.transport.accepted == true && entranceMeatDTO.weight.accepted == true &&
            entranceMeatDTO.fridge.accepted == true) {
            let cooling: Cooling = new Cooling();
            cooling.loteInterno = entranceMeatDTO.lotInternal;
            cooling.loteProveedor = entranceMeatDTO.lotProveedor;
            cooling.quantity = entranceMeatDTO.weight.value;
            cooling.status = WarehouseStatus.PENDING;
            cooling.fridge = fridge;
            cooling.userId = userInspector.id;
            cooling.closingDate = null;
            cooling.openingDate = null;

            let raw: Raw = await this.rawRepository.getByName(entranceMeatDTO.rawMaterial);
            if (raw) {
                cooling.rawMaterial = raw;
            } else {
                let saveRaw: Raw = new Raw();
                saveRaw.rawMaterial = entranceMeatDTO.rawMaterial;
                await this.rawRepository.saveRaw(saveRaw);
                let enRaw: Raw[] = await this.rawRepository.getLastRaw();
                cooling.rawMaterial = enRaw[0];
            }
            await this.coolingRepository.saveCooling(cooling);
        }


        entranceMeat.photo = file;



        let entranceMeatSaved: EntranceMeat = await this.entrancesMeatRepository.saveEntrancesMeat(entranceMeat);
        return entranceMeatSaved.id;
    }

    async reportEntranceMeat(meatId: number) {
        if (!meatId) throw new Error("[400], meatId is required");
        let meat: EntranceMeat = await this.entrancesMeatRepository.getEntranceMeatById(meatId);
        if (!meat) throw new Error(`[404], meat with id ${meatId} not found`);
        return meat;
    }

    async reportEntrancesMeats(dateInit: string, dateEnd: string) {
        if (!dateInit) throw new Error(`[400], initDate is required in query`);
        if (!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if (!Date.parse(dateInit)) throw new Error("[400], initDate has not a valid value");
        if (!Date.parse(dateEnd)) throw new Error("[400], finDate has not a valid value");

        if (Date.parse(dateInit) > Date.parse(dateEnd)) throw new Error(`[400], iniDate cannot be greater than finDate`);
        let meat: EntranceMeat[] = await this.entrancesMeatRepository.getEntrancesMeats(dateInit, dateEnd);

        if (!meat.length)
            throw new Error("[404], No Entrances meats found, can not generate report");
        return meat;
    }

    async getHistoryMeatEntrance(entranceId: number, dateStart: string, dateEnd: string) {
        if (!entranceId) throw new Error("[400], entranceId is required");
        let response: any = {};
        let aMeat: any = [];
        
      
        console.log("paso 1");
        let meat: EntranceMeat = await this.entrancesMeatRepository.getEntranceMeatById(entranceId);
        if (meat) {
            aMeat.push({
                receptionDate: meat.createdAt,
                entranceMeatId: meat.id,
                weight: meat.weight,
                inspector: meat.qualityInspector,
                rawMaterial: meat.rawMaterial
            })
        }
        return response={
            entranceMeat: aMeat ? aMeat : ""
        }

    }
    async getHistoryMeatCooling(entranceId:number, dateStart: string, dateEnd: string){
        let aCooling: any = [];
        let response:any=null;
        let meat: EntranceMeat = await this.entrancesMeatRepository.getEntranceMeatById(entranceId);
        let cooling: any[] = await this.coolingRepository.getCoolingByLotInterBetweenDates(meat.loteInterno,meat.loteProveedor, dateStart, dateEnd);
        console.log("paso 2");
        if (cooling.length) {
            
            cooling.forEach(i => {
                aCooling.push({
                    coolingId: i ? i.id : "",
                    openingDate: i ? i.openingDate : "",
                    closedDate: i ? i.closingDate : ""
                })
            })
        }
        return response={
            fridge: aCooling
        }
    }
    async getHistoryOutputCooling(entranceId:number,dateStart:string,dateEnd:string){
        let response:any=null;
        let aOutputs:any[]=[];
        let meat: EntranceMeat = await this.entrancesMeatRepository.getEntranceMeatById(entranceId);
        let outputsCoolings: OutputsCooling[] = await this.outputsCoolingRepository.getOutputsCoolingByLotInternoBetweenDates(meat.loteInterno, dateStart, dateEnd);
        
        console.log("paso 3");
        let already = [];
        for (let outputsCooling of outputsCoolings) {       
            if (!already.includes(outputsCooling.id)) {
                aOutputs.push({
                    outputsCoolingId: outputsCooling.id,
                    startOutput: outputsCooling.outputDate,
                    observations: outputsCooling.observations,
                    rawMaterial: outputsCooling.rawMaterial.rawMaterial,
                    quantity: outputsCooling.quantity
                });
                already.push(outputsCooling.id);
            }
        }
        return response={
            outputs: aOutputs
        }
    }
    async getHistoryByOutputsFormulations(outputs:number[]){
            
            let formulations:any[]
            let response:any=null;
            if(outputs.length){
                formulations= await this.formulationRepository.getAllFormulationHistoryByOutputs(outputs);
            }else{
                formulations=[];
            }
            return response ={
                formulation: formulations
            };
        }

        async getHistoryByOutputsProcess(formulationsIds:number[]){
            let response:any=null;
            let aProcess:any[]=[];
            if(formulationsIds.length){
                aProcess = await this.processRepository.getAllProcessHistoryByFormulationsIds(formulationsIds);
            }else{
                aProcess=[];
            }
                    return response={
                        process: aProcess
                    };
        }
        async getHistoryByOutputsOvenByProcessId(processIds:number[]){
                let aOven:any[]=[];
                let response:any=null;
                if(processIds.length){
                    aOven= await this.ovenRepository.getAllHistoryByProcessIds(processIds);
                    for(let item of aOven){
                        let revisions = await this.revisionsOvenProductsRepository.getByOvenId(item.ovenId);
                        if(revisions.length){
                            item.revisions=revisions;
                        }
                    }

                }else{
                    aOven=[];
                }
               
                return response={
                    oven: aOven
                };
                }
    async getHistoryByOutputsPackagingByOvenIds(ovenIds:number[]){
        let aPackaging:any[]=[];
        let response=null;
        if(ovenIds.length){
            aPackaging = await this.propertiesPackagingRepository.getAllHistoryByOvenIds(ovenIds);
        }
        return response={
            packingDate:aPackaging
        };   

    }

    async getHistoryByDevolutionsByOvenByOvenIds(ovenIds:number[]){    
        let response=null;
        let aDevolution:any[]=[];
        if(ovenIds.length){
            aDevolution = await this.devolutionRepository.getAllHistoryByOvenIds(ovenIds);
        }
        
        return response={
            devolutions: aDevolution
        };
    }

    async getHistoryByReprocesingsByOvenByOvenIds(ovenIds:number[]){    
        let response=null;
        let aReprocesings:any[]=[];
        if(ovenIds.length){
            aReprocesings = await this.reprocessingRepository.getAllHistoryOfOvenIds(ovenIds);
        }
        
        return response={
            reprocesings: aReprocesings
        };
    }
    async getHistoryByInspectionByOvenByOvenIds(ovenIds:number[]){
        let aInspection:any[]=[];
        let response=null;
        if(ovenIds.length){
            aInspection = await this.inspectionRepository.getAllHistoryByOvenIds(ovenIds);
        }
        for(let ovenId of ovenIds){
            let ovenProduct:OvenProducts = await this.ovenRepository.getOvenProductById(ovenId);
                                let inspection: Inspection[] = await this.inspectionRepository.getInspectionsByNewLotAndProduct(ovenProduct.newLote,ovenProduct.product);
                                console.log("paso 13");
                                if (inspection) {
                                    inspection.forEach(i => {
                                        aInspection.push({
                                            InspectionDate: i ? i.expirationDate : "",
                                            newLot: i.lotId,
                                            verify: i.nameVerify,
                                            elaborate: i.nameElaborated
                                        })
                                    })
                                }
                            }
  
      
        return  response = {
            InspectionDate: aInspection ? aInspection : "",
        };
    }

}
