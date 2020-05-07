import { DriefRepository } from "../Repositories/Drief.Repository";
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { EntrancesDriefDTO } from "../Models/DTO/Entrances.Drief.DTO";
import { ProductRepository } from '../Repositories/Product.Repository';

export class DriefService{
    private productRepostory:ProductRepository;
    private driefRepository:DriefRepository;
    constructor(){
        this.driefRepository = new DriefRepository();
        this.productRepostory = new ProductRepository();
    }

    async createEntrancesDrief(entrancesDrief:EntrancesDriefDTO){

        let product = await this.productRepostory.getProductById(entrancesDrief.product_id);

        if(!product[0])  throw new Error("[404],Product not found");
        if(!entrancesDrief.color) throw new Error("[400],Color is required");
        if(!entrancesDrief.date) throw new Error("[400],Date is required");
        if(!entrancesDrief.is_pz) throw new Error("[400],is_pz is required");
        if(!entrancesDrief.lotProveedor) throw new Error("[400],lotProveedor is required");
        if(!entrancesDrief.observations) throw new Error("[400],Observations is required");
        if(!entrancesDrief.odor) throw new Error("[400],Odor is required");
        if(!entrancesDrief.paking) throw new Error("[400],Packing is required");
        if(!entrancesDrief.product_id) throw new Error("[400],Product_id is required");
        if(!entrancesDrief.proveedor_id) throw new Error("[400],Proveedor_id is required");
        if(!entrancesDrief.quality) throw new Error("[400],Quality is required");
        if(!entrancesDrief.quantity) throw new Error("[400],Quantity is required");
        if(!entrancesDrief.rawMaterial) throw new Error("[400],rawMaterial is required");
        if(!entrancesDrief.strangeMaterial) throw new Error("[400],strangeMaterial is required");
        if(!entrancesDrief.texture) throw new Error("[400],texture is required");
        if(!entrancesDrief.transport) throw new Error("[400],transport is required");
        if(!entrancesDrief.weigth) throw new Error("[400],weigth is required");

        let entrancesDriefToSave:EntranceDrief = new EntranceDrief();

        entrancesDriefToSave.color = entrancesDrief.color;
        entrancesDriefToSave.date = entrancesDrief.date;
        entrancesDriefToSave.expiration = entrancesDrief.expiration;
        entrancesDriefToSave.loteProveedor = entrancesDrief.lotProveedor;
        entrancesDriefToSave.paking = entrancesDrief.paking;
        entrancesDriefToSave.product = product[0];
        entrancesDriefToSave.quality = entrancesDrief.quality;
        entrancesDriefToSave.quantity = entrancesDrief.quantity;
        entrancesDriefToSave.strangeMaterial = entrancesDrief.strangeMaterial;
        entrancesDriefToSave.texture = entrancesDrief.texture;
        entrancesDriefToSave.transport = entrancesDrief.transport;
        entrancesDriefToSave.weight = entrancesDriefToSave.weight;

        return await this.driefRepository.createEntrancesDrief(entrancesDriefToSave);
    }
}