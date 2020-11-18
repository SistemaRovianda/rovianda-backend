import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO, UserPackagingDTO, PackagingAssignedDTO, UserPackaginggDTO, PackagingOutput, PackagingReprocesingRequest, DevolutionRequest } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Request, response } from 'express';
import { has, isArguments } from 'lodash';
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
import { SqlSRepository } from '../Repositories/SqlS.Repositoy';
import { Devolution } from '../Models/Entity/Devolution';
import { DevolutionRepository } from '../Repositories/Devolution.Repository';
import PdfHelper from '../Utils/Pdf.Helper';
import { Inspection } from '../Models/Entity/Inspection';
import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { CheeseRepository } from '../Repositories/Cheese.Repository';

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
    private sqlRepository:SqlSRepository;
    private devolutionRepository:DevolutionRepository;
    private pdfHelper:PdfHelper;
    private inspectionRepository:InspectionRepository;
    private cheeseRepository:CheeseRepository;
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
        this.sqlRepository= new SqlSRepository();
        this.devolutionRepository=new DevolutionRepository();
        this.pdfHelper=new PdfHelper();
        this.inspectionRepository=new InspectionRepository();
        this.cheeseRepository = new CheeseRepository();
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
        
        let packing=await this.packagingRepository.savePackaging(packaging);
        
        for(let e = 0; e<packagingDTO.products.length; e++){
            let propertiesPackaging:PropertiesPackaging = new PropertiesPackaging();
            let presentation:PresentationProducts= await this.presentationProductRepository.getPresentationProductsById(packagingDTO.products[e].presentationId)
            propertiesPackaging.weight = packagingDTO.products[e].weight;
            propertiesPackaging.observations = packagingDTO.products[e].observations;
            propertiesPackaging.units = packagingDTO.products[e].units;
            propertiesPackaging.packaging = packing;
            propertiesPackaging.presentation = presentation;
            propertiesPackaging.active=true;
            
            await this.sqlRepository.updateProductInSae(presentation.keySae,packagingDTO.products[e].units);
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
        }
        return packing.id;
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

    async savePackagingInventoryLotsProductOutput(packagingOutput:PackagingOutput[]){
        for(let pack of packagingOutput){
        await validPackagingOutput(pack);
        }
        for(let pack of packagingOutput){
                let subOrder:SubOrder = await this.subOrderRepository.getSubOrderById(pack.subOrderId);
                if(!subOrder) throw new Error("[404], no existe la subOrder");
                let presentationProducts:PresentationProducts = await this.presentationsProductsRepository.getPresentationProductsById(pack.presentationId);
                if(!presentationProducts) throw new Error(`[404], no existe la presentacion del producto con el id: ${pack.presentationId}`);
                let packaging:Packaging=await this.packagingRepository.getPackagingByLotId(pack.loteId);
                let propertiesPackagings:PropertiesPackaging=await this.propertiesPackagingRepository.getPropertiesPackagingByPackagingAndPresentationAndCount(packaging,presentationProducts,pack.quantity);
                if(propertiesPackagings){
                    propertiesPackagings.units-=pack.quantity;
                    await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackagings);
                }
                    let subOrderMetadata:SubOrderMetadata = new SubOrderMetadata();
                    subOrderMetadata.loteId=pack.loteId;
                    subOrderMetadata.quantity=pack.quantity;
                    subOrderMetadata.weigth=pack.weigth;
                    subOrderMetadata.subOrder=subOrder;
                    let date= new Date();
                    date.setHours(date.getHours()-6)
                    subOrderMetadata.outputDate=date.toISOString();
                    if(!subOrder.subOrderMetadata.length){
                        subOrder.subOrderMetadata=new Array();
                    }
                    subOrder.subOrderMetadata.push(subOrderMetadata);
                    let sellerInventory:SellerInventory = new SellerInventory();
                    sellerInventory.loteId = pack.loteId;
                    sellerInventory.presentation=presentationProducts;
                    sellerInventory.quantity = pack.quantity
                    sellerInventory.dateEntrance=date.toString();
                    sellerInventory.product =presentationProducts.productRovianda;
                    sellerInventory.weigth= pack.weigth;
                    let order= await this.orderSellerRepository.getOrderById(subOrder.orderSeller.id);
                    sellerInventory.seller=order.seller;
                    subOrder.units=subOrder.units-pack.quantity;
                     
                    if(subOrder.units==0){
                    subOrder.active=false;    
                    }
                    await this.subOrderRepository.saveSalesProduct(subOrder); 
                    await this.sellerInventoryRepository.saveSellerInventory(sellerInventory);
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

    async getOrderSellerByUrgent(urgent:string,mode:string){
        if(urgent == null) throw new Error(`[400], urgent is required`);
        let bUrgent:boolean;
        if(urgent == "true" || urgent == "True"){ bUrgent = true;}
        if(urgent == "false" || urgent == "False"){ bUrgent = false;}
        let orderSellers:OrderSeller[]=[];
        console.log("MODE:"+mode);
        let cheesesIds = [];
        let cheeses = await this.cheeseRepository.getAllCheeses();
        cheesesIds=cheeses.map(x=>x.product.id);
            
        if(mode==null || mode==undefined){ 
            let orderSellers2 = await this.orderSellerRepository.getOrderSellerByUrgent(bUrgent);
            
            for(let i=0;i<orderSellers2.length;i++){
                let subOrders = await this.subOrderRepository.getByOrderSeller(orderSellers2[i]);
                subOrders = subOrders.filter(x=>!cheesesIds.includes(+x.productRovianda.id));
                if(subOrders.length){
                    orderSellers.push(orderSellers2[i]);
                }
            }
        }else if(mode=="cheese"){
            let orderSellers3 = await this.orderSellerRepository.getOrderSellerByUrgentCheese(bUrgent);
            for(let i=0;i<orderSellers3.length;i++){
                let subOrders = await this.subOrderRepository.getByOrderSeller(orderSellers3[i]);
                subOrders = subOrders.filter(x=>cheesesIds.includes(+x.productRovianda.id));
                if(subOrders.length){
                    orderSellers.push(orderSellers3[i]);
                }
            }
        }
        let response:any = [];
        for(let order of orderSellers){
            let orderSeller = await this.orderSellerRepository.getOrderById(order.id);
                response.push({
                    orderId: `${orderSeller.id}`,
                    date: `${orderSeller.date}`,
                    userId: `${orderSeller.seller.id}`,
                    vendedor: `${orderSeller.seller.name} `,
                    status: `${orderSeller.status}`
                })
        }
        
      
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
                let ovenProduct:OvenProducts = await this.ovenRepository.getOvenProductByLot(aPackaging[e].lotId);
                if(ovenProduct && ovenProduct.processId){
                let inspections:Inspection[]= await this.inspectionRepository.getByProcessId(ovenProduct.processId);
                if(!inspections.length){
                    response2.push({
                        processId: ovenProduct.processId,
                        lotId: ovenProduct.newLote
                    });
                }
                }
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
        reprocesing.comment=request.comment;
        let reprocesingEntity=await this.reprocessingRepository.saveRepocessing(reprocesing);
        return reprocesingEntity.id;
    }

    async getReprosessingById(reprocesingId:number){
        let reprocesing:Reprocessing=await this.reprocessingRepository.getReprocessingById(reprocesingId);
        if(!reprocesing) throw new Error("[404], no existe el reproceso");
        return await this.pdfHelper.getReprocesingPackagingReport(reprocesing);
    }

    async createDevolution(devolutionRequest:DevolutionRequest){
        let ovenProduct:OvenProducts = await this.ovenRepository.getOvensByNewLot(devolutionRequest.lotId);
        if(!ovenProduct) throw new Error("[404], no existe el lote en salidas de hornos");
        let packaging:Packaging = await this.packagingRepository.getPackagingByLotId(devolutionRequest.lotId);
        let propertyPackaging:PropertiesPackaging = await this.propertiesPackagingRepository.findByPackagings(packaging,devolutionRequest.units);
        if(!propertyPackaging) throw new Error("[409], no tienes producto en existencia para devolver");
        let presentation:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(devolutionRequest.presentationId);
        if(!presentation) throw new Error("[404], no existe la presentation de ese producto");
        ovenProduct.status="CLOSED";
        let devolution:Devolution = new Devolution();
        devolution.date=devolutionRequest.date;
        devolution.lotId=devolutionRequest.lotId;
        devolution.units=devolutionRequest.units;
        devolution.presentationProduct=presentation;
        await this.ovenRepository.saveOvenProduct(ovenProduct);
        await this.sqlRepository.updateProductInSae(propertyPackaging.presentation.keySae,(devolutionRequest.units)*-1);
        return await this.devolutionRepository.saveDevolution(devolution);
    }

    async getDevolutionDetails(devolutionId:number){
        let devolution:Devolution = await this.devolutionRepository.getDevolutionById(devolutionId);
        if(!devolution) throw new Error("[404], no existe la devolucion");
        let ovenProduct=await this.ovenRepository.getOvensByNewLot(devolution.lotId);
        if(!ovenProduct) throw new Error("[409], la devolucion no esta vinculada a un lote de hornos");
        return await this.pdfHelper.getPackagingDevolution(devolution,ovenProduct.product.name);
    }

    async closeOrderSeller(orderSellerId:number){
        let orderSeller:OrderSeller= await this.orderSellerRepository.getOrderById(orderSellerId);
        let subOrders = await this.subOrderRepository.getByOrderSeller(orderSeller);
        let hasCheese =false;
        let cheeses = await this.cheeseRepository.getAllCheeses();
        let cheeseIds = cheeses.map(x=>x.product.id);
        for(let sub of subOrders){
            if(cheeseIds.includes(+sub.presentation.keySae)){
                hasCheese=true;
            }
        }
        if(hasCheese){
            orderSeller.status="CHEESE";
        }else if(orderSeller.status=="CHEESE" || orderSeller.status=="ACTIVE"){
            orderSeller.status="INACTIVE";
        }
        await this.orderSellerRepository.saveSalesSeller(orderSeller);
    }

    async getReportOfDeliveredSeller(orderSellerId:number,mode:string){
        let orderSeller:OrderSeller = await this.orderSellerRepository.getOrderByIdWithSuborders(orderSellerId);
        let mapSubOrderWeigth=new Map<number,number>();
        let subOrders = await this.subOrderRepository.getByOrderSeller(orderSeller);
        for(let subOrder of subOrders){
            let subOrdersMetadata = await this.subOrderMetadataRepository.getSubOrderMetadataBySubOrder(subOrder);
            
            subOrder.units=subOrdersMetadata.map(x=>x.quantity).reduce((a,b)=>a+b,0);
            let weigth=subOrdersMetadata.map(x=>x.weigth).reduce((a,b)=>a+b,0);
            mapSubOrderWeigth.set(subOrder.subOrderId,weigth);
        }
        return await this.pdfHelper.getPackagingDeliveredReport(orderSeller,mapSubOrderWeigth,mode);
    }
}
