import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { Inspection } from '../Models/Entity/Inspection';
import { InspectionDTO, InspectionUsersDTO } from '../Models/DTO/InspectionDTO';
import { UserRepository } from '../Repositories/User.Repository';
import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { User } from '../Models/Entity/User';
import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { RevisionsOvenProductsRepository } from '../Repositories/Revisions.Oven.Products.Repository';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { OvenProductStatusEnum } from '../Models/Enum/OvenProduct.Status.Enum';

export class InspectionService{
    private inspectionRepository:InspectionRepository;
    private userRepository:UserRepository;
    private packagingRepository:PackagingRepository;
    private productRoviandaRepository:ProductRoviandaRepository;
    private presentationProduct:PresentationsProductsRepository;
    private ovenProductRepository:OvenRepository;
    constructor(){
        this.inspectionRepository = new InspectionRepository();
        this.userRepository = new UserRepository();
        this.packagingRepository = new PackagingRepository();
        this.productRoviandaRepository = new ProductRoviandaRepository();
        this.presentationProduct = new PresentationsProductsRepository();
        this.ovenProductRepository = new OvenRepository;
    }


    async getUsersInspection(inspectionId: number) {
        let inspection: Inspection = await this.inspectionRepository.getInspectionById(+inspectionId);
        console.log(inspection); 
        if (!inspection)
            throw Error(`[404], Inspection not found`);
        let response = {
            nameElaborated: inspection.nameElaborated? inspection.nameElaborated : null,
            jobElaborated: inspection.jobElaborated? inspection.jobElaborated : null,
            nameVerify: inspection.nameVerify? inspection.nameVerify : null,
            jobVerify: inspection.jobVerify? inspection.jobVerify : null
        }
        return response;
    }

    async createInspection(inspectionDTO:InspectionDTO){
        if(!inspectionDTO.uid) throw new Error("[400],uid is required");
        if (!inspectionDTO.lotId)  throw new Error("[400],lotId is required");
        if (!inspectionDTO.expirationDate)  throw new Error("[400],expirationDate is required");
        if (!inspectionDTO.productId)  throw new Error("[400],productId is required");
        if (!inspectionDTO.presentationId)  throw new Error("[400],presentationId is required");
        if (!inspectionDTO.numberPackages)  throw new Error("[400],numberPackages is required");
        //if (!inspectionDTO.observations)  throw new Error("[400],observations is required");
        if (inspectionDTO.validations.packagingControl == null)  throw new Error("[400],packaginControl is required");
        if (inspectionDTO.validations.foreignMatter == null)  throw new Error("[400],foreignMatter is required");
        if (inspectionDTO.validations.transport == null)  throw new Error("[400],transport is required");
        if (inspectionDTO.validations.weightPerPiece == null)  throw new Error("[400],weightPerPiece is required");
        if (inspectionDTO.validations.temperature == null)  throw new Error("[400],temperature is required");
        if (inspectionDTO.validations.odor == null)  throw new Error("[400],odor is required");
        if (inspectionDTO.validations.colour == null)  throw new Error("[400],colour is required");
        if (inspectionDTO.validations.texture == null)  throw new Error("[400],texture is required");

        let user:User = await this.userRepository.getUserById(inspectionDTO.uid);
        let product = await this.inspectionRepository.getProductInspection(+inspectionDTO.productId);
        if (!product)  throw new Error("[400],producto no encontrado en tabla packaging");
        let prod:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaByProductId(+inspectionDTO.productId)
        if (!prod)  throw new Error("[404],producto no encontrado");
        let presentationProduct = await this.presentationProduct.getPresentationProductsById(inspectionDTO.presentationId);
        if(!presentationProduct)throw new Error("[404],presentacion no encontrada");
        let lot = await this.packagingRepository.getPackagingByLotId(inspectionDTO.lotId);
        if (!lot)  throw new Error("[400],No existe lote");
        console.log(lot);
            let inspection :Inspection = new Inspection();
            inspection.lotId = inspectionDTO.lotId;
            inspection.expirationDate = inspectionDTO.expirationDate;
            inspection.productId = prod;
            inspection.numberPackages = inspectionDTO.numberPackages;
            inspection.observations = inspectionDTO.observations?inspectionDTO.observations:"";
            inspection.packagingControl = inspectionDTO.validations.packagingControl;
            inspection.foreingMatter = inspectionDTO.validations.foreignMatter;
            inspection.transport = inspectionDTO.validations.transport;
            inspection.weightPerPiece = inspectionDTO.validations.weightPerPiece;
            inspection.temperature = inspectionDTO.validations.temperature;
            inspection.odor = inspectionDTO.validations.odor;
            inspection.colour = inspectionDTO.validations.colour;
            inspection.texture = inspectionDTO.validations.texture;
            inspection.processId = inspectionDTO.processId;
            inspection.userIspector=user.id;
            inspection.presentationId=presentationProduct.id;
           let inspectionSaved:Inspection= await this.inspectionRepository.createInspection(inspection);   
           return inspectionSaved.id;
    }

    async createInspectionUsers(inspectionUsersDTO:InspectionUsersDTO,inspectionId:string){
      
        if (!inspectionUsersDTO.jobElaborated)  throw new Error("[400],jobElaborated is required");
        if (!inspectionUsersDTO.jobVerify)  throw new Error("[400],jobVerify is required");
        if (!inspectionUsersDTO.nameElaborated)  throw new Error("[400],nameElaborated is required");
        if (!inspectionUsersDTO.nameVerify)  throw new Error("[400],nameVerify is required");

        // let userElaborated = await this.userRepository.getUserByName(inspectionUsersDTO.nameElaborated);
        // if (!userElaborated)  throw new Error(`[404],No existe usuario ${inspectionUsersDTO.nameElaborated}`);
        // let userVerify = await this.userRepository.getUserByName(inspectionUsersDTO.nameVerify);
        // if (!userVerify)  throw new Error(`[404],No existe usuario ${inspectionUsersDTO.nameVerify}`);

            let inspection :Inspection = await this.inspectionRepository.getInspectionById(+inspectionId);
            if(!inspection)  throw new Error("[404],No existe inspection ");

            inspection.nameElaborated = inspectionUsersDTO.nameElaborated;
            inspection.nameVerify = inspectionUsersDTO.nameVerify;
            inspection.jobElaborated = inspectionUsersDTO.jobElaborated;
            inspection.jobVerify = inspectionUsersDTO.jobVerify;
    
            await this.inspectionRepository.createInspection(inspection);   
    }

    async endedInspection(ovenProductId:number){
        let ovenProduct:OvenProducts = await this.ovenProductRepository.getOvenProductById(ovenProductId);
        if(!ovenProduct) throw new Error("[404], no existe registro en hornos de este producto");
        ovenProduct.inspectioned=true;
        await this.ovenProductRepository.saveOvenProduct(ovenProduct);      
    }
}