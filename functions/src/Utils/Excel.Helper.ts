
import * as excel from "excel4node";
import Logo from "../Models/Logo";
import * as fs from "fs";
import * as os from "os";
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { User } from "../Models/Entity/User";
import { OvenProducts } from "../Models/Entity/Oven.Products";
import { Formulation } from "../Models/Entity/Formulation";
import { FormulationIngredients } from "../Models/Entity/Formulation.Ingredients";
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { WarehouseDrief } from "../Models/Entity/Warehouse.Drief";
import { Packaging } from '../Models/Entity/Packaging';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { Process } from "../Models/Entity/Process";

import { Inspection } from "../Models/Entity/Inspection";
import { UserRepository } from "../Repositories/User.Repository";
import { PresentationsProductsRepository } from "../Repositories/Presentation.Products.Repository";
import { SalesRequestRepository } from "../Repositories/SalesRequest.Repostitory";
import { SubOrderMetadataRepository } from "../Repositories/SubOrder.Metadata.Repository";
import { SalesSellerRepository } from "../Repositories/SaleSeller.Repository";
import { SubOrderMetadata } from "../Models/Entity/SubOrder.Sale.Seller.Metadata";
import { LotsStockInventoryPresentation, OutputsDeliveryPlant } from "../Models/DTO/PackagingDTO";
import { DeliverToWarehouse } from "../Services/Packaging.Service";
import { ProductInfoFromPackDefrostTrazability, ProductInfoFromPackIngredientsTrazability, ProductInfoFromPackTrazability } from "../Models/DTO/Quality.DTO";
import { ClientItemBySeller, ClientVisitData } from "../Models/DTO/Client.DTO";
import { SellerClientScheduleData, SellerReportSoldPeriod, SellerSoldPeriod, SellerVisit } from "../Models/SellerReportRequests";
import { DailyReportRecord, DailyReportSalesADayRecord, EffectiveDeliverPreSalesReport, VisitDailyRecord } from "../Models/DTO/DailyReport";
import { getParseAddress, getParseDays } from "./Pdf.Helper";


export default class Excel4Node{
    private userRepository:UserRepository;
    private presentationProductRepository:PresentationsProductsRepository;
    private subOrdersRepository:SalesRequestRepository;
    private subOrdersMetadataRepository:SubOrderMetadataRepository;
    private orderSellerRepository:SalesSellerRepository;
    constructor(){
        this.userRepository = new UserRepository();
        this.presentationProductRepository = new PresentationsProductsRepository();
        this.subOrdersRepository = new SalesRequestRepository();
        this.subOrdersMetadataRepository = new SubOrderMetadataRepository();
        this.orderSellerRepository = new SalesSellerRepository();
    }

    generateFormulationDocumentByDates(formulationData: Formulation[]){
        console.log(formulationData);
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); // se inicializa un workbook (archivo de excel)

