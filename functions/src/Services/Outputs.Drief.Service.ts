import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { WarehouseExitDriefDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";
import { OutputDriefDTO } from '../Models/DTO/OutputsDriefDTO';

export class OutputsDriefService {
    private outputsDriefRepository: OutputsDriefRepository;
    private productRepository: ProductRepository;
    private warehouseDriefRep: WarehouseDriefRepository;
    constructor() {
        this.outputsDriefRepository = new OutputsDriefRepository();
        this.productRepository = new ProductRepository();
        this.warehouseDriefRep = new WarehouseDriefRepository();
    }

    async createOutputsDrief(outputsDriefDTO: WarehouseExitDriefDTO) {
    
        let product: Product = await this.productRepository.getProductById(outputsDriefDTO.productId);
        if (!product) throw new Error("[404], producto no encontrado");

        let lote: WarehouseDrief = await this.warehouseDriefRep.getWarehouseDriefByLoteId(outputsDriefDTO.loteId);
        if (!lote) throw new Error("[404], El lote no existe");
        console.log(lote)
        
        if (lote.status == WarehouseStatus.CLOSED) throw new Error("[409], El lote esta cerrado");
        if (lote.status == WarehouseStatus.PENDING) throw new Error("[409], El lote aún no abierto");
        let outputsDrief: OutputsDrief = new OutputsDrief();
        outputsDrief.date = outputsDriefDTO.date;
        outputsDrief.loteProveedor = outputsDriefDTO.loteId;
        outputsDrief.observations = outputsDriefDTO.observations;
        outputsDrief.product = product;
        outputsDrief.warehouseDrief = lote;
        outputsDrief.status = "UNUSED";
        return await this.outputsDriefRepository.createOutputsDrief(outputsDrief);
    }

    async getAlloutputsDrief() {
        return await this.outputsDriefRepository.getAllOutputsDrief();
    }

    async getOutputsDriefgById(id: number) {
        return await this.outputsDriefRepository.getOutputsDriefById(id);
    }

    async getOutputsDriefByLot(lot: string,status:string) {
        return await this.outputsDriefRepository.getOutputsDriefByLotIdAndStatus(lot,status);
    }

    async getOutputIngredients() {
        let outputsDrief = await this.outputsDriefRepository.getAllOutputsDrief();
        let ingredients: Product[] = [];
        
        for (let outputDrief of outputsDrief){
            if(outputDrief.product)
                ingredients.push(outputDrief.product);
        }
        return ingredients;
    }

    async getAllDrief(){
        return await this.productRepository.getAllProductsExisting("DRIEF");
    }

    // async getIngredients(lotsId:[]){
    //     //id de ingredientes
    //     if (!lotsId) throw new Error("[404], lotsId is required");
    //    console.log(lotsId);
    //    let outputs:OutputsDrief[] = await this.outputsDriefRepository.getOutputsDriefByLotId(lotsId);
       
    //    let response = [];
    //    outputs.forEach(i => {
    //        response.push({
    //            productId: `${i.product.id}`,
    //            lots:[`${i.loteProveedor}`]   
    //        });
    //    });
    //    return response; 
    // }

    async getIngredients(lotsId:[]){
        if (!lotsId) throw new Error("[404], lotsId is required");
        console.log(lotsId);
        let response2:any = []
        for(let i = 0; i<lotsId.length; i++){
            let response:any = []
            let product:Product = await this.productRepository.getProductById(lotsId[i]);
            //let productOpen:WarehouseDrief[] = await this.warehouseDriefRep.getByProductIdAndStatus(lotsId[i],"OPENED");
            
                console.log("pasa")
                let outputsDrief:OutputsDrief[] = await this.outputsDriefRepository.getOutputsDriefByProductAndStatus(product,"NOTUSED");
                console.log(outputsDrief)
                if(outputsDrief[0]){
                    outputsDrief.forEach(e => {
                        response.push(
                            {
                             loteId:e.loteProveedor,
                             lotRecordId:e.id,
                             date: e.date
                            }
                            )
                    })
                }
            
            response2.push({
                productId: lotsId[i],
                lots: response 
            })
        }
        return response2;
    }


}