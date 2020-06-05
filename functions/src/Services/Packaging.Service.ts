import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
export class PackagingService{

    private packagingRepository:PackagingRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private ovenRepository: OvenRepository;

    constructor() {
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
    }

    async savePackaging(packagingDTO:PackagingDTO){

        if(!packagingDTO.expiration) throw new Error("[400], expiration is required");
        if(!packagingDTO.lotId) throw new Error("[400], lotId is required");
        if(!packagingDTO.observations) throw new Error("[400], observations is required");
        if(!packagingDTO.packs) throw new Error("[400], packs is required");
        if(!packagingDTO.pieces) throw new Error("[400], pieces is required");
        if(!packagingDTO.productId) throw new Error("[400], productId is required");
        if(!packagingDTO.registerDate) throw new Error("[400], registerDate is required");
        if(!packagingDTO.weight) throw new Error("[400], weight is required");
        
        console.log("inicio")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(packagingDTO.productId);
        console.log("Consulta")
        if(!product) throw new Error("[400], product not found");
        console.log("Consulta")
        let lot:OvenProducts = await this.ovenRepository.getOvenProductByLot(packagingDTO.lotId);
        if(!lot) throw new Error("[400], lot not found");

        let packaging:Packaging = new Packaging();
        packaging.expiration = packagingDTO.expiration;
        packaging.lotId = packagingDTO.lotId;
        packaging.observations = packagingDTO.observations;
        packaging.packs = packagingDTO.packs;
        packaging.pieces = packagingDTO.pieces;
        packaging.productId = product;
        packaging.registerDate = packagingDTO.registerDate;
        packaging.weight = packagingDTO.weight;
    
        console.log("hecho")
        return await this.packagingRepository.savePackaging(packaging);
    }

    async getProducts(){
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string){

    }
        
}