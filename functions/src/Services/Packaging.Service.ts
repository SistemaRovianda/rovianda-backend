import { PackagingRepository } from '../Repositories/Packaging.Repository';
import { PackagingDTO, PackagingAssignedDTO, UserPackaginggDTO, PackagingOutput, PackagingReprocesingRequest, DevolutionRequest, LotsStockInventory, LotsStockInventoryPresentation, UpdateStockPlant } from '../Models/DTO/PackagingDTO';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenRepository } from '../Repositories/Oven.Repository';
import { Packaging } from '../Models/Entity/Packaging';
import { ProductRoviandaRepository } from '../Repositories/Product.Rovianda.Repository';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Request } from 'express';

import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { PresentationsProductsRepository } from '../Repositories/Presentation.Products.Repository';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PropertiesPackagingRepository } from '../Repositories/Properties.Packaging.Repository';

import { Reprocessing } from '../Models/Entity/Reprocessing';
import { ReprocessingRepository } from '../Repositories/Reprocessing.Repository';
import { User } from '../Models/Entity/User';
import { UserRepository } from '../Repositories/User.Repository';
import { BoxPackaging } from '../Models/Entity/Box.Packaging';
import { BoxPackagingRepository } from '../Repositories/Box.Packaging.Repository';

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

import { SqlSRepository } from '../Repositories/SqlS.Repositoy';
import { Devolution } from '../Models/Entity/Devolution';
import { DevolutionRepository } from '../Repositories/Devolution.Repository';
import PdfHelper from '../Utils/Pdf.Helper';

