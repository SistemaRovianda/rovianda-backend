import { EntranceMeatRepository } from '../Repositories/Entrances.Meat.Repository';
import { EntranceMeat } from "../Models/Entity/Entrances.Meat";
import { UserRepository } from '../Repositories/User.Repository';
import { User } from '../Models/Entity/Users';
import { EntranceMeatDTO } from '../Models/DTO/EntranceMeatDTO';
import { Fridge } from '../Models/Entity/Fridges';
import { FridgeRepository } from '../Repositories/Fridges.Repository';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { File } from '../Models/Entity/Files';
import { CoolingRepository } from '../Repositories/Cooling.Repository';
import { Cooling } from '../Models/Entity/Cooling';
import { WarehouseStatus } from '../Models/Enum/WarehouseStatus';

export class EntranceMeatService{
    private entrancesMeatRepository:EntranceMeatRepository;
    private userRepository:UserRepository;
    private fridgeRepository:FridgeRepository;
    private coolingRepository:CoolingRepository;
    constructor(private firebaseHelper:FirebaseHelper){
        this.entrancesMeatRepository = new EntranceMeatRepository();
        this.userRepository = new UserRepository();
        this.fridgeRepository = new FridgeRepository();
        this.coolingRepository = new CoolingRepository();
    }


    async saveEntrancesMeat(req:any){

        let entranceMeatDTO:EntranceMeatDTO = req.body;

        let photo:any= req.files[0];

        if(!entranceMeatDTO.createdAt) throw new Error("[400],Falta la propiedad createdAt");
        if(!entranceMeatDTO.loteInterno) throw new Error("[400],Falta la propiedad loteInterno");
        if(!entranceMeatDTO.loteProveedor) throw new Error("[400],Falta la propiedad loteProveedor");
        if(!entranceMeatDTO.proveedor) throw new Error("[400],Falta la propiedad proveedor");
        if(!entranceMeatDTO.rawMaterial) throw new Error("[400],Falta la propiedad rawMaterial");
        if(!entranceMeatDTO.temperature) throw new Error("[400],Falta la propiedad temperature");
        if(!entranceMeatDTO.texture) throw new Error("[400],Falta la propiedad texture");
        if(!entranceMeatDTO.transport) throw new Error("[400],Falta la propiedad transport");
        if(!entranceMeatDTO.weight) throw new Error("[400],Falta la propiedad weight");
        if(!entranceMeatDTO.strangeMaterial) throw new Error("[400],Falta la propiedad strageMaterial");
        if(!entranceMeatDTO.slaughterDate) throw new Error("[400],Falta la propiedad slaughterDate");
        if(!entranceMeatDTO.packing) throw new Error("[400],Falta la propiedad packing");
        if(!entranceMeatDTO.odor) throw new Error("[400],Falta la propiedad odor");
        if(!entranceMeatDTO.job) throw new Error("[400],Falta la propiedad job");
        if(!entranceMeatDTO.fridge) throw new Error("[400],Falta la propiedad fridge");
        if(!entranceMeatDTO.expiration) throw new Error("[400],Falta la propiedad expiration");  

        let userInspector:User = await this.userRepository.getUserById(entranceMeatDTO.qualityInspectorId);
        if(!userInspector) throw new Error("[404],Usuario inspector de calidad no existe");
        let fridge:Fridge = await this.fridgeRepository.getFridgeById(+entranceMeatDTO.fridge.fridgeld);
        if(!fridge) throw new Error("[404],Refrigerador no existe");

        let urlOfImage:string = await this.firebaseHelper.uploadImage(`/${entranceMeatDTO.createdAt}/${entranceMeatDTO.loteInterno}/`,photo);

        let entranceMeat = new EntranceMeat();
        entranceMeat.createdAt = entranceMeatDTO.createdAt;
        entranceMeat.loteInterno= entranceMeatDTO.loteInterno;
        entranceMeat.loteProveedor = entranceMeatDTO.loteProveedor;
        entranceMeat.proveedor = entranceMeatDTO.proveedor;
        entranceMeat.rawMaterial = entranceMeatDTO.rawMaterial;
        entranceMeat.temperature = entranceMeatDTO.temperature;
        entranceMeat.texture = entranceMeatDTO.texture;
        entranceMeat.transport = entranceMeatDTO.transport;
        entranceMeat.weight = entranceMeatDTO.weight;
        entranceMeat.strangeMaterial = entranceMeatDTO.strangeMaterial;
        entranceMeat.slaughterDate = entranceMeatDTO.slaughterDate;
        entranceMeat.packing = entranceMeatDTO.packing;
        entranceMeat.odor = entranceMeatDTO.odor;
        entranceMeat.job = entranceMeatDTO.job;
        entranceMeat.qualityInspector = userInspector;
        entranceMeat.fridge = entranceMeatDTO.fridge;
        let file:File = new File();
        file.url = urlOfImage;
        entranceMeat.photo = file;

        let cooling:Cooling = new Cooling();
        cooling.loteInterno = entranceMeatDTO.loteInterno;
        cooling.loteProveedor = entranceMeatDTO.loteProveedor;
        cooling.quantity = entranceMeatDTO.weight.value;
        cooling.rawMaterial=entranceMeatDTO.rawMaterial;
        cooling.status = WarehouseStatus.PENDING;
        cooling.fridge = fridge;
        cooling.userId=req.headers.uid;
        await this.coolingRepository.saveCooling(cooling);
        await this.entrancesMeatRepository.saveEntrancesMeat(entranceMeat);
    }

}