        let worksheet = workbook.addWorksheet('Formulation'); //Se añade una hoja de calculo y se pasa el nombre por parametro

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');// Se convierte a buffer el base64 (solo el base64 no la informacion de tipo de archivo)

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);//Se crea el archivo imagen en la carpeta temporal

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 6, 2, 10, true).string("BITACORA DE CONTROL DE CALIDAD FORMULACION").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });
        let row = 4;

        formulationData.forEach(formulation =>{
            worksheet.cell(row, 5, row, 8, true).string(`Realizo, Nombre:  ${formulation.make? formulation.make.name : ""}`).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento

        worksheet.cell(++row, 5, row, 8, true).string("Firma:  ").style(styleUser);

        worksheet.cell(++row, 5, row, 8, true).string(`Puesto:  ${formulation.make? formulation.make.job : ""}`).style(styleUser);
           
        worksheet.cell(++row, 4, row, 5, true).string("Producto").style(style);
        worksheet.cell(row, 6, row, 7, true).string("Lote").style(style);
        worksheet.cell(row, 8, row, 9, true).string("Temperatura carne").style(style);
        worksheet.cell(row, 10, row, 11, true).string("Temperatura agua").style(style);
        worksheet.cell(row, 12, row, 13, true).string("Ingredientes").style(style);
        worksheet.cell(row, 14, row, 15, true).string("Fechas").style(style);
        
        let col = 4;

        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal

        
            worksheet.cell(++row, col, row, ++col, true).string(`${formulation.productRovianda.name}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.lotDay}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.temp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.waterTemp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.ingredients[0] ? formulation.ingredients[0].product.description : ""}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.date}`).style(style);
            for (let i = 1; i < formulation.ingredients.length; i++) {
                col = 4;
                row++;
                worksheet.cell(row, col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.ingredients[i].product.description}`).style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
            }

        worksheet.cell(++row, 4, row, 7,true).string(`Verificó, Nombre:  ${formulation.verifit ? formulation.verifit.name : ""}`).style(styleUser);

        worksheet.cell(row, 8, row, 9, true).string("Firma:  ").style(styleUser);

        worksheet.cell(row, 10, row, 11, true).string(`Puesto:  ${formulation.verifit ? formulation.verifit.job : ""}`).style(styleUser);


            row++;
        });
        
        return workbook;//se retorna el workbook
    }
  
    async generateEndedProductReportDocument(items:{ovenProduct:OvenProducts,inspection:Inspection[]}[]){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('Producto Terminado'); //Se añade una hoja de calculo y se pasa el nombre por parametro

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');// Se convierte a buffer el base64 (solo el base64 no la informacion de tipo de archivo)

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);//Se crea el archivo imagen en la carpeta temporal

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 5, 2, 11, true).string("BITACORA DE CONTROL DE PRODUCTO TERMINADO").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });

        

        let row = 9;
        let col = 4;

        for (let i = 0; i < items.length; i++) {
            for(let inspection of items[i].inspection){
                let totalLot:number = +inspection.numberPackages;
                let userInspector:User = await this.userRepository.getUserById(inspection.userIspector);
                let presentationProduct  = await this.presentationProductRepository.getPresentationProductsById(inspection.presentationId);
                console.log(inspection.productId.name,inspection.productId.id,presentationProduct.presentationType,presentationProduct.id);
                let subOrders =  await this.subOrdersRepository.getByProductAndPresentation(inspection.productId,presentationProduct,false);
                console.log("Suborders: "+subOrders.length);
                let subOrdersIds = subOrders.map(x=>x.subOrderId);
                let subOrdersMetadata:SubOrderMetadata[] = await this.subOrdersMetadataRepository.findBySubOrdersIdsAndLotId(subOrdersIds,inspection.lotId);
                for(let subOrderM of subOrdersMetadata){
                    let subOrder = await this.subOrdersRepository.getSubOrderById(subOrderM.subOrder.subOrderId);
                    subOrderM.subOrder = subOrder;
                    let orderSeller = await this.orderSellerRepository.getOrderById(subOrder.orderSeller.id);
                    subOrderM.subOrder.orderSeller = orderSeller;
                }
            worksheet.cell(row, col, row, col+2, true).string(`Nombre: ${ userInspector.name }`).style(styleUser);
            worksheet.cell(row+1, col, row+1, col+2, true).string("Firma:  ").style(styleUser);
            worksheet.cell(row+2, col, row+2, col+2, true).string(`Puesto: ${userInspector.job }`).style(styleUser);
    
            
            worksheet.cell(row+3, col, row+3, col+2, true).string(`Producto: ${inspection.productId.name} ${presentationProduct.presentationType} `).style(style);
            worksheet.cell(row+3, col+1, row+3, col+1, true).string(`Lote y caducidad: `).style(style);
            worksheet.cell(row+3, col+2, row+3, col+2, true).string(`Fecha de ingreso: ${inspection.expirationDate}`).style(style);
            worksheet.cell(row+4, col,  row+4, col,   true).string("Número de paquetes o piezas: "+inspection.numberPackages).style(style);
    
            worksheet.cell(row+5, col,   row+5, col,   true).string("Control").style(style);
            worksheet.cell(row+5, col+1, row+5, col+1, true).string("Estandar").style(style);
            worksheet.cell(row+5, col+2, row+5, col+2, true).string("Aceptado").style(style);
            worksheet.cell(row+5, col+3, row+5, col+3, true).string("Rechazado").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string("Observaciones").style(style);
            
            worksheet.cell(row+6, col,   row+6, col,   true).string("Empaque").style(style);
            worksheet.cell(row+6, col+1, row+6, col+1, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+2, row+6, col+2, true).string(` ${inspection.packagingControl==true? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+3, row+6, col+3, true).string(` ${inspection.packagingControl==false? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(`  `).style(style);
            
            worksheet.cell(row+7, col,   row+7, col,   true).string("Materia extraña").style(style);
            worksheet.cell(row+7, col+1, row+7, col+1, true).string("Ausente").style(style);
            worksheet.cell(row+7, col+2, row+7, col+2, true).string(` ${inspection.foreingMatter==true? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+3, row+7, col+3, true).string(` ${inspection.foreingMatter==false? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(`  `).style(style);

            worksheet.cell(row+8, col,   row+8, col,   true).string("Transporte").style(style);
            worksheet.cell(row+8, col+1, row+8, col+1, true).string("Limpio").style(style);
            worksheet.cell(row+8, col+2, row+8, col+2, true).string(` ${inspection.transport==true? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+3, row+8, col+3, true).string(` ${inspection.transport==false? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+4, row+8, col+4, true).string(`  `).style(style);


            worksheet.cell(row+9, col,   row+9, col,   true).string("Peso por pieza").style(style);
            worksheet.cell(row+9, col+1, row+9, col+1, true).string("Según empaque").style(style);
            worksheet.cell(row+9, col+2, row+9, col+2, true).string(` ${inspection.weightPerPiece==true? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+3, row+9, col+3, true).string(` ${inspection.weightPerPiece==false? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+4, row+9, col+4, true).string(`  `).style(style);

            worksheet.cell(row+10, col,   row+10, col,   true).string("Peso por pieza").style(style);
            worksheet.cell(row+10, col+1, row+10, col+1, true).string("Según empaque").style(style);
            worksheet.cell(row+10, col+2, row+10, col+2, true).string(` ${inspection.weightPerPiece==true? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+3, row+10, col+3, true).string(` ${inspection.weightPerPiece==false? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+4, row+10, col+4, true).string(`  `).style(style);

            worksheet.cell(row+11,col,row+11,col,true).string("Día de salida").style(style);
            worksheet.cell(row+11,col+1,row+11,col+1,true).string("Cliente o vendedor").style(style);
            worksheet.cell(row+11,col+2,row+11,col+2,true).string("Cantidad entregada").style(style);
            worksheet.cell(row+11,col+3,row+11,col+3,true).string("Cantidad del lote").style(style);
            row=row+12;
            
            for(let subOrderM of subOrdersMetadata){
                totalLot-=subOrderM.quantity;

                worksheet.cell(row,col,row,col,true).string(subOrderM.outputDate.split("T")[0]).style(style);
                worksheet.cell(row,col+1,row,col+1,true).string(subOrderM.subOrder.orderSeller.seller.name).style(style);
                worksheet.cell(row,col+2,row,col+2,true).string(`${subOrderM.quantity}`).style(style);
                worksheet.cell(row,col+3,row,col+3,true).string(`${totalLot}`).style(style);
                row++;
                
            }
            
            row = row + 7; 
            }

        }
        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal
        

        return workbook;//se retorna el workbook
    }
    generatePackingDocumentByDates(user:User,data:EntrancePacking[]){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('Packaging'); //Se añade una hoja de calculo y se pasa el nombre por parametro

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');// Se convierte a buffer el base64 (solo el base64 no la informacion de tipo de archivo)

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);//Se crea el archivo imagen en la carpeta temporal

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 5, 2, 11, true).string("BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${data[0].make ? data[0].make.name: "" }`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${data[0].make ? data[0].make.job : "" }`).style(styleUser);

        let row = 9;
        let col = 4;

        for (let i = 0; i < data.length; i++) {
       
            worksheet.cell(row, col, row, col+2, true).string(`Materia prima: ${data[i].product.description} `).style(style);
            worksheet.cell(row, col+3, row+1, col+3, true).string(`Lote proveedor: ${data[i].loteProveedor}`).style(style);
            worksheet.cell(row, col+4, row+1, col+4, true).string(`Fecha: ${data[i].date}`).style(style);
            worksheet.cell(row+1, col, row+1, col+2, true).string(`Proveedor: ${data[i].proveedor}`).style(style);
    
            worksheet.cell(row+2, col,   row+2, col,   true).string("Control").style(style);
            worksheet.cell(row+2, col+1, row+2, col+1, true).string("Estandar").style(style);
            worksheet.cell(row+2, col+2, row+2, col+2, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+3, row+2, col+3, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col,   true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+1, row+3, col+1, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+2, row+3, col+2, true).string(` ${data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+3, row+3, col+3, true).string(` ${!data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data[i].observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col,   true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+1, row+4, col+1, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+2, row+4, col+2, true).string(` ${data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+3, row+4, col+3, true).string(` ${!data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col,   true).string("Transpote").style(style);
            worksheet.cell(row+5, col+1, row+5, col+1, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+2, row+5, col+2, true).string(` ${data[i].transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+3, row+5, col+3, true).string(` ${!data[i].transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col,   true).string("Empaque").style(style);
            worksheet.cell(row+6, col+1, row+6, col+1, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+2, row+6, col+2, true).string(` ${data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+3, row+6, col+3, true).string(` ${!data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(`  `).style(style);
            row = row + 7;
        }
        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal
        worksheet.cell(++row, 4, row, 6,true).string(`Verifico:  ${data[0].verifit == null ? "": data[0].verifit.name} `).style(styleUser);
        worksheet.cell(row, 7, row, 7, true).string("Firma:  ").style(styleUser);
        worksheet.cell(row, 8, row, 8, true).string(`Puesto: ${data[0].verifit == null ? "": data[0].verifit.job}`).style(styleUser);

        return workbook;//se retorna el workbook
    }
  
  generateFormulationDocumentById(formulation: Formulation, formulationIngredients: FormulationIngredients[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('OvenProducts'); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })

        worksheet.cell(1, 6, 1, 12, true).string("BITACORA DE CONTROL DE CALIDAD FORMULACION").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        worksheet.cell(4, 5, 4, 8, true).string(`Realizo, Nombre:  ${formulation.make.name}  `).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento

        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);

        worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${formulation.make.job}`).style(styleUser);

        worksheet.cell(9, 4, 9, 5, true).string("Producto").style(style);
        worksheet.cell(9, 6, 9, 7, true).string("Lote").style(style);
        worksheet.cell(9, 8, 9, 9, true).string("Temperatura carne").style(style);
        worksheet.cell(9, 10, 9, 11, true).string("Temperatura agua").style(style);
        worksheet.cell(9, 12, 9, 13, true).string("Ingredientes").style(style);
        worksheet.cell(9, 14, 9, 15, true).string("Fechas").style(style);

        let row = 10;
        let col = 4;

        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal

        // formulationIngredients.forEach((product) => {
            worksheet.cell(row, col, row, ++col, true).string(`${formulation.productRovianda.name}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.lotDay}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.temp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.waterTemp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulationIngredients[0].product.description}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${new Date(formulation.date).toLocaleDateString()}`).style(style);
            for (let i = 1; i < formulationIngredients.length; i++) {
                col = 4;
                row++;
                worksheet.cell(row, col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string(`${formulationIngredients[i].product.description}`).style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
            }
            col = 4;
            row ++; 
        // });

        worksheet.cell(++row, 4, row, 7,true).string(`Realizo, Nombre:  ${formulation.verifit.name} `).style(styleUser);

        worksheet.cell(row, 8, row, 9, true).string("Firma:  ").style(styleUser);

        worksheet.cell(row, 10, row, 11, true).string(`Puesto:  ${formulation.verifit.job}`).style(styleUser);



        return workbook;
    }
  
     generateReportWarehouseDrief(data: WarehouseDrief[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('WarehousDrief'); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(1, 6, 1, 12, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        worksheet.cell(2, 6, 2, 12, true).string("BITACORA DE CONTROL DE PEP´S ALMACENES").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        let row = 5;
        worksheet.cell(3, 9, 4, 12, true).string(`ALMACEN:`).style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                vertical: 'center'
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            }
        });

        worksheet.cell(row, 4, row, 5, true).string(`Fecha de entrada`).style(styleUser);
        worksheet.cell(row, 6, row, 7, true).string(`Producto material`).style(styleUser);
        worksheet.cell(row, 8).string(`Lote`).style(styleUser);
        worksheet.cell(row, 9).string(`Cantidad`).style(styleUser);
        worksheet.cell(row, 10).string(`Unidad`).style(styleUser);
        worksheet.cell(row, 11, row, 13, true).string(`Observaciones`).style(styleUser);

        data.forEach(wd => {
            worksheet.cell(++row, 4, row, 5, true).string(`${new Date(wd.date).toLocaleDateString()}`).style(style);
            worksheet.cell(row, 6, row, 7, true).string(`${wd.product.description}`).style(style);
            worksheet.cell(row, 8).string(`${wd.loteProveedor}`).style(style);
            worksheet.cell(row, 9).string(`${wd.quantity}`).style(style);
            worksheet.cell(row, 10).string(``).style(style);
            worksheet.cell(row, 11, row, 13, true).string(`${wd.observations}`).style(style);
        });
        row++;
        worksheet.cell(row, 11, row, 13, true).string(`F-TZR-ROV-01`).style(styleUser);


        return workbook;
    }
  
    generateOvenProductsDocumentsByDate(data: OvenProducts[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        
        let worksheet = workbook.addWorksheet('oven-product'); 
        let row = 1;

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: row, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: (row+8), 
                    rowOff: '0.1in',
                  }
              }
          });

          worksheet.cell(row, 6, row, 12, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });
        row+=3;
        worksheet.cell(row, 6, row, 12, true).string("CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        data.forEach((ovenProduct,index) => {

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        

        row = row+5;

            worksheet.cell(row, 11, row, 13, true).string(`Tiempo estimado: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(++row, 4, row, 6, true).string(`Producto: ${ovenProduct.product.name}`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`PCC: ${ovenProduct.pcc}`).style(styleUser);
            worksheet.cell(row, 9, row, 11, true).string(`Fecha: ${ovenProduct.date}`).style(styleUser);
            worksheet.cell(row, 12, row, 13, true).string(`PCC = 70°`).style(styleUser);

            worksheet.cell(++row, 4).string(`Hora`).style(styleUser);
            worksheet.cell(row, 5, row, 6, true).string(`Temperatura interna del producto`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`Temperatura del horno`).style(styleUser);
            worksheet.cell(row, 9).string(`Humedad`).style(styleUser);
            worksheet.cell(row, 10, row, 13, true).string(`Observaciones`).style(styleUser);

            for(let i = 0 ; i < ovenProduct.revisions.length ; i++){
                worksheet.cell(++row, 4).string(`${ovenProduct.revisions[i].hour}`).style(style);
                worksheet.cell(row, 5, row, 6, true).string(`${ovenProduct.revisions[i].interTemp}`).style(style);
                worksheet.cell(row, 7, row, 8, true).string(`${ovenProduct.revisions[i].ovenTemp}`).style(style);
                worksheet.cell(row, 9).string(`${ovenProduct.revisions[i].humidity}`).style(style);
                worksheet.cell(row, 10, row, 13, true).string(`${ovenProduct.revisions[i].observations}`).style(style);
            }
            row+=2;



        worksheet.cell(++row, 4,row, 8, true).string(`Elaboró: ${ovenProduct.nameElaborated}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobElaborated}`).style(style);

        worksheet.cell(++row, 4,row, 8, true).string(`Revisó: ${ovenProduct.nameCheck}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobCheck}`).style(style); 

        worksheet.cell(++row, 4,row, 8, true).string(`Verificó: ${ovenProduct.nameVerify}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobVerify}`).style(style); 
        row+=2;
        });
        return workbook;
    }

    generateEntrysDriefsDocumentByDates(user:User,data:EntranceDrief[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Entrances-Driefs');
        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 4, 2, 11, true).string("RECEPCIÓN DE MATERIA PRIMA SECOS").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre:  ${user.name} `).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${user.job}`).style(styleUser);
  
        let row = 9;
        let col = 3;

        for (let i = 0; i < data.length; i++) {
       
            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data[i].product.description} `).style(style);
            worksheet.cell(row+1, col,   row+1, col+3, true).string(`Proveedor: ${data[i].proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data[i].loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${data[i].date}`).style(style);
           
            worksheet.cell(row+2, col,   row+2, col+1, true).string("Control").style(style);
            worksheet.cell(row+2, col+2, row+2, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+5, row+2, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+6, row+2, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data[i].observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data[i].transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data[i].transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

            worksheet.cell(row+7, col,   row+7, col+1, true).string("Olor").style(style);
            worksheet.cell(row+7, col+2, row+7, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(` ${data[i].odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+5, row+7, col+5, true).string(` ${!data[i].odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+6, row+7, col+7, true).string(`  `).style(style);

            worksheet.cell(row+8, col,   row+8, col+1, true).string("Color").style(style);
            worksheet.cell(row+8, col+2, row+8, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+8, col+4, row+8, col+4, true).string(` ${data[i].color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+5, row+8, col+5, true).string(` ${!data[i].color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+6, row+8, col+7, true).string(`  `).style(style);

            worksheet.cell(row+9, col,   row+9, col+1, true).string("Textura").style(style);
            worksheet.cell(row+9, col+2, row+9, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+9, col+4, row+9, col+4, true).string(` ${data[i].texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+5, row+9, col+5, true).string(` ${!data[i].texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+6, row+9, col+7, true).string(`  `).style(style);

            worksheet.cell(row+10, col,   row+10, col+1, true).string("Peso").style(style);
            worksheet.cell(row+10, col+2, row+10, col+3, true).string("Según Empaque").style(style);
            worksheet.cell(row+10, col+4, row+10, col+4, true).string(` ${data[i].weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+5, row+10, col+5, true).string(` ${!data[i].weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+6, row+10, col+7, true).string(`  `).style(style);
            row = row + 11;
        }
        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal
        worksheet.cell(++row, 9, row, 10,true).string("F-CAL-RO-02").style(style);
        return workbook;//se retorna el workbook
    }


    generateOvenProductsDocumentsById(ovenProduct:OvenProducts,revisionOven:RevisionsOvenProducts[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('OvenProductsById'); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(1, 6, 1, 12, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        worksheet.cell(3, 6, 3, 12, true).string("CONTROL DE TEMPERATURA DEL COCIMENTO DEL PRODUCTO").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        let row = 5;
            worksheet.cell(row, 11, row, 13, true).string(`Tiempo estimado: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(++row, 4, row, 6, true).string(`Producto: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`PCC: ${ovenProduct.pcc}`).style(styleUser);
            worksheet.cell(row, 9, row, 11, true).string(`Fecha: ${ovenProduct.date}`).style(styleUser);
            worksheet.cell(row, 12, row, 13, true).string(`PCC = 70°`).style(styleUser);

            worksheet.cell(++row, 4).string(`Hora`).style(styleUser);
            worksheet.cell(row, 5, row, 6, true).string(`Temperatura interna del producto`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`Temperatura del horno`).style(styleUser);
            worksheet.cell(row, 9).string(`Humedad`).style(styleUser);
            worksheet.cell(row, 10, row, 13, true).string(`Observaciones`).style(styleUser);

            for(let i = 0 ; i < revisionOven.length ; i++){
                worksheet.cell(++row, 4).string(`${revisionOven[i].hour}`).style(style);
                worksheet.cell(row, 5, row, 6, true).string(`${revisionOven[i].interTemp}`).style(style);
                worksheet.cell(row, 7, row, 8, true).string(`${revisionOven[i].ovenTemp}`).style(style);
                worksheet.cell(row, 9).string(`${revisionOven[i].humidity}`).style(style);
                worksheet.cell(row, 10, row, 13, true).string(`${revisionOven[i].observations}`).style(style);
            }
            row+=2;
       

        worksheet.cell(++row, 4,row, 8, true).string(`Elaboró: ${ovenProduct.nameElaborated} `).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobElaborated}`).style(style);

        worksheet.cell(++row, 4,row, 8, true).string(`Revisó: ${ovenProduct.nameCheck ? ovenProduct.nameCheck:" " } `).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobCheck ? ovenProduct.jobCheck : " " }`).style(style); 

        worksheet.cell(++row, 4,row, 8, true).string(`Verificó: ${ovenProduct.nameVerify} `).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobVerify}`).style(style); 

        return workbook;
    }
 
   generatePackingDocumentById(user:User,data:EntrancePacking){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Packaging');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor',
                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(2, 5, 2, 11, true).string("BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${data.make ? data.make.name: "" }`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${data.make ? data.make.job : "" }`).style(styleUser);
  
        
        let row = 9;
        let col = 3;
        let dateSplited = data.date.split("-");
        let dateStr = `${dateSplited[2]}/${dateSplited[1]}/${dateSplited[0]}`;
            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data.product.description} `).style(style);
            worksheet.cell(row+2, col,   row+2, col+3, true).string(`Proveedor: ${data.proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data.loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${dateStr}`).style(style);

            worksheet.cell(row+1, col,   row+2, col+1, true).string("Cantidad recibida: "+data.quantity+` ${data.isPz&&data.isBox?'Cajas':((data.isPz)?'Piezas':'Kg')} `).style(style);

            worksheet.cell(row+3, col,   row+3, col+1, true).string("Control").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(` ${data.observations} `).style(style);
            
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+6, col,   row+6, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data.transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data.transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

            worksheet.cell(row+7, col,   row+7, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+7, col+2, row+7, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(` ${data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+5, row+7, col+5, true).string(` ${!data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+6, row+7, col+7, true).string(`  `).style(style);

           worksheet.cell(row+9, 3, row+9, 5, true).string(`Verifico:  ${data.verifit == null ? "": data.verifit.name} `).style(styleUser);
           worksheet.cell(row+9, 6, row+9, 7, true).string("Firma:  ").style(styleUser);
           worksheet.cell(row+9, 8, row+9, 10, true).string(`Puesto:  ${data.verifit == null ? "": data.verifit.job}`).style(styleUser);
           worksheet.cell(row+10, 9, row+10, 10, true).string("F-CAL-RO-03").style(styleUser);
        return workbook;
    }

    generateEntryMeatDocumentById(user:User,data:EntranceMeat){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Entry-Meat');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
    
        worksheet.cell(4, 5, 4, 7, true).string("ROVIANDA S.A.P.I DE C.V").style(styleUser);
        worksheet.cell(4, 8, 4, 9, true).string("F-CAL-RO-04").style(styleUser);
        worksheet.cell(5, 5, 6, 7, true).string("RECEPCIÓN DE MATERIA PRIMA CÁRNICOS").style(styleUser);
        worksheet.cell(5, 8, 6, 8, true).string(`Lote interno: ${data.loteInterno}`).style(styleUser);
        worksheet.cell(5, 9, 6, 9, true).string("Pág.: 1 de 1").style(styleUser);
  
        let row = 9;
        let col = 3;

        worksheet.cell(8, 3, 8, 4, true).string(" Fecha ").style(styleUser);
        worksheet.cell(8, 5, 8, 6, true).string(" Proveedor ").style(styleUser);
        worksheet.cell(8, 7, 8, 8, true).string(" Materia Prima ").style(styleUser);
        worksheet.cell(8, 9, 8, 10, true).string(" Lote proveedor ").style(styleUser);
        let dateSplited=data.createdAt.split("-");
        let dateStr=`${dateSplited[2]}/${dateSplited[1]}/${dateSplited[0]}`;
        worksheet.cell(9, 3, 9, 4, true).string(`${dateStr}`).style(style);
        worksheet.cell(9, 5, 9, 6, true).string(`${data.proveedor}`).style(style);
        worksheet.cell(9, 7, 9, 8, true).string(`${data.rawMaterial}`).style(style);
        worksheet.cell(9, 9, 9, 10, true).string(`${data.loteProveedor}`).style(style);

        worksheet.cell(10, 3, 10, 4, true).string(" Total recibido ").style(styleUser);
        worksheet.cell(10, 5, 10, 10, true).string(`${data.weight.value}`).style(styleUser);
        
        row=11;
        worksheet.cell(row, 3, row, 4, true).string(" Control ").style(styleUser);
        worksheet.cell(row, 5, row, 6, true).string(" Estandar ").style(styleUser);
        worksheet.cell(row, 7, row, 7, true).string(" Aceptado ").style(styleUser);
        worksheet.cell(row, 8, row, 8, true).string(" Recahzado").style(styleUser);
        worksheet.cell(row, 9, row, 10, true).string(" Observaciones ").style(styleUser);

        row++;

        worksheet.cell(row, 3, row, 4, true).string("Transporte").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Limpio, sin olores, sin material ajeno, sin plagas").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.transport.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.transport.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10, true).string(` ${data.transport.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Empaque").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Sin daños y limpio").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.packing.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.packing.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10, true).string(` ${data.packing.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Caducidad").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Vigente").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.expiration.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.expiration.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10, true).string(` ${data.expiration.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Peso").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Segun el empaque").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.weight.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.weight.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10,true).string(` ${data.weight.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Materia extraña").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Ausente").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.strangeMaterial.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.strangeMaterial.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10,true).string(` ${data.strangeMaterial.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row+1, 4, true).string("Temperatura").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Fresco: Max. 4C°").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row+1, 5, row+1, 6, true).string("Congelado: Max -18C°").style(style);
        worksheet.cell(row+1, 7, row+1, 7, true).string(` ${data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row+1, 8, row+1, 8, true).string(` ${!data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row+1, 10,true).string(` ${data.temperature.value} `).style(style);
        row+=2;
        worksheet.cell(row, 3, row, 4, true).string("Olor").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Característico").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10,true).string(` ${data.odor.observations} `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Color").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Característico").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.color.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.color.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10,true).string(` `).style(style);
        row++;
        worksheet.cell(row, 3, row, 4, true).string("Textura").style(style);
        worksheet.cell(row, 5, row, 6, true).string("Firme Característico").style(style);
        worksheet.cell(row, 7, row, 7, true).string(` ${data.texture.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 8, row, 8, true).string(` ${!data.texture.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(row, 9, row, 10,true).string(` ${data.texture.observations} `).style(style);
        row++;
        worksheet.cell(22, 3, 22, 10,true).string("Desviación").style(style);
        row++;
        worksheet.cell(row, 3, row, 10,true).string("").style(style);
        row++;
        worksheet.cell(row, 3, row, 10, true).string("Acción correctiva").style(style);
        row++;
        worksheet.cell(row, 3, row, 10, true).string("").style(style);
        row++;
        worksheet.cell(row, 3, row, 10, true).string("Etiqueta").style(style);
        row++;
        worksheet.cell(row, 3, row+10, 10, true).string("").style(style);
        row+=11;
        worksheet.cell(row, 3, row, 7, true).string(`Realizó:  ${user.name} `).style(styleUser);
        worksheet.cell(row, 8, row, 10, true).string("Firma:  ").style(styleUser);
           
        return workbook;
    }


    generateEntryDriefDocumentById(user:User,data:EntranceDrief){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Entry-Drief');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(2, 5, 2, 11, true).string("RECEPCIÓN DE MATERIA PRIMA SECOS").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${user.name }`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${user.job }`).style(styleUser);
  
        let row = 9;
        let col = 3;
        let dateSplited = data.date.split("-");
        let dateStr = `${dateSplited[2]}/${dateSplited[1]}/${dateSplited[0]}`;
            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data.product.description} `).style(style);
            worksheet.cell(row+1, col,   row+1, col+3, true).string(`Proveedor: ${data.proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data.loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${dateStr}`).style(style);

            worksheet.cell(row+2, col,   row+2, col+1, true).string("Total recibido: ").style(style);
            worksheet.cell(row+2, col+2, row+2, col+7, true).string(`${data.quantity} ${data.isPz&&data.isBox?'Cajas':((data.isPz)?'Piezas':'Kg')}`).style(style);
            row++;
            worksheet.cell(row+2, col,   row+2, col+1, true).string("Control").style(style);
            worksheet.cell(row+2, col+2, row+2, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+5, row+2, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+6, row+2, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data.observations} `).style(style);

            worksheet.cell(row+3, col,   row+3, col+1, true).string("Caducidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Vigente").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data.observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data.transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data.transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

            worksheet.cell(row+7, col,   row+7, col+1, true).string("Olor").style(style);
            worksheet.cell(row+7, col+2, row+7, col+3, true).string("Característico").style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(` ${data.odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+5, row+7, col+5, true).string(` ${!data.odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+6, row+7, col+7, true).string(`  `).style(style);

            worksheet.cell(row+8, col,   row+8, col+1, true).string("Color").style(style);
            worksheet.cell(row+8, col+2, row+8, col+3, true).string("Caraterístico").style(style);
            worksheet.cell(row+8, col+4, row+8, col+4, true).string(` ${data.color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+5, row+8, col+5, true).string(` ${!data.color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+6, row+8, col+7, true).string(`  `).style(style);

            worksheet.cell(row+9, col,   row+9, col+1, true).string("Textura").style(style);
            worksheet.cell(row+9, col+2, row+9, col+3, true).string("Característico").style(style);
            worksheet.cell(row+9, col+4, row+9, col+4, true).string(` ${data.texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+5, row+9, col+5, true).string(` ${!data.texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+6, row+9, col+7, true).string(`  `).style(style);

            worksheet.cell(row+10, col,   row+10, col+1, true).string("Peso").style(style);
            worksheet.cell(row+10, col+2, row+10, col+3, true).string("Según empaque").style(style);
            worksheet.cell(row+10, col+4, row+10, col+4, true).string(` ${data.weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+5, row+10, col+5, true).string(` ${!data.weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+6, row+10, col+7, true).string(`  `).style(style);

           worksheet.cell(row+11, 9, row+11, 10, true).string("F-CAL-RO-03").style(styleUser);
           
        return workbook;
    }

    generateEntryMeatsDocumentByDate(user:User, meat: EntranceMeat[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 
        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        let worksheet = workbook.addWorksheet('Entry-Meats'); 

        let row = 1;


            worksheet.addImage({ 
                path: `${tmp}/imageTmp.png`,
                name: 'logo', 
                type: 'picture', 
                position: { 
                    type: 'twoCellAnchor', 

                    from: { 
                    col: 1,
                    colOff: '1in', 
                    row: row, 
                    rowOff: '0.1in', 
                    },
                    to: {
                        col: 3, 
                        colOff: '1in',
                        row: row, 
                        rowOff: '0.1in',
                    }
                }
            });

            worksheet.cell(1, 4, 2, 8, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(1, 10, 2, 12, true).string("F-CAL-RO-04").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(3, 4, 4, 9, true).string("CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });



        meat.forEach((m , index)=>{
            
            let style = workbook.createStyle({ 
                font: {
                color: '#000000',
                size: 12, 
                },
                border: { 
                    top: {
                        style:'double' 

                    },
                    bottom: {
                        style:'double'
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: { 
                    wrapText: true 
                }
            });

            let styleUser = workbook.createStyle({
                font: {
                    bold: true,
                    size: 12
                },
                border: {
                    top: {
                        style:'double'
                    },
                    bottom: {
                        style:'double'
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: {
                    wrapText: true
                }
            });
            
            worksheet.cell(row+3, 10, row+4, 11, true).string("LOTE INTERNO: "+m.loteInterno).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            row = row+5;

            worksheet.cell(row, 4).string(`Fecha`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 5, row, 9, true).string(`Proveedor`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10, row, 11, true).string(`Materia prima`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 12).string(`Lote proveedor`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`${new Date(m.createdAt).toLocaleDateString()}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 5, row, 9, true).string(`${m.proveedor}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10, row, 11, true).string(`${m.rawMaterial}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 12).string(`${m.loteProveedor}`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`Control`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 5, row, 9, true).string(`Estándar`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10).string(`Aceptado`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 11).string(`Rechazado`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 12).string(`Observaciones`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`Transporte`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Limpio, sin olores,sin material ajeno, sin plagas	`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.transport.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.transport.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            worksheet.cell(++row, 4).string(`Empaque`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Sin daños y limpio`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.packing.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.packing.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);


            worksheet.cell(++row, 4).string(`Caducidad`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Vigente:`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.expiration.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.expiration.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);


            worksheet.cell(++row, 4).string(`Peso`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Segun el empaque`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.weight.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.weight.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);


            worksheet.cell(++row, 4, ++row, 4, true).string(`Temperatura`).style(styleUser);
            worksheet.cell(row-1, 5, row-1, 9, true).string(`Fresco: Max. 4°C`).style(styleUser);
            worksheet.cell(row-1, 10).string(`${m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row-1, 11).string(`${!m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row-1, 12).string(``).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Fresco: Max. -18°C`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);


            worksheet.cell(++row, 4).string(`Olor`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Caracteristico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.odor.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.odor.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            worksheet.cell(++row, 4).string(`Color`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Caracteristico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.color.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.color.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);


            worksheet.cell(++row, 4).string(`Texture`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Firme, Característico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            worksheet.cell(++row, 4, row, 12, true).string(`Desviación:`).style(styleUser);
            worksheet.cell(++row, 4, row, 12, true).string(``).style(style);

            worksheet.cell(++row, 4, row, 12, true).string(`Accion correctiva:`).style(styleUser);
            worksheet.cell(++row, 4, row, 12, true).string(``).style(style);


            worksheet.cell(++row, 4, row+10, 12, true).string(`Etiqueta:`).style(styleUser);
            row+=10;
            worksheet.cell(++row, 4, row, 9, true).string(`Realizó:`).style(styleUser);
            worksheet.cell(row, 10, row, 12, true).string(`Firma:`).style(styleUser);
            row+=3;
        });

        return workbook;
    }

    generatePackagingsDocument(packagings:Packaging[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Packaging');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        });

            worksheet.cell(2, 6, 2, 11, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(4, 6, 4, 11, true).string("BITÁCORA DE CONTROL DE REBANADO Y EMPACADO").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(6, 4, 6, 5, true).string(`Fecha: ${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}`).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });

            let row = 8;
            for(let pack of packagings){
                worksheet.cell(row, 3, row, 4,  true).string(`PRODUCTO`).style(styleUser);
                worksheet.cell(row, 5, row, 6,  true).string(`LOTE Y CADUCIDAD`).style(styleUser);
                worksheet.cell(row, 7, row, 8,  true).string(`PRESENTACIONES`).style(styleUser);
                worksheet.cell(row, 9, row, 9,  true).string(`UNIDADES`).style(styleUser);
                worksheet.cell(row, 10,row, 10, true).string(`PESO KG`).style(styleUser);
                worksheet.cell(row, 11,row, 12, true).string(`OBSERVACIONES`).style(styleUser);
                worksheet.cell(row, 13,row, 14, true).string(`USUARIOS`).style(styleUser);
                
                worksheet.cell(row+1, 3, row+1, 4,  true).string(`${pack.productId == null ? " " : pack.productId.name}`).style(style);
                worksheet.cell(row+1, 5, row+1, 6,  true).string(`${pack.lotId? pack.lotId:""} (Cad. ${pack.expiration})`).style(style);
                
                let presentaciones="";
                                   
                for(let i = 0 ; i < pack.propertiesPackaging.length ; i++){
                    let propertyEntity:PropertiesPackaging = pack.propertiesPackaging[i];
                    
                    presentaciones=`${propertyEntity.presentation.presentationType}\n`
                    worksheet.cell(row+1, 7, row+1, 8, true).string(presentaciones).style(style);

                    worksheet.cell(row+1, 9, row+1, 9,  true).string(`${propertyEntity.outputOfWarehouse || " "}`).style(style);
                    worksheet.cell(row+1, 10,row+1, 10, true).string(`${ propertyEntity.weight||" "}`).style(style);
                    worksheet.cell(row+1, 11,row+1, 12, true).string(`${propertyEntity.observations||" "}`).style(style);
                    worksheet.cell(row+1, 13,row+1, 14, true).string(`${pack.userId ==null ? " ": pack.userId.name }`).style(style);
                    worksheet.cell(row+2, 13,row+2, 14, true).string(`F-CALL-RO-020`).style(styleUser);
                    row++;
                }
                row+=4;
            }
        return workbook;
    }
    generatePackagingDocumentById(data:Packaging, properties:PropertiesPackaging[],presentations:PresentationProducts[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Packaging');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        });

            worksheet.cell(2, 6, 2, 11, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(4, 6, 4, 11, true).string("BITÁCORA DE CONTROL DE REBANADO Y EMPACADO").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(6, 4, 6, 5, true).string(`Fecha: ${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}`).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });

            let row = 8;
            worksheet.cell(row, 3, row, 4,  true).string(`PRODUCTO`).style(styleUser);
            worksheet.cell(row, 5, row, 6,  true).string(`LOTE Y CADUCIDAD`).style(styleUser);
            worksheet.cell(row, 7, row, 8,  true).string(`PRESENTACIONES`).style(styleUser);
            worksheet.cell(row, 9, row, 9,  true).string(`UNIDADES`).style(styleUser);
            worksheet.cell(row, 10,row, 10, true).string(`PESO KG`).style(styleUser);
            worksheet.cell(row, 11,row, 12, true).string(`OBSERVACIONES`).style(styleUser);
            worksheet.cell(row, 13,row, 14, true).string(`USUARIOS`).style(styleUser);
            
            worksheet.cell(row+1, 3, row+1, 4,  true).string(`${data.productId == null ? " " : data.productId.name}`).style(style);
            worksheet.cell(row+1, 5, row+1, 6,  true).string(`${data.lotId? data.lotId:""} (Cad. ${data.expiration})`).style(style);
            
            let presentaciones="";
                                   
            for(let i = 0 ; i < presentations.length ; i++){
            presentaciones+=`${presentations[i].presentation}\n`}

            worksheet.cell(row+1, 7, row+1, 8, true).string(presentaciones).style(style);

            worksheet.cell(row+1, 9, row+1, 9,  true).string(`${properties.length ? properties[0].units:" "}`).style(style);
            worksheet.cell(row+1, 10,row+1, 10, true).string(`${properties.length ? properties[0].weight:" "}`).style(style);
            worksheet.cell(row+1, 11,row+1, 12, true).string(`${properties.length ? properties[0].observations:" "}`).style(style);
            worksheet.cell(row+1, 13,row+1, 14, true).string(`${data.userId ==null ? " ": data.userId.name }`).style(style);
            worksheet.cell(row+2, 13,row+2, 14, true).string(`F-CALL-RO-020`).style(styleUser);

        return workbook;
    }


    generateReportProcess(processArray: Process[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 
        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        let worksheet = workbook.addWorksheet('Entry-Meats'); 

        let row = 1;


        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                col: 1,
                colOff: '1in', 
                row: row, 
                rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: row, 
                    rowOff: '0.1in',
                }
            }
        });
        
        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        });

        worksheet.cell(1, 4, 2, 8, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
                vertical: 'center'
            }
        });

        worksheet.cell(3, 4, 4, 9, true).string("BITACORA DE CONTROL DE CALIDAD SALA DE TRABAJO").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
                vertical: 'center'
            }
        });


        row = 5;
    for(let process of processArray){

        worksheet.cell(row, 10).string(`No. lote: ${process.formulation.lotDay}`);
        worksheet.cell(++row, 10).string(`Fecha: ${new Date(process.createAt).toLocaleDateString()}`);

        worksheet.cell(++row, 4, row, 6, true).string("DESCONGELADO").style(styleUser);

        worksheet.cell(++row, 4, row, 5, true).string("MATERIA PRIMA").style(styleUser);
        worksheet.cell(row, 6).string("FECHA").style(styleUser);
        worksheet.cell(row, 7).string("PESO Kg").style(styleUser);
        worksheet.cell(row, 8, row, 9, true).string("HORA DE ENTRADA").style(styleUser);
        worksheet.cell(row, 10, row, 11, true).string("HORA DE SALIDA").style(styleUser);

        worksheet.cell(++row, 4, row, 5, true).string(`${process.product ? process.product.name : ""}`).style(style);
        worksheet.cell(row, 6).string(`${process.startDate ? process.startDate : ""}`).style(style);
        //worksheet.cell(row, 7).string(`${process.weigth ? process.weigth : ""}`).style(style);
        worksheet.cell(row, 8, row, 9, true).string(`${process.entranceHour ? process.entranceHour : "" }`).style(style);
        worksheet.cell(row, 10, row, 11, true).string(`${process.outputHour ? process.outputHour : ""}`).style(style);

        worksheet.cell(++row, 4, row, 6, true).string("ACONDICIONAMIENTO").style(styleUser);

        
        for(let conditioning of process.conditioning){
            worksheet.cell(++row, 4, row, 5, true).string("MATERIA PRIMA").style(styleUser);
        worksheet.cell(row, 6).string("FECHA").style(styleUser);
        worksheet.cell(row, 7).string("PROCESO").style(styleUser);
        worksheet.cell(row, 8, row, 9, true).string("PESO Kg").style(styleUser);
        worksheet.cell(row, 10, row, 11, true).string("PRODUCTO(s)").style(styleUser);

        worksheet.cell(++row, 4, row, 5, true).string(`${conditioning.raw}`).style(style);
        worksheet.cell(row, 6).string(`${conditioning.date}`).style(style);
        worksheet.cell(row, 7).string(`${conditioning.process}`).style(style);
        worksheet.cell(row, 8, row, 9, true).string(`${conditioning.weight}`).style(style);
        worksheet.cell(row, 10, row, 11, true).string(`${conditioning.raw}`).style(style);
        worksheet.cell(row, 12).string(`clave`).style(styleUser);
        worksheet.cell(row, 13).string(`Proceso`).style(styleUser);

        worksheet.cell(++row, 4, row, 5, true).string(``).style(style);
        worksheet.cell(row, 6).string(``).style(style);
        worksheet.cell(row, 7).string(``).style(style);
        worksheet.cell(row, 8, row, 9, true).string(``).style(style);
        worksheet.cell(row, 10, row, 11, true).string(``).style(style);
        worksheet.cell(row, 12).string(`D`).style(styleUser);
        worksheet.cell(row, 13).string(`Deshuese`).style(styleUser);
        
        
        worksheet.cell(++row, 4, row, 5, true).string(``).style(style);
        worksheet.cell(row, 6).string(``).style(style);
        worksheet.cell(row, 7).string(``).style(style);
        worksheet.cell(row, 8, row, 9, true).string(``).style(style);
        worksheet.cell(row, 10, row, 11, true).string(``).style(style);
        worksheet.cell(row, 12).string(`L`).style(styleUser);
        worksheet.cell(row, 13).string(`Limpieza`).style(styleUser);

        
        worksheet.cell(++row, 4, row, 5, true).string(``).style(style);
        worksheet.cell(row, 6).string(``).style(style);
        worksheet.cell(row, 7).string(``).style(style);
        worksheet.cell(row, 8, row, 9, true).string(``).style(style);
        worksheet.cell(row, 10, row, 11, true).string(``).style(style);
        worksheet.cell(row, 12).string(`SC`).style(styleUser);
        worksheet.cell(row, 13).string(`Salado y curado`).style(styleUser);

        
        worksheet.cell(++row, 4, row, 5, true).string(``).style(style);
        worksheet.cell(row, 6).string(``).style(style);
        worksheet.cell(row, 7).string(``).style(style);
        worksheet.cell(row, 8, row, 9, true).string(``).style(style);
        worksheet.cell(row, 10, row, 11, true).string(``).style(style);
        }
        worksheet.cell(++row, 4, row, 6, true).string("MOLIENDA").style(styleUser);
        for(let grinding of process.grinding){
        

        worksheet.cell(++row, 4, row, 5, true).string("MATERIA PRIMA").style(styleUser);
        worksheet.cell(row, 6).string("FECHA").style(styleUser);
        worksheet.cell(row, 7).string("PROCESO").style(styleUser);
        worksheet.cell(row, 8).string("PESO Kg").style(styleUser);
        worksheet.cell(row, 9).string("T* C").style(styleUser);
        worksheet.cell(row, 10, row, 11, true).string("PRODUCTO(s)").style(styleUser);

        
        worksheet.cell(++row, 4, row, 5, true).string(`${grinding.raw.rawMaterial}`).style(styleUser);
        worksheet.cell(row, 6).string(`${grinding.date ? new Date(grinding.date).toLocaleDateString() : "" }`).style(styleUser);
        worksheet.cell(row, 7).string(`${grinding.process}`).style(styleUser);
        worksheet.cell(row, 8).string(`${grinding.weight }`).style(styleUser);
        worksheet.cell(row, 9).string(`${grinding.temperature }`).style(styleUser);
        worksheet.cell(row, 10, row, 11, true).string(`${process.formulation.productRovianda.name }`).style(styleUser);
        }
        worksheet.cell(++row, 4, row, 6, true).string("INYECCION/TENDERIZADO").style(styleUser);
        for(let tenderized of process.tenderized){
        

        worksheet.cell(++row, 4, row, 5, true).string("PRODUCTO").style(styleUser);
        worksheet.cell(row, 6).string("FECHA").style(styleUser);
        worksheet.cell(row, 7).string("PESO Kg").style(styleUser);
        worksheet.cell(row, 8).string("T*C").style(styleUser);
        worksheet.cell(row, 9, row, 10, true).string("PESO SALMUERA Kg").style(styleUser);
        worksheet.cell(row, 11).string("%INYECCION").style(styleUser);

        
        worksheet.cell(++row, 4, row, 5, true).string(`${tenderized.raw == null ? "" : tenderized.raw}`).style(styleUser);
        worksheet.cell(row, 6).string(`${tenderized.date}`).style(styleUser);
        worksheet.cell(row, 7).string(`${tenderized.weight}`).style(styleUser);
        worksheet.cell(row, 8).string(`${tenderized.temperature}`).style(styleUser);
        worksheet.cell(row, 9, row, 10, true).string(`${tenderized.weightSalmuera}`).style(styleUser);
        worksheet.cell(row, 11).string(`${tenderized.percentInject}`).style(styleUser);
        }
        worksheet.cell(++row, 4, row, 6, true).string("EMBUTIDO").style(styleUser);
        for(let sausage of process.sausage){
        worksheet.cell(++row, 4, row, 6, true).string("PRODUCTO").style(styleUser);
        worksheet.cell(row, 7).string("FECHA").style(styleUser);
        worksheet.cell(row, 8).string("T*C").style(styleUser);
        worksheet.cell(row, 9).string("PESO Kg.Inicio(Hra)").style(styleUser);
        worksheet.cell(row, 10).string("PESO Kg.Medio(Hra)").style(styleUser);
        worksheet.cell(row, 11).string("PESO kg. Fin(Hra)").style(styleUser);

        
        worksheet.cell(++row, 4, row, 5, true).string(`${sausage.raw}`).style(styleUser);
        worksheet.cell(row, 6).string(`${sausage.date}`).style(styleUser);
        worksheet.cell(row, 7).string(`${sausage.temperature}`).style(styleUser);
        worksheet.cell(row, 8).string(`${sausage.weightIni} (${sausage.hour1}`).style(styleUser);
        worksheet.cell(row, 9, row, 10, true).string(`${sausage.weightMedium} ( ${sausage.hour2})`).style(styleUser);
        worksheet.cell(row, 11).string(`${sausage.weightExit} (${sausage.hour3}`).style(styleUser);

        worksheet.cell(++row, 11).string(`F-CAL-RO-07`).style(styleUser);
        }
        row+=2;

        
        worksheet.cell(row, 4, row, 6, true).string(`Elaboro: ${process.nameElaborated}`).style(styleUser);
        worksheet.cell(row, 7, row, 8, true).string(`Firma:`).style(styleUser);
        worksheet.cell(row, 9, row, 11, true).string(`Puesto: ${process.jobElaborated}`).style(styleUser);

        
        worksheet.cell(++row, 4, row, 6, true).string(`Verifico: ${process.nameVerify}`).style(styleUser);
        worksheet.cell(row, 7, row, 8, true).string(`Firma:`).style(styleUser);
        worksheet.cell(row, 9, row, 11, true).string(`Puesto: ${process.jobVerify}`).style(styleUser);

        row+=5;
    }
        return workbook;
    }

    generateInventoryReport(items:LotsStockInventoryPresentation[],title:string){
        
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Inventario');
        
        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        });

            worksheet.cell(2, 6, 2, 11, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(4, 6, 4, 11, true).string(title).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            let date=new Date();
            date.setHours(date.getHours()-6);
            let month = (date.getMonth()+1).toString();
            let day = date.getDate().toString();
            if(+month<10) month="0"+month;
            if(+day<10) day="0"+day;
            worksheet.cell(6, 4, 6, 5, true).string(`Fecha de impresión: ${date.getFullYear().toString()}-${month}-${day}`).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });

            let row = 8;
            worksheet.cell(row, 5, row, 6,  true).string(`PRODUCTO`).style(styleUser);
                worksheet.cell(row, 7, row, 8,  true).string(`PRESENTACION`).style(styleUser);
                worksheet.cell(row, 9, row, 10,  true).string(`LOTE`).style(styleUser);
                worksheet.cell(row, 11, row, 11,  true).string(`UNIDADES`).style(styleUser);
                worksheet.cell(row, 12,row, 12, true).string(`PESO KG`).style(styleUser);

            for(let item of items){      
                    worksheet.cell(row+1, 5, row+1, 6, true).string(item.name).style(style);
                    worksheet.cell(row+1, 7, row+1, 8,  true).string(`${item.type_presentation}`).style(style);
                    worksheet.cell(row+1, 9,row+1, 10, true).string(`${ item.lot_id}`).style(style);
                    worksheet.cell(row+1,11,row+1, 11, true).string(`${item.units}`).style(style);
                    worksheet.cell(row+1, 12,row+1, 12, true).string(`${item.weight}`).style(style);
                    row++;
            }
        return workbook;
    }

    generatePlantDelivery(records:OutputsDeliveryPlant[],from:string,to:string){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Plant');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        });

            worksheet.cell(2, 6, 2, 11, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(4, 6, 4, 11, true).string("SALIDAS DE ALMACÉN PLANTA").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            worksheet.cell(6, 4, 6, 5, true).string(`Fecha de ${from} a ${to}`).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });

            let row = 8;
                worksheet.cell(row, 3, row, 4,  true).string(`Vendedor/Tienda/Sucursal`).style(styleUser);
                worksheet.cell(row, 5, row, 6,  true).string(`Codigo`).style(styleUser);
                worksheet.cell(row, 7, row, 8,  true).string(`Producto`).style(styleUser);
                worksheet.cell(row, 9, row, 9,  true).string(`Presentación`).style(styleUser);
                worksheet.cell(row, 10, row, 10,  true).string(`Lote`).style(styleUser);
                worksheet.cell(row, 11,row, 12, true).string(`Unidades`).style(styleUser);
                worksheet.cell(row, 13,row, 14, true).string(`Peso`).style(styleUser);
                worksheet.cell(row, 15,row, 16, true).string(`Fecha`).style(styleUser);
                
            for(let record of records){
                    worksheet.cell(row+1, 3, row+1, 4,  true).string(`${record.seller}`).style(style);
                    worksheet.cell(row+1, 5,row+1, 6, true).string(`${ record.code}`).style(style);
                    worksheet.cell(row+1, 7,row+1, 8, true).string(`${record.name}`).style(style);
                    worksheet.cell(row+1, 9,row+1, 9, true).string(`${record.presentation }`).style(style);
                    worksheet.cell(row+1, 10,row+1, 10, true).string(`${record.loteId }`).style(style);
                    worksheet.cell(row+1, 11,row+1, 12, true).string(`${record.units}`).style(styleUser);
                    worksheet.cell(row+1, 13,row+1, 14, true).string(`${record.weight}`).style(styleUser);
                    worksheet.cell(row+1, 15,row+1, 16, true).string(`${record.outputDate}`).style(styleUser);
                    row++;
            }
        return workbook;
    }

    getEmptyWoorbook(){
        return new excel.Workbook();
    }

    getSummaryReportBySeller(seller:User,acumulateAbarrotes:{amount:number},acumulateNormal:{amount:number},acumulatedNormalKg:{totalKg:number},acumulatedCheeses:{amount:number},acumulatedCheesesKg:{totalKg:number},ranking:{amount:number,amountKg:number,name:string,type_presentation:string}[],dateStart:string,dateEnd:string,countData: {count:number}[],typeReport:string,workbook?:any){
        let type="VENTAS GENERALES";
        let productsTitle ="PRODUCTOS";
        if(typeReport=="CANCELED"){
            type="CANCELACIONES";
            productsTitle="PRODUCTOS CANCELACIONES"
        }
        let worksheet = workbook.addWorksheet(type);
        worksheet.cell(1,2,1,2,true).string("Desde: "+dateStart);
        worksheet.cell(1,4,1,4,true).string("Hasta: "+dateEnd);

        worksheet.cell(3,1,3,1,true).string('RUTA');
        worksheet.cell(3,2,3,2,true).string('VENDEDOR');
        worksheet.cell(3,3,3,3,true).string("TOTAL DE NOTAS");
        worksheet.cell(3,4,3,4,true).string('MONTO CARNICOS');
        worksheet.cell(3,5,3,5,true).string('KILOS CARNICOS');
        worksheet.cell(3,6,3,6,true).string('MONTO QUESOS');
        worksheet.cell(3,7,3,7,true).string('KILOS QUESOS');
        worksheet.cell(3,8,3,8,true).string('MONTO ABARROTES');

        worksheet.cell(4,1,4,1,true).string(seller.cve);
        worksheet.cell(4,2,4,2,true).string(seller.name);
        worksheet.cell(4,3,4,3,true).string(countData[0].count.toString());
        
        worksheet.cell(4,4,4,4,true).number(acumulateNormal.amount?acumulateNormal.amount:0);
        worksheet.cell(4,5,4,5,true).number(acumulatedNormalKg.totalKg?acumulatedNormalKg.totalKg:0);
        worksheet.cell(4,6,4,6,true).number(acumulatedCheeses.amount?acumulatedCheeses.amount:0);
        worksheet.cell(4,7,4,7,true).number(acumulatedCheesesKg.totalKg?acumulatedCheesesKg.totalKg:0);
        worksheet.cell(4,8,4,8,true).number(acumulateAbarrotes.amount?acumulateAbarrotes.amount:0);
         
        const worksheet2 = workbook.addWorksheet(productsTitle);

        worksheet2.cell(1,2,1,2,true).string("Desde: "+dateStart);
        worksheet2.cell(1,4,1,4,true).string("Hasta: "+dateStart);

        worksheet2.cell(3,1,3,1,true).string('VENDEDOR');
        worksheet2.cell(3,2,3,2,true).string('PRODUCTO');
        worksheet2.cell(3,3,3,3,true).string('MONTO');
        worksheet2.cell(3,4,3,4,true).string('KILOS');
        let row = 5;
                let totalAmount = 0;
                let totalKg=0;
            for(let product of ranking){
                totalAmount+=product.amount;
                totalKg+=product.amountKg;
                worksheet2.cell(row,1,row,1).string(seller.name);
                worksheet2.cell(row,2,row,2).string(product.name+ " "+product.type_presentation);
                worksheet2.cell(row,3,row,3).number(product.amount);
                worksheet2.cell(row,4,row,4).number(product.amountKg);
                row++;
            }
            
            return workbook;
    }

    getReportWarehouseDeliveredBySeller(products:DeliverToWarehouse[],dateStart:string,dateEnd:string,sellerName:string,type:string){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('PRODUCTO ENTREGADO');

        worksheet.cell(1,1,1,4,true).string("PRODUCTO ENTREGADO");
        worksheet.cell(2,1,2,4,true).string("VENDEDOR: "+sellerName);

        worksheet.cell(5,1,5,1,true).string('DESDE: '+dateStart);
        worksheet.cell(5,4,5,4,true).string('HASTA: '+dateEnd);

        worksheet.cell(7,1,7,1,true).string('CÓDIGO');
        worksheet.cell(7,2,7,2,true).string('NOMBRE');
        worksheet.cell(7,3,7,3,true).string('UNIDADES');
        worksheet.cell(7,4,7,4,true).string('PESO');
        if(type!="acumulated"){
            worksheet.cell(7,5,7,5,true).string('FECHA');
            worksheet.cell(7,6,7,6,true).string('PRECIO');
            worksheet.cell(7,7,7,7,true).string('TOTAL');
        }else{
            worksheet.cell(7,5,7,5,true).string('PRECIO');
            worksheet.cell(7,6,7,6,true).string('TOTAL');
        }
        let row=8;
        let total = 0;
        for(let product of products){
            worksheet.cell(row,1,row,1,true).string(`${product.CODE}`);
            worksheet.cell(row,2,row,2,true).string(`${product.NAME}`);
            worksheet.cell(row,3,row,3,true).string(`${product.UNITS}`);
            worksheet.cell(row,4,row,4,true).string(`${product.WEIGHT.toFixed(2)}`);
            if(type!="acumulated"){
                worksheet.cell(row,5,row,5,true).string(`${product.DATE}`);
                worksheet.cell(row,6,row,6,true).string(`${product.PRICE}`);
                worksheet.cell(row,7,row,7,true).string(`${product.TOTAL}`);
            }else{
                worksheet.cell(row,5,row,5,true).string(`${product.PRICE}`);
                worksheet.cell(row,6,row,6,true).string(`${product.TOTAL}`);
            }
            
            total+=product.TOTAL;
            row++;
        }
        worksheet.cell(row,6,row,6,true).string(`Total: $ ${total.toFixed(2)}`);
        return workbook;
    }

    async getReportTrazability(productInfo:ProductInfoFromPackTrazability,productDefrost:ProductInfoFromPackDefrostTrazability[],ingredients:ProductInfoFromPackIngredientsTrazability[],rangeDate:{startDate:string,endDate:string}[]){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('PRODUCTO TERMINADO');
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,8,true).string("REPORTE DE TRAZABILIDAD").style(style);
        worksheet.cell(2,1,2,8,true).string(`Con el fin de rastrear la procedencia y el tipo de preparación de nuestros productos, se realizará un proceso de trazabilidad, por medio de el que se podran investigar las presentaciones de cada
        uno de los productos como: lote,materia prima,cocimiento del producto,ingredientes,temperaturas,maquinaria por donde pasa el producto, el control de quimicos para lavar la maquinaria, como
        también el nombre del repartidor/cliente al que se le entrego el producto`).style(style);

        worksheet.cell(3,1,3,8,true).string('OBJETIVOS').style(style);;
        worksheet.cell(4,1,8,8,true).string(`- Recopilar los números de lote y cantidades de materia prima.
        - Localizar los mismos lotes de producto y cantidad que se han utilizado para la producción.
        - Localizar las cantidades localizadas con las cantidades de producción registradas.
        - Inmovilizar el producto.`).style(style);;

        worksheet.cell(9,1,9,8,true).string('1.-DATOS DELPRODUCTO').style(style);;

        worksheet.cell(10,1,10,3,true).string('Producto');
        worksheet.cell(10,4,10,5,true).string('Lote');
        worksheet.cell(10,5,10,6,true).string('Fecha de caducidad');
        worksheet.cell(10,7,10,8,true).string('Lote de producto');
        
        worksheet.cell(11,1,11,3,true).string(productInfo.productName);
        worksheet.cell(11,4,11,5,true).string(productInfo.lotId.slice(0,2));
        worksheet.cell(11,5,11,6,true).string(this.parseDateStr(productInfo.expiration));
        worksheet.cell(11,7,11,8,true).string(productInfo.lotId);

        worksheet.cell(12,1,12,2,true).string("No de piezas o paquetes");
        worksheet.cell(12,3,12,3,true).string(`${productInfo.outputOfWarehouse}`);
        worksheet.cell(12,4,12,5,true).string(`${productInfo.weightOfWarehouse}`);
        worksheet.cell(12,6,12,6,true).string("Fecha de distribución");
        worksheet.cell(12,7,12,7,true).string(`${rangeDate.length?((rangeDate[0].startDate!=null)?this.parseDateStr(rangeDate[0].startDate.split("T")[0]):""):""}`);
        worksheet.cell(12,8,12,8,true).string(`${(productInfo.active==0?(rangeDate.length?(rangeDate[0].endDate!=null?this.parseDateStr(rangeDate[0].endDate.split("T")[0]):""):""):"")}`);

        worksheet.cell(13,1,13,8,true).string(`2.-RECEPCIÓN DE MATERIAS PRIMAS Y MATERIALES EMVASADOS`).style(style);
        
        worksheet.cell(14,1,14,8,true).string(`A. Entrada de materia prima`).style(style);

        worksheet.cell(15,1,15,1,true).string(`Fecha`);
        worksheet.cell(15,2,15,2,true).string(`Temperatura C`);
        worksheet.cell(15,3,15,3,true).string(`Lote Interno`);
        worksheet.cell(15,4,15,4,true).string(`Lote proveedor`);
        worksheet.cell(15,5,15,5,true).string(`Fecha de matanza`);
        worksheet.cell(15,6,15,6,true).string(`Materia prima`);
        worksheet.cell(15,7,15,7,true).string(`Conservación/Congelador`);
        worksheet.cell(15,8,15,8,true).string(`Proveedor`);

        let row=16;
        let currentPage = 1;
        for(let product of productDefrost){
            if(row>113){
                worksheet = workbook.addWorksheet(`HOJA ${currentPage+1}`);
                currentPage++;
                row=1;
                worksheet.cell(row,1,row,1,true).string(`Fecha`);
                worksheet.cell(row,2,row,2,true).string(`Temperatura C`);
                worksheet.cell(row,3,row,3,true).string(`Lote Interno`);
                worksheet.cell(row,4,row,4,true).string(`Lote proveedor`);
                worksheet.cell(row,5,row,5,true).string(`Fecha de matanza`);
                worksheet.cell(row,6,row,6,true).string(`Materia prima`);
                worksheet.cell(row,7,row,7,true).string(`Conservación/Congelador`);
                worksheet.cell(row,8,row,8,true).string(`Proveedor`);
                row++;
            }
            let temp = JSON.parse(product.temperature);
            let slaughter=JSON.parse(product.slaughterDate);

            worksheet.cell(row,1,row,1,true).string(`${product.dateEntrance}`);
            worksheet.cell(row,2,row,2,true).string(`${temp.value}`);
            worksheet.cell(row,3,row,3,true).string(`${product.lotIntern}`);
            worksheet.cell(row,4,row,4,true).string(`${product.lotProvider}`);
            worksheet.cell(row,5,row,5,true).string(`${slaughter.value}`);
            worksheet.cell(row,6,row,6,true).string(`${product.rawMaterial}`);
            worksheet.cell(row,7,row,7,true).string(`${product.temp} ${product.fridge}`);
            worksheet.cell(row,8,row,8,true).string(`${product.provider}`);
            row++;
        }
        worksheet.cell(row,1,row,8,true).string(`3.-Control de PEP´S Almacenes`).style(style);
        row++;
        worksheet.cell(row,1,row,2,true).string(`Ingredientes`);
        worksheet.cell(row,3,row,3,true).string(`Nombre o marca`);
        worksheet.cell(row,4,row,4,true).string(`Lote`);
        worksheet.cell(row,5,row,5,true).string(`Fecha de entrada`);
        worksheet.cell(row,6,row,8,true).string(`Distribuidora`);
        row++;
        let currentIndex = row;
        let lastIndex=row;
        let ingredientsStr = "";
        
        for(let ingre of ingredients){
            if(row>100){
                
                    ingredientsStr+=";";
                    ingredientsStr = ingredientsStr.replace(",;",".");
                    worksheet.cell(currentIndex,1,lastIndex,2,true).string(ingredientsStr);            
                    ingredientsStr="";
                    currentIndex=2;
                    lastIndex=2;
                row=1;
                worksheet = workbook.addWorksheet(`HOJA ${currentPage+1}`);
                currentPage++;
                worksheet.cell(row,1,row,2,true).string(`Ingredientes`);
                worksheet.cell(row,3,row,3,true).string(`Nombre o marca`);
                worksheet.cell(row,4,row,4,true).string(`Lote`);
                worksheet.cell(row,5,row,5,true).string(`Fecha de entrada`);
                worksheet.cell(row,6,row,8,true).string(`Distribuidora`);
                row++;
            }
            ingredientsStr+=`${ingre.productName},`;
            worksheet.cell(row,3,row,3,true).string(`${ingre.productName}`);
            worksheet.cell(row,4,row,4,true).string(`${ingre.lotProvider}`);
            worksheet.cell(row,5,row,5,true).string(`${ingre.entranceDate}`);
            worksheet.cell(row,6,row,8,true).string(`${ingre.provider}`);
            lastIndex=row;
            row++;
        }
        ingredientsStr+=";";
        ingredientsStr = ingredientsStr.replace(",;",".");
        worksheet.cell(currentIndex,1,lastIndex,2,true).string(ingredientsStr);
        let date = new Date();
        date.setHours(date.getHours()-5);
        let month = (date.getMonth()+1).toString();
        let day = date.getDate().toString();
        if(+month<10) month="0"+month;
        if(+day<10) day="0"+day;
        worksheet.cell(row,1,row,2,true).string(`Fecha de creación: ${date.getFullYear()}-${month}-${day}`);
        worksheet.cell(row,8,row,8,true).string(`F-CAL-R0-64`);
        return workbook;           
    }

    parseDateStr(date:string){
        let dateSplited = date.split("-");
        return `${dateSplited[2]}/${dateSplited[1]}/${dateSplited[0]}`;
      }


    getCustomerReportBySeller(seller:User,customers:ClientItemBySeller[]){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Hoja 1');
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,11,true).string("Reporte de clientes de vendedor").style(style);
        

        worksheet.cell(2,1,2,11,true).string(`Vendedor: ${seller.name}`).style(style);;

        worksheet.cell(3,1,3,1,true).string('Tipo');
        worksheet.cell(3,2,3,2,true).string('Clave sistema');
        worksheet.cell(3,3,3,3,true).string('Clave SAE');
        worksheet.cell(3,4,3,4,true).string('Nombre');
        worksheet.cell(3,5,3,5,true).string('RFC');
        worksheet.cell(3,6,3,6,true).string('Calle');
        worksheet.cell(3,7,3,7,true).string('Número exterior');
        worksheet.cell(3,8,3,8,true).string('Colonia');
        worksheet.cell(3,9,3,9,true).string('Ciudad');
        worksheet.cell(3,10,3,10,true).string('Estado');
        worksheet.cell(3,11,3,11,true).string('Código postal');
        worksheet.cell(3,12,3,12,true).string('Referencia');
        worksheet.cell(3,13,3,13,true).string('Contacto');
        let row=4;
        let currentPage = 1;
        for(let customer of customers){
            if(row>500){
                worksheet = workbook.addWorksheet(`HOJA ${currentPage+1}`);
                currentPage++;
                worksheet.cell(1,1,1,11,true).string("Reporte de clientes de vendedor").style(style);
                worksheet.cell(2,1,2,11,true).string(`Vendedor: ${seller.name}`).style(style);;
                worksheet.cell(3,1,3,1,true).string('Tipo');
                worksheet.cell(3,2,3,2,true).string('Clave sistema');
                worksheet.cell(3,3,3,3,true).string('Clave SAE');
                worksheet.cell(3,4,3,4,true).string('Nombre');
                worksheet.cell(3,5,3,5,true).string('RFC');
                worksheet.cell(3,6,3,6,true).string('Calle');
                worksheet.cell(3,7,3,7,true).string('Número exterior');
                worksheet.cell(3,8,3,8,true).string('Colonia');
                worksheet.cell(3,9,3,9,true).string('Ciudad');
                worksheet.cell(3,10,3,10,true).string('Estado');
                worksheet.cell(3,11,3,11,true).string('Código postal');
                worksheet.cell(3,12,3,12,true).string('Referencia');
                worksheet.cell(3,13,3,13,true).string('Contacto');
                row=4;
            }
                
                worksheet.cell(row,1,row,1,true).string(`${customer.TIPO}`);
                worksheet.cell(row,2,row,2,true).string(`${customer.CLAVE_SISTEMA}`);
                worksheet.cell(row,3,row,3,true).string(`${customer.CLAVE_SAE}`);
                worksheet.cell(row,4,row,4,true).string(`${customer.NOMBRE}`);
                worksheet.cell(row,5,row,5,true).string(`${customer.RFC}`);
                worksheet.cell(row,6,row,6,true).string(`${customer.CALLE}`);
                worksheet.cell(row,7,row,7,true).string(`${customer.NUMERO_EXTERIOR}`);
                worksheet.cell(row,8,row,8,true).string(`${customer.COLONIA}`);
                worksheet.cell(row,9,row,9,true).string(`${customer.CIUDAD}`);
                worksheet.cell(row,10,row,10,true).string(`${customer.ESTADO}`);
                worksheet.cell(row,11,row,11,true).string(`${customer.CODIGO_POSTAL}`);
                worksheet.cell(row,12,row,12,true).string(`${customer.REFERENCIA}`);
                worksheet.cell(row,13,row,13,true).string(`${customer.CONTACTO}`);
            row++;
        }
        return workbook;           
    }

    getSellerVisits(items:SellerVisit[],dateString:string){
        let dateParsed = this.parseDate(new Date(dateString));
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Reporte');
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        let style2={alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,11,true).string("Reporte de visitas de vendedor").style(style);
        
        let row=2;
        let headerRow=2;
        let dateRow=2;
        let currentSeller = "";
        let totalAmount =0;
        for(let item of items){
            if(currentSeller!=item.sellerId){
                let lastRowBySeller = row+1;
                if(currentSeller!=""){
                    worksheet.cell(lastRowBySeller,4,lastRowBySeller,4).string("Total: ").style(style);
                    worksheet.cell(lastRowBySeller,5,lastRowBySeller,5).string("$ "+(+totalAmount.toFixed(2)).toLocaleString()).style(style);
                    totalAmount=0;
                }
                headerRow=row+2;
                dateRow=headerRow+1;
                row+=4;
                worksheet.cell(headerRow,1,headerRow,2,true).string(`Vendedor: ${item.sellerName}`).style(style);
                worksheet.cell(dateRow,1,dateRow,2,true).string(`Fecha: ${dateParsed}`).style(style);
                worksheet.cell(row,1,row,1,true).string('Clave cliente').style(style);
                worksheet.cell(row,2,row,2,true).string('Nombre cliente').style(style);
                worksheet.cell(row,3,row,3,true).string('En agenda').style(style);
                worksheet.cell(row,4,row,4,true).string('Status final').style(style);
                worksheet.cell(row,5,row,5,true).string('Total vendido').style(style);
                worksheet.cell(row,6,row,6,true).string('Observaciones').style(style);
                currentSeller=item.sellerId;
                row++;
            }
            worksheet.cell(row,1,row,1,true).string(item.keyClient.toString()).style(style2);
            worksheet.cell(row,2,row,2,true).string(item.name).style(style2);
            worksheet.cell(row,3,row,3,true).string(item.mustVisited==1?"Si":"No").style(style2);
            worksheet.cell(row,4,row,4,true).string(item.amount>0?"Visitado":"No visitado").style(style2);
            worksheet.cell(row,5,row,5,true).string((+item.amount.toFixed(2)).toLocaleString()).style(style2);
            totalAmount+=item.amount;
            row++;
        }
        worksheet.cell(row,4,row,4).string("Total: ").style(style);
        worksheet.cell(row,5,row,5).string("$ "+(+totalAmount.toFixed(2)).toLocaleString()).style(style);
        
        return workbook;  
    }

    getSellerVisitsScheduled(items:ClientVisitData[],sellerName:string,date:string){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Reporte');
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        let style2={alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,6,true).string("Visitas programadas del vendedor").style(style);
        worksheet.cell(2,1,2,3,true).string("Fecha: "+date).style(style);
        worksheet.cell(2,4,2,6,true).string("Vendedor: "+sellerName).style(style);
        let row=4;
                worksheet.cell(row,1,row,1,true).string('Nombre').style(style);
                worksheet.cell(row,2,row,2,true).string('Código').style(style);
                worksheet.cell(row,3,row,3,true).string('Visitado').style(style);
                worksheet.cell(row,4,row,4,true).string('Con venta').style(style);
                worksheet.cell(row,5,row,5,true).string('Monto vendido').style(style);
                worksheet.cell(row,6,row,6,true).string('Observaciones').style(style);
                row++;
        for(let item of items){
            worksheet.cell(row,1,row,1,true).string(item.clientName).style(style2);
            worksheet.cell(row,2,row,2,true).string(item.code.toString()).style(style2);
            worksheet.cell(row,3,row,3,true).string(item.visited?"Si":"No").style(style2);
            worksheet.cell(row,4,row,4,true).string(item.withSale?"Si":"No").style(style2);
            worksheet.cell(row,5,row,5,true).string((+item.amount.toFixed(2)).toLocaleString()).style(style2);
            worksheet.cell(row,6,row,6,true).string(item.observations).style(style2);
            row++;
        }
    
        return workbook;  
    }


    getCustomerScheduleReport(day:string,records:SellerClientScheduleData[]){
        var workbook = new excel.Workbook();
        let dayStr ="";
        switch(day){
            case "MONDAY":
                dayStr="Lunes"
                break;
            case "TUESDAY":
                dayStr="Martes"
                break;
            case "WEDNESDAY":
                dayStr="Miercoles"
                break;
            case "THURSDAY":
                dayStr="Jueves"
                break;
            case "FRIDAY":
                dayStr="Viernes"
                break;
            case "SATURDAY":
                dayStr="Sabado"
                break;
        }
        let worksheet = workbook.addWorksheet('Reporte de agenda');
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        let style2={alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,6,true).string('Reporte de agenda dia: '+dayStr).style(style);
        let currentSeller="";
        let row=2;
        if(records.length>0){
            currentSeller = records[0].sellerName;
            worksheet.cell(row,1,row,6,true).string('Vendedor: '+currentSeller).style(style);
            row=3;
        
                worksheet.cell(row,1,row,1,true).string('Nombre').style(style);
                worksheet.cell(row,2,row,2,true).string('Tipo').style(style);
                worksheet.cell(row,3,row,3,true).string('Clave Sistema').style(style);
                worksheet.cell(row,4,row,4,true).string('Clave SAE').style(style);
                worksheet.cell(row,5,row,5,true).string('Estatus').style(style);
                worksheet.cell(row,6,row,6,true).string('Ciudad').style(style);
                worksheet.cell(row,7,row,7,true).string('Colonia').style(style);
                worksheet.cell(row,8,row,8,true).string('Dirección').style(style);
                row++;
                for(let item of records){
                    if(currentSeller!=item.sellerName){
                        currentSeller=item.sellerName;
                        row++;
                        worksheet.cell(row,1,row,6,true).string('Vendedor: '+currentSeller).style(style);
                        row++;
                        worksheet.cell(row,1,row,1,true).string('Nombre').style(style);
                        worksheet.cell(row,2,row,2,true).string('Tipo').style(style);
                        worksheet.cell(row,3,row,3,true).string('Clave Sistema').style(style);
                        worksheet.cell(row,4,row,4,true).string('Clave SAE').style(style);
                        worksheet.cell(row,5,row,5,true).string('Estatus').style(style);
                        worksheet.cell(row,6,row,6,true).string('Ciudad').style(style);
                        worksheet.cell(row,7,row,7,true).string('Colonia').style(style);
                        worksheet.cell(row,8,row,8,true).string('Dirección').style(style);
                        row++;
                    }
                    worksheet.cell(row,1,row,1,true).string(item.name).style(style2);
                    worksheet.cell(row,2,row,2,true).string(item.typeClient.toString()).style(style2);
                    worksheet.cell(row,3,row,3,true).string(item.keyClient.toString()).style(style2);
                    worksheet.cell(row,4,row,4,true).string(item.aspelKey.toString()).style(style2);
                    worksheet.cell(row,5,row,5,true).string(item.status=="ACTIVE"?"Activo":"Desactivado").style(style2);
                    worksheet.cell(row,6,row,6,true).string(item.city).style(style2);
                    worksheet.cell(row,7,row,7,true).string(item.suburb).style(style2);
                    worksheet.cell(row,8,row,8,true).string(item.street).style(style2);
                    row++;
                }
        }
    
        return workbook;  
    }

    getCustomerScheduleAllDaysReport(records:SellerClientScheduleData[]){
        var workbook = new excel.Workbook();
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        let style2={alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        if(records.length>0){
            let monday = records.filter((x)=>x.monday==1);
            let tuesday=records.filter((x)=>x.tuesday==1);
            let wednesday=records.filter((x)=>x.wednesday==1);
            let thursday=records.filter((x)=>x.thursday==1);
            let friday =records.filter(x=>x.friday==1);
            let saturday=records.filter((x)=>x.saturday==1);
            let currentSeller="";
            let days=["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
            let worksheet=null;
            for(let day of days){
                worksheet = workbook.addWorksheet(day);
                let currentArray =[];
                switch(day){
                    case "Lunes":
                        currentArray=monday;
                        break;
                    case "Martes":
                        currentArray=tuesday;
                        break;
                    case "Miercoles":
                        currentArray=wednesday;
                        break;
                    case "Jueves":
                        currentArray=thursday;
                        break;
                    case "Viernes":
                        currentArray=friday;
                        break;
                    case "Sabado":
                        currentArray=saturday;
                        break;
                }

                if(currentArray.length>0){
                    let row=1;
                    currentSeller = records[0].sellerName;
                    worksheet.cell(row,1,row,6,true).string('Vendedor: '+currentSeller).style(style);
                    row=3;
                    worksheet.cell(row,1,row,1,true).string('Nombre').style(style);
                    worksheet.cell(row,2,row,2,true).string('Tipo').style(style);
                    worksheet.cell(row,3,row,3,true).string('Clave Sistema').style(style);
                    worksheet.cell(row,4,row,4,true).string('Clave SAE').style(style);
                    worksheet.cell(row,5,row,5,true).string('Estatus').style(style);
                    worksheet.cell(row,6,row,6,true).string('Ciudad').style(style);
                    worksheet.cell(row,7,row,7,true).string('Colonia').style(style);
                    worksheet.cell(row,8,row,8,true).string('Dirección').style(style);
                    row++;
                    for(let item of currentArray){        
                        if(currentSeller!=item.sellerName){
                            currentSeller=item.sellerName;
                            row++;
                            worksheet.cell(row,1,row,6,true).string('Vendedor: '+currentSeller).style(style);
                            row++;
                            worksheet.cell(row,1,row,1,true).string('Nombre').style(style);
                            worksheet.cell(row,2,row,2,true).string('Tipo').style(style);
                            worksheet.cell(row,3,row,3,true).string('Clave Sistema').style(style);
                            worksheet.cell(row,4,row,4,true).string('Clave SAE').style(style);
                            worksheet.cell(row,5,row,5,true).string('Estatus').style(style);
                            worksheet.cell(row,6,row,6,true).string('Ciudad').style(style);
                            worksheet.cell(row,7,row,7,true).string('Colonia').style(style);
                            worksheet.cell(row,8,row,8,true).string('Dirección').style(style);
                            row++;
                        }
                        worksheet.cell(row,1,row,1,true).string(item.name).style(style2);
                        worksheet.cell(row,2,row,2,true).string(item.typeClient.toString()).style(style2);
                        worksheet.cell(row,3,row,3,true).string(item.keyClient.toString()).style(style2);
                        worksheet.cell(row,4,row,4,true).string(item.aspelKey.toString()).style(style2);
                        worksheet.cell(row,5,row,5,true).string(item.status=="ACTIVE"?"Activo":"Desactivado").style(style2);
                        worksheet.cell(row,6,row,6,true).string(item.city).style(style2);
                        worksheet.cell(row,7,row,7,true).string(item.suburb).style(style2);
                        worksheet.cell(row,8,row,8,true).string(item.street).style(style2);
                        row++;
                    }
                    currentSeller="";    
                }
            }
            
            
                            
                
        
        }
        return workbook;  
    }

    getSellerSoldsPeriod(items:SellerSoldPeriod[],request:SellerReportSoldPeriod){
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Reporte');
        let monthStr = this.getMonthByNumber(request.month);
        let periodOne ="";
        let periodTwo ="";
        if(request.typePeriod==3){
            periodOne=`Mes completo de ${monthStr} de ${request.year}`;
            periodTwo=`Mes completo de ${monthStr} de ${request.oldYear}`;
        }else{
         periodOne=`${request.typePeriod} Quincena de ${monthStr} de ${request.year}`;
         periodTwo=`${request.typePeriod} Quincena de ${monthStr} de ${request.oldYear}`;
        }
        let style= {font: {
            bold: true
        },
        alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        let style2={alignment: {
            wrapText: true,
            horizontal: 'center',
        }};
        worksheet.cell(1,1,1,11,true).string("Reporte de crecimientos").style(style);
        let row=2;
        let headerRow=2;
        let periodOneHeader=2;
        let periodTwoHeader=2;
        
        let sellerMap = new Map<string,SellerSoldPeriod[]>();
        for(let item of items){
            let sellerMapObject = sellerMap.get(item.sellerId);
            if(!sellerMapObject){
                sellerMap.set(item.sellerId,[item]);
            }else{
                sellerMapObject.push(item);
                sellerMap.set(item.sellerId,sellerMapObject);
            }
        }
        for(let [key,value] of sellerMap.entries()){
            let mapProducts = new Map<number,SellerSoldPeriod>();
            let periodOneArray:SellerSoldPeriod[] =[];
            for(let sold of value){
                
                if(sold.period==1){
                    periodOneArray.push(sold);
                }else{
                    mapProducts.set(sold.productId,sold);
                }
            }
            headerRow=row+1;
            periodOneHeader=headerRow+1;
            periodTwoHeader=headerRow+2;
            row=periodTwoHeader+1;
            let titleAdded=false;
            if(periodOneArray.length){
                worksheet.cell(headerRow,1,headerRow,2,true).string(`Vendedor: ${periodOneArray[0].sellerName}`).style(style);
                worksheet.cell(periodOneHeader,1,periodOneHeader,2,true).string(`Periodo actual: ${periodOne}`).style(style);
                worksheet.cell(periodTwoHeader,1,periodTwoHeader,2,true).string(`Periodo anterior: ${periodTwo}`).style(style);
                worksheet.cell(row,1,row,1,true).string('Clave producto').style(style);
                worksheet.cell(row,2,row,2,true).string('Nombre producto').style(style);
                worksheet.cell(row,3,row,3,true).string('Total periodo Actual (Kg/Pz)').style(style);
                worksheet.cell(row,4,row,4,true).string('Total periodo Anterior (Kg/Pz)').style(style);
                worksheet.cell(row,5,row,5,true).string('Crecimiento').style(style);
                titleAdded=true;
                row++;
            
                for(let oldSold of periodOneArray){
                    worksheet.cell(row,1,row,1,true).string(oldSold.code).style(style2);
                    worksheet.cell(row,2,row,2,true).string(oldSold.product).style(style2);
                    
                    let newQuantity=0;
                    let newObject = mapProducts.get(oldSold.productId);
                    let percent = 1;
                    if(newObject){
                        newQuantity=newObject.quantity;
                        let maxValue=0;
                        let minValue=0;
                        let mult=1;
                        if(newQuantity<oldSold.quantity){
                            maxValue = oldSold.quantity;
                            minValue=newQuantity;
                            mult=-1;
                            percent = (((maxValue-minValue)*100)/(maxValue))*mult;
                        }else{
                            maxValue = newQuantity;
                            minValue= oldSold.quantity;
                            percent = (((maxValue-minValue)*100)/(minValue))*mult;
                        }
                        
                    }else{
                        percent=-100;
                    }
                    worksheet.cell(row,3,row,3,true).string((+newQuantity.toFixed(2)).toLocaleString()).style(style2);
                    worksheet.cell(row,4,row,4,true).string((+oldSold.quantity.toFixed(2)).toLocaleString()).style(style2);
                    worksheet.cell(row,5,row,5,true).string(`${(+percent.toFixed(2)).toLocaleString()} %`).style(style2);
                    mapProducts.delete(oldSold.productId);
                    row++;
                }
            }
            if(mapProducts.size>1){
                for(let [key,value] of mapProducts.entries()){
                    if(!titleAdded){
                        worksheet.cell(headerRow,1,headerRow,2,true).string(`Vendedor: ${value.sellerName}`).style(style);
                        worksheet.cell(periodOneHeader,1,periodOneHeader,2,true).string(`Periodo actual: ${periodOne}`).style(style);
                        worksheet.cell(periodTwoHeader,1,periodTwoHeader,2,true).string(`Periodo anterior: ${periodTwo}`).style(style);
                        worksheet.cell(row,1,row,1,true).string('Clave producto').style(style);
                        worksheet.cell(row,2,row,2,true).string('Nombre producto').style(style);
                        worksheet.cell(row,3,row,3,true).string('Total periodo Actual (Kg/Pz)').style(style);
                        worksheet.cell(row,4,row,4,true).string('Total periodo Anterior (Kg/Pz)').style(style);
                        worksheet.cell(row,5,row,5,true).string('Crecimiento').style(style);
                        titleAdded=true;
                        row++;
                    }
                    worksheet.cell(row,1,row,1,true).string(value.code).style(style2);
                    worksheet.cell(row,2,row,2,true).string(value.product).style(style2);
                    worksheet.cell(row,3,row,3,true).string((+value.quantity.toFixed(2)).toLocaleString()).style(style2);
                    worksheet.cell(row,4,row,4,true).string("0.00").style(style2);
                    worksheet.cell(row,5,row,5,true).string(`100%`).style(style2);
                    mapProducts.delete(value.productId);
                    row++;
                }
            }
            mapProducts.clear();
        }
        return workbook;  
    }

    parseDate(date:Date){
        let month = date.getMonth()+1;
        let montStr =this.getMonthByNumber(month);
        return date.getDate()+" de "+montStr+" del "+date.getFullYear();
    }

    getMonthByNumber(month:number){
        let montStr="";
        switch(month){
            case 1:
                montStr="Enero";
                break;
            case 2:
                montStr="Febrero";
                break;
            case 3:
                montStr="Marzo";
                break;
            case 4:
                montStr="Abril";
                break;
            case 5: 
                montStr="Mayo";
                break;
            case 6:
                montStr="Junio";
                break;
            case 7:
                montStr="Julio";
                break;
            case 8:
                montStr="Agosto";
                break;
            case 9:
                montStr="Septiembre";
                break;
            case 10:
                montStr="Octubre";
                break;
            case 11:
                montStr="Noviembre";
                break;
            case 12:
                montStr="Diciembre";
                break;
        }
        return montStr;
    }
    async getDailyPreSaleReport(records:DailyReportRecord[]){
        var workbook = new excel.Workbook();
        /*let dates = [];
        for(let i=0;i<records.length;i++){
            if(!dates.includes(records[i].fecha)){
                dates.push(records[i].fecha);
            }
        }*/
        let indexToStart=0;
        //for(let i=0;i<dates.length;i++){
        //    let firstDate = dates[i];
            //let worksheet = workbook.addWorksheet(firstDate);
            let worksheet = workbook.addWorksheet("Reporte");
            let style= {font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }};
            let style2={alignment: {
                wrapText: true,
                horizontal: 'center',
            }};
            worksheet.cell(1,1,1,6,true).string('Reporte de venta diaria por cliente por prevendedor').style(style);
            let row=2;  
            worksheet.column(1).setWidth(50);
            worksheet.column(2).setWidth(50);
            worksheet.column(3).setWidth(120);
            worksheet.column(4).setWidth(40);
            worksheet.column(5).setWidth(20);
            worksheet.column(6).setWidth(20);
            worksheet.column(7).setWidth(20);
            worksheet.column(8).setWidth(20);
            worksheet.cell(row,1,row,1,true).string('Prevendedor').style(style);
            worksheet.cell(row,2,row,2,true).string('Nombre cliente').style(style);
            worksheet.cell(row,3,row,3,true).string('Dirección').style(style);
            worksheet.cell(row,4,row,4,true).string('Contacto').style(style);
            worksheet.cell(row,5,row,5,true).string('Fecha').style(style);
            worksheet.cell(row,6,row,6,true).string('Total en KG').style(style);
            worksheet.cell(row,7,row,7,true).string('Total en $').style(style);
            worksheet.cell(row,8,row,8,true).string('Dias de visita').style(style);
            row++;
            let vendedorId="";
            let totalKgGlobal=0;
            let totalMontoGlobal=0;
            for(let g=indexToStart;g<records.length;g++){
                let item= records[g];
                /*if(firstDate!=item.fecha){
                    indexToStart=g;
                    break;
                }*/
                if(vendedorId==""){
                    vendedorId=item.vendedorId;
                }else if(vendedorId!=item.vendedorId){
                    vendedorId=item.vendedorId;
                    worksheet.cell(row,6,row,6,true).string('Total: '+totalKgGlobal.toFixed(2));
                    worksheet.cell(row,7,row,7,true).string('Total: $'+(+totalMontoGlobal.toFixed(2)).toLocaleString());
                    row++;
                    totalKgGlobal=0;
                    totalMontoGlobal=0;
                }
                worksheet.cell(row,1,row,1,true).string(item.vendedor);
                worksheet.cell(row,2,row,2,true).string(item.nombre);
                worksheet.cell(row,3,row,3,true).string(getParseAddress(item));
                worksheet.cell(row,4,row,4,true).string(item.contacto?item.contacto:"");
                worksheet.cell(row,5,row,5,true).string(item.fecha);
                worksheet.cell(row,6,row,6,true).string(item.totalKg.toFixed(2));
                worksheet.cell(row,7,row,7,true).string("$"+(+item.totalMonto.toFixed(2)).toLocaleString());
                worksheet.cell(row,8,row,8,true).string(getParseDays(item));
                row++;
                totalKgGlobal+=item.totalKg;
                totalMontoGlobal+=item.totalMonto;
            }
            worksheet.cell(row,6,row,6,true).string('Total: '+totalKgGlobal.toFixed(2));
            worksheet.cell(row,7,row,7,true).string('Total: $'+(+totalMontoGlobal.toFixed(2)).toLocaleString());
            totalKgGlobal=0;
            totalMontoGlobal=0;
        //}
        
    
        return workbook;  
    }

    async getDailySaleReport(records:DailyReportSalesADayRecord[],title:string){
        var workbook = new excel.Workbook();
        /*let dates = [];
        for(let i=0;i<records.length;i++){
            if(!dates.includes(records[i].section)){
                dates.push(records[i].section);
            }
        }*/
        let indexToStart=0;
        let row=2;
        //for(let i=0;i<dates.length;i++){
            row=2;
        //    let firstDate = dates[i];
            //let worksheet = workbook.addWorksheet(firstDate);
            let worksheet = workbook.addWorksheet("Reporte");
            let style= {font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }};
            worksheet.cell(1,1,1,6,true).string(title).style(style);
             
            worksheet.cell(row,1,row,1,true).string('Prevendedor').style(style);
            //worksheet.cell(row,2,row,2,true).string('Folio').style(style);
            worksheet.column(1).setWidth(25);
            worksheet.column(2).setWidth(20);
            worksheet.column(3).setWidth(10);
            worksheet.column(4).setWidth(30);
            worksheet.column(5).setWidth(10);
            worksheet.column(6).setWidth(50);
            worksheet.column(7).setWidth(50);
            row++;
            let vendedorId="";
            let totalSellerAmountGlobal=0;
            let totalPerSale=0;
            let currentFolio="";
            for(let g=indexToStart;g<records.length;g++){
                
                let item= records[g];
                /*if(firstDate!=item.section){
                    indexToStart=g;
                    break;
                }*/
                if(currentFolio==""){
                    currentFolio=item.folio;
                    worksheet.cell(row,1,row,1,true).string(item.vendedor).style(style);
                    row++;
                    worksheet.cell(row,2,row,2,true).string("Fecha").style(style);
                    worksheet.cell(row,3,row,3,true).string("Folio").style(style);
                    worksheet.cell(row,4,row,4,true).string("Prevendedor").style(style);
                    worksheet.cell(row,5,row,5,true).string("Clave cliente").style(style);
                    worksheet.cell(row,6,row,6,true).string("Nombre cliente").style(style);
                    worksheet.cell(row,7,row,7,true).string("Producto").style(style);
                    worksheet.cell(row,8,row,8,true).string("Cantidad").style(style);
                    worksheet.cell(row,9,row,9,true).string("Monto").style(style);
                    row++;
                }else if(currentFolio!=item.folio){
                    currentFolio=item.folio;
                    worksheet.cell(row,8,row,8,true).string('Total: ').style(style);
                    worksheet.cell(row,9,row,9,true).string('$'+(+totalPerSale.toFixed(2)).toLocaleString()).style(style);
                    totalSellerAmountGlobal+=totalPerSale;
                    totalPerSale=0;
                    row++;
                }
                if(vendedorId==""){
                    vendedorId=item.vendedorId;
                }else if(vendedorId!=item.vendedorId){
                    vendedorId=item.vendedorId;
                    worksheet.cell(row,8,row,8,true).string('Total del vendedor: ').style(style);
                    worksheet.cell(row,9,row,9,true).string('$'+(+totalSellerAmountGlobal.toFixed(2)).toLocaleString());
                    totalSellerAmountGlobal=0;
                    row++;
                    worksheet.cell(row,1,row,1,true).string(item.vendedor);
                    
                    row++;
                    worksheet.cell(row,2,row,2,true).string("Fecha").style(style);
                    worksheet.cell(row,3,row,3,true).string("Folio").style(style);
                    worksheet.cell(row,4,row,4,true).string("Prevendedor").style(style);
                    worksheet.cell(row,5,row,5,true).string("Clave cliente").style(style);
                    worksheet.cell(row,6,row,6,true).string("Nombre cliente").style(style);
                    worksheet.cell(row,7,row,7,true).string("Producto").style(style);
                    worksheet.cell(row,8,row,8,true).string("Cantidad").style(style);
                    worksheet.cell(row,9,row,9,true).string("Monto").style(style);
                    row++;
                }
                let modificated=false;
                for(let h=g;h<records.length;h++){
                    let record= records[h];
                    if(record.folio!=currentFolio){
                        g=(h-1);
                        break;
                    }
                    if(item.modificated && !modificated){
                        worksheet.cell(row,1,row,1,true).string(item.modificated?"Preventa Modificada":"");
                    }
                    worksheet.cell(row,2,row,2,true).string(record.section);
                    worksheet.cell(row,3,row,3,true).string(record.folio);
                    worksheet.cell(row,4,row,4,true).string(record.prevendedor?record.prevendedor:"");
                    worksheet.cell(row,5,row,5,true).string(record.claveCliente?record.claveCliente.toString():"");
                    worksheet.cell(row,6,row,6,true).string(record.nombreCliente);
                    worksheet.cell(row,7,row,7,true).string(record.producto+" "+record.presentacion);
                    worksheet.cell(row,8,row,8,true).string(record.cantidad.toFixed(2));
                    worksheet.cell(row,9,row,9,true).string((+record.monto.toFixed(2)).toLocaleString());
                    row++;
                    totalPerSale+=record.monto;
                    if(item.modificated){
                        modificated=true;
                    }
                }
                
            }
            worksheet.cell(row,8,row,8,true).string('Total del vendedor: ');
            worksheet.cell(row,9,row,9,true).string('$'+(+totalSellerAmountGlobal.toFixed(2)).toLocaleString());
            totalSellerAmountGlobal=0;
        //}
        return workbook;  
    }

    async getDailyEffectiveDeliverReport(dateStart:string,dateEnd:string,records:EffectiveDeliverPreSalesReport[]){
            var workbook = new excel.Workbook();
            /*let dates= [];
            for(let record of records){
                if(!dates.includes(record.section)){
                    dates.push(record.section);
                }
            }*/
            let style= {font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }};
            //let dateStr = "";
            let indexToStart=0;
            //for(let i=0;i<dates.length;i++){
            //    dateStr=dates[i];
            //let worksheet = workbook.addWorksheet(dateStr);
                let worksheet = workbook.addWorksheet("Reporte");
                worksheet.cell(1,1,1,7,true).string("Reporte de efectividad de Entrega").style(style);
                worksheet.cell(2,2,2,2,true).string("Desde: "+dateStart).style(style);
                worksheet.cell(2,4,2,4,true).string("Hasta: "+dateEnd).style(style);

                worksheet.column(1).setWidth(20);
                worksheet.column(2).setWidth(30);
                worksheet.column(3).setWidth(10);
                worksheet.column(4).setWidth(10);
                worksheet.column(5).setWidth(10);
                worksheet.column(6).setWidth(40);
                worksheet.column(7).setWidth(10);
                worksheet.column(8).setWidth(10);
                worksheet.column(9).setWidth(10);
                worksheet.column(10).setWidth(10);
                worksheet.cell(3,1,3,1,true).string('Fecha').style(style);
                worksheet.cell(3,2,3,2,true).string('Prevendedor').style(style);
                worksheet.cell(3,3,3,3,true).string('Folio de Preventa').style(style);
                worksheet.cell(3,4,3,4,true).string("Monto Preventa").style(style);
                worksheet.cell(3,5,3,5,true).string("Clave Cliente").style(style);
                worksheet.cell(3,6,3,6,true).string("Nombre Cliente").style(style);
                worksheet.cell(3,7,3,7,true).string('Folio Venta').style(style);
                worksheet.cell(3,8,3,8,true).string('Monto Venta').style(style);
                worksheet.cell(3,9,3,9,true).string('Modificó').style(style);
                worksheet.cell(3,10,3,10,true).string('Entregado').style(style);
                let row=4;
                for(let h=indexToStart;h<records.length;h++){
                    let item = records[h];
                    /*if(item.section!=dateStr){
                        indexToStart=h;
                        break;
                    }*/
                    worksheet.cell(row,1,row,1,true).string(item.section);
                    worksheet.cell(row,2,row,2,true).string(item.vendedor);
                    worksheet.cell(row,3,row,3,true).string(item.folio);
                    worksheet.cell(row,4,row,4,true).string((+item.monto.toFixed(2)).toLocaleString());
                    worksheet.cell(row,5,row,5,true).string(item.claveCliente?item.claveCliente.toString():"");
                    worksheet.cell(row,6,row,6,true).string(item.nombreCliente);
                    worksheet.cell(row,7,row,7,true).string(item.folioVenta!=null?item.folioVenta:"");
                    worksheet.cell(row,8,row,8,true).string(item.montoVenta!=null?(+item.montoVenta.toFixed(2)).toLocaleString():"");
                    worksheet.cell(row,9,row,9,true).string(item.modificado?"SI":"NO");
                    worksheet.cell(row,10,row,10,true).string(item.folioVenta!=null?"SI":"NO");
                    row++;
                }
                
            //}
                
            return workbook;
    }

    async getVisitsADaySellersReport(dateStart:string,dateEnd:string,records:VisitDailyRecord[]){
        var workbook = new excel.Workbook();
            let dates= [];
            for(let record of records){
                if(!dates.includes(record.section)){
                    dates.push(record.section);
                }
            }
            let dateStr = "";
            let indexToStart=0;
            
            for(let i=0;i<dates.length;i++){
                dateStr=dates[i];
                let worksheet = workbook.addWorksheet(dateStr);
                worksheet.cell(1,1,1,1,true).string("Desde: "+dateStart);
                worksheet.cell(1,3,1,3,true).string("Hasta: "+dateEnd);


                worksheet.column(1).setWidth(30);
                worksheet.column(2).setWidth(50);
                worksheet.column(3).setWidth(30);
                worksheet.cell(3,1,3,1,true).string('Vendedor');
                worksheet.cell(3,2,3,2,true).string('Cliente');
                worksheet.cell(3,3,3,3,true).string("Visito");
                
                let row=4;
                let totalYes=0;
                let totalNo=0;
                let vendedorId:string="";

                for(let h=indexToStart;h<records.length;h++){
                    let item = records[h];
                    if(item.section!=dateStr){
                        indexToStart=h;
                        break;
                    }
                    if(vendedorId==""){
                       vendedorId=item.vendedorId; 
                    }else if(vendedorId!=item.vendedorId){
                        vendedorId=item.vendedorId;
                        worksheet.cell(row,2,row,2,true).string("% Cumplido");
                        worksheet.cell(row,3,row,3,true).string("%"+((100/(totalYes+totalNo))*totalYes).toFixed(2));
                        totalYes=0;
                        totalNo=0;
                        row++;
                    }
                    worksheet.cell(row,1,row,1,true).string(item.vendedor);
                    worksheet.cell(row,2,row,2,true).string(item.cliente);
                    worksheet.cell(row,3,row,3,true).string(item.visito==1?"SI":"NO");
                    if(item.visito==1){
                        totalYes++;
                    }else{
                        totalNo++;
                    }
                    row++;
                }
                
            }
                
        return workbook;
    }
}