import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO, UserPackagingDTO, PackagingAssignedDTO, UserPackaginggDTO } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Request, response } from 'express';
import { isArguments } from 'lodash';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';
import { ReprocessingDTO } from '../Models/DTO/ReprocessingDTO';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { BoxPackaging } from '../Models/Entity/Box.Packaging';
import { BoxPackagingRepository } from '../Repositories/Box.Packaging.Repository';
import { REPROCESSING } from '../Models/Enum/Reprocessing.Area';
import { ProcessRepository } from '../Repositories/Process.Repository';


export class PackagingService{

    private packagingRepository: PackagingRepository;
    private productRoviandaRepository: ProductRoviandaRepository;
    private ovenRepository: OvenRepository;
    private presentationProductRepository: PresentationsProductsRepository;
    private userRepository: UserRepository;
    private reprocessingRepository: ReprocessingRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private presentationsProductsRepository:PresentationsProductsRepository;
    private boxPackagingRepository:BoxPackagingRepository;
    private processRepository:ProcessRepository;


    constructor() {
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.ovenRepository = new OvenRepository();
        this.packagingRepository = new PackagingRepository();
        this.presentationProductRepository = new PresentationsProductsRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.reprocessingRepository = new ReprocessingRepository();
        this.userRepository = new UserRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.presentationsProductsRepository = new PresentationsProductsRepository();
        this.boxPackagingRepository= new BoxPackagingRepository();
        this.processRepository = new ProcessRepository();
    }

    async savePackaging(packagingDTO:PackagingDTO) {
        if (!packagingDTO.registerDate) throw new Error("[400],registerDate is required");
        if (!packagingDTO.productId) throw new Error("[400],productId is required");
        if (!packagingDTO.lotId) throw new Error("[400],lotId is required");
        if (!packagingDTO.expiration) throw new Error("[400],expiration is required");
        if (!packagingDTO.products) throw new Error("[400],products is required");
        if (isNaN(packagingDTO.productId)) throw new Error("[400],productId has invalid format, productId must be a numeric value");
        let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(packagingDTO.productId);
        if(!product) throw new Error("[400], product not found");
        for(let i = 0; i<packagingDTO.products.length; i++){
            if (!packagingDTO.products[i].presentationId) throw new Error("[400],presentationId is required");
            if (!packagingDTO.products[i].units) throw new Error("[400],units is required");
            if (!packagingDTO.products[i].weight) throw new Error("[400],weight is required");
        }
        let lot:OvenProducts = await this.ovenRepository.getOvenProductByIds(packagingDTO.lotId);
        if(!lot) throw new Error("[400], lot not found");
        let packaging:Packaging = new Packaging();
        packaging.registerDate = packagingDTO.registerDate;
        packaging.productId = product;
        packaging.lotId = packagingDTO.lotId;
        packaging.expiration = packagingDTO.expiration;
        packaging.active = true;
        await this.packagingRepository.savePackaging(packaging);
        let packing = await this.packagingRepository.getLastPackaging();
        for(let e = 0; e<packagingDTO.products.length; e++){
            let propertiesPackaging:PropertiesPackaging = new PropertiesPackaging();
            let presentation:PresentationProducts = await this.presentationProductRepository.getPresentatiosProductsById(packagingDTO.products[e].presentationId)
            propertiesPackaging.weight = packagingDTO.products[e].weight;
            propertiesPackaging.observations = packagingDTO.products[e].observations;
            propertiesPackaging.units = packagingDTO.products[e].units;
            propertiesPackaging.packagingId = packing[0];
            propertiesPackaging.presentationId = presentation;
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
        }
   }
  
    async getProducts() {
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string) {

    }

    async getReprocessingByArea(area:string){
        if(!area) throw new Error("[400], area is required");
        if(area == REPROCESSING.ACONDICIONAMIENTO ||
            area == REPROCESSING.DESCONGELAMIENTO ||
           area == REPROCESSING.EMBUTIDO ||
            area == REPROCESSING.INJECCIONTENDERIZADO ||
           area == REPROCESSING.MOLIENDA){
               let reprocessing:Reprocessing[] = await this.reprocessingRepository.getByArea(area);
               let response:any = [];
               reprocessing.forEach( i=> {
                   if(!i.lotProcess){
                       response.push({
                           reprocessingId: `${i.id}`,
                           date: `${i.date}`,
                           productId: `${i.productId}`,
                           loteProcess: `${i.lotProcess}`,
                           loteReprocessing: `${i.lotRepro}`,
                           allergens: `${i.allergens}`,
                           area: `${i.area}`
                       })
                   }
               })
               return response;
        }else{
            throw new Error("[404], Area incorret");
        }
    }
        
