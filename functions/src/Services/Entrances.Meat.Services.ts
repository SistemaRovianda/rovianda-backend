import { EntranceMeatRepository } from '../Repositories/Entrances.Meat.Repository';
import { EntranceMeat } from "../Models/Entity/Entrances.Meat";
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

export class EntranceMeatService {
    private entrancesMeatRepository: EntranceMeatRepository;
    private userRepository: UserRepository;
    private fridgeRepository: FridgeRepository;
    private coolingRepository: CoolingRepository;
    private rawRepository:RawRepository;
    constructor(private firebaseHelper: FirebaseHelper) {
        this.entrancesMeatRepository = new EntranceMeatRepository();
        this.userRepository = new UserRepository();
        this.fridgeRepository = new FridgeRepository();
        this.coolingRepository = new CoolingRepository();
        this.rawRepository = new RawRepository();
    }


    async saveEntrancesMeat(req: any) {
        let entranceMeatDTO: EntranceMeatDTO = req.body;
        //let photo:any= req.files[0];
        entranceMeatDTO.createdAt = new Date().toLocaleDateString();
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
        let urlOfImage: string = await this.firebaseHelper.uploadImage(`/${entranceMeatDTO.createdAt.replace(/\//g, "")}/${entranceMeatDTO.lotInternal}/`, photo);
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
            job: entranceMeatDTO.job,
            qualityInspector: userInspector,
            fridge: entranceMeatDTO.fridge,
            id: 0,
            expiration: entranceMeatDTO.expiration,
            photo: file
        }

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

        entranceMeat.photo = file;

        
        await this.coolingRepository.saveCooling(cooling);
        await this.entrancesMeatRepository.saveEntrancesMeat(entranceMeat);
        let id:any = await this.entrancesMeatRepository.getLastEntrnaceMeat();
        return id[0].id;
    }

}
