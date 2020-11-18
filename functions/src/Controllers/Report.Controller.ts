import {Request,Response} from 'express';
import { FirebaseHelper } from '../Utils/Firebase.Helper';
import { EntranceDriefService } from '../Services/Entrance.Drief.Service';
import { UserService } from '../Services/User.Service';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { Formulation } from '../Models/Entity/Formulation';
import PdfHelper from '../Utils/Pdf.Helper';
import * as pdf from 'html-pdf';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { EntranceMeatService } from '../Services/Entrances.Meat.Services';
import { EntrancePackingService } from '../Services/Entrance.Packing.Service';
import { FormulationService } from '../Services/Formulation.Service';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { WarehouseDriefService } from '../Services/Warehouse.Drief.Service';
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { OvenService } from '../Services/Oven.Service';
import { RevisionOvenProductService } from '../Services/Revision.Oven.Product.Service';
import { RevisionsOvenProducts } from '../Models/Entity/Revisions.Oven.Products';
import { Process } from '../Models/Entity/Process';
import { ProcessService } from '../Services/Process.Service';
import { Conditioning } from '../Models/Entity/Conditioning';
import { ConditioningService } from '../Services/Conditioning.Service';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { SausagedService } from '../Services/Sausaged.Service';
import { TenderizedService } from '../Services/Tenderized.Service';
import Excel4Node from "../Utils/Excel.Helper" 
import * as os from "os";
import * as fs from "fs";
import { Packaging } from '../Models/Entity/Packaging';
import { PackagingService } from '../Services/Packaging.Service';
import { ProductRoviandaService } from '../Services/Product.Rovianda.Service';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import _ = require('lodash');
import { DryingLabel } from '../Models/Entity/Dryng.Label';
import { DryngLabelService } from '../Services/Dring.Label.Service';
import { ProductService } from '../Services/Product.Services';
import { OrderSeller } from '../Models/Entity/Order.Seller';

export class ReportController{

    private entranceDriefService: EntranceDriefService;
    private entranceMeatService:EntranceMeatService;
    private userService: UserService;
    private formulationService: FormulationService
    private warehouseDriefService: WarehouseDriefService;
    private entrancePackingService: EntrancePackingService;
    private ovenService:OvenService;
    private revisionOvenProductService:RevisionOvenProductService;
    private processService:ProcessService;
    private conditioningService:ConditioningService;
    private sausagedService:SausagedService;
    private tenderizedService:TenderizedService;
    private packagingService:PackagingService;
    private productRoviandaService:ProductRoviandaService;
    private dryingLabelService: DryngLabelService;
    private productService: ProductService;
    private pdfHelper: PdfHelper;
    private excel: Excel4Node;
    constructor(private firebaseInstance:FirebaseHelper){
        this.entranceDriefService = new EntranceDriefService(this.firebaseInstance);
        this.entranceMeatService = new EntranceMeatService(this.firebaseInstance);
        this.userService = new UserService(this.firebaseInstance);
        this.formulationService = new FormulationService();
        this.warehouseDriefService = new WarehouseDriefService();
        this.entrancePackingService = new EntrancePackingService();
        this.ovenService = new OvenService();
        this.revisionOvenProductService = new RevisionOvenProductService();
        this.processService = new ProcessService(this.firebaseInstance);
        this.conditioningService = new ConditioningService();
        this.sausagedService = new SausagedService();
        this.tenderizedService = new TenderizedService();
        this.packagingService = new PackagingService();
        this.productRoviandaService = new ProductRoviandaService(this.firebaseInstance);
        this.dryingLabelService = new DryngLabelService();
        this.productService = new ProductService();
        this.pdfHelper = new PdfHelper();
        this.excel = new Excel4Node();
    }

