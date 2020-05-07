import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { OutputsDrief } from "../Models/Entity/Outputs.Drief";
import { WarehouseExitDriefDTO } from "../Models/DTO/WarehouseDTO";
import { Product } from "../Models/Entity/Product";
import { ProductRepository } from "../Repositories/Product.Repository";
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";
import { WarehouseStatus } from "../Models/Enum/WarehouseStatus";

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
        if (!lote) throw new Error("[404], el lote no existe");
        if (lote.status == WarehouseStatus.CLOSED) throw new Error("[409], el lote esta cerrado");
        if (lote.status == WarehouseStatus.PENDING) throw new Error("[409], el lote no ah sido abierto");
        let outputsDrief: OutputsDrief = new OutputsDrief();
        outputsDrief.date = outputsDriefDTO.date;
        outputsDrief.loteProveedor = outputsDriefDTO.loteId;
        outputsDrief.observations = outputsDriefDTO.observations;
        //outputsDrief.product = product;

        return await this.outputsDriefRepository.createOutputsDrief(outputsDrief);
    }

    async getAlloutputsDrief() {
        return await this.outputsDriefRepository.getAllOutputsDrief();
    }

    async getOutputsDriefgById(id: number) {
        return await this.outputsDriefRepository.getOutputsDriefById(id);
    }

    async getOutputsDriefByLot(lot: string) {
        return await this.outputsDriefRepository.getOutputsDriefByLot(lot);
    }

}