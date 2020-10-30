import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO, UserPackagingDTO, PackagingAssignedDTO, UserPackaginggDTO, PackagingOutput, PackagingReprocesingRequest } from '../Models/DTO/PackagingDTO';
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
import { validPackagingOutput } from '../Utils/Validators/Packaging.Validators';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { SalesSellerRepository } from '../Repositories/SaleSeller.Repository';
import { SubOrder } from '../Models/Entity/SubOrder.Sale.Seller';
import { SalesRequestRepository } from '../Repositories/SalesRequest.Repostitory';
import { SubOrderMetadata } from '../Models/Entity/SubOrder.Sale.Seller.Metadata';
import { SubOrderMetadataRepository } from '../Repositories/SubOrder.Metadata.Repository';
import { SellerInventory } from '../Models/Entity/Seller.Inventory';
import { SellerInventoryRepository } from '../Repositories/Seller.Inventory.Repository';
import { Process } from '../Models/Entity/Process';
import { RevisionsOvenProductsRepository } from '../Repositories/Revisions.Oven.Products.Repository';


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
    private orderSellerRepository:SalesSellerRepository;
    private subOrderRepository:SalesRequestRepository;
    private subOrderMetadataRepository:SubOrderMetadataRepository;
    private sellerInventoryRepository:SellerInventoryRepository;
    
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
        this.orderSellerRepository = new SalesSellerRepository();
        this.subOrderRepository = new SalesRequestRepository();
        this.subOrderMetadataRepository = new SubOrderMetadataRepository();
        this.sellerInventoryRepository= new SellerInventoryRepository();
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
            let presentation:PresentationProducts= await this.presentationProductRepository.getPresentationProductsById(packagingDTO.products[e].presentationId)
            propertiesPackaging.weight = packagingDTO.products[e].weight;
            propertiesPackaging.observations = packagingDTO.products[e].observations;
            propertiesPackaging.units = packagingDTO.products[e].units;
            propertiesPackaging.packaging = packing[0];
            propertiesPackaging.presentation = presentation;
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
        }
        return packing[0].id;
   }
  
    async getProducts() {
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string) {

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

        let presentation: PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(packagingAssigned.presentationId);
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
            presentation: packaging.presentation.id,
            typePresentation: packaging.presentation.presentationType,
            ids
        }

        return response;
    }

    async getPackaging(){
        let packaging:Packaging[] = await this.packagingRepository.getPackaging();
        console.log(packaging)
        let response = [];
        for(let i = 0; i<packaging.length; i++){
            let presentations = await this.propertiesPackagingRepository.findPropiertiesPackagings(packaging[i]);
            console.log(presentations)
            let response1 = [];
            for(let j = 0; j< presentations.length; j++){
                response1.push({
                    presentationId : `${presentations[j].presentation.id}`,
                    presentation : `${presentations[j].presentation.presentation}`,
                    typePresentation : `${presentations[j].presentation.presentationType}`,
                    pricePresentation : `${presentations[j].presentation.presentationPricePublic}`
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
  
    async getProductPresentationInventory(productId:number){
        return await this.packagingRepository.getPackagingAvailableProductLotsPresentation(productId);
    }

    async savePackagingInventoryLotsProductOutput(packagingOutput:PackagingOutput,userPackingId:string){
        await validPackagingOutput(packagingOutput);
        let orderSeller:OrderSeller = await this.orderSellerRepository.getOrderById(packagingOutput.orderSellerId);
        if(!orderSeller) throw new Error("[404], no existe la orden");
        try{
            let user:User = await this.userRepository.getUserbyIdWithRol(userPackingId);
            if(!user) throw new Error("[404], no existe el usuario empacador");
            if(user.roles.description!="PACKAGING") throw new Error("[401], el usuario no es de empaque");
        for(let product of packagingOutput.products){
            for(let presentation of product.presentations){
                let subOrder:SubOrder = await this.subOrderRepository.getSubOrder(presentation.subOrderId);
                if(!subOrder) throw new Error(`[404], no existe la subOrden: ${presentation.subOrderId}`);
                let cantidad = presentation.lots.map(x=>x.quantity).reduce((a,b)=>a+b,0);
                if(subOrder.units<cantidad) throw new Error(`[409], se requiren mas productos para la subOrden ${presentation.subOrderId}, ${cantidad} de ${subOrder.units}`);
                for(let loteItem of presentation.lots){
                    let subOrderMetadata:SubOrderMetadata = new SubOrderMetadata();
                    subOrderMetadata.loteId=loteItem.lotId;
                    subOrderMetadata.quantity=loteItem.quantity;
                    subOrderMetadata.subOrder=subOrder;
                    subOrderMetadata.outputDate=packagingOutput.dateOutput;
                    await this.subOrderMetadataRepository.saveSubOrderMetadata(subOrderMetadata);
                    let presentationProducts:PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(presentation.presentationId);
                    if(!presentationProducts) throw new Error(`[404], no existe la presentacion del producto con el id: ${presentation.presentationId}`);
                    let sellerInventory:SellerInventory = new SellerInventory();
                    sellerInventory.loteId = loteItem.lotId;
                    sellerInventory.presentation=presentationProducts;
                    sellerInventory.quantity = loteItem.quantity
                    sellerInventory.dateEntrance=packagingOutput.dateOutput;
                    let productRovianda:ProductRovianda = await this.productRoviandaRepository.getById(product.productId);
                    if(!productRovianda) throw new Error(`[404], no existe el producto de rovianda con el id: ${product.productId}`);
                    sellerInventory.product = productRovianda;
                    let presetationEntity:PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(presentation.presentationId)
                    if(!presetationEntity) throw new Error(`[404], no existe la presentacion con el id:${presentation.presentationId}`);
                    sellerInventory.presentation= presetationEntity;
                    sellerInventory.seller=orderSeller.user; 
                    await this.sellerInventoryRepository.saveSellerInventory(sellerInventory);
                }
            }
        }
        }catch(err){
            await this.subOrderRepository.deleteByOrderSeller(packagingOutput.orderSellerId);
            throw new Error(err.message);
        }      
        

    }

    

    async getPackagingById(packagingId:number){

        if(!packagingId) throw new Error(`[400], packaginId is required`);

        let packaging = await this.packagingRepository.findPackagingById(packagingId);

        if(!packaging) throw new Error(`[404], packaging with id ${packagingId} not found`);

        return packaging

    }

    async getPackagingPropertiesById(packagingId:Packaging){

        // let packaging = await this.packagingRepository.findPropiertiesPackagingById(packagingId);
        let packaging:PropertiesPackaging[] = await this.propertiesPackagingRepository.findPropiertiesPackagings(packagingId);
        return packaging

    }


    async getPackagingOpen(){

    }

    async saveSubOrderMetaData(req:Request){
        for(let i = 0; i < req.body.length; i++){
            console.log(req.body[i])
            let metadata:SubOrderMetadata = new SubOrderMetadata();
            let subOrde = await this.subOrderRepository.getSubOrderById(+req.body[i].subOrderId);
            console.log(subOrde);
            metadata.loteId = req.body[i].loteId;
            metadata.subOrder = subOrde[0];
            metadata.quantity = req.body[i].quantity;
            await this.subOrderMetadataRepository.saveSubOrderMetadata(metadata);
        }
    }

    async getOrderSellerByUrgent(urgent:string){
        if(urgent == null) throw new Error(`[400], urgent is required`);
        let bUrgent:boolean;
        if(urgent == "true" || urgent == "True"){ bUrgent = true;}
        if(urgent == "false" || urgent == "False"){ bUrgent = false;} 
        let orderSeller:OrderSeller[] = await this.orderSellerRepository.getOrderSellerByUrgent(bUrgent);
        let response:any = [];
        orderSeller.forEach( i=> {
            response.push({
                orderId: `${i.id}`,
                date: `${i.date}`,
                userId: `${i.user ? i.user.id : ""}`,
                vendedor: `${i.user ? i.user.name : ""} `,
                status: `${i.status}`
            })
        });
        return response;

    }

    //let aPackaging:Packaging[] = await this.packagingRepository.findPackagingByProduc(packaging[i])
    async getPackagingLotProduct(){
        let packaging = await this.packagingRepository.getPackagingOrdeByProduct();
        let response:any = [];
        for(let i = 0; i < packaging.length; i++){
            let response2:any = [];
            let product:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(+packaging[i].product_id);
            let aPackaging:Packaging[] = await this.packagingRepository.findPackagingByProduc(product);
            for(let e = 0; e < aPackaging.length; e++){
                let process:Process = await this.processRepository.findProcessById(+aPackaging[e].lotId);
                response2.push({
                    processId: process ? process.id : "",
                    lotId:"" //process ? process.formulation : ""
                });
            }
            response.push({
                productId: product ? product.id : "",
                product: product ? product.name : "",
                lot: response2
            })
        }
        return response;
    }

    async createReprocesing(request:PackagingReprocesingRequest){
        let ovenProduct:OvenProducts = await this.ovenRepository.getOvensByNewLot(request.lotId);
        if(!ovenProduct) throw new Error("[404], no existe ese lote en salidas de hornos");
        let reprocesing:Reprocessing = new Reprocessing();
        reprocesing.active=true;
        reprocesing.used=false;
        reprocesing.allergens=request.allergen;
        reprocesing.date=request.date;
        reprocesing.weigth = request.weight;
        reprocesing.packagingProductName=ovenProduct.product.name;
        reprocesing.packagingReprocesingOvenLot=request.lotId;
        await this.reprocessingRepository.saveRepocessing(reprocesing);
    }
}