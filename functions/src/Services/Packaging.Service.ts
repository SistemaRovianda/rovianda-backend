import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO, UserPackagingDTO, PackagingAssignedDTO } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Request } from 'express';
import { isArguments } from 'lodash';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { PresentationProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
import { ReprocessingDTO } from '../Models/DTO/ReprocessingDTO';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { BoxPackaging } from '../Models/Entity/Box.Packaging';
import { BoxPackagingRepository } from '../Repositories/Box.Packaging.Repository';


export class PackagingService{

    private packagingRepository: PackagingRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private ovenRepository: OvenRepository;
    private presentationProductRepository: PresentationProductsRepository;
    private userRepository: UserRepository;
    private reprocessingRepository: ReprocessingRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private presentationsProductsRepository:PresentationsProductsRepository;
    private boxPackagingRepository:BoxPackagingRepository;


    constructor() {
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.presentationProductRepository = new PresentationProductsRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.reprocessingRepository = new ReprocessingRepository();
        this.userRepository = new UserRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.presentationsProductsRepository = new PresentationsProductsRepository();
        this.boxPackagingRepository= new BoxPackagingRepository();
    }

    async savePackaging(req: Request) {
      
        let { registerDate, productId, lotId, expiration, products } = req.body;
        if (!registerDate)
            throw new Error("[400],registerDate is required");
        if (!productId)
            throw new Error("[400],productId is required");
        if (isNaN(productId))
            throw new Error("[400],productId has invalid format, productId must be a numeric value");
        if (!lotId)
            throw new Error("[400],lotId is required");
        if (isNaN(lotId))
            throw new Error("[400],lotId has invalid format, lotId must be a numeric value")
        if (!expiration)
            throw new Error("[400],expiration is required");
        if (isNaN(expiration))
            throw new Error("[400],expiration has invalid format, expiration must be a numeric value");
        if (!products)
            throw new Error("[400],products is required");
        
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
            propertiesPackaging.packagingId = packing[0];
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
      
        let presentations: PresentationProducts[] = [];

        for (let product of products) {
            if (!product.presentationId)
                throw new Error("[400],a product is missing presntationId");
            if (isNaN(product.presentationId))
                throw new Error("[400],presentationId in one of the products has invalid format");
            if (!product.pieces)
                throw new Error("[400],a product is missing pieces attribute");
            if (isNaN(product.pieces))
                throw new Error("[400],pieces in one of the products has invalid format");
            if (!product.packs)
                throw new Error("[400],a product is missing packs attribute");
            if (isNaN(product.packs))
                throw new Error("[400],packs in one of the products has invalid format");
            if (!product.weight)
                throw new Error("[400],a product is missing weight attribute");
            if (isNaN(product.weight))
                throw new Error("[400],weight in one of the products has invalid format");
            let presentation = await this.presentationProductRepository.getPresentationProductsById(product.presentationId);
            if (!presentation)
                throw new Error(`[404], Presentation product with id ${product.presentationId} was not found`);
            presentations.push(presentation);

        }

        let productRovianda = await this.productRoviandaRepository.getProductRoviandaById(+productId);

        if (!productRovianda)
            throw new Error(`[404],product rovianda with id ${productId} was not found`);

        let ovenProduct = await this.ovenRepository.getOvenProductById(lotId);
        if (!ovenProduct)
            throw new Error(`[404],oven product with id ${lotId} was not found`);


        let packaging: Packaging = {
            id: 0,
            expiration,
            productId: productRovianda,
            lotId: ovenProduct.id,
            registerDate,
            jobElabored: null,
            jobVerify: null,
            nameElabored: null,
            nameVerify: null,
            propertiesPackaging: null

        }
        try {

            let packagingSaved = await this.packagingRepository.savePackaging(packaging);
            let index = 0;
            for (let product of products) {
                let propertiePackaging: PropertiesPackaging = {
                    id: 0,
                    boxPackaging: null,
                    observations: product.observations,
                    packaging: packagingSaved,
                    packs: product.packs,
                    pieces: product.pieces,
                    presentationProduct: presentations[index],
                    weight: product.weight
                }
                await this.propertiesPackagingRepository.savePropertiesPackaging(propertiePackaging);
                index++;
            }
        } catch (error) {
            throw new Error(`[500],${error}`);
        }

    }
   }
  
    async getProducts() {
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string) {

    }
        
    async saveReprocessing(reprocessingDTO:ReprocessingDTO){

        if(!reprocessingDTO.date) throw new Error("[400], date is required");
        if(!reprocessingDTO.allergen) throw new Error("[400], allergen is required");
        if(!reprocessingDTO.area) throw new Error("[400], area is required");
        if(!reprocessingDTO.lotId) throw new Error("[400], lotId is required");
        if(!reprocessingDTO.productId) throw new Error("[400], productId is required");
        if(!reprocessingDTO.weight) throw new Error("[400], weight is required");
        
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
  
    async saveUsersPackaging(userPackagingDTO:UserPackagingDTO, packagingId:string){

            if(!userPackagingDTO.jobElaborated) throw new Error("[400], falta el parametro jobElaborated");
            if(!userPackagingDTO.jobVerify) throw new Error("[400], falta el parametro jobVerify");
            if(!userPackagingDTO.nameElaborated) throw new Error("[400], falta el parametro nameElaborated");
            if(!userPackagingDTO.nameVerify) throw new Error("[400], falta el parametro nameVerify");
    
            let userVerify : User = await this.userRepository.getUserByName(userPackagingDTO.nameVerify);
            if(!userVerify) throw new Error(`[400], no existe usuario ${userVerify}`);
    
            let userElaborated : User = await this.userRepository.getUserByName(userPackagingDTO.nameElaborated);
            if(!userElaborated) throw new Error(`[400], no existe usuario ${userElaborated}`);
    
            let packaging: Packaging = await this.packagingRepository.findPackagingById(+packagingId);
            if(!packaging) throw new Error("[400], packaging not found");

            packaging.jobElabored = userPackagingDTO.jobElaborated;
            packaging.nameElabored = userPackagingDTO.nameElaborated;
            packaging.nameVerify = userPackagingDTO.nameVerify;
            packaging.jobVerify = userPackagingDTO.jobVerify;
    
            return await this.packagingRepository.savePackaging(packaging);
    }

    async getPackagingColaboratedById(packagingId:number){
        if(!packagingId) throw new Error("[400], packagingId is required");
        let packaging:Packaging = await this.packagingRepository.findPackagingById(packagingId);
        if(!packaging) throw new Error("[404], packaging not found");
        let response = {};
        response = {
            nameElaborated: `${packaging.nameElabored}`,
            jobElaborated: `${packaging.jobElabored}`,
            nameVerify: `${packaging.nameElabored}`,
            jobVerify: `${packaging.jobVerify}`
        }
        return response;
    }

    async savePackagingAssigned(packagingAssigned:PackagingAssignedDTO){

        if(!packagingAssigned.boxs) throw new Error("[400], boxs is required");
        if(!packagingAssigned.packagingId) throw new Error("[400], packagingId is required");
        if(!packagingAssigned.presentationId) throw new Error("[400], presentationId is required");
    
        let packaging: Packaging = await this.packagingRepository.findPackagingById(packagingAssigned.packagingId);
        if(!packaging) throw new Error("[404], packaging not found");
        let packagingPropierties = await this.propertiesPackagingRepository.findPropiertiesPackagingByPackagingId(packaging.id);
        if(!packagingPropierties) throw new Error("[404], packaging no relacionado a propierties packaging");

        let presentation: PresentationProducts = await this.presentationsProductsRepository.getPresentatiosProductsById(packagingAssigned.presentationId);
        if(!presentation) throw new Error("[404], presentation products not found");
        let presentationPropierties = await this.propertiesPackagingRepository.findPropiertiesPackagingByPresentationId(presentation.id);
        if(!presentationPropierties) throw new Error("[404], presentation product no relacionado a propierties packaging");

        let countEnd = await this.boxPackagingRepository.getMaxBox(); 
        console.log(countEnd.max);

        let boxPackaging: BoxPackaging = new BoxPackaging();
        boxPackaging.propertiesId = presentationPropierties;
        boxPackaging.countInitial = ""+(parseInt(countEnd.max)+1);
        boxPackaging.countEnd = ""+(parseInt(countEnd.max)+packagingAssigned.boxs);

        return await this.boxPackagingRepository.createBoxPackaging(boxPackaging);        

    }
}