    async reportEntranceDrief(req:Request, res:Response){ 
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let drief:EntranceDrief = await this.entranceDriefService.reportEntranceDrief(+req.params.driefId);
        let report = await this.pdfHelper.reportEntranceDrief(user,drief);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteSecos.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportDryinById(req: Request, res: Response){
        let { dryingId } = req.params;
        let drying: DryingLabel = await this.dryingLabelService.getDryngById(+dryingId);
        let product = await this.productRoviandaService.getById(+drying.productId);
        let report = this.pdfHelper.reportDryingLaberById(product, drying);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporte-drying.pdf`
            });
            stream.pipe(res);
        }))


    }

    async reportFormulation(req:Request, res:Response){
        let formulation:Formulation = await this.formulationService.reportFormulation(+req.params.formulationId);
        let formulationIngredents:FormulationIngredients[] = await this.formulationService.reportFormulationIngredents(+req.params.formulationId)
        let report = await this.pdfHelper.reportFormulation(formulation,formulationIngredents);
        pdf.create(report, {
            format: 'Legal',
            orientation:"landscape",
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteFormulacion.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportDocumentFormulation(req:Request, res:Response){
        let tmp = os.tmpdir();
        let formulation:Formulation = await this.formulationService.reportFormulation(+req.params.formulationId);
        let formulationIngredents:FormulationIngredients[] = await this.formulationService.reportFormulationIngredents(+req.params.formulationId)
        
        let workbook = this.excel.generateFormulationDocumentById(formulation, formulationIngredents);
        
        workbook.write(`${tmp}/formulation-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="formulation-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/formulation-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/formulation-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }
  
  async reportEntranceMeat(req:Request, res:Response){ 
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let meat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(+req.params.meatId);
        let report = await this.pdfHelper.reportEntranceMeat(user,meat);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteCarnicos.pdf`
            });
            stream.pipe(res);
        }))
    }

    async reportEntrancePacking(req:Request, res:Response){
        let packin:EntrancePacking = await this.entrancePackingService.getReportPacking(+req.params.pakingId);
        let report = await this.pdfHelper.reportEntrancePacking(packin);
        pdf.create(report, {
            format:'Letter',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetado.pdf`

            });
            stream.pipe(res);
        }))
    }
  
    async documentReportEntrancePackingById(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let tmp = os.tmpdir(); 
        
        let packing:EntrancePacking = await this.entrancePackingService.getReportPacking(+req.params.pakingId);
    
        let workbook = this.excel.generatePackingDocumentById(user,packing); 
    
        workbook.write(`${tmp}/Reporte-Entrada-Paquetes.xlsx`,(err, stats)=>{ 
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-Entrada-Paquetes.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-Entrada-Paquetes.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Entrada-Paquetes.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }

    async reportWarehouseDrief(req:Request, res:Response){
        let dateInit = req.query.initDate;
        let dateEnd = req.query.finalDate;
        let data:WarehouseDrief[] = await this.warehouseDriefService.getDataReport(dateInit,dateEnd);
        let report = await this.pdfHelper.reportWarehouseDrief(data);
        pdf.create(report, {
            format: 'Legal',
            header: {
                height: "30px"
            },
            footer: {
                height: "22mm"
          },
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportAlmacenSecos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportDocumentWarehouseDrief(req:Request, res:Response){
        let dateInit = req.query.initDate;
        let dateEnd = req.query.finalDate;
        let tmp = os.tmpdir();
        let data:WarehouseDrief[] = await this.warehouseDriefService.getDataReport(dateInit,dateEnd);
        
        let workbook = this.excel.generateReportWarehouseDrief(data); 

        workbook.write(`${tmp}/reporte-almacen-secos.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="reporte-almacen-secos.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/reporte-almacen-secos.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/reporte-almacen-secos.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }

    async reportOven(req:Request, res:Response){
        let revisionOven:OvenProducts = await this.ovenService.getDataReport(req.params.ovenId);
        let dataRevision:RevisionsOvenProducts[] = await this.revisionOvenProductService.getDataReport(revisionOven.id);
        let report = await this.pdfHelper.reportOven(revisionOven,dataRevision);
        pdf.create(report, {
            format: 'Letter',
            zoomFactor: "0",
            border: {
              top: "1.2cm",
              right: "1cm",
              bottom: "0.5cm",
              left: "1.5cm",
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportOven.pdf`
            });
            stream.pipe(res);
        }));
    }

    async documentReportOvenById(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let tmp = os.tmpdir(); 
        
        let revisionOven:OvenProducts = await this.ovenService.getDataReport(req.params.ovenId);
        let dataRevision:RevisionsOvenProducts[] = await this.revisionOvenProductService.getDataReport(revisionOven.id);
    
        let workbook = this.excel.generateOvenProductsDocumentsById(revisionOven,dataRevision); 
    
        workbook.write(`${tmp}/Reporte-Horno.xlsx`,(err, stats)=>{ 
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-Horno.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-Horno.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Horno.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })
    }
    
    async reportFormularionByDate(req: Request, res:Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let {iniDate, finDate} = req.params;

        let formulations = await this.formulationService.getFormulartionByDates(iniDate, finDate);
        

        let html = this.pdfHelper.generateFormulationReport(formulations);
        pdf.create(html, {
            format: 'Legal',
            border: {
                top: "1cm", 
                right: "2cm",
                bottom: "2cm",
                left: "2cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reportFormulation.pdf`
            });
            stream.pipe(res);
        }));
    }
