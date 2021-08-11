import { Request, response, Response } from "express";
import { DeliveryToSeller, EntranceOutputPackingFromOven, EntranceOutputsOven, InventoryTypeQuality, OutputsByEntrance, OutputsOfWarehouse, OvensInventory, ProcessFormulation, ProcessInventory, ProductEndedIventory, ProductQualityDetails, ReceptionMaterialInterface } from "../Models/DTO/Quality.DTO";
import { QualityService } from "../Services/Quality.Service";
import { ReportTrazability } from "../Utils/componentsReports/ReportTrazability";
import * as pdf from 'html-pdf';
export class QualityController{
    private qualityService:QualityService;
    private reportTrazability:ReportTrazability;
    constructor(){
        this.qualityService=new QualityService();
        this.reportTrazability=new ReportTrazability();
    }

    async searchLotReceptionsProducts(req:Request,res:Response){
        let lot:string = req.query.lot;
        let type:string = req.params.type;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response:string[]=await this.qualityService.getProductReceivedByLotAndType(lot,type,dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async searchReceptionsOfProduct(req:Request,res:Response){
        let lot:string = req.query.lot;
        let type:string = req.params.type;
        let productName:string =req.params.productName;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response:ReceptionMaterialInterface[]=await this.qualityService.getHistoryOfReceptionsOfProduct(lot,type,productName,dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async getHistoryOutputsWarehouseByEntranceId(req:Request,res:Response){
        let entranceId:number = +req.params.entranceId;
        let type:string = req.query.type;
        let page:number = +req.query.page;
        let perPage:number = +req.query.perPage;
        let response:{count:number,items:OutputsByEntrance[]} = await this.qualityService.getHistoryOfOutputs(entranceId,type,page,perPage);
        return res.status(200).send(response);
    }

    async getHistoryOutputsWarehouseProcess(req:Request,res:Response){
        let formulationId:number = req.query.formulationId;
        let page = req.query.page;
        let perPage=req.query.perPage;
        let entranceId=req.query.entranceId;
        let type=req.query.type;
        let response:{count:number,items:ProcessFormulation[]}=await this.qualityService.getProcessByFormulation(formulationId,page,perPage,entranceId,type);
        return res.status(200).send(response);
    }
   
    async getHistoryOutputsWarehouseoOven(req:Request,res:Response){
        let processId:string = req.query.processId;
        let page = req.query.page;
        let perPage=req.query.perPage;
        let entranceId=req.query.entranceId;
        let type = req.query.type;
        let response:{count:number,items:EntranceOutputsOven[]}=await this.qualityService.getOvensByProcess(processId,page,perPage,entranceId,type);
        return res.status(200).send(response);
    }
   
    async getHistoryReportTrazability(req:Request,res:Response){
        let id=req.query.id;
        let productInfo= await this.qualityService.getHistoryTrazabilityProductInfo(id);
        let rangeDates = await this.qualityService.getDateDistribution(productInfo.lotId,productInfo.productId,productInfo.presentationId);
        let productdefrost = await this.qualityService.getHistoryTrazabilityProductInfoDefrost(productInfo.lotId,productInfo.productId);
        let ingredients = await this.qualityService.getHistoryTrazabilityProductInfoIngredients(productInfo.lotId,productInfo.productId);
        let report = await this.reportTrazability.getReportOfTrazability(productInfo,productdefrost,ingredients,rangeDates);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "2cm", 
                right: "2cm",
                bottom: "2cm",
                left: "2cm",
            },
            footer:{
                height: "28mm",
                contents:{
                    default: '<span>Pag. {{page}}</span>/<span>{{pages}}</span>'
                }
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteDeTrazabilidad.pdf`
            });
            stream.pipe(res);
        }));
    }

    async getHistoryProductEndedWarehouse(req:Request,res:Response){
        let ovenId:string = req.query.ovenId;
        let page = req.query.page;
        let perPage=req.query.perPage;
        let entranceId=req.query.entranceId;
        let type = req.query.type;
        let response:{count:number,items:EntranceOutputPackingFromOven[]}=await this.qualityService.getProductEndedByOven(ovenId,page,perPage,entranceId,type);
        return res.status(200).send(response);
    }

    async getHistoryProductEnded(req:Request,res:Response){
        let page = req.query.page;
        let perPage=req.query.perPage;
        let lot=req.query.lot;
        let productName = req.query.productName;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;

        let response:{count:number,items:EntranceOutputPackingFromOven[]}=await this.qualityService.getProductEndedBetweenDates(dateStart,dateEnd,productName,lot,page,perPage);
        return res.status(200).send(response);
    }

    async getInventoryOfQualityType(req:Request,res:Response){
        let type=req.params.type as string;
        let dateStart:string= req.query.dateStart;
        let dateEnd:string= req.query.dateEnd;
        let page:number = +req.query.page;
        let perPage:number = +req.query.perPage;
        let lot:string = req.query.lot;
        let response:{items:InventoryTypeQuality[],count:number}= await this.qualityService.getInventoryOfReceptions(type,dateStart,dateEnd,page,perPage,lot);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }

    async getInventoryWarehouseOutputsBySectionQuality(req:Request,res:Response){
        let type=req.query.type;
        let page=+req.query.page;
        let perPage=+req.query.perPage;
        let startDate=req.query.startDate;
        let endDate = req.query.endDate;
        let lot = req.query.lot;
        let response:{items:OutputsOfWarehouse[],count:number}=await this.qualityService.getAllOutputsByWarehouses(type,page,perPage,startDate,endDate,lot);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }    

    async getInventoryWarehousesProcessRecords(req:Request,res:Response){
        let page:number =+req.query.page;
        let perPage:number =+req.query.perPage;
        let startDate:string = req.query.startDate;
        let endDate:string = req.query.endDate;
        let lot:string = req.query.lot;
        let response:{items:ProcessInventory[],count:number} = await this.qualityService.getProcessRecords(page,perPage,startDate,endDate,lot);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }

    async getInventoryWarehousesOvensRecords(req:Request,res:Response){
        let page:number =+req.query.page;
        let perPage:number =+req.query.perPage;
        let startDate:string = req.query.startDate;
        let endDate:string = req.query.endDate;
        let lot:string = req.query.lot;
        let response:{items:OvensInventory[],count:number} =await this.qualityService.getOvensRecords(page,perPage,startDate,endDate,lot);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }
    async getInventoryFormulationsBySectionQuality(req:Request,res:Response){
        let startDate:string = req.query.startDate;
        let endDate:string = req.query.endDate;
        let page:number = +req.query.page;
        let perPage:number=+req.query.perPage;
        let lot:string = req.query.lot;
        let response:{items:OutputsByEntrance[],count:number}= await this.qualityService.getFormulationsInventoryQuality(page,perPage,lot,startDate,endDate);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }

    async getAllProductCatalogByQuality(req:Request,res:Response){
        let response:{id:number,name:string}[] = await this.qualityService.getAllProductOnlyOfQuality();
        return res.status(200).send(response);
    }
    async getProductQualitytDetails(req:Request,res:Response){
        let productId:number = +req.params.productId;
        let response:ProductQualityDetails=await this.qualityService.getProductQualityDetails(productId);
        return res.status(200).send(response);
    }

    async addNewIngredient(req:Request,res:Response){
        await this.qualityService.addNewIngredient(req.body);
        return res.status(201).send();
    }
    async vinculateIngredient(req:Request,res:Response){
        await this.qualityService.vinculateIngredient(req.body);
        return res.status(204).send();
    }
    async getInventoryWarehousesProductEnded(req:Request,res:Response){
        let type:string = req.query.type;
        let page:number= +req.query.page;
        let perPage:number=+req.query.perPage;
        let lot:string=req.query.lot;
        let startDate:string = req.query.startDate;
        let endDate:string = req.query.endDate;
        let response:{items:ProductEndedIventory[],count:number}=await this.qualityService.getProductsEnded(page,perPage,startDate,endDate,lot,type)
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }

    async getAllUsersDelivers(req:Request,res:Response){
        let response:{name:string,id:string}[]= await this.qualityService.getAllUsersSellers();
        return res.status(200).send(response);
    }

    async getInventoryWarehouseDeliverySellersRecords(req:Request,res:Response){
        let response:{items:DeliveryToSeller[],count:number} = await this.qualityService.getAllDelivers(req.body);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader("X-Total-Count",response.count);
        return res.status(200).send(response.items);
    }
}