import { InspectionRepository } from '../Repositories/Inspection.Repository';
import { CheeseRepository } from '../Repositories/Cheese.Repository';
import { SubOrderMetadataOutputs } from '../Models/DTO/Sales.ProductDTO';
import { PackagingDeliveredAcumulated, PackagingDeliveredIndividual } from '../Models/DTO/Packaging.DTO';
import { OrderSellerInterface } from '../Models/Enum/order.seller.interface';


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
    
    private orderSellerRepository:SalesSellerRepository;
    private subOrderRepository:SalesRequestRepository;
    private subOrderMetadataRepository:SubOrderMetadataRepository;
    private sellerInventoryRepository:SellerInventoryRepository;
    private sqlRepository:SqlSRepository;
    private devolutionRepository:DevolutionRepository;
    private pdfHelper:PdfHelper;
    
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
        
        this.orderSellerRepository = new SalesSellerRepository();
        this.subOrderRepository = new SalesRequestRepository();
        this.subOrderMetadataRepository = new SubOrderMetadataRepository();
        this.sellerInventoryRepository= new SellerInventoryRepository();
        this.sqlRepository= new SqlSRepository();
        this.devolutionRepository=new DevolutionRepository();
        this.pdfHelper=new PdfHelper();
        
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
        let lot:OvenProducts = await this.ovenRepository.getOvenProductByIdsAndProduct(packagingDTO.lotId,product);
        if(!lot) throw new Error("[400], lot not found");
        let packaging:Packaging = new Packaging();
        packaging.registerDate = packagingDTO.registerDate;
        packaging.productId = product;
        packaging.lotId = packagingDTO.lotId;
        packaging.expiration = packagingDTO.expiration;
        packaging.active = true;
        packaging.ovenProduct=lot;
        let packing=await this.packagingRepository.savePackaging(packaging);
        
        for(let e = 0; e<packagingDTO.products.length; e++){
            let propertiesPackaging:PropertiesPackaging = new PropertiesPackaging();
            let presentation:PresentationProducts= await this.presentationProductRepository.getPresentationProductsById(packagingDTO.products[e].presentationId)
            //let productSae = await this.sqlRepository.getProductSaeByKey(presentation.keySae);

            propertiesPackaging.weight = packagingDTO.products[e].weight;
            propertiesPackaging.observations = packagingDTO.products[e].observations;
            propertiesPackaging.units = packagingDTO.products[e].units;
            propertiesPackaging.packaging = packing;
            propertiesPackaging.presentation = presentation;
            propertiesPackaging.active=true;
            propertiesPackaging.outputOfWarehouse=packagingDTO.products[e].units;
            propertiesPackaging.weightOfWarehouse=packagingDTO.products[e].weight;
            await this.propertiesPackagingRepository.savePropertiesPackaging(propertiesPackaging);
            //let quantity = (presentation.uniMed.toUpperCase()=="PZ")?packagingDTO.products[e].units:packagingDTO.products[e].weight;
            //this.sqlRepository.updateInventoryGeneralAspeSaeByProduct(presentation.keySae,quantity);
        }
        return packing.id;
   }
  
    async getProducts() {
        return await this.productRoviandaRepository.getAllProducts();
    }

    async getHistoryPackaging(lotId: string) {

    }

    async getReportOrdersOfSeller(urgent:boolean,date:string,type:string){
        console.log("Urgente: "+urgent);
        console.log("Type: "+type);
      
        let orders:OrderSeller[] = await this.orderSellerRepository.getOrderSellerByUrgentByDate(urgent);
        
        let cheeses = await this.cheeseRepository.getAllCheeses();
        let cheesesKeys = cheeses.map(x=>x.code);

        for(let order of orders){
            let subOrders = await this.subOrderRepository.getByOrderSeller(order);
            
            if(type && type=="cheese"){
                order.subOrders=subOrders.filter(x=>cheesesKeys.includes(x.presentation.keySae));
            }else{
                order.subOrders=subOrders.filter(x=>!cheesesKeys.includes(x.presentation.keySae));
            }
            
        }
        
        let reports:string[] = this.pdfHelper.getReportOfOrdersSellers(orders);
        return reports;
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
        ///boxPackaging.propertiesPackaging = presentationPropierties;
        boxPackaging.countInitial = ""+(parseInt(countEnd.max)+1);
        boxPackaging.countEnd = ""+(parseInt(countEnd.max)+packagingAssigned.boxs);

        return await this.boxPackagingRepository.createBoxPackaging(boxPackaging);  
    }      

    async getPackagingAssignedBoxes(req: Request){
        let id = req.params.packagingId;

        let packaging = await this.propertiesPackagingRepository.getPropertiesPackaginById(+id);

        if (!packaging) 
            throw new Error(`[404], Properties packaging with id ${id} was not found`);
    
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
        let result= await this.packagingRepository.getPackagingAvailableProductLotsPresentation(productId);
        result=result.filter(x=>x.quantity>0);
        return result;
    }

    async getProductPresentationInventoryByProduct(productId:number){
        let result= await this.packagingRepository.getPackagingAvailableProductLotsPresentationByProduct(productId);
        result=result.filter(x=>x.quantity>0);
        return result;
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
                let packagings:Packaging[]=await this.packagingRepository.getPackagingByLotId(pack.loteId);
                let countToRest=pack.quantity;
                for(let packaging of packagings){
                    if(countToRest>0){
                        let propertiesPackagings:PropertiesPackaging[]=await this.propertiesPackagingRepository.getPropertiesPackagingByPackagingAndPresentationAndCount(packaging,presentationProducts);
                        if(propertiesPackagings.length){
                            for(let propack of propertiesPackagings){
                                if(propack.units>=countToRest){
                                    propack.units-=countToRest;
                                    propack.weight-=pack.weight;
                                    if(propack.weight<0){
                                        propack.weight=0;
                                    }
                                    countToRest=0;
                                    if(propack.units==0){
                                        propack.active=false;
                                    }
                                }else if(propack.units<countToRest){
                                    countToRest-=propack.units;
                                    propack.units=0;
                                    propack.weight=0;
                                    propack.active=false;
                                }
                                await this.propertiesPackagingRepository.savePropertiesPackaging(propack);
                            }
                            if(!(propertiesPackagings.map(x=>x.units>0)).length){
                                packaging.active=false;
                                await this.packagingRepository.savePackaging(packaging);
                            }
                        }
                    }
                }
                
                    let subOrderMetadata:SubOrderMetadata = new SubOrderMetadata();
                    subOrderMetadata.loteId=pack.loteId;
                    subOrderMetadata.quantity=pack.quantity;
                    subOrderMetadata.weigth=pack.weight;
                    subOrderMetadata.subOrder=subOrder;
                    let date= new Date();
                    date.setHours(date.getHours()-5);
                    subOrderMetadata.outputDate= date.toISOString();
                    if(!subOrder.subOrderMetadata.length){
                        subOrder.subOrderMetadata=new Array();
                    }
                    subOrder.subOrderMetadata.push(subOrderMetadata);
                    //let sellerInventory:SellerInventory = new SellerInventory();
                    //sellerInventory.loteId = pack.loteId;
                    //sellerInventory.presentation=presentationProducts;
                    //sellerInventory.quantity = pack.quantity
                    //sellerInventory.dateEntrance=date.toISOString();
                    //sellerInventory.product =presentationProducts.productRovianda;
                    //sellerInventory.weigth= pack.weight;
                    //let order= await this.orderSellerRepository.getOrderById(subOrder.orderSeller.id);
                    //sellerInventory.seller=order.seller;
                    if(pack.quantity==subOrder.units){
                        subOrder.active=false;
                    }else{
                        
                        let subOrdersM = await this.subOrderMetadataRepository.getSubOrderMetadataBySubOrder(subOrder);
                        let count =0;
                        for(let sub of subOrdersM){
                            count+=sub.quantity;
                        }
                        count+=pack.quantity;
                        if(count==subOrder.units){
                            subOrder.active=false;
                            
                        }
                    }
                    if(subOrder.weight!=null){
                        subOrder.weight+=pack.weight;  
                    }else{
                        subOrder.weight=pack.weight;
                    }
                    //let productSae = await this.sqlRepository.getProductSaeByKey(presentationProducts.keySae);
                    //if(!productSae.length) throw new Error("[409], no existe el producto en aspel sae");
                   // let uniMed=(productSae[0].UNI_MED as string).toLowerCase();
                    // let valueToSave;
                    // if(uniMed=="pz"){
                    //     valueToSave=pack.quantity;
                    // }else{
                    //     valueToSave=pack.weight;
                    // }
                    
                    await this.subOrderRepository.saveSalesProduct(subOrder); 
                    //await this.sellerInventoryRepository.saveSellerInventory(sellerInventory);
                    //await this.sqlRepository.updateProductInSaeBySellerWarehouseStock(+order.seller.warehouseKeySae,presentationProducts.keySae,valueToSave,order.seller.saeKey.toString(),uniMed);
        }
    }

    

    async getPackagingById(packagingId:number){

        if(!packagingId) throw new Error(`[400], packaginId is required`);

        let packaging = await this.packagingRepository.findPackagingById(packagingId);

        if(!packaging) throw new Error(`[404], packaging with id ${packagingId} not found`);

        return packaging

    }

    async getPackgingByLotsIds(lots:string[]){
        return await this.packagingRepository.getBynewLotsIds(lots);
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
        let orderSellers:any[]=[];
        console.log("MODE:"+mode);
        let cheesesIds = [];
        let cheeses = await this.cheeseRepository.getAllCheeses();
        if(cheeses.length){
        cheesesIds=cheeses.map(x=>x.product.id);
        }
        if(mode==null || mode==undefined){ 
            let orderSellers2 = await this.orderSellerRepository.getOrderSellerByUrgent(bUrgent);
            
            for(let i=0;i<orderSellers2.length;i++){
                let subOrders = await this.subOrderRepository.getByOrderSeller(orderSellers2[i]);
                subOrders = subOrders.filter(x=>!cheesesIds.includes(+x.productRovianda.id));
                let outOfStockItems = subOrders.filter(x=>x.outOfStock);
                if(subOrders.length){
                    orderSellers.push({...orderSellers2[i],outOfStock: outOfStockItems.length?true:false});
                }
            }
        }else if(mode=="cheese"){
            let orderSellers3 = await this.orderSellerRepository.getOrderSellerByUrgentCheese(bUrgent);
            for(let i=0;i<orderSellers3.length;i++){
                let subOrders = await this.subOrderRepository.getByOrderSeller(orderSellers3[i]);
                subOrders = subOrders.filter(x=>cheesesIds.includes(+x.productRovianda.id));
                let outOfStockItems = subOrders.filter(x=>x.outOfStock);
                if(subOrders.length){
                    orderSellers.push({...orderSellers3[i],outOfStock: outOfStockItems.length?true:false});
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
                    status: `${orderSeller.status}`,
                    outOfStock:  order.outOfStock
                })
        }
        
      
        return response;

    }

    //let aPackaging:Packaging[] = await this.packagingRepository.findPackagingByProduc(packaging[i])
    async getPackagingLotProduct(){
        let products:any[] = await this.productRoviandaRepository.getOnlyProductOfQualityArea()
        let response:any = [];
        
        for(let product of products){
            let packagingLots:any[] = await this.packagingRepository.getLotsToInspectionOfProducts(product.id);
            response.push({
                productId: product.id,
                product: product.name,
                lot: packagingLots
            });
        }
        
    
        return response;
    }

    async createReprocesing(request:PackagingReprocesingRequest){
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(request.productId);
        let ovenProduct:OvenProducts = await this.ovenRepository.getOvensByNewLotAndProduct(request.lotId,productRovianda);
        if(!ovenProduct) throw new Error("[404], no existe ese lote en salidas de hornos");
        let reprocesing:Reprocessing = new Reprocessing();
        reprocesing.active=true;
        reprocesing.used=false;
        reprocesing.allergens=request.allergen;
        reprocesing.date=request.date;
        reprocesing.weightMerm=  request.weightMerm;
        reprocesing.weigth = request.weight;
        reprocesing.packagingProductName=productRovianda.name;
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
        console.log("JSON: "+JSON.stringify(devolutionRequest));
        //let presentation:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(devolutionRequest.presentationId);
        //if(!presentation) throw new Error("[404], no existe la presentation de ese producto");
        //let ovenProduct:OvenProducts = await this.ovenRepository.getOvensByNewLotAndProduct(devolutionRequest.lotId,presentation.productRovianda);
        //if(!ovenProduct) throw new Error("[404], no existe el lote en salidas de hornos");
        //let packagings:Packaging[] = await this.packagingRepository.getPackagingsByLotId(devolutionRequest.lotId);
        let propertiesPackagingOfProduct = await this.propertiesPackagingRepository.getAllProductsInventoryToDiscount(devolutionRequest.presentationId,devolutionRequest.lotId);
        
        let totalToDiscountTemp=devolutionRequest.units;
        let totalToDiscountWeightTemp = devolutionRequest.weight;
        let toUpdate:{id:number,units:number,weight:number}[]=[];
        for(let properties of propertiesPackagingOfProduct){
            if(properties.presentationId==devolutionRequest.presentationId){
                if(totalToDiscountTemp>0){
                    if(properties.units==totalToDiscountTemp){
                        toUpdate.push({
                            id: properties.id,
                            units: 0,
                            weight: 0
                        });
                        totalToDiscountTemp=0;
                        totalToDiscountWeightTemp=0;
                    }else if(properties.units>totalToDiscountTemp){
                        toUpdate.push({
                            id: properties.id,
                            units: properties.units-totalToDiscountTemp,
                            weight: (properties.weight-totalToDiscountWeightTemp)<0?0:(properties.weight-totalToDiscountWeightTemp)
                        });
                        totalToDiscountTemp=0;
                        totalToDiscountWeightTemp=0;
                    }else if(properties.units<totalToDiscountTemp){
                        toUpdate.push({
                            id: properties.id,
                            units:0,
                            weight:0
                        });
                        totalToDiscountTemp-=properties.units;
                        totalToDiscountWeightTemp-=properties.weight;
                    }
                }
            }
        }
        console.log("Total discount: "+totalToDiscountTemp);
        if(totalToDiscountTemp==0){ 
            let devolution:Devolution = new Devolution();
            let date = new Date();
            date.setHours(date.getHours()-5);
            devolution.date=date.toISOString();
            devolution.lotId=devolutionRequest.lotId;
            devolution.units=devolutionRequest.units;
            let presentation:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(devolutionRequest.presentationId);
            devolution.presentationProduct=presentation;
            devolution.weight = devolutionRequest.weight;
            
            let ovenProduct = await this.ovenRepository.getOvensByNewLotAndProduct(devolutionRequest.lotId,presentation.productRovianda);

            if(ovenProduct){
                ovenProduct.status="CLOSED";
                await this.ovenRepository.saveOvenProduct(ovenProduct);
                devolution.ovenProduct=ovenProduct;
            }else{
                
                let ovenProduct = new OvenProducts();
                ovenProduct.stimatedTime="0:0";
                ovenProduct.newLote=devolution.lotId;
                ovenProduct.pcc="1";
                ovenProduct.oven=1;
                let date= new Date();
                date.setHours(date.getHours()-6);
                ovenProduct.date = date.toISOString();
                ovenProduct.status="CLOSED";
                ovenProduct.processId=1;
                ovenProduct.product=presentation.productRovianda;
                ovenProduct.observations="Lote: "+devolution.lotId;
                let ovenSaved = await this.ovenRepository.saveOvenProduct(ovenProduct);
                devolution.ovenProduct=ovenSaved;
            }
            for(let update of toUpdate){
                await this.propertiesPackagingRepository.UpdateProperty(update.id,update.units,update.weight);
            }
            await this.packagingRepository.checkToClose(devolutionRequest.lotId);
            return await this.devolutionRepository.saveDevolution(devolution);
        }else{
            throw new Error("[409], Producto disponible insuficiente para devolver");    
        }
        
        //await this.sqlRepository.updateInventoryGeneralAspeSaeByProduct(propertyPackaging.presentation.keySae,(devolutionRequest.units)*-1);
    }

    async getDevolutionDetails(devolutionId:number){
        let devolution:Devolution = await this.devolutionRepository.getDevolutionById(devolutionId);
        if(!devolution) throw new Error("[404], no existe la devolucion");
        //let ovenProduct=await this.ovenRepository.getOvensByNewLot(devolution.lotId);
        let name = "";
        
            let presentation = devolution.presentationProduct;
            let product = await this.presentationProductRepository.getPresentationProductsById(presentation.id);
            name = product.productRovianda.name + " "+product.presentationType;
        
        //if(!ovenProduct) throw new Error("[409], la devolucion no esta vinculada a un lote de hornos");
        return await this.pdfHelper.getPackagingDevolution(devolution,name);
    }

    async closeOrderSeller(orderSellerId:number,date:string){
        let orderSeller:OrderSeller= await this.orderSellerRepository.getOrderById(orderSellerId);
        let lastCountOrderSeller = await this.orderSellerRepository.getLastCountOrderSellerRemission();
        orderSeller.folioRemission= (lastCountOrderSeller[0].folioRemission)+1;
        await this.subOrderMetadataRepository.updateDateCloseOrder(orderSellerId,date);
        orderSeller.status="INACTIVE";
        let dateParsed:Date = new Date(date);
        dateParsed.setHours(dateParsed.getHours());
        orderSeller.dateAttended=dateParsed.toISOString();
        await this.orderSellerRepository.saveSalesSeller(orderSeller);
        let orderSellerParsed:OrderSellerInterface[] = await this.orderSellerRepository.getAllOrdersSellersByOrderSellerId(orderSellerId);
        if(orderSellerParsed.length){  
            let currentOrderSeller = orderSellerParsed[0];
            let subOrders = await this.orderSellerRepository.getAllSubOrdersSellersByOrderSellerId(orderSellerId);
            currentOrderSeller.amount = subOrders.map(x=>x.amount).reduce((a,b)=>a+b,0);
            currentOrderSeller.subOrders=subOrders;
            await this.sqlRepository.transferWarehouseEntranceLikeRemission(currentOrderSeller);
        }
        orderSeller.sincronized=true;
        await this.orderSellerRepository.saveSalesSeller(orderSeller);
    
    }

    async getReportOfDeliveredSeller(orderSellerId:number,mode:string){
        let orderSeller:OrderSeller = await this.orderSellerRepository.getOrderByIdWithSuborders(orderSellerId);
        
        let subOrders = await this.subOrderRepository.getByOrderSeller(orderSeller);
        for(let subOrder of subOrders){
            let subOrdersMetadata = await this.subOrderMetadataRepository.getSubOrderMetadataBySubOrder(subOrder);
            subOrder.subOrderMetadata=subOrdersMetadata;
        }
        return await this.pdfHelper.getPackagingDeliveredReport(orderSeller,mode);
    }

    async getEntrancesOfWarehouseId(warehouseId:string,dateStart:string,dateEnd:string,type:string){
        let records:SubOrderMetadataOutputs[]=[];
        if(+warehouseId!=53){
            let seller:User = await this.userRepository.getByWarehouseId(warehouseId);
            if(!seller) return [];
        records= await this.subOrderMetadataRepository.getAllOrdersDispached(dateStart,dateEnd,seller.id,type);
        }else{
            records = await this.packagingRepository.getAllDispatched(dateStart,dateEnd);
        }
        let deliveredToWarehouse:DeliverToWarehouse[]=[];
        for(let subOrder of records){
            
                deliveredToWarehouse.push(
                    {
                        PRESENTATIONID: subOrder.presentationId,
                        CODE: subOrder.keySae,
                        NAME: subOrder.name+" "+subOrder.presentation,
                        LOT: subOrder.lotId?subOrder.lotId:null,
                        UNITS: subOrder.quantity,
                        WEIGHT: subOrder.weight,
                        DATE: subOrder.outputDate?subOrder.outputDate:null,
                        EXPRATION: subOrder.expiration,
                        OBSERVATIONS: subOrder.observations,
                        PRICE: subOrder.price,
                        TOTAL: subOrder.total
                    }
                );
            
        }
        return deliveredToWarehouse;
    }

    async getLotsStockInventoryByPresentationId(presentationId:number){
        let response:LotsStockInventory[]=[];
        let presetationProduct = await this.presentationProductRepository.getPresentationProductsById(presentationId);
        // if(!presetationProduct) throw new Error("[404], no existe el producto");
        // let productSae = null;
        // productSae =await this.sqlRepository.getProductSaeByKey(presetationProduct.keySae);
        // if(!productSae.length){
        //   productSae = await this.sqlRepository.getProductSaeByKeyLike(presetationProduct.keySae);
        // }
        //if(!productSae.length) throw new Error("[400], producto no existente en SAE");
        let packagings = await this.packagingRepository.getPackagingsByProduct(presetationProduct.productRovianda);
        let mapLotsStock = new Map<string,number>();
        for(let packaging of packagings){
            let propertiesPackaging = await this.propertiesPackagingRepository.findPropiertiesPackagings(packaging);
            for(let pro of propertiesPackaging){
              if(pro.presentation.id==presetationProduct.id){
                  let itemMapped = mapLotsStock.get(packaging.lotId);
                  if(!itemMapped){
                    mapLotsStock.set(packaging.lotId,pro.units);
                  }else{
                    mapLotsStock.set(packaging.lotId,itemMapped+pro.units);
                  }
              }
            }
        }

        let lots = Array.from(mapLotsStock.keys());
        for(let lot of lots){
            let stock = mapLotsStock.get(lot);
            response.push({
                lotId: lot,
                quantity: stock
            });
        }
      
        return response;
    }

    async getLotsStockInventoryByProductId(productId:number){
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        let ovensLots = await this.ovenRepository.getAllLotsByProduct(productRovianda);
        
        let lots:string[]=[];
        for(let oven of ovensLots){
            
            if(!lots.includes(oven.newLote)){
                lots.push(oven.newLote);
            }
        }
        return lots;
    }

    async getLotsStockInventoryByProductIdAndDate(productId:number,date:string){
        let productRovianda:ProductRovianda = await this.productRoviandaRepository.getProductRoviandaById(productId);
        let ovensLots = await this.ovenRepository.getAllLotsByProductAndDate(productRovianda,date);
        
        let lots:string[]=[];
        for(let oven of ovensLots){
            
            if(!lots.includes(oven.newLote)){
                lots.push(oven.newLote);
            }
        }
        return lots;
    }

    async getLotsStockInventoryByWarehouseGeneral(id:number){
        let items:LotsStockInventoryPresentation[]=[];
        let name = "";
        if(id==53){
            items = await this.propertiesPackagingRepository.getAllPropertiesPackaging();      
            name = "ALMACEN GENERAL PLANTA";
        }else{
            let user:User = await this.userRepository.getByWarehouseId(id.toString());
            if(!user){
                name = "Nadie está a cargo de este almacen"
            }else{
                name = "Almacen de: "+user.name;
                items = await this.sellerInventoryRepository.getInventoryByProductStockOfSeller(user);
            }
        }

        items = items.filter(x=>x.units>0);
        
       return {items,name};
    }

    async updateInventoryPlant(request:UpdateStockPlant){
        let unitType = request.unitTypeOp;
        let weightTyep=request.weightTypeOp;
        let packaging:Packaging = await this.packagingRepository.getPackagingById(request.packaging_id);
        let presentationProduct:PresentationProducts = await this.presentationProductRepository.getPresentationProductsById(request.presentation_id);
        let propertyPackagings:PropertiesPackaging[] = await this.propertiesPackagingRepository.getPropertiesPackagingByPackagingAndPresentationAndCount(packaging,presentationProduct);

        if(unitType==1){
            let quantityToSum = request.unitsTemp-request.units;
            for(let prop of propertyPackagings){
                if(quantityToSum>0 && prop.weight>0){
                    prop.units+=quantityToSum;
                    prop.active=true;
                        await this.propertiesPackagingRepository.savePropertiesPackaging(prop);
                        quantityToSum=0;
                    } 
            }
              
        }else if(unitType==2){
            let quantityToRest = request.units-request.unitsTemp;
            for(let prop of propertyPackagings){
                if(quantityToRest>0){
                    if(prop.units>=quantityToRest){
                        prop.units-=quantityToRest;
                        quantityToRest=0;
                        if(prop.units==0){
                            prop.active=false;
                        }
                        await this.propertiesPackagingRepository.savePropertiesPackaging(prop);
                    }else if(prop.units<quantityToRest){
                        quantityToRest-=prop.units;
                        prop.units=0;
                        prop.weight=0;
                        prop.active=false;
                        await this.propertiesPackagingRepository.savePropertiesPackaging(prop);
                    }
                }
            }
        }
        if(weightTyep==1){
            let quantityToSum = request.weightTemp-request.weight;
            for(let prop of propertyPackagings){
                if(quantityToSum>0 && prop.units>0){
                    propertyPackagings[0].weight+=quantityToSum;
                    propertyPackagings[0].active=true;
                    await this.propertiesPackagingRepository.savePropertiesPackaging(propertyPackagings[0]);
                    quantityToSum=0;
                }
            }
        }else if(weightTyep==2){
            let quantityToRest = request.weight-request.weightTemp;
            for(let prop of propertyPackagings){
                if(quantityToRest>0 && prop.units>0){
                    if(prop.weight>=quantityToRest){
                        prop.weight-=quantityToRest;
                        quantityToRest=0;
                        if(prop.weight==0){
                            prop.active=false;
                        }
                        await this.propertiesPackagingRepository.savePropertiesPackaging(prop);
                    }else if(prop.weight<quantityToRest){
                        quantityToRest=quantityToRest-prop.weight;
                        prop.weight=0;
                        prop.units=0;
                        prop.active=false;
                        await this.propertiesPackagingRepository.savePropertiesPackaging(prop);
                    }
                }
            }
        }
    }

    async getAllOutputsByPlant(from:string,to:string){
        let outputs = await this.packagingRepository.getAllOutputsByPlant(from,to);
        return outputs;
    }

    async getAllProductsDeliveredToSellers(startDate:string,endDate:string,type:string,sellers:string[]){
        
        if(type=="ACCUMULATED"){
            let records:PackagingDeliveredAcumulated[] = await this.packagingRepository.getAllProductsDeliveredToSellersAccumulated(startDate,endDate,sellers);
            return await this.pdfHelper.getPackagingDeliveredAccumulated(records,startDate,endDate);
        }else{
            let records:PackagingDeliveredIndividual[] = await this.packagingRepository.getAllProductsDeliveredToSellersIndividual(startDate,endDate,sellers);
            return await this.pdfHelper.getPackagingDeliveredIndividual(records,startDate,endDate);
        }
    }
    async getPresentationsChangesList(page:number,perPage:number,dateStart:string,dateEnd:string){
        return await this.devolutionRepository.getPresentationsChangesList(page,perPage,dateStart,dateEnd);
    }
}

export interface DeliverToWarehouse{
    PRESENTATIONID:number,
    CODE:string,
    NAME:string,
    LOT?:string,
    UNITS:number,
    WEIGHT:number,
    DATE?:string,
    EXPRATION?: string,
    OBSERVATIONS?:string,
    PRICE: number,
    TOTAL: number
}