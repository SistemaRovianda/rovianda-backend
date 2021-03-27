import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { PackagingService } from '../Services/Packaging.Service'
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { Devolution } from '../Models/Entity/Devolution';
import * as pdf from 'html-pdf';
import { LotsStockInventory, LotsStockInventoryPresentation } from '../Models/DTO/PackagingDTO';
import PdfHelper from "../Utils/Pdf.Helper";
import Excel4Node from '../Utils/Excel.Helper';
import * as os from "os";
import * as fs from "fs";
export class PackagingController{

    private excel: Excel4Node;
    private packagingService: PackagingService;
    private pdfHelper: PdfHelper;
    constructor(private firebaseInstance:FirebaseHelper){
        this.packagingService = new PackagingService();
        this.pdfHelper= new PdfHelper();
        this.excel = new Excel4Node();
    }

    async savePackaging(req:Request,res:Response){
        let response = await this.packagingService.savePackaging(req.body);
        return res.status(201).send({packaging: response});
    }

   
    async getProducts(req:Request,res:Response){
        let products:ProductRovianda[] = await this.packagingService.getProducts();
        return res.status(200).send(products);
    }
  
    async getHistoryPackaging(req:Request,res:Response){
        let packaging = await this.packagingService.getHistoryPackaging(req.params.lotId);
        return res.status(200).send(packaging);
    }

  
  
    async saveUsersPackaging(req:Request,res:Response){
        await this.packagingService.saveUsersPackaging(req.body, req.params.packagingId);
        return res.status(201).send();
    }

    async getPackagingColaboratedById(req:Request,res:Response){
        let packaging = await this.packagingService.getPackagingColaboratedById(+req.params.packagingId);
        return res.status(200).send(packaging);
    }

    async savePackagingAssigned(req:Request,res:Response){
            await this.packagingService.savePackagingAssigned(req.body);
            return res.status(201).send();
    }
      
    async getPackagingAssignedBoxes(req: Request, res: Response){
        let response = await this.packagingService.getPackagingAssignedBoxes(req);
        return res.status(200).send(response);
    }

    async getPackaging(req: Request, res: Response){
        let response = await this.packagingService.getPackaging();
        return res.status(200).send(response);
    }

    async getPackagingInventoryLotsProduct(req:Request,res:Response){
        let orderId:number = +req.params.orderId;
        return res.status(200).send(await this.packagingService.getProductPresentationInventory(orderId));
    }

    async savePackagingInventoryLotsProductOutput(req:Request,res:Response){
        
        await this.packagingService.savePackagingInventoryLotsProductOutput(req.body)
        return res.status(201).send();
    }

    async saveSubOrderMetaData(req:Request,res:Response){
        await this.packagingService.saveSubOrderMetaData(req);
        return res.status(201).send();
    }

    async getOrderSellerByUrgent(req:Request,res:Response){
        let mode=req.query.mode;
        let response = await this.packagingService.getOrderSellerByUrgent(req.params.urgent,mode);
        return res.status(200).send(response);
    }

    async getPackagingLotProduct(req:Request,res:Response){
        let response = await this.packagingService.getPackagingLotProduct();
        return res.status(200).send(response);
    }

    async createPackagingReprocesing(req:Request,res:Response){
        let reprocesingId=await this.packagingService.createReprocesing(req.body)
        return res.status(200).send({reprocesingId});
    }

    async getPackagingReprocesingReport(req:Request,res:Response){
        let reprocesingId=+req.params.reprocesingId;
        let reprocesingReport= await this.packagingService.getReprosessingById(reprocesingId);
        pdf.create(reprocesingReport, {
            format: 'Legal',
            header: {
                height: "2.5cm"
            },
            footer: {
                height: "2.5cm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=Reproceso.pdf`
            });
            stream.pipe(res);
        }))
    }
    async createDevolution(req:Request,res:Response){
        let devolution:Devolution= await this.packagingService.createDevolution(req.body);
        return res.status(200).send({devolutionId:devolution.id});
    }

    async getDevolutionReport(req:Request,res:Response){
        let devolutionId:number=+req.params.devolutionId;
        let content:string=await this.packagingService.getDevolutionDetails(devolutionId);
        pdf.create(content, {
            format: 'Legal',
            orientation:`landscape`,
            header: {
                height: ".5cm"
            },
            footer: {
                height: ".5cm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=Devolucion.pdf`
            });
            stream.pipe(res);
        }))
    }

    async closeOrderSeller(req:Request,res:Response){
        let orderSellerId:number = +req.params.orderSellerId;
        await this.packagingService.closeOrderSeller(orderSellerId);
        return res.status(204).send();
    }

    async getEntrancesToSellerInventoryByWarehouse(req:Request,res:Response){
        let warehouseId:string = req.params.warehouseId;
        let dateStart:string = req.query.dateStart;
        let dateEnd:string = req.query.dateEnd;
        let response = await this.packagingService.getEntrancesOfWarehouseId(warehouseId,dateStart,dateEnd);
        return res.status(200).send(response);
    }

    async getLotsStockInventory(req:Request,res:Response){
        let presentationId:number = +req.params.presentationId;
        let response: LotsStockInventory[] =  await this.packagingService.getLotsStockInventoryByPresentationId(presentationId);
        return res.status(200).send(response);
    }

    async getReportInventory(req:Request,res:Response){
        let warehouse = req.query.ware;
        let type = req.params.type;
        let result:{items:LotsStockInventoryPresentation[],name:string} = await this.packagingService.getLotsStockInventoryByWarehouseGeneral(warehouse);
        
        if(type=="pdf"){
            let content = this.pdfHelper.getReportInventory(result.items,result.name);
        
            pdf.create(content, {
                format: 'Legal',
                orientation:`landscape`,
                header: {
                    height: ".5cm"
                },
                footer: {
                    height: ".5cm"
              },
            }).toStream((function (err, stream) {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'responseType': 'blob',
                    'Content-disposition': `attachment; filename=Inventario.pdf`
                });
                stream.pipe(res);
            }))
        }else if(type=="excel"){
            let tmp = os.tmpdir();
            let workbook = this.excel.generateInventoryReport(result.items,result.name); 
            workbook.write(`${tmp}/Inventario.xlsx`,(err, stats)=>{
                if(err){
                    console.log(err);
                }
                res.setHeader(
                    "Content-disposition",
                    'inline; filename="Inventario.xlsx"'
                  );
                  res.setHeader("Content-Type", "application/vnd.ms-excel");
                  res.status(200); 
                console.log(stats);
                return res.download(`${tmp}/Inventario.xlsx`,(er) =>{ 
                    if (er) console.log(er);
                    fs.unlinkSync(`${tmp+"/Inventario.xlsx"}`);
                    
                })
            });
        }
       
    }

    async getInventoryPlant(req:Request,res:Response){
        let result:{items:LotsStockInventoryPresentation[],name:string} = await this.packagingService.getLotsStockInventoryByWarehouseGeneral(53);
        return res.status(200).send(result.items);
    }

    async UpdateInventoryPlant(req:Request,res:Response){
        
        return res.status(204).send(await this.packagingService.updateInventoryPlant(req.body));
    }

    async getOutputsByPlant(req:Request,res:Response){
        let from =req.query.from;
        let to = req.query.to;
        let response = await this.packagingService.getAllOutputsByPlant(from,to);
        return res.status(200).send(response);
    }

}