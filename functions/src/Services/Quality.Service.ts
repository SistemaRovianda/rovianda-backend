import { response } from "express";
import { stringify } from "uuid";
import { DeliveryToSellerRequest, EntranceOutputsOven, InventoryTypeQuality, NewIngredientQuality, OutputsByEntrance, OutputsOfWarehouse, ProcessFormulation, ProductQualityDetails, PropertyEvaluatedType1, ReceptionMaterialInterface } from "../Models/DTO/Quality.DTO";
import { SaleMetricsAcumulated } from "../Models/DTO/Sales.ProductDTO";
import { CodeAccess } from "../Models/Entity/CodesAccess";
import { Cooling } from "../Models/Entity/Cooling";
import { Fridge } from "../Models/Entity/Fridges";
import { OvenProducts } from "../Models/Entity/Oven.Products";
import { Product } from "../Models/Entity/Product";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { CodeAccessRepository } from "../Repositories/CodeAccess.Repository";
import { CoolingRepository } from "../Repositories/Cooling.Repository";
import { EntranceDriefRepository } from "../Repositories/Entrance.Drief.Repository";
import { EntrancePackingRepository } from "../Repositories/Entrance.Packing.Repository";
import { EntranceMeatRepository } from "../Repositories/Entrances.Meat.Repository";
import { FormulationRepository } from "../Repositories/Formulation.Repository";
import { FridgeRepository } from "../Repositories/Fridges.Repository";
import { InspectionRepository } from "../Repositories/Inspection.Repository";
import { OutputsCoolingRepository } from "../Repositories/Outputs.Cooling.Repository";
import { OutputsDriefRepository } from "../Repositories/Outputs.Drief.Repository";
import { OvenRepository } from "../Repositories/Oven.Repository";
import { PackagingRepository } from "../Repositories/Packaging.Repository";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { ProcessRepository } from "../Repositories/Process.Repository";
import { ProductRepository } from "../Repositories/Product.Repository";
import { ProductRoviandaRepository } from "../Repositories/Product.Rovianda.Repository";
import { PropertiesPackagingRepository } from "../Repositories/Properties.Packaging.Repository";
import { SaleRepository } from "../Repositories/Sale.Repository";
import { SubOrderMetadataRepository } from "../Repositories/SubOrder.Metadata.Repository";
import { UserRepository } from "../Repositories/User.Repository";
import { WarehouseDriefRepository } from "../Repositories/Warehouse.Drief.Repository";

export class QualityService{
    private entranceMeatRepository:EntranceMeatRepository;
    private entraceDriefRepository:EntranceDriefRepository;
    private entrancePackingRepository:EntrancePackingRepository;
    private fridgeRepository:FridgeRepository;
    private ovenRepository:OvenRepository;
    private productEndedRepository:PackagingRepository;
    private packagingRepository:PackagingRepository;
    private productsRoviandaRepository:ProductRoviandaRepository;
    private productCRepository:ProductRepository;
    private formulationRepository:FormulationRepository;
    private processRepository:ProcessRepository;
    private propertiesPackagingRepository:PropertiesPackagingRepository;
    private userRepository:UserRepository;
    private subOrderMetadataRepository:SubOrderMetadataRepository;
    private warehouseDrief:WarehouseDriefRepository;
    private outputsDriefRepository:OutputsDriefRepository;
    private outputsCoolingRepository:OutputsCoolingRepository;
    private coolingRepository:CoolingRepository;
    private inspectionRepository:InspectionRepository;
    private codeAccessRepository:CodeAccessRepository;
    private presentationProductsRepository:PresentationsProductsRepository;
    private saleRepository:SaleRepository;
    constructor(){
        this.entraceDriefRepository = new EntranceDriefRepository();
        this.entranceMeatRepository= new EntranceMeatRepository();
        this.entrancePackingRepository= new EntrancePackingRepository();
        this.fridgeRepository = new FridgeRepository();
        this.ovenRepository = new OvenRepository();
        this.productEndedRepository = new PackagingRepository();
        this.packagingRepository=new PackagingRepository();
        this.productsRoviandaRepository = new ProductRoviandaRepository();
        this.productCRepository=new ProductRepository();
        this.formulationRepository = new FormulationRepository();
        this.processRepository = new ProcessRepository();
        this.propertiesPackagingRepository = new PropertiesPackagingRepository();
        this.userRepository = new UserRepository();
        this.subOrderMetadataRepository= new SubOrderMetadataRepository();
        this.warehouseDrief = new WarehouseDriefRepository();
        this.outputsDriefRepository=  new OutputsDriefRepository();
        this.coolingRepository=new CoolingRepository();
        this.outputsCoolingRepository= new OutputsCoolingRepository();
        this.inspectionRepository = new InspectionRepository();
        this.codeAccessRepository = new CodeAccessRepository();
        this.presentationProductsRepository = new PresentationsProductsRepository();
        this.saleRepository = new SaleRepository();
    }
    

