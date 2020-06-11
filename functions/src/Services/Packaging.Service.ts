import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ReprocessingDTO } from '../Models/DTO/ReprocessingDTO';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
export class PackagingService{

    private packagingRepository:PackagingRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private ovenRepository: OvenRepository;
    private reprocessingRepository: ReprocessingRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;

    constructor() {
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.reprocessingRepository = new ReprocessingRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
    }

    async savePackaging(packagingDTO:PackagingDTO){

        if(!packagingDTO.registerDate) throw new Error("[400], registerDate is required");
        if(!packagingDTO.productId) throw new Error("[400], productId is required");
        if(!packagingDTO.lotId) throw new Error("[400], lotId is required");
        if(!packagingDTO.expiration) throw new Error("[400], expiration is required");
        if(!packagingDTO.products) throw new Error("[400], products is required");
        
        console.log("inicio")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(packagingDTO.productId);
        console.log("Consulta")
        if(!product) throw new Error("[400], product not found");
        console.log("Consulta")
        let lot:OvenProducts = await this.ovenRepository.getOvenProductByLot(packagingDTO.lotId);
        if(!lot) throw new Error("[400], lot not found");
        let packaging:Packaging = new Packaging();
        packaging.registerDate = packagingDTO.registerDate;
        packaging.productId = product;
        packaging.lotId = packagingDTO.lotId;
        packaging.expiration = packagingDTO.expiration;
        await this.packagingRepository.savePackaging(packaging);
        let packing = await this.propertiesPackagingRepository.getLastPropertiesPackaging();
        for( let i =0; i<packagingDTO.products.length; i++){
            let propertiesPackaging:PropertiesPackaging = new PropertiesPackaging();
            propertiesPackaging.pieces = packagingDTO.products[i].pieces;
            propertiesPackaging.packs = packagingDTO.products[i].packs;
            propertiesPackaging.weight = packagingDTO.products[i].weight;
            propertiesPackaging.observations = packagingDTO.products[i].observations;
            propertiesPackaging.packaging = packing[0];
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
        }
        console.log("hecho")
        return "registrado";
    }

    async getProducts(){
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string){

    }
        
    async saveReprocessing(reprocessingDTO:ReprocessingDTO){

        if(!reprocessingDTO.date) throw new Error("[400], date is required");
        if(!reprocessingDTO.allergen) throw new Error("[400], allergen is required");
        if(!reprocessingDTO.area) throw new Error("[400], area is required");
        if(!reprocessingDTO.lotId) throw new Error("[400], date is required");
        if(!reprocessingDTO.productId) throw new Error("[400], date is required");
        if(!reprocessingDTO.weight) throw new Error("[400], date is required");
        
        console.log("inicio")
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(reprocessingDTO.productId);
        console.log("Consulta")
        if(!product) throw new Error("[404], product not found");
        console.log("Consulta")
        let lot:OvenProducts = await this.ovenRepository.getOvenProductByLot(reprocessingDTO.lotId);
        if(!lot) throw new Error("[404], lot not found");

        let reprocessing:Reprocessing = new Reprocessing();
        reprocessing.allergens = reprocessingDTO.allergen;
        reprocessing.area = reprocessingDTO.area;
        reprocessing.date = reprocessingDTO.date;
        reprocessing.lotRepro = lot.newLote;
        reprocessing.productId = product.id;
    
        console.log("hecho")
        return await this.reprocessingRepository.saveRepocessing(reprocessing);
    }
}