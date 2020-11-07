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

export class EntranceMeatService {
    private entrancesMeatRepository: EntranceMeatRepository;
    private userRepository: UserRepository;
    private fridgeRepository: FridgeRepository;
    private coolingRepository: CoolingRepository;
    private formulatioIngredientsRepository:FormulatioIngredientsRepository;
    private processRepository:ProcessRepository;
    private ovenRepository:OvenRepository;
    private packagingRepository:PackagingRepository;
    private inspectionRepository:InspectionRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    private rawRepository:RawRepository;
    private formulationRepository:FormulationRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private reprocessingRepository:ReprocessingRepository;
    private revisionsOvenProductsRepository:RevisionsOvenProductsRepository;
    constructor(private firebaseHelper: FirebaseHelper) {
        this.entrancesMeatRepository = new EntranceMeatRepository();
        this.userRepository = new UserRepository();
        this.fridgeRepository = new FridgeRepository();
        this.coolingRepository = new CoolingRepository();
        this.rawRepository = new RawRepository();
        this.formulatioIngredientsRepository = new FormulatioIngredientsRepository();
        this.processRepository = new ProcessRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.inspectionRepository = new InspectionRepository();
        this.outputsCoolingRepository = new OutputsCoolingRepository();
        this.formulationRepository = new FormulationRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.reprocessingRepository = new ReprocessingRepository();
        this.revisionsOvenProductsRepository = new RevisionsOvenProductsRepository();
    }


    async saveEntrancesMeat(req: any) {
        let entranceMeatDTO: EntranceMeatDTO = req.body;
        //let photo:any= req.files[0];
        console.log("REVISION DE CUERPO DE REQUEST",JSON.stringify(entranceMeatDTO));
        let date=new Date();
        date.setHours(date.getHours()-6)
        entranceMeatDTO.createdAt = date.toISOString().substring(0,10);
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

        let fridge:Fridge = await this.fridgeRepository.getFridgeByIdFridge(+entranceMeatDTO.fridge.fridgeId);

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
            color:entranceMeatDTO.color,
            job: entranceMeatDTO.job,
            qualityInspector: userInspector,
            fridge: entranceMeatDTO.fridge,
            id: 0,
            expiration: entranceMeatDTO.expiration,
            photo: file
        }

        if(entranceMeatDTO.color.accepted==true
            && entranceMeatDTO.expiration.accepted==true && entranceMeatDTO.odor.accepted==true && entranceMeatDTO.packing.accepted==true 
            && entranceMeatDTO.slaughterDate.accepted==true && entranceMeatDTO.strageMaterial.accepted==true && entranceMeatDTO.temperature.accepted==true &&
            entranceMeatDTO.texture.accepted ==true && entranceMeatDTO.transport.accepted==true && entranceMeatDTO.weight.accepted==true &&
            entranceMeatDTO.fridge.accepted==true){
                let cooling:Cooling = new Cooling();
                cooling.loteInterno = entranceMeatDTO.lotInternal;
                cooling.loteProveedor = entranceMeatDTO.lotProveedor;
                cooling.quantity = entranceMeatDTO.weight.value;
                cooling.status = WarehouseStatus.PENDING;
                cooling.fridge = fridge;
                cooling.userId = req.headers.uid;
                cooling.closingDate = null;
                cooling.openingDate = null;
        
                let raw:Raw = await this.rawRepository.getByName(entranceMeatDTO.rawMaterial);
                if(raw){
                    cooling.rawMaterial = raw;
                }else{
                    let saveRaw:Raw = new Raw();
                    saveRaw.rawMaterial= entranceMeatDTO.rawMaterial;
                    await this.rawRepository.saveRaw(saveRaw);
                    let enRaw:Raw[] = await this.rawRepository.getLastRaw();
                    cooling.rawMaterial = enRaw[0];
                }
                await this.coolingRepository.saveCooling(cooling);
        }

        
        entranceMeat.photo = file;

        
        
