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
    }


    async saveEntrancesMeat(req: any) {
        let entranceMeatDTO: EntranceMeatDTO = req.body;
        //let photo:any= req.files[0];
        console.log("REVISION DE CUERPO DE REQUEST",JSON.stringify(entranceMeatDTO));
        entranceMeatDTO.createdAt = new Date().toISOString().substring(0,10);
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

    async getHistoryMeat(lotId:string){
        if(!lotId) throw new Error("[400], lotId is required");
        let response:any = [];
        let aMeat:any = [];
        let aCooling:any = [];
        let aFormulation:any = [];
        let aProcess:any = [];
        let aPackaging:any = [];
        let aOven:any = []
        let aInspection:any = [];
        let aOutputs:any = [];

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
                    date: i ? i.startDate : "",
                    description: i ? i.currentProcess : ""
                })
            })
        }
        let oven:OvenProducts[] = await this.ovenRepository.getOvensByNewLot(lotId);
        if(oven){
            oven.forEach( i => {
                aOven.push({
                    ovenId: i ? i.id : "",
                    entranceDate: i ? i.date : ""
                })
            })
        }
        //let packaging:Packaging[] = await this.packagingRepository.getPackagingByLot
        // let packaging = await this.packagingRepository.getPackagingByLot(meat.loteInterno);
        // let inspection = await this.inspectionRepository.getInspectionByLot(meat.loteInterno);
        // let outputs = await this.outputsCoolingRepository.getOutputsCoolingByLotInter(meat.loteInterno);

        // let response=
        // {
        //     receptionDate: meat.createdAt ? meat.createdAt : "",
        //     fridge: {
        //       openingDate: cooling.openingDate? cooling.openingDate: null,
        //       closedDate: cooling.closingDate? cooling.closingDate:null
        //     },
        //     formulation: formulation,
        //     process: process,
        //     oven: {
        //       entranceDate: oven ? oven.date : null
        //     },
        //     packingDate: packaging,
        //     devolutions: {
        //       date: null,
        //       lotProcess: null
        //     },
        //     InspectionDate: inspection ? inspection.expirationDate:null,
        //     outputs: outputs
        //   };

        // return response;
    }

}