//crear proceso tomar lote interno

//regresar por tipo de area
    async reportEntryDriefByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysDriefs:EntranceDrief[] = await this.entranceDriefService.reportEntrancesDriefs(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryDriefs(user,entrysDriefs);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "2cm",
                left: "1cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEntradaSecos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportEntryMeatByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysMeats:EntranceMeat[] = await this.entranceMeatService.reportEntrancesMeats(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryMeats(user,entrysMeats);
        pdf.create(report, {
            format: 'Legal',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "1cm",
                left: "1cm"
            },
            footer: {
                height: "10mm",
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEntradaCarnicos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportDocumentEntryMeatByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let tmp = os.tmpdir();
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysMeats:EntranceMeat[] = await this.entranceMeatService.reportEntrancesMeats(dateInit,dateEnd);
        let workbook =  this.excel.generateEntryMeatsDocumentByDate(user,entrysMeats);

        workbook.write(`${tmp}/entry-meat-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="entry-meat-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/entry-meat-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/entry-meat-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            });
        });
    }

    async reportEntryPackingByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let entrysPacking:EntrancePacking[] = await this.entrancePackingService.getReportEntrysPacking(dateInit,dateEnd);
        let report = await this.pdfHelper.reportEntryPacking(user,entrysPacking);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "1cm",
                left: "1cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEntradaPaquetes.pdf`
            });
            stream.pipe(res);
        }));

    }

    async reportOvenByDates(req:Request, res:Response){
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let oven:OvenProducts[] = await this.ovenService.getReportOvenProducts(dateInit,dateEnd);
        let userElaborated:User= await this.userService.getUserByName(oven[0].nameElaborated);
        let userVerify:User= await this.userService.getUserByName(oven[0].nameVerify);
        let report = await this.pdfHelper.reportOvenProducts(userElaborated,userVerify,oven);
        pdf.create(report, {
            format: 'Letter',
            border: {
                top: "1cm", 
                right: "1cm",
                bottom: "1cm",
                left: "1cm"
            }
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteHornos.pdf`
            });
            stream.pipe(res);
        }));
    }

    async documentReportOvenByDates(req:Request, res:Response){
        let tmp = os.tmpdir();
        let dateInit = req.params.iniDate;
        let dateEnd = req.params.finDate;
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let oven:OvenProducts[] = await this.ovenService.getReportOvenProducts(dateInit,dateEnd);

        let workbook = this.excel.generateOvenProductsDocumentsByDate(oven); 
        console.log(oven);

        workbook.write(`${tmp}/oven-products-report.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="oven-products-report.xlsx"'
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");
              res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/oven-products-report.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/oven-products-report.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        })

        
    }

    async reportProcess(req:Request, res:Response){
        let process:Process = await this.processService.getProcessById(+req.params.processId);
                    
        let report = await this.pdfHelper.reportProcess(process);
        pdf.create(report, {
            format: 'legal',
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
                'Content-disposition': `attachment; filename=reporteProceso.pdf`
            });
            stream.pipe(res);
        }));
    }

    async reportDocumentProcess(req:Request, res:Response){
        let process:Process = await this.processService.getProcessById(+req.params.processId);
        let tmp = os.tmpdir();
        let conditioning:Conditioning = new Conditioning();
        let sausaged:Sausaged = new Sausaged();
        let tenderized:Tenderized= new Tenderized();
        
      /*  if(process.conditioningId == null){
            conditioning = null;
        }else{
            conditioning = await this.conditioningService.getConditioningByProcessId(+process.conditioningId.id);
        }      
        if(process.sausageId == null){
            sausaged = null;
        }else{
            sausaged = await this.sausagedService.getSausagedByProcessId(+process.sausageId.id);
        }    
        if(process.tenderizedId == null){
            tenderized = null;
        }else{
            tenderized = await this.tenderizedService.getTenderizedByProcessId(+process.tenderizedId.id);
        }  */                                                                  
        let workbook = this.excel.generateReportProcess(process, conditioning, sausaged, tenderized); 
        workbook.write(`${tmp}/Reporte-procesos.xlsx`,(err, stats)=>{
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",
                'inline; filename="Reporte-procesos.xlsx"'
            );
            res.setHeader("Content-Type", "application/vnd.ms-excel");
            res.status(200); 
            console.log(stats);
            return res.download(`${tmp}/Reporte-procesos.xlsx`,(er) =>{ 
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-procesos.xlsx"}`);
                fs.unlinkSync(`${tmp}/imageTmp.png`);
            })
        });
    }

    async documentReportFormulationByDates(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let {iniDate, finDate} = req.params;
        let tmp = os.tmpdir(); //se obtiene la carpeta temporal ya que las cloudfunctions solo permiten escritura en carpeta tmp

        let formulations = await this.formulationService.getFormulartionByDates(iniDate, finDate);

        let workbook = this.excel.generateFormulationDocumentByDates(formulations); // se llama a la utileria con los mismos datos que se envian al reporte html

        workbook.write(`${tmp}/formulation-report.xlsx`,(err, stats)=>{//workbook escribe y permite un callback
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",//se pone un tipo de cabecera
                'inline; filename="formulation-report.xlsx"'//para indicar a front el nombre del archivo
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");// se añade cabecera para permitir excel
              res.status(200); 
            console.log(stats);//stats solo trae informacion de la creacion del archivo
            return res.download(`${tmp}/formulation-report.xlsx`,(er) =>{ //response.download manda un documento para ser descargado en el response
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/formulation-report.xlsx"}`);//aunque en la carpeta tmp no sea necesario eliminar archivos es mejor hacerlo para no aumentar el peso de las cloud functions    
                fs.unlinkSync(`${tmp}/imageTmp.png`);//borrar aqui la imagen temporal si no, dara error al generar el documento y no encontrar la imagen
            })
        })
    }


    async documentReportPackingByDates(req: Request, res: Response){
        let user:User = await this.userService.getUserByUid(req.query.uid);
        let {iniDate, finDate} = req.params;
        let tmp = os.tmpdir(); //se obtiene la carpeta temporal ya que las cloudfunctions solo permiten escritura en carpeta tmp

        let entrysPacking:EntrancePacking[] = await this.entrancePackingService.getReportEntrysPacking(iniDate,finDate);
        
        let workbook = this.excel.generatePackingDocumentByDates(user,entrysPacking); // se llama a la utileria con los mismos datos que se envian al reporte html

        workbook.write(`${tmp}/Reporte-Empaques.xlsx`,(err, stats)=>{//workbook escribe y permite un callback
            if(err){
                console.log(err);
            }
            res.setHeader(
                "Content-disposition",//se pone un tipo de cabecera
                'inline; filename="Reporte-Empaques.xlsx"'//para indicar a front el nombre del archivo
              );
              res.setHeader("Content-Type", "application/vnd.ms-excel");// se añade cabecera para permitir excel
              res.status(200); 
            console.log(stats);//stats solo trae informacion de la creacion del archivo
            return res.download(`${tmp}/Reporte-Empaques.xlsx`,(er) =>{ //response.download manda un documento para ser descargado en el response
                if (er) console.log(er);
                fs.unlinkSync(`${tmp+"/Reporte-Empaques.xlsx"}`);//aunque en la carpeta tmp no sea necesario eliminar archivos es mejor hacerlo para no aumentar el peso de las cloud functions    
                fs.unlinkSync(`${tmp}/imageTmp.png`);//borrar aqui la imagen temporal si no, dara error al generar el documento y no encontrar la imagen
            })
        })
    }


 async documentReportEntryDriefsByDates(req: Request, res: Response){
    let user:User = await this.userService.getUserByUid(req.query.uid);
    let {iniDate, finDate} = req.params;
    let tmp = os.tmpdir();

    let entrysDriefs:EntranceDrief[] = await this.entranceDriefService.reportEntrancesDriefs(iniDate,finDate);
    
    let workbook = this.excel.generateEntrysDriefsDocumentByDates(user,entrysDriefs); 
    workbook.write(`${tmp}/Reporte-Entrada-Secos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Secos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Secos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Secos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async documentReportEntryMeatById(req: Request, res: Response){
    let user:User = await this.userService.getUserByUid(req.query.uid);
    let tmp = os.tmpdir();

    let entrysMeat:EntranceMeat = await this.entranceMeatService.reportEntranceMeat(+req.params.meatId);
    
    let workbook = this.excel.generateEntryMeatDocumentById(user,entrysMeat); 
    workbook.write(`${tmp}/Reporte-Entrada-Carnicos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Carnicos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Carnicos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Carnicos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async documentReportEntryDriefById(req: Request, res: Response){
    let user:User = await this.userService.getUserByUid(req.query.uid);
    let tmp = os.tmpdir();

    let drief:EntranceDrief = await this.entranceDriefService.reportEntranceDrief(+req.params.driefId);
    
    let workbook = this.excel.generateEntryDriefDocumentById(user,drief); 
    workbook.write(`${tmp}/Reporte-Entrada-Secos.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Entrada-Secos.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Entrada-Secos.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Entrada-Secos.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
  }

  async reportPackagingById(req:Request,res:Response){
    let packagingId = req.params.packaginId;

    let packaging:Packaging = await this.packagingService.getPackagingById(+packagingId);
    let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(packaging);
    let report = await this.pdfHelper.reportPackagingById(packaging,properties);
    pdf.create(report, {
        format: 'Legal',
        orientation:'landscape',
        border: {
            top: "2cm", 
            right: "2cm",
            bottom: "1cm",
            left: "2cm"
        }
        
    }).toStream((function (err, stream) {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'responseType': 'blob',
            'Content-disposition': `attachment; filename=reporteEmpaquetadoPDF.pdf`
        });
        stream.pipe(res);
    }));
}

async reportDocumentPackagingById(req:Request,res:Response){
    let packagingId = req.params.packaginId;

    let user:User = await this.userService.getUserByUid(req.query.uid);
    let tmp = os.tmpdir();

    let packaging:Packaging = await this.packagingService.getPackagingById(+packagingId);
    let properties: PropertiesPackaging[] = await this.packagingService.getPackagingPropertiesById(packaging);
    let presentations:PresentationProducts[] = await this.productRoviandaService.getProductsPresentation(+packaging.productId.id)
    
    let workbook = this.excel.generatePackagingDocumentById(packaging,properties,presentations); 
    workbook.write(`${tmp}/Reporte-Rebanado-Empacado.xlsx`,(err, stats)=>{
        if(err){
            console.log(err);
        }
        res.setHeader(
            "Content-disposition",
            'inline; filename="Reporte-Rebanado-Empacado.xlsx"'
          );
          res.setHeader("Content-Type", "application/vnd.ms-excel");
          res.status(200); 
        console.log(stats);
        return res.download(`${tmp}/Reporte-Rebanado-Empacado.xlsx`,(er) =>{ 
            if (er) console.log(er);
            fs.unlinkSync(`${tmp+"/Reporte-Rebanado-Empacado.xlsx"}`);
            fs.unlinkSync(`${tmp}/imageTmp.png`);
        })
    });
}

    async getReportPackagingDelivered(req:Request,res:Response){
        let orderSellerId:number = +req.params.orderSellerId;
        let mode=req.query.mode;
        let report:string = await this.packagingService.getReportOfDeliveredSeller(orderSellerId,mode);
        pdf.create(report, {
            format: 'Legal',
            border: {
                top: "2cm", 
                right: "1cm",
                bottom: "2cm",
                left: "1cm"
            }
            
        }).toStream((function (err, stream) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'responseType': 'blob',
                'Content-disposition': `attachment; filename=reporteEmpaquetadoAVendedorPDF.pdf`
            });
            stream.pipe(res);
        }));
    }

}