    async saveReprocessing(reprocessingDTO:ReprocessingDTO){

        if(!reprocessingDTO.date) throw new Error("[400], date is required");
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
        console.log(lot)
        let process:any = await this.processRepository.getProceesByLot(lot.newLote,reprocessingDTO.productId);

        if(reprocessingDTO.area == REPROCESSING.ACONDICIONAMIENTO ||
            reprocessingDTO.area == REPROCESSING.DESCONGELAMIENTO ||
            reprocessingDTO.area == REPROCESSING.EMBUTIDO ||
            reprocessingDTO.area == REPROCESSING.INJECCIONTENDERIZADO ||
            reprocessingDTO.area == REPROCESSING.MOLIENDA){
                let reprocessing:Reprocessing = new Reprocessing();
                if(reprocessingDTO.allergen) {reprocessing.allergens = reprocessingDTO.allergen;}
                reprocessing.area = reprocessingDTO.area;
                reprocessing.date = reprocessingDTO.date;
                reprocessing.lotRepro = lot.newLote;
                reprocessing.productId = product.id;
                reprocessing.lotProcess = process[0].lote_interno;
                return await this.reprocessingRepository.saveRepocessing(reprocessing);
        
        }else{
            throw new Error("[404], Status incorret");
        }

        
        //servicio que retorne todos los reprosesos pero aquellos que no tengan
        //lot repro filtrado por area
    
        // console.log("hecho")
        
    }
  
    async saveUsersPackaging(userPackagingDTO:UserPackaginggDTO, packagingId:string){

        if(!userPackagingDTO.userId) throw new Error("[400], falta el parametro userId");

        let userVerify : User = await this.userRepository.getUserById(userPackagingDTO.userId);
        if(!userVerify) throw new Error(`[400], no existe usuario ${userVerify}`);

        let packaging: Packaging = await this.packagingRepository.findPackagingById(+packagingId);
        if(!packaging) throw new Error("[400], packaging not found");

        packaging.userId = userVerify;

        return await this.packagingRepository.savePackaging(packaging);
    }

    async getPackagingColaboratedById(packagingId:number){
        if(!packagingId) throw new Error("[400], packagingId is required");
        let packaging:Packaging = await this.packagingRepository.findPackagingById(packagingId);
        if(!packaging) throw new Error("[404], packaging not found");
        let response = {};
        response = {
            user: packaging.userId
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
        boxPackaging.propertiesPackaging = presentationPropierties;
        boxPackaging.countInitial = ""+(parseInt(countEnd.max)+1);
        boxPackaging.countEnd = ""+(parseInt(countEnd.max)+packagingAssigned.boxs);

        return await this.boxPackagingRepository.createBoxPackaging(boxPackaging);  
    }      

    async getPackagingAssignedBoxes(req: Request){
        let id = req.params.packagingId;

        let packaging = await this.propertiesPackagingRepository.getPropertiesPackaginById(+id);

        if (!packaging) 
            throw new Error(`[404], Properties packaging with id ${id} was not found`);
        
        if (!packaging.boxPackaging)
            throw new Error(`[404], Properties packaging with id ${id} does not have a box packaging assigned`);
        let ids: number[] = [];
        for (let i = parseInt(packaging.boxPackaging.countInitial); i <= parseInt(packaging.boxPackaging.countEnd); i++){
            ids.push(i);
        }

        let response = {
            presentation: packaging.presentationId.id,
            typePresentation: packaging.presentationId.presentationType,
            ids
        }

        return response;
    }

    async getPackaging(){
        let packaging = await this.packagingRepository.getPackaging();
        let response = [];
        for(let i = 0; i<packaging.length; i++){
            let presentations = await this.propertiesPackagingRepository.findPropiertiesPackaging(+packaging[i].propertiesPackaging[0].id);
            let response1 = [];
            for(let j = 0; j< presentations.length; j++){
                response1.push({
                    presentationId : presentations[j].presentationId.id,
                    presentation : presentations[j].presentationId.presentation,
                    typePresentation : presentations[j].presentationId.presentationType,
                    pricePresentation : presentations[j].presentationId.presentationPrice
                });
            }
            response.push({ 
                nameProduct: packaging[i].productId.name,
                productId: packaging[i].productId.id,
                presentations: response1
            })
        }
        return response; 
    }
}