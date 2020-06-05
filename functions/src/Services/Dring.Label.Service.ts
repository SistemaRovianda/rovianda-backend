import { DryngLabelRepository } from "../Repositories/Dryng.Label.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { DryingLabel } from '../Models/Entity/Dryng.Label';
import { DringLabelDTO } from "../Models/DTO/DringLabelDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";

export class DryngLabelService{
    private dryngLabelRepository:DryngLabelRepository;
    private processRepository:ProcessRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    constructor(){
        this.dryngLabelRepository = new DryngLabelRepository();
        this.processRepository = new ProcessRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
    }

    async createDringLabel(dryngLabelDTO:DringLabelDTO){
        if(!dryngLabelDTO.productId) throw new Error("[400],productId is required");
        if(!dryngLabelDTO.lotId) throw new Error("[400],lotId is required");
        if(!dryngLabelDTO.dateEntrance) throw new Error("[400],dateEntrance is required");
        if(!dryngLabelDTO.dateOutput) throw new Error("[400],dateOutput is required");
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+dryngLabelDTO.productId)
        let proccessbyProduct = await this.processRepository.getProceesByProductID(product);
        if(!proccessbyProduct) throw new Error("[404],Procces not found");
        let proccessbylo = await this.processRepository.getProceesByLotIner(dryngLabelDTO.lotId.toString());
        if(!proccessbylo[0]) throw new Error("[404],Procces not found");

        let dryngLabel:DryingLabel = new DryingLabel();
        dryngLabel.productId = +dryngLabelDTO.productId;
        dryngLabel.lotId = dryngLabelDTO.lotId.toString();
        dryngLabel.dateEntrance = dryngLabelDTO.dateEntrance;
        dryngLabel.dateOutput = dryngLabelDTO.dateOutput;

        return await this.dryngLabelRepository.createDryngLabel(dryngLabel);

    }

    async getDryngLabelById(id:number){

        if(!id) throw new Error("[400],id is required");
        let dryngLabel:DryingLabel = await this.dryngLabelRepository.getDryngLabelById(id);
        if(!dryngLabel) throw new Error("[404],Dryng Label not found");
        let response={
            productId: `${dryngLabel.productId}`,
            lotId: `${dryngLabel.lotId}`,
            dateEntrance: `${dryngLabel.dateEntrance}`,
            dateExit: `${dryngLabel.dateOutput}`
        }
        return response;
    }

}