    async getProductReceivedByLotAndType(lot:string,type:string,dateStart:string,dateEnd:string){
            if(type=="MEAT"){
               let result:any[]=await this.entranceMeatRepository.findEntrancesByLotAndDate(lot,dateStart,dateEnd);
               return result.map(x=>x.productName);
            }else if(type=="DRIEF"){
                let result:any[]= await this.entraceDriefRepository.findEntrancesByLotAndDate(lot,dateStart,dateEnd);
                return result.map(x=>x.productName);
            }else if(type=="PACKING"){
                let result:any[]= await this.entrancePackingRepository.findEntrancesByLotAndDate(lot,dateStart,dateEnd);
                return result.map(x=>x.productName);
            }else if(type=="PRODUCT_ENDED"){
                let result:any[]= await this.productEndedRepository.findProductsByLotAndDate(lot,dateStart,dateEnd);
                return result.map((x)=>x.productName);
            }else{
                return [];
            }
    }

    async getHistoryOfReceptionsOfProduct(lot:string,type:string,productName:string,dateStart:string,dateEnd:string){
        let response:ReceptionMaterialInterface[]=[];
        if(type=="MEAT"){
            let items:any[]= await this.entranceMeatRepository.findEntrancesDetailsbyLotAndDate(lot,productName,dateStart,dateEnd);
            
            for(let item of items){
                let warehouseOfLot:any[] =[];
                let properties:PropertyEvaluatedType1[]=[];
                if(item.weight){
                    let property:any = JSON.parse(item.weight);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Peso",
                        value: property.value||""
                    });
                }
                if(item.temperature){
                    let property:any = JSON.parse(item.temperature);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.description,
                        property:"Temperatura",
                        value: `${property.value} C`||""
                    });
                }
                if(item.strangeMaterial){
                    let property:any = JSON.parse(item.strangeMaterial);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Materia extraña"
                    });
                }

                if(item.expiration){
                    let property:any = JSON.parse(item.expiration);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Expiración"
                    });
                }

                if(item.packing){
                    let property:any = JSON.parse(item.packing);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Empaque"
                    });
                }
                if(item.odor){
                    let property:any = JSON.parse(item.odor);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Olor"
                    });
                }
                if(item.color){
                    let property:any = JSON.parse(item.color);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Color"
                    });
                }
                if(item.transport){
                    let property:any = JSON.parse(item.transport);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        property:"Transporte"
                    });
                }
                if(item.fridge){
                    let property:any = JSON.parse(item.fridge);
                    let fridge:Fridge = await this.fridgeRepository.getFridgeByIdFridge(+property.fridgeId);
                    console.log("Fridge: "+JSON.stringify(fridge));
                    warehouseOfLot = await this.entranceMeatRepository.getWarehouseCoolingBydEntranceMeat(item.lotProvider,item.lotIntern,productName,+property.fridgeId);
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        fridge: fridge.temp,
                        property:"Enfriador",
                        value: `${fridge.temp} C`
                    });
                }

                if(item.slaughterDate){
                    let property:any = JSON.parse(item.slaughterDate);
                    let dateSplited = property.value.split("-");
                    properties.push({
                        accepted:property.accepted,
                        observations: property.observations,
                        value: dateSplited[2]+"/"+dateSplited[1]+"/"+dateSplited[0],
                        property:"Fecha de matanza"
                    });
                }
                response.push({
                    entranceId: item.entranceId,
                    date: item.date,
                    provider: item.provider,
                    productName: item.productName,
                    lotIntern: item.lotIntern,
                    lotProvider: item.lotProvider,
                    evidence: item.evidence,
                    qualityInspector: item.qualityInspector,
                    area: item.area,
                    propertiesEvaluated:properties,
                    status: (warehouseOfLot.length)?((warehouseOfLot[0].status=="OPENED")?"ABIERTO":"CERRADO"):"NO HABIERTO"
                });
            }
         }else if(type=="DRIEF"){
             let items:any[]=await this.entraceDriefRepository.getEntrancesOfDriefByLotAndDate(lot,productName,dateStart,dateEnd);
             for(let item of items){
                 let properties:PropertyEvaluatedType1[]=[];
                if(item.quality){
                    properties.push({
                        accepted:true,
                        observations:"",
                        property:"Cantidad",
                        value: `${item.quantity} ${(item.isPz==1 && item.isBox==1)?'Cajas':((item.isPz==1)?'Piezas':'Kilos')}`
                    });
                }
                if(item.quality!=null){
                    properties.push({
                        accepted: item.quality==1?true:false,
                        observations:"",
                        property:"Calidad",
                    });
                }
                if(item.expiration!=null){
                    properties.push({
                        accepted: item.expiration==1?true:false,
                        observations:"",
                        property:"Expiración",
                    });
                }
                if(item.transport!=null){
                    properties.push({
                        accepted: item.transport==1?true:false,
                        observations:"",
                        property:"Transporte",
                    });
                }
                if(item.strangeMaterial!=null){
                    properties.push({
                        accepted: item.strangeMaterial==1?true:false,
                        observations:"",
                        property:"Materia extraña",
                    });
                }

                if(item.paking!=null){
                    properties.push({
                        accepted: item.paking==1?true:false,
                        observations:"",
                        property:"Empaque",
                    });
                }
                if(item.odor!=null){
                    properties.push({
                        accepted: item.odor==1?true:false,
                        observations:"",
                        property:"Olor",
                    });
                }

                if(item.color!=null){
                    properties.push({
                        accepted: item.color==1?true:false,
                        observations:"",
                        property:"Color",
                    });
                }
                if(item.texture!=null){
                    properties.push({
                        accepted: item.texture==1?true:false,
                        observations:"",
                        property:"Textura",
                    });
                }

                if(item.weight!=null){
                    properties.push({
                        accepted: item.strangeMaterial==1?true:false,
                        observations:"",
                        property:"Peso",
                    });
                }
                if(item.isPz!=null){
                    if(item.isBox==1){
                        properties.push({
                            accepted: true,
                            observations:"",
                            property:"Caja",
                        });
                    }else{
                        properties.push({
                            accepted: item.isPz==1?true:false,
                            observations:"",
                            property:"Pieza",
                        });
                    }
                }

                response.push({
                    entranceId: item.entranceId,
                    area:"",
                    date:item.date,
                    evidence:"",
                    lotIntern:item.lotItern,
                    lotProvider: item.lotProvider,
                    productName: item.productName,
                    provider: item.provider,
                    propertiesEvaluated:properties,
                    qualityInspector:"",
                    status: item.status=="PENDING"?"NO ABIERTO":(item.status=="OPENED"?"ABIERTO":"CERRADO")
                })
             }
         }else if(type=="PACKING"){
             let items:any[] = await this.entrancePackingRepository.getEntrancesOfPackingByLotAndDate(lot,productName,dateStart,dateEnd);
             for(let item of items){
                let properties:PropertyEvaluatedType1[]=[];
                if(item.quantity){
                    properties.push({
                        accepted:true,
                        observations: item.observations,
                        property: "Cantidad",
                        value: item.quantity
                    });
                }
                if(item.isPz!=null){
                    let isPz=item.isPz;
                    
                        if(item.isBox==1){
                            isPz=false;
                            properties.push({
                                accepted:true,
                                observations:"",
                                property:"Caja"
                            });
                        }else {
                            properties.push({
                                accepted:isPz,
                                observations:"",
                                property:"Pieza"
                            });
                        }
                    
                    
                }
              
                if(item.quality!=null){
                    properties.push({
                        accepted:item.quality==1?true:false,
                        observations:"",
                        property:"Calidad"
                    })
                }
                if(item.strangeMaterial!=null){
                    properties.push({
                        accepted: item.strangeMaterial==1?true:false,
                        observations:"",
                        property:"Materia extraña"
                    });
                }
                if(item.paking!=null){
                    properties.push({
                        accepted: item.paking==1?true:false,
                        observations:"",
                        property:"Empaque"
                    });
                }
                if(item.transport!=null){
                    properties.push({
                        accepted:item.transport==1?true:false,
                        observations:"",
                        property:"Transporte"
                    });
                }
                response.push({
                    entranceId: item.entranceId,
                    area:"",
                    date:item.date,
                    evidence:"",
                    lotIntern: item.lotIntern,
                    lotProvider: item.lotProvider,
                    productName: item.productName,
                    provider: item.provider,
                    qualityInspector: item.qualityInspector,
                    propertiesEvaluated:properties,
                    status: item.status=="PENDING"?"NO HABIERTO":((item.status=="OPENED")?"ABIERTO":"CERRADO")
                });
             }
         }
        return response;
    }

    async getHistoryOfOutputs(entranceId:number,type:string,page:number,perPage:number){
        let offset=page*perPage;
        let response:{count:number,items:OutputsByEntrance[]}={count:0,items:[]};
        if(type=="MEAT"){
            let entranceMeat = await this.entranceMeatRepository.getEntranceMeatById(entranceId);
            if(entranceMeat){
                let lotProvider = entranceMeat.loteProveedor;
                let lotIntern= entranceMeat.loteInterno;
                let outputs = await this.entranceMeatRepository.getAllOutputsByLotProviderAndLotIntern(lotProvider,lotIntern,offset,perPage);

                for(let output of outputs.items){
                    let ingredients = await this.entranceMeatRepository.getAllIngredientsByOutputId(output.id);
                    output.ingredients=ingredients;
                }
                
                response.items=outputs.items;
                response.count=outputs.count;
            }
        }else if(type=="DRIEF"){
            let entranceDrief = await this.entraceDriefRepository.getEntranceDriefById(entranceId);
            let lotProvider = entranceDrief.loteProveedor;
            let productId = entranceDrief.product.id;
            let formulationsRecords = await this.entraceDriefRepository.getAllOutputsByLotProviderAndProduct(lotProvider,productId,offset,perPage);
            for(let output of formulationsRecords.items){
                let ingredients = await this.entranceMeatRepository.getAllIngredientsByOutputId(output.id);
                output.ingredients=ingredients;
            }
            response.items=formulationsRecords.items;
            response.count=formulationsRecords.count;
        }
        return response;
    }

    async getFormulationsInventoryQuality(page:number,perPage:number,lot:string,startDate:string,endDate:string){
        let offset = page*perPage;
        let result:{items:OutputsByEntrance[],count:number}= await this.formulationRepository.getFormulationsByDateAndLot(offset,perPage,lot,startDate,endDate);
        for(let item of result.items){
            let ingredients = await this.entranceMeatRepository.getAllIngredientsByOutputId(item.id);
            item.ingredients=ingredients;
        }
        return result;
    }

    async getProcessByFormulation(formulationId:number,page:string,perPage:string,entranceId:number,type:string){
        let response:{count:number,items:ProcessFormulation[]}={count:0,items:[]};
        if(type=="MEAT"){
            if(formulationId!=null){
                console.log("Opcion 1");
                response= await this.entranceMeatRepository.getAllProcessByFormulation(formulationId);
            }else if(page!=null && perPage!=null && entranceId!=null){
                console.log("Opcion 1");
                let entranceMeat = await this.entranceMeatRepository.getEntranceMeatById(entranceId);
                let lotInter = entranceMeat.loteInterno;
                let lotProvider = entranceMeat.loteProveedor;
                let offset = (+page)*(+perPage);
                response= await this.entranceMeatRepository.getAllProcessByFormulationPagination(offset,+perPage,lotInter,lotProvider);
            }
        }else if(type=="DRIEF"){
           if(formulationId!=null){
                response= await this.entraceDriefRepository.getAllProcessByFormulation(formulationId);
           }else if(page!=null && perPage!=null && entranceId!=null){
            console.log("Opcion 1");
            let entranceDrief = await this.entraceDriefRepository.getEntranceDriefById(entranceId);
            let lotProvider = entranceDrief.loteProveedor;
            let productId = entranceDrief.product.id;
            let offset = (+page)*(+perPage);
            response= await this.entraceDriefRepository.getAllProcessByFormulationPagination(lotProvider,productId, offset,+perPage);
           }
        }
        return response;
    }

    async getOvensByProcess(processId:string,page:string,perPage:string,entranceId:number,type:string){
        let response:{count:number,items:EntranceOutputsOven[]}={count:0,items:[]};
        if(type=="MEAT"){
            if(processId!=null){
                console.log("Opcion 1");
                response= await this.entranceMeatRepository.getAllOvenByProcess(+processId);
            }else if(page!=null && perPage!=null && entranceId!=null){
                console.log("Opcion 1");
                let entranceMeat = await this.entranceMeatRepository.getEntranceMeatById(entranceId);
                let lotInter = entranceMeat.loteInterno;
                let lotProvider = entranceMeat.loteProveedor;
                let offset = (+page)*(+perPage);
                let processIds = await this.entranceMeatRepository.getAllOvenByProcessIngredientsNormal(lotInter,lotProvider);
                response= await this.entranceMeatRepository.getAllOvenByProcessPagination(offset,+perPage,processIds);
            }
        }else if(type=="DRIEF"){
            if(processId!=null){
                console.log("Opcion 1");
                response = await this.entraceDriefRepository.getAllOvenByProcess(+processId);
            }else if(page!=null && perPage!=null && entranceId!=null){
                console.log("Opcion 1");
                let entranceMeat = await this.entraceDriefRepository.getEntranceDriefById(entranceId);
                let lotProvider = entranceMeat.loteProveedor;
                let productId = entranceMeat.product.id;
                let offset = (+page)*(+perPage);
                let processIds = await this.entraceDriefRepository.getAllOvenByProcessIngredientsNormal(lotProvider,productId);
                response=await this.entraceDriefRepository.getAllOvenByProcessPagination(offset,+perPage,processIds);
            }
        }    
        return response;
    }
    async getProductEndedByOven(ovenId:string,page:string,perPage:string,entranceId:number,type:string){
        if(type=="MEAT"){
            if(ovenId!=null){
                console.log("Opcion 1");
                let oven:OvenProducts= await this.ovenRepository.getOvenProductById(+ovenId);
                let lot = oven.newLote;
                let productId = oven.product.id;
                return await this.entranceMeatRepository.getAllPropacksByOven(lot,productId);
            }else if(page!=null && perPage!=null && entranceId!=null){
                let entranceMeat = await this.entranceMeatRepository.getEntranceMeatById(entranceId);
                let lotInter = entranceMeat.loteInterno;
                let lotProvider = entranceMeat.loteProveedor;
                let offset = (+page)*(+perPage);
                let processIds = await this.entranceMeatRepository.getAllOvenByProcessIngredientsNormal(lotInter,lotProvider);
                let ovens= await this.entranceMeatRepository.getAllOvenByProcessPagination(null,null,processIds);
                return await this.entranceMeatRepository.getAllPropacksByOvenPagination(offset,+perPage,ovens.items);
            }
        }else if(type=="DRIEF"){
            if(ovenId!=null){
                console.log("Opcion 1");
                let oven:OvenProducts= await this.ovenRepository.getOvenProductById(+ovenId);
                let lot = oven.newLote;
                let productId = oven.product.id;
                return await this.entraceDriefRepository.getAllPropacksByOven(lot,productId);
            }else if(page!=null && perPage!=null && entranceId!=null){
                let entranceDrief = await this.entraceDriefRepository.getEntranceDriefById(entranceId);
                let lotProvider = entranceDrief.loteProveedor;
                let productId:number = entranceDrief.product.id;
                let offset = (+page)*(+perPage);
                let processIds = await this.entraceDriefRepository.getAllOvenByProcessIngredientsNormal(lotProvider,productId);
                let ovens= await this.entraceDriefRepository.getAllOvenByProcessPagination(null,null,processIds);
                return await this.entraceDriefRepository.getAllPropacksByOvenPagination(offset,+perPage,ovens.items);
            }
        }
    }

    async getProductEndedBetweenDates(dateStart:string,dateEnd:string,productName:string,lot:string,page:number,perPage:number){
        let offset = (+page)*(+perPage);
        return await this.packagingRepository.getAllPropacksByDateAndProductNameAndLot(dateStart,dateEnd,productName,lot,offset,perPage);
    }

    async getHistoryTrazabilityProductInfo(id:number){
        return await this.entranceMeatRepository.getProductInfoFromPackingToTrazability(id);
    }
    async getHistoryTrazabilityProductInfoDefrost(ovenId:number){
        let process = await this.entranceMeatRepository.getProcessOfProductEndedLotProductId(ovenId);
        let ids:number[] =[];
        for(let pro of process){
            if(!ids.includes(pro.processId)){
                ids.push(pro.processId);
            }
        }
        
        let items= await this.entranceMeatRepository.getProductInfoFromPackingToTrazabilityDefrost(ids);
        
        return items;
    }

    async getHistoryTrazabilityProductInfoIngredients(ovenId:number){
        return await this.entranceMeatRepository.getProductInfoFromPackingToTrazabilityIngredients(ovenId);
    }

    async getDateDistribution(lot:string,productId:number,presentationId:number){
        return await this.entranceMeatRepository.getStartDateEndDateDistribution(lot,productId,presentationId);
    }

    async getInventoryOfReceptions(type:string,dateStart:string,dateEnd:string,page:number,perPage:number,lot:string){
        let offset=page*perPage;
        let response:{items:InventoryTypeQuality[],count:number}={items:[],count:0};
            if(type=="MEAT"){
                response=await this.entranceMeatRepository.getInventoryOfCoolingByDateEntrance(dateStart,dateEnd,offset,perPage,lot);
            }else if(type=="DRIEF"){
                response=await this.entraceDriefRepository.getInventoryOfDriefByDateEntrance(dateStart,dateEnd,offset,perPage,lot);
            }else if(type=="PACKING"){
                response = await this.entrancePackingRepository.getInventoryOfPackingByDateEntrance(dateStart,dateEnd,offset,perPage,lot);
            }
        return response;
    }

    async getAllOutputsByWarehouses(type:string,page:number,perPage:number,startDate:string,endDate:string,lot:string){
        let response:{items:OutputsOfWarehouse[],count:number}={count:0,items:[]};
        let offset = page*perPage;
        switch(type){
            case 'MEAT':
                response = await this.entranceMeatRepository.getOutputsOfWarehouseMeat(lot,startDate,endDate,offset,perPage);
                break;
            case 'DRIEF':
                response = await this.entraceDriefRepository.getOutputsOfWarehouseDrief(lot,startDate,endDate,offset,perPage);
                break;
            case 'PACKING':
                response = await this.entrancePackingRepository.getOutputsOfWarehouseDrief(lot,startDate,endDate,offset,perPage);
                break;
        }
        return response;
    }
    async getProcessRecords(page:number,perPage:number,startDate:string,endDate:string,lot:string){
        let offset = page*perPage;
        return await this.processRepository.getAllProcessByDatesAndLotPaginated(offset,perPage,startDate,endDate,lot);
    }
    async getOvensRecords(page:number,perPage:number,startDate:string,endDate:string,lot:string){
        let offset = page*perPage;
        return await this.ovenRepository.getAllOvensByDatesAndLotPaginated(offset,perPage,startDate,endDate,lot);
    }

    async getProductsEnded(page:number,perPage:number,startDate:string,endDate:string,lot:string,type:string){
        let offset = page*perPage;
        if(type=="ACUMULATED"){
            return await this.propertiesPackagingRepository.getAllProductsEndedPaginatedAccumulated(offset,perPage,startDate,endDate,lot);
        }else{
            return await this.propertiesPackagingRepository.getAllProductsEndedPaginatedSingle(offset,perPage,startDate,endDate,lot);
        }
    }

    async getAllUsersSellers(){
        return await this.userRepository.getAllUsersDelivers();
    }
    async getAllDelivers(body:DeliveryToSellerRequest,type:string){
        if(type=="ACCUMULATED"){
            return await this.subOrderMetadataRepository.getAllDeliversAccumulated(body);
        } else{
            return await this.subOrderMetadataRepository.getAllDeliversIndividual(body);
        }  
        
    }
    async getAllProductOnlyOfQuality(){
        return await this.productsRoviandaRepository.getOnlyProductOfQualityArea()
    }

    async getAllProductsOnlyOfQualityMetrics(date:string,type:string){
        let date1="";
        let date2="";
        let date3="";
        let date4="";
        if(type=="YESTERDAY"){
            let dateP = new Date(date);
            dateP.setHours(dateP.getHours()-1);
            let day = (dateP.getDate()).toString();

            if(+day<10) day="0"+day;
            date1=`${date.substring(0,8)}${day}`;
            date2=`${date.substring(0,8)}${day}`
            date3=date;
            date4=date;
        }else if(type=="WEEK"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"week");
            console.log("Dates: "+JSON.stringify(dates));
            date1=dates.date1;
            date2=dates.date2;
            date3=dates.date3;
            date4=dates.date4;
        }else if(type=="LAST_MONTH"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"month");
            date1=dates.date1;
            date2=dates.date2;
            date3=dates.date3;
            date4=dates.date4;
        }else if(type=="LAST_YEAR"){
            let dateP = new Date(date);
            let currentYear = dateP.getFullYear();
            let lastYear = currentYear-1;
            date1=`${lastYear}-01-01`;
            date2=`${lastYear}-12-31`;
            date3=`${currentYear}-01-01`;
            date4=`${currentYear}-12-31`;
        }else if(type=="MONTH_LAST_YEAR"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"month");
            date1=dates.date1;
            date2=dates.date2;
            date3=dates.date3;
            date4=dates.date4;
            let dateP = new Date(date);
            date1=`${dateP.getFullYear()-1}${date1.substring(4,date1.toString().length)}`;
            date2=`${dateP.getFullYear()-1}${date2.substring(4,date2.toString().length)}`;
            
        }else{
            return [];
        }
        console.log(date1,date2,date3,date4);
        return await this.productsRoviandaRepository.getMetricsProductsIncreaseDecrease(date1,date2,date3,date4);
    }

    async getProductQualityDetails(productId:number){
        let productRovianda = await this.productsRoviandaRepository.getProductRoviandaById(productId);
        if(!productRovianda) throw new Error("[400], No existe el producto rovianda");
        
        let response:ProductQualityDetails={
            ingredients:productRovianda.ingredients.map((x)=>({productName:x.description,id:x.id,mark:x.mark,presentation:x.presentation,variant:x.variant})),
            name:productRovianda.name,
            presentations:productRovianda.presentationProducts.map((x)=>({code:x.typeProduct=='ABARROTES'?x.keyAltern:x.keySae,presentation:x.presentationType}))
        };
        return response;
    }

    async getAllPresentationOfProduct(productId:number,date:string,type:string){
        let date1="";
        let date2="";
        let date3="";
        let date4="";
        if(type=="YESTERDAY"){
            let dateP = new Date(date);
            dateP.setHours(dateP.getHours()-1);
            let day = (dateP.getDate()).toString();

            if(+day<10) day="0"+day;
            date1=`${date.substring(0,8)}${day}`;
            date2=`${date.substring(0,8)}${day}`
            date3=date;
            date4=date;
        }else if(type=="WEEK"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"week");
            date1=dates.date1;
            date2=dates.date2;
            date3=dates.date3;
            date4=dates.date4;
        }else if(type=="LAST_MONTH"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"month");
            date1=dates.date1;
            date2=dates.date2;
            date3=dates.date3;
            date4=dates.date4;
        }else if(type=="LAST_YEAR"){
            let dateP = new Date(date);
            let currentYear = dateP.getFullYear();
            let lastYear = currentYear-1;
            date1=`${lastYear}-01-01`;
            date2=`${lastYear}-12-31`;
            date3=`${currentYear}-01-01`;
            date4=`${currentYear}-12-31`;
        }else if(type=="MONTH_LAST_YEAR"){
            let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"month");
            
            date3=dates.date3;
            date4=dates.date4;
            let dateP = new Date(date);
            date1=`${dateP.getFullYear()-1}${date1.substring(4,date1.toString().length)}`;
            date2=`${dateP.getFullYear()-1}${date2.substring(4,date2.toString().length)}`;
            
        }else{
            return [];
        }
        console.log(date1,date2,date3,date4);

        return await this.presentationProductsRepository.getPresentationsMetricsByProductId(productId,date1,date2,date3,date4);
    }

    async getChartMetricsPresentationWeek(presentationId:number,date:string){
        let date1="";
        let date2="";
        let date3="";
        let date4="";
        let dates= await this.productsRoviandaRepository.getWeekDatesByDate(date,"week");
        date1=dates.date1;
        date2=dates.date2;
        date3=dates.date3;
        date4=dates.date4;
        return await this.presentationProductsRepository.getChartDataByWeek(presentationId,date1,date2,date3,date4);
    }

    async getGeneralDataSalesChart(dateStart:string,dateEnd:string){
        return await this.saleRepository.getGeneralDataSalesChart(dateStart,dateEnd);
    }

    async addNewIngredient(body:NewIngredientQuality){
        let ingredient:Product = await this.productCRepository.getProductByDescription(body.productName);
        if(ingredient) throw new Error("[409],Ya existe un ingrediente con el mismo nombre");
        let ingredientToSave:Product= new Product();
        ingredientToSave.description=body.productName;
        ingredientToSave.mark=body.mark;
        ingredientToSave.state=true;
        ingredientToSave.variant=body.variant;
        ingredientToSave.presentation=body.presentation;
        ingredientToSave.category="DRIEF";
        ingredientToSave = await this.productCRepository.createProduct(ingredientToSave);
        if(body.productId){
            let productRovianda = await this.productsRoviandaRepository.getProductRoviandaById(body.productId);
            if(productRovianda){
                productRovianda.ingredients.push(ingredientToSave);
                await this.productsRoviandaRepository.saveProductRovianda(productRovianda);
            }
        }
    }

    async vinculateIngredient(body:{ingredientId:number,productId:number,type:string}){
        if(body.type=="ADD"){
            let productRovianda:ProductRovianda = await this.productsRoviandaRepository.getProductRoviandaById(body.productId);
            if(productRovianda){
                let product:Product = await this.productCRepository.getProductById(body.ingredientId);
                if(product){
                    productRovianda.ingredients.push(product);
                    await this.productsRoviandaRepository.saveProductRovianda(productRovianda);
                }
            }
        }else if(body.type=="REMOVE"){
            await this.productsRoviandaRepository.unvinculateOfIngredient(body.productId,body.ingredientId);
        }
    }

    async updateStatusOfOvenProduct(ovenId:number,body:{status:string}){
        let ovenProduct = await this.ovenRepository.getOvenProductsById(ovenId);
        if(ovenProduct){
            ovenProduct.status=body.status;
            await this.ovenRepository.saveOvenProduct(ovenProduct);
        }
    }

    async updateRecordEntrancesByType(entranceId:number,type:string,request:any){
        switch(type){
            case 'MEAT':
                
                let cooling = await this.coolingRepository.getCoolingById(entranceId);
                let entranceMeat = await this.entranceMeatRepository.getEntranceMeatByLotProviderAndLotInternAndQuantity(cooling.loteProveedor,cooling.loteInterno,+cooling.quantity);
                if(entranceMeat){
                   if(request.lotProvider){
                       entranceMeat.loteProveedor=request.lotProvider;
                   } 
                
                   if(request.lotIntern){
                       console.log("Nuevo lote interno: "+request.lotIntern);
                       entranceMeat.loteInterno=request.lotIntern;
                   }
                   if(request.quantity){
                       let quantityParsed = entranceMeat.weight;
                        quantityParsed.value=request.quantity;
                        entranceMeat.weight=quantityParsed;
                   }
                   if(request.fridgeId){
                    entranceMeat.fridge={
                        accepted: entranceMeat.fridge.accepted,
                        fridgeId: request.fridgeId,
                        observations: entranceMeat.fridge.observations
                    };
                    }
                   await this.entranceMeatRepository.saveEntrancesMeat(entranceMeat);
                }
                if(cooling){
                    let oldLotIntern=cooling.loteInterno;
                    let oldLotProvider=cooling.loteProveedor;
                    let newLotIntern=request.lotIntern||cooling.loteInterno;
                    let newLotProvider=request.lotProvider||cooling.loteProveedor;
                    if(request.lotProvider){
                       cooling.loteProveedor=request.lotProvider;
                   } 
                   if(request.lotIntern){
                    console.log("Nuevo lote interno: "+request.lotIntern);
                       cooling.loteInterno=request.lotIntern;
                   }
                   if(request.quantity){
                       cooling.quantity=request.quantity;
                   }
                   if(request.fridgeId){
                       let fridge = await this.fridgeRepository.getFridgeByIdFridge(request.fridgeId);
                      cooling.fridge=fridge;
                   }
                   if(request.status){
                       cooling.status=request.status;
                   }
                   await this.coolingRepository.saveCooling(cooling);
                   await this.outputsCoolingRepository.updateAllOutputsCoolingLotByLoteInternAndLotProvider(oldLotProvider,oldLotIntern,newLotProvider,newLotIntern);
                }
                
                break;
            case 'DRIEF':
                let warehouseDrief= await this.warehouseDrief.getWarehouseDriefByIds(entranceId);
                let entrancesDrief = await this.entraceDriefRepository.getByWarehouseDrief(warehouseDrief);
                
                if(entrancesDrief){
                    
                    if(request.quantity){
                        entrancesDrief.quantity=request.quantity;
                    }
                    if(request.lotProvider){
                        entrancesDrief.loteProveedor=request.lotProvider;
                    }
                    await this.entraceDriefRepository.saveDrief(entrancesDrief);
                }
                if(warehouseDrief){
                    if(request.status){
                        warehouseDrief.status=request.status;
                    }
                    if(request.quantity){
                        warehouseDrief.quantity=request.quantity;
                    }
                    if(request.lotProvider){
                        warehouseDrief.loteProveedor=request.lotProvider;
                        await this.outputsDriefRepository.updateAllOutputs(request.lotProvider,warehouseDrief.id);
                    }
                    await this.warehouseDrief.saveWarehouseDrief(warehouseDrief);
                }
                
                break;
        }
    }

    async updateOvenProperties(ovenId:number,body:any){
        let oven:OvenProducts = await this.ovenRepository.getOvenProductById(ovenId);
        if(oven){
            if(body.status){
                oven.status=body.status;
                if(oven.status=="CLOSED"){
                    oven.inspectioned=false;
                }
            }
            let oldNewLote = oven.newLote;
            if(body.newLot){
                oven.newLote=body.newLot;
                await this.packagingRepository.updateLotAllOvenOutputs(oldNewLote,oven.product.id,body.newLot);
                await this.subOrderMetadataRepository.updateLotAllOvenOutputs(oldNewLote,oven.product.id,body.newLot);
                await this.inspectionRepository.updateLotToInspectionProduct(oldNewLote,oven.product.id,body.newLot);
            }
            await this.ovenRepository.saveOvenProduct(oven);
        }
    }

    async createCodeAccess(userId:string){
        let user = await this.userRepository.getUserById(userId);
        if(user){
            let code = this.makeid(8);
            let codeAccess:CodeAccess = await this.codeAccessRepository.getCodeAccessByUserId(user.id);
            if(codeAccess){
                codeAccess.code=code;
                await this.codeAccessRepository.saveCodeAccess(codeAccess);
            }else{
                let newCodeAccess:CodeAccess = new CodeAccess();
                newCodeAccess.code=code;
                newCodeAccess.userId=user.id;
                await this.codeAccessRepository.saveCodeAccess(newCodeAccess);
            }
        }
    }

    async getCodeAccessByUserId(userId:string) {
        let user = await this.userRepository.getUserById(userId);
        if(!user) throw new Error("[404], no existe el usuario");
        let codeAccess:CodeAccess = await this.codeAccessRepository.getCodeAccessByUserId(userId);
        if(!codeAccess) throw new Error("[404], no existe el código de acceso");
        return codeAccess;        
    }

    async validateCodeAccess(codeAccess:string) {
        let codeAccessEntity:CodeAccess = await this.codeAccessRepository.getCodeAccessByCode(codeAccess);
        if(!codeAccessEntity) return false;
        await this.codeAccessRepository.deleteCodeAccess(codeAccessEntity.codeAccessId);
        return true;
    }

    makeid(length:number) {
        var result:string= '';
        var characters:string= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    async getSalesMetricsAcumulated(dateStart:string,dateEnd:string){
        let result = await this.saleRepository.getSalesMetricsAcumulated(dateStart,dateEnd);
        let response:SaleMetricsAcumulated={
            amount:0,
            tickets:0,
            ticketsCanceled:0
        }
        if(result.length){
            response = result[0];
        }
        return response;
    }
}