        let entranceMeatSaved:EntranceMeat=await this.entrancesMeatRepository.saveEntrancesMeat(entranceMeat);
        return entranceMeatSaved.id;
    }

    async reportEntranceMeat(meatId:number){
        if(!meatId) throw new Error("[400], meatId is required");
        let meat:EntranceMeat = await this.entrancesMeatRepository.getEntranceMeatById(meatId);
        if(!meat) throw new Error(`[404], meat with id ${meatId} not found`);
        return meat;
    }

    async reportEntrancesMeats(dateInit:string,dateEnd:string){
        if(!dateInit) throw new Error(`[400], initDate is required in query`);
        if(!dateEnd) throw new Error(`[400], finalDate is required in query`);
        if (!Date.parse(dateInit)) throw new Error("[400], initDate has not a valid value");
        if (!Date.parse(dateEnd)) throw new Error("[400], finDate has not a valid value");

        if(Date.parse(dateInit)>Date.parse(dateEnd)) throw new Error(`[400], iniDate cannot be greater than finDate`);
        let meat:EntranceMeat[]= await this.entrancesMeatRepository.getEntrancesMeats(dateInit,dateEnd);

        if(!meat.length)
            throw new Error("[404], No Entrances meats found, can not generate report");
        return meat;
    }

    /*async getHistoryMeat(lotId:string){
        if(!lotId) throw new Error("[400], lotId is required");
        let response:any = {};
        let aMeat:any = [];
        let aCooling:any = [];
        let aFormulation:any = [];
        let aProcess:any = [];
        let aPackaging:any = [];
        let aOven:any = []
        let aInspection:any = [];
        let aOutputs:any = [];
        let aDevolution:any = [];

        let meat:EntranceMeat[] = await this.entrancesMeatRepository.getEntranceMeatByLotInter(lotId);
        if(meat){
            meat.forEach( i => {
                aMeat.push({
                    receptionDate: i ? i.createdAt : "",
                    entranceMeatId: i ? i.id : ""
                })
            })
        }
        let cooling:Cooling[] = await this.coolingRepository.getCoolingByLotInter(lotId);
        if(cooling){
            cooling.forEach( i => {
                aCooling.push({
                    coolingId: i ? i.id : "",
                    openingDate: i ? i.openingDate : "",
                    closedDate: i ? i.closingDate : ""
                })
            })
        }
        let formulation:Formulation[] = await this.formulationRepository.getOneFormulationsByLote(lotId);
        if(formulation){
            for(let i = 0; i < formulation.length; i++){
                let ingredents:FormulationIngredients[] = await this.formulatioIngredientsRepository.getByFormulation(formulation[i]);
                let ingreden:any = []
                ingredents.forEach( i=> {
                    ingreden.push(i.productId.description)
                })
                aFormulation.push({
                    formulationId: formulation[i] ? formulation[i].id : "",
                    providerId: formulation[i].make ? formulation[i].make.name + " " + formulation[i].make.firstSurname + " " + formulation[i].make.lastSurname : "",
                    ingredient: ingreden
                })
            }
        }
        let process:Process[] = await this.processRepository.findProceesByLotInerno(lotId);
        if(process){
            process.forEach( i => {
                aProcess.push({
                    processId: i ? i.id : "",
                    startDate: i ? i.startDate : "",
                    endDate: i ? i.dateEndedProcess : "",
                    description: i ? i.currentProcess : ""
                })
            })
        }
        console.log("pasa proceso")
        if(process){
            for(let i = 0; i < process.length; i++){
                let oven:OvenProducts[] = await this.ovenRepository.getOvenByProcessId(process[i].id);
                if(oven){
                    //array de revisiones: hora, tempin,oven,observacoines
                    // oven.forEach( i => {
                    //     aOven.push({
                    //         ovenId: i ? i.id : "",
                    //         entranceDate: i ? i.date : ""
                    //     })
                    // })
                    for(let a = 0; a < oven.length; a++){
                        let revisionOven:RevisionsOvenProducts[] = await this.revisionsOvenProductsRepository.getByOven(oven[i]);
                        let revision:any = [];
                        revisionOven.forEach(i=>{
                            revision.push({
                                hour: i ? i.hour : "",
                                interTemp: i ? i.interTemp : "",
                                ovenTemp: i ? i.ovenTemp : "",
                                humidity: i ? i.humidity : "",
                                observations: i ? i.observations : ""
                            })
                        })
                        aOven.push({
                            ovenId: oven[a] ? oven[a].id : "",
                            entranceDate: oven[a] ? oven[a].date : "",
                            revisions: revision
                        })
                    }
                }
            }
        }
        console.log("pasa hornos")
        if(process){
            for(let i = 0; i < process.length; i++){
                let packagin:Packaging[] = await this.packagingRepository.getPackagingByProcessId(process[i].id.toString());
                if(packagin){
                    for(let e = 0; e < packagin.length; e++){
                        let proPackagin:PropertiesPackaging[] = await this.propertiesPackagingRepository.findPropiertiesPackagings(packagin[e]);
                        let properties:any = [];
                        //que tipo de presentacion type
                        //peso
                        proPackagin.forEach( i => {
                            properties.push({
                                quantity: i ? i.units : "",
                                presentation: i.presentationId ? i.presentationId.presentation + " " + i.presentationId.presentationType : "",
                                weight: i ? i.weight : ""
                            })
                        });
                        aPackaging.push({
                            packaginId: packagin[i] ? packagin[i].id : "",
                            date: packagin[i] ? packagin[i].registerDate : "",
                            properties: properties
                        })
                    }
                }
            }
        }
        console.log("pasa empaquetado")
        if(process){
            for(let i = 0; i < process.length; i++){
                let oven:OvenProducts[] = await this.ovenRepository.getOvenByProcessId(process[i].id);
                if(oven){
                    for(let e = 0; e < oven.length; e++){
                        let reprocessing:Reprocessing[] = await this.reprocessingRepository.getReprocessingByLotRepro(oven[e].newLote);
                        if(reprocessing){
                            reprocessing.forEach(i=>{
                                aDevolution.push({
                                    reprocessingId: i ? i.id : "",
                                    date: i ? i.date : "",
                                    lotProcess: i.lotProcess ? i.lotProcess : ""
                                })
                            })
                        }
                    }
                }
            }
        }
        console.log("pasa reproceso")
        if(process){
            for(let i = 0; i < process.length; i++){
                let packagin:Packaging[] = await this.packagingRepository.getPackagingByProcessId(process[i].id.toString());
                if(packagin){
                    for(let e = 0; e < packagin.length; e++){
                        let inspection:Inspection[] = await this.inspectionRepository.getInspectionsByLot(packagin[i].lotId);
                        if(inspection){
                            inspection.forEach(i=>{
                                aInspection.push({
                                    InspectionDate: i ? i.expirationDate : ""
                                })
                            })
                        }
                    }
                }
            }
        }
        console.log("pasa devolucion")
        let outputs = await this.outputsCoolingRepository.getOutputsCoolingByLotInterno(lotId);
        if(outputs){
            //agregar observaciones, cantidad, materia prima
            outputs.forEach(i=>{
                aOutputs.push({
                    outputsCoolingId: i ? i.id : "",
                    startOutput: i ? i.outputDate : "",
                    observations: i.observations ? i.observations : "",
                    rawMaterial: i.rawMaterial ? i.rawMaterial.rawMaterial : "",
                    quantity: i.quantity ? i.quantity : ""
                })
            })
        }
        
        response = {
            entranceMeat: aMeat ? aMeat : "",
            fridge: aCooling ? aCooling : "",
            formulation: aFormulation ? aFormulation : "",
            process: aProcess ? aProcess : "",
            oven: aOven ? aOven : "",
            packingDate: aPackaging ? aPackaging : "",
            devolutions: aDevolution ? aDevolution : "",
            InspectionDate: aInspection ? aInspection : "",
            outputs: aOutputs ? aOutputs : ""
        }
        return response;
    }*/

}
