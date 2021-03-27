
import LOGO from '../Models/Logo';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
import { WarehouseDrief } from '../Models/Entity/Warehouse.Drief';
import { RevisionsOvenProducts } from '../Models/Entity/Revisions.Oven.Products';
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { Process } from '../Models/Entity/Process';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { Packaging } from '../Models/Entity/Packaging';
import { DryingLabel } from '../Models/Entity/Dryng.Label';
import { GrindingRepository } from '../Repositories/Grinding.Repository';
import { Grinding } from '../Models/Entity/Grinding';
import { Devolution } from '../Models/Entity/Devolution';
import { OrderSeller } from '../Models/Entity/Order.Seller';
import { Reprocessing } from '../Models/Entity/Reprocessing';
import { CheeseRepository } from '../Repositories/Cheese.Repository';
import { LotsStockInventoryPresentation, OutputsDeliveryPlant } from '../Models/DTO/PackagingDTO';



export default class PdfHelper{

    private grindingRepository:GrindingRepository;
    private cheeseRepository:CheeseRepository;
    constructor(){
        this.cheeseRepository = new CheeseRepository();
        this.grindingRepository=new GrindingRepository();
    }

    getReportInventory(items:LotsStockInventoryPresentation[],name:string){
        let content= `<html><body>`;
        content+=`<h1 style="text-align:center">${name}</h1>`;
        content+=`<table><tr><th>Producto</th><th>Presentación</th><th>Lote</th><th>Unidades</th><th>Peso</th></tr>`;
        for(let item of items){
            content+=`<tr>
            <td>${item.name}</td>
            <td>${item.type_presentation}</td>
            <td>${item.lot_id}</td>
            <td>${item.units}</td>
            <td>${item.weight}</td>
            </tr>`;
        }
        content+=`</body></html>`;
        return content;
    }

    getReportOfOrdersSellers(orders:OrderSeller[]){
        let reports=[];
        let content = ``;
        if(orders.length){
            for(let order of orders){
                content+=`
                    <html><head>
                <style>
                table {
                    border-collapse: collapse;
                    }
                    table, td, th {
                    border: 1px solid black;
                    }
                    
                </style>
                </head><body>
                <h3 style="text-align:center">Reporte de ordenes de vendedores</h3>
                <h3 style="text-align:center">Orden No. ${order.id}</h3>
                <table border=1>
                <tr><th>Vendedor</th>
                <th>Producto</th>
                <th>Presentacion</th>
                <th>Cantidad</th>
                <th>Observaciones</th>
                <th>Urgente</th>
                </tr>
                <tr>
                <td>${order.seller.name}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`;
                for(let subOrder of order.subOrders){
                    content+=`
                    <tr>
                    <td style="font-size: 8px">${subOrder.presentation.keySae}</td>
                    <td>${subOrder.productRovianda.name}</td>
                    <td>${subOrder.presentation.presentationType}</td>
                    <td>${subOrder.units}</td>
                    <td>${subOrder.observations?subOrder.observations:""}</td>
                    <td>${order.urgent?"SI":"NO"}</td>
                    </tr>
                    `;
                }
                content+=`<table></html>`;
                reports.push(content);
                content="";
            }
        }else{
            reports.push(`<html><body><h1>No hay ordenes</h1></body></html>`);
        }
        
        return reports;
    }
    
    headReportEntranceDrief(){
        return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabla 1</title>
        <style>
            .ta{
                width:400px;   
                text-align: left;
            }
            .ma{
               text-align: left;
               width: 300px;
            }
            #fec{ 
                width:148px;
            }
            header{
                text-align: center;
                margin-top: -94px;
            }
            #mueve{
                width: 185px;
                margin-left: 340px
            }
            img{
                width: 60px;
                height:80px;
                transform: translateY(78%) translateX(474%);
            }
            #title{
            transform: translateY(507%) translateX(-2%);
            top: 200px;
            }
        </style>
        </head>
        `;
    }

    bodyReportEntranceDrief(user:User,drief:EntranceDrief){
        return `
        <body>
        <br><br>
        <div id="pageHeader">
            <b><p align="center">RECEPCIÓN DE MATERIA PRIMA SECOS</p></b>
        </div>
        
        <table border="1" width="80%" align="center">
            <tr>
                <th colspan="2" rowspan="3"><img src="${LOGO.data}" alt="" ></th>
                <th class="ta" colspan="2">Nombre: ${user.name} </th>
                <th></th>
            </tr>

            <tr>
                <th class="ta" colspan="2">Firma: </th>
                <th></th>
            </tr>

            <tr>
                <th class="ta" colspan="2">Puesto: ${user.job}</th>
                <th></th>
            </tr>
            
        <!--------------------------------------------------------------------------->
            <tr>
                <th colspan="2" >Materia prima: ${drief.product.description}</th>
                <th  rowspan="2" colspan="2" >Lote proveedor: ${drief.loteProveedor}</th>
                <th  id="fec" rowspan="2">Fecha: ${drief.date}</th>
            </tr>

            <tr>
                <th colspan="2">Proveedor: ${drief.proveedor}</th>
                
            </tr>
        <!--------------------------------------------------------------------------->
        
            <tr>
                <th>Control</th>
                <th>Estandar</th>
                <th>Aceptado</th>
                <th>Rechazado</th>
                <th>Observaciones</th>
            </tr>

            <tr>
                <th>Certificado de calidad</th>
                <th>Entrega de Certificado</th>
                <th>${drief.quality?"Ok":""}</th>
                <th>${!drief.quality?"Ok":""}</th>
                <th>${drief.observations}</th>
            </tr>
            <tr>
                <th>Caducidad</th>
                <th>Vigente</th>
                <th>${drief.expiration ? "Ok" : ""}</th>
                <th>${!drief.expiration ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Materia Extraña</th>
                <th>Ausente</th>
                <th>${drief.strangeMaterial ? "Ok" : ""}</th>
                <th>${!drief.strangeMaterial ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Transporte</th>
                <th>Limpio</th>
                <th>${drief.transport ? "Ok" : ""}</th>
                <th>${!drief.transport ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Empaque</th>
                <th>Sin daños y limpio</th>
                <th>${drief.paking ? "Ok" : ""}</th>
                <th>${!drief.paking ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Olor</th>
                <th>Caracteristico</th>
                <th>${drief.odor ? "Ok" : ""}</th>
                <th>${!drief.odor ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Color</th>
                <th>Caracteristico</th>
                <th>${drief.color ? "Ok" : ""}</th>
                <th>${!drief.color ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Textura</th>
                <th>Caracteristico</th>
                <th>${drief.texture ? "Ok" : ""}</th>
                <th>${!drief.texture ? "Ok" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Peso</th>
                <th>Según Empaque</th>
                <th>${drief.weight ? "Ok" : ""}</th>
                <th>${!drief.weight ? "Ok" : ""}</th>
                <th></th>
            </tr>
            <tr>
                <td colspan="2">Se recibió: </td>
                <td colspan="3">${drief.quantity}</td>
            </tr>
            <tr style="border:0px">
                <td style="border:0px;"></td>
                <td style="border:0px;"></td>
                <td style="border:0px;"></td>
                <td style="border:0px;"></td>     
                <td >F-CAL-RO-02</td>
            </tr>
            
        </table>
    </body>
    </html>
        `;
    }


    async reportEntranceDrief(user:User,drief:EntranceDrief){
        let content = this.headReportEntranceDrief()+this.bodyReportEntranceDrief(user,drief);
        return content;
    }

    reportDryingLaberById(product: ProductRovianda, drying: DryingLabel){
        let html = this.headReportDryingLabelById() + this.bodyReportDryingLabelById(product, drying);
        return html;
    }

    headReportDryingLabelById(){
        return`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rovianda</title>
            <style>
                .espa{
                height: 15px;
                }

                .separa{
                height: 15px;
                }

                table{
                    border-collapse: collapse;
                }

                .enbloque {
                    display: block;
                }
                .normal {
                    border-bottom: 1px solid #000;
                    border-top: 1px solid #000;
                    border-right: 1px solid #000;
                    border-left: 1px solid #000;
                }
                .special1{
                    border-bottom: 1px solid #000;
                    border-top: 1px solid #000;
                    border-left: 1px solid #000;
                }
                .special2{
                    border-bottom: 1px solid #000;
                    border-top: 1px solid #000;
                    border-right: 1px solid #000;
                }

            </style>
        </head>`;
    }

    bodyReportDryingLabelById(product: ProductRovianda, drying: DryingLabel){
        return  `
            <body>
                <div id="pageHeader">
                    <b><p align="center">ETIQUETA DE SECADO</p></b>
                </div>
                <br>
                <table border="1" width="80%" align="center">
                    <tr>
                        <th>Producto</th>
                        <td colspan="5">${product ? product.name : "" }</td>
                    </tr>
                    <tr>
                        <th class="normal">Fecha de entrada</th>
                        <td class="normal">${drying.dateEntrance}</td>
                        <th class="special2">Fecha de salida</th>
                        <td class="special1">${drying.dateOutput}</td>
                        <th class="special2">lote</th>
                        <td class="special1">${drying.lotId}</td>
                    </tr>
                </table>
            </body>
        </html>`
    }


    headReportEntranceMeat(){
        return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rovianda</title>
        <style>
            .espa{
            height: 15px;
            }

            .separa{
            height: 15px;
            }

            table{
            border: #65768C 3px solid;
            }

            .enbloque {
                display: block;
            }
        </style>
    </head>`;
    }

    bodyReportEntranceMeat(user:User,meat:EntranceMeat){
        let date= new Date();
        date.setHours(date.getHours()-6);
        let day = date.getDate().toString();
        let month = (date.getMonth()+1).toString();
        if(+day<10){
            day='0'+day;
        }
        if(+month<10){
            month='0'+month;
        }
        let conten1=`
        <body bgcolor="">

        <table  align="center" border="1px"   width="85%" > 
        <caption>
            <b><p align="center">ROVIANDA S.A.P.I. DE C.V.</p></b>
            <font size=2><p align="center">RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</p></font>
        </caption>
         <tr>
            <td rowspan="2" align="center">  <img src="${LOGO.data}" alt=""  height="60px"></td>
            <td align="center" rowspan="2" colspan="3"><font size=1>LOTE INTERNO: ${meat.loteInterno}</font> </td>
            <td align="center" rowspan="2" colspan="2"><font size=1>Pág.:1 de 1</font></td>
         </tr>
         <tr></tr>
         <tr>
            <th><font size=1>Fecha de recepción</font></th>
            <th><font size=1>Proveedor</font</th>
            <th colspan="2"><font size=1>Materia prima</font></th>
            <th><font size=1>Lote proveedor</font></th>
         </tr>
<!-- ************************************************************************************************-->
         <tr>
            <th class="espa"><font size=1>${meat.createdAt}</font></th>
            <th class="espa"><font size=1>${meat.proveedor}</font></th>
            <th class="espa"  colspan="2"><font size=1>${meat.rawMaterial}</font></th>
            <th class="espa"><font size=1>${meat.loteProveedor}</font></th>
         </tr>
<!-- ************************************************************************************************-->  
        <th><font size=1>Control</font></th>
        <th><font size=1>Estándar</font></th>
        <th><font size=1>Aceptado</font></th>
        <th><font size=1>Rechazado</font></th>
        <th><font size=1>Observaciones</font></th>
<!-- ************************************************************************************************-->
         <tr>
            <td><font size=1>Transporte</font> </td>
            <td><font size=1>Limpio, sin olores,sin material ajeno, sin plagas</font></td>
            <td><font size=1>${meat.transport.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.transport.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.transport.observations ? meat.transport.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Empaque</font></td>
            <td><font size=1>Sin daños y limpio</font> </td>
            <td><font size=1>${meat.packing.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.packing.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.packing.observations ? meat.packing.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Caducidad</font></td>
            <td><font size=1>Vigente:</font></td>
            <td><font size=1>${meat.expiration.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.expiration.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.expiration.observations ? meat.expiration.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Peso</font></td>
            <td><font size=1>Según el empaque</font></td>
            <td><font size=1>${meat.weight.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.weight.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.weight.value ? meat.weight.value : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Materia extraña</font></td>
            <td><font size=1>Ausente</font></td>
            <td><font size=1>${meat.strangeMaterial.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.strangeMaterial.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.strangeMaterial.observations ? meat.strangeMaterial.observations : ""}</font></td>
         </tr>
        `;
        let conten2="";
        if(+meat.temperature.value <= 4 && +meat.temperature.value >= -17){
            conten2= `
            <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>${meat.temperature.accepted  ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.temperature.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.temperature.value ? meat.temperature.value : ""}</font></td>
         </tr>  
         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>N/A</font></td>
            <td><font size=1>N/A</font></td>
            <td><font size=1></font></td>
         </tr>
            `;
        }
        if(+meat.temperature.value <= -18){
            conten2= `
            <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>N/A</font></td>
            <td><font size=1>N/A</font></td>
            <td><font size=1></font></td>
         </tr>  
         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>${meat.temperature.accepted  ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.temperature.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.temperature.value ? meat.temperature.value : ""}</font></td>
         </tr>
            `;
        }
        let conten3=`
        <tr>
            <td><font size=1>Olor</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat.odor.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.odor.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.odor.observations ? meat.odor.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Color</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat.color.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.color.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.color.observations ? meat.color.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Textura</font></td>
            <td><font size=1>Firme, Característico</font></td>
            <td><font size=1>${meat.texture.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.texture.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.texture.observations ? meat.texture.observations : ""}</font></td>
         </tr>
         <tr>
            <td colspan="5"><font size=1>Desviación:</font></td>
         </tr>
         <tr>
            <td class ="separa" colspan="5"></td>
         </tr>
         <tr>
            <td colspan="5"><font size=1>Acción correctiva:</font></td>
         </tr>
         <tr>
            <td  class ="separa" colspan="5"></td>
         </tr>
         <tr>
            <td colspan="5" ><font size=1> Etiqueta:</font></td>
         </tr> 
         <tr>
         <td colspan="5"><div align="center"><img src="${meat.photo.url}" class="enbloque" height="100" width="140" border="1"/></div></td> 
         </tr> 
         <tr>
            <th ><font size=1>Inspector de calidad</font></th>
            <th ><font size=1>${meat.qualityInspector.name} </font> </th>
            <th colspan="3" ><font size=1>Firma:</font></th>
         </tr>
         <tr>
            <td colspan="4"></td>
            <td align="center"><font size=1>F-CAL-RO-04</font></td>
         </tr>
        </table>
      </body>
    </html>`;
        return conten1+conten2+conten3;
    }


    async reportEntranceMeat(user:User,meat:EntranceMeat){
        let content = this.headReportEntranceMeat()+this.bodyReportEntranceMeat(user,meat);
        return content;
    }


    headReportFormulationf(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Index4</title>
            <style>
                .wi{
                    width: 30px;
                    height: 20px;
                }
                #ta{
                    text-align: center;
                }
                .pro{
                    width: 110px;
                }
                #ini{
                    text-align: left;
                    margin-left: 80px;
                }
                
                
                #title{
                transform: translateY(507%) translateX(-2%);
                top: 200px;
                margin-left:65px;
                }
                header{
                    text-align: center;
                    margin-bottom: -70px;
                }
                #fo1{
                    height: 60px;
                    margin-left:23px;
                    width: 550px;
                }
                #fo{
                    margin-left: 375px;
                    width:200px ;
                }
            </style>
        </head>
        `;
    }

    bodyReportFormulation(formulation:Formulation,ingredents:FormulationIngredients[]){
        let content = `
        <body>
        <br>
        <br>
        <table id="ini" border="1" width="80%" >
        <caption>
            <b><p id="title"> ROVIANDA S.A.P.I. DE C.V.</p></b>
            <b><p id="title"> BITÁCORA DE CONTROL DE CALIDAD FORMULACIÓN</p></b>
        </caption>
            <tr>
            <td rowspan="3"><img src="${LOGO.data}" "width=120px" height="100px" ></td>
            <th colspan="5">Nombre: ${formulation.make.name}</th>
            </tr>
            <tr>
            <th colspan="5">Firma: </th>
            </tr>
            <tr>
            <th colspan="5">Puesto: ${formulation.make.job}</th>
            </tr>`;

        let content2 = `
            <tr>
                <td class="pro" >Producto</td>
                <td>Lote</td>
                <td>Temperatura carne</td>
                <td>Temperatura agua</td>
                <td>Ingredientes</td>
                <td>Fechas</td>
            </tr>
            <tr>
                <td class="wi">${formulation.productRovianda.name}</td>
                <td>${formulation.lotDay}</td>
                <td>${formulation.temp}</td>
                <td>${formulation.waterTemp}</td>
                <td>${ingredents[0].product.description}</td>
                <td>${new Date(formulation.date).toLocaleDateString()}</td>
            </tr>
        `;
        let content3 = "";
        for(let i = 1; i<ingredents.length; i++){
            content3=content3 + `
            <tr>
                <td class="wi"></td>
                <td></td>
                <td></td>
                <td></td>
                <td>${ingredents[i].product.description}</td>
                <td></td>
            </tr>
            `;
        }
        return content + content2 + content3;
    }

    footerReportFormulation(formulation:Formulation){
        return `
                <tr>
                    <td colspan="3">Verifico: ${formulation.verifit.name} </td>
                    <td>Firma:</td>
                    <td colspan="2">Puesto: ${formulation.verifit.job}</td>
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td><b>F-CAL-RO-05</b></td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }

    async reportFormulation(formulation:Formulation,ingredents:FormulationIngredients[]){
        let content = this.headReportFormulationf()+this.bodyReportFormulation(formulation,ingredents)+
        this.footerReportFormulation(formulation);
        return content;
    }



    headReportWarehouseDrief(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabla2</title>
        
        <style>     
        .lista{
            height: 25px;
        }
        .lista2{
            width: 300px;
        }
        
        img{
                  width: 80px;
                  height:100px;
                  transform: translateY(68%) translateX(394%);
                  border-radius: 15px;
              }
              P{
                transform: translateY(541%) translateX(33%);
              }
        
              .mueve{
                  width: 185px;
               margin-left: 858px;
               
            }
        
            .AL{
                height: 70px;
                width: 220px;
               margin-left: 821px;
             
            }
        header{
            margin-top: -5px;
        }
        
        .lo{
            width: 55px;
        }
        
            </style>
        </head>

      `;
    }

    bodyReportWarehouseDrief(data:WarehouseDrief[]){
       let content = `
       <body bgcolor="">
       <div id="pageHeader">
           <p align="center">EMPACADORA ROVIANDA S.A.P.I. DE C.V.</p>
           <P align="center">BITACORA DE CONTROL DE PEP´S ALAMACENES</P>
       </header>
        <br>
        <table border="1" align="center" width="100%">
            <tr>
                <td>
                    <img src="${LOGO.data}" alt="" align="left">
                </td>
                <td colspan="4"></td>
                <td align="left"> ALMACEN:</td>
            </tr>
           <tr>
               <th>Fecha de entrada</th>
               <th>Producto/Material</th>
               <th class="lo" >Lote</th>
               <th>Cantidad</th>
               <th>Unidad</th>
               <th>Observaciones</th>
           </tr>`;
       
        let content2 = "";
        for(let i = 0; i<data.length; i++){
            content2=content2 + `
            <tr>
                <th class="lista">${data[i].date}</th>
                <th class="lista">${data[i].product.description}</th>
                <th class="lista">${data[i].loteProveedor}</th>
                <th class="lista">${data[i].quantity}</th>
                <th class="lista"></th>
                <th class="lista">${data[i].observations}</th>
            </tr>
            `}
        

        let content3 = `
        
            <tr>     
                <td colspan="5"></td>
                <td >F-TZR-ROV-01</td>
            </tr>
        </table>
        </body>
      </html>`;

        return content+content2+content3;
    }

    async reportWarehouseDrief(data:WarehouseDrief[]){
        let content = this.headReportWarehouseDrief()+this.bodyReportWarehouseDrief(data);
        return content;
    }


    headReportEntrancePacking(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabla Nueva</title>
        <style>
            .ta{
                width:400px;   
                text-align: left;
            }
            .te{
                width:187px;   
                text-align: left;
            }
            .ma{
               text-align: left;
               width: 300px; 
            }
            #fec{
                width:148px;
            }
            header{
                text-align: center;
                margin-top: -94px;
            }
            #mueve{
                width: 185px;
                margin-left: 390px
            }
            #go{
                width: 185px;
                margin-left: 780px
            }
            img{
                width: 80px;
                height:100px;
                transform: translateY(78%) translateX(474%);
            }
            #title{
                transform: translateY(507%) translateX(-2%);
                top: 200px;
            }
        </style>
        </head>
        `;
    }

    bodyReportEntrancePacking(packing:EntrancePacking){
        return `
        <body>
        <br><br><br><br><br>
        <header>
            <b><p id="title">EMPACADORA ROVIANDA S.A.P.I DE C.V</p></b>
            <p id="title">BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES  </p>
        </header>
        <table border="1" align="center" style="width:90%">
        <tr>
        <td>
            <img src="${LOGO.data}" alt="" >
        </td>
        <td colspan="4">
            Nombre: ${packing.make ? packing.make.name : "" }
        </td>
        <td></td>
        </tr>
        <tr>
        <td>
            
        </td>
        <td colspan="4">
            Firma:
        </td>
        <td></td>
        </tr>
        <tr>
        <td>
            
        </td>
        <td colspan="4">
            Puesto: ${packing.make ? packing.make.job : "" }
        </td>
        <td></td>
        </tr>
        <tr>
        <td colspan="4">
        Materia prima: ${packing.product.description}
        </td>
        <td  rowspan="2">
        Lote proveedor: ${packing.loteProveedor}
        </td>
        <td  rowspan="2">
        Fecha: ${packing.date}
        </td>
        </tr>
        <tr>
        <td colspan="4">
        Proveedor: ${packing.proveedor}
        </td>
        
        </tr>
        <tr>
        <td><strong>Control</strong></td>
        <td><strong>Estandar</strong></td>
        <td><strong>Aceptado</strong></td>   
        <td><strong>Rechazado</strong></td>
        <td colspan="2">Observaciones</td>
        </tr>
        <tr>
            <td>Certificado de calidad</td>
            <td>Entrega de Certificado</td>
            <td>${packing.quality ? "Ok" : ""}</td>
            <td>${!packing.quality ? "Ok" : ""}</td>
            <td colspan="2" style="max-width:140px"><div style="width: 140px;height: auto;word-wrap: break-word;">${packing.observations}</div></td>
        </tr>
        <tr>
            <td>Materia extraña</td>
            <td>Ausente</td>
            <td>${packing.strangeMaterial ? "Ok" : ""}</td>
            <td>${!packing.strangeMaterial ? "Ok" : ""}</td>
            <td colspan="2"></td>
        </tr>
       
        <tr>
                <td>Transporte</td>
                <td>Limpio</td>
                <td>${packing.transport ? "Ok" : ""}</td>
                <td>${!packing.transport ? "Ok" : ""}</td>
                <td colspan="2"></td>
        </tr>
     
        <tr>
            <td>Empaque</td>
            <td>Sin daños y limpios</td>
            <td>${packing.paking ? "Ok" : ""}</td>
            <td>${!packing.paking ? "Ok" : ""}</td>
            <td colspan="2"></td>
        </tr>
        <tr>
        <td colspan="2">Se recibió: </td> 
        <td  colspan="4"> ${packing.quantity}</td>  
    
        </tr>
        <tr>
        <td colspan="2"><b>Verifico: ${packing.verifit ? packing.verifit.name: "" }</b> </td> 
        <td  colspan="2"> <b> Firma:</b></td>  
        <td  colspan="2"> <b> Puesto: ${packing.verifit ? packing.verifit.job : "" }</b> </td>
        </tr>
        <tr>
        <td colspan="4"></td>
        <td colspan="2">F-CAL-RO-03 </td>
        </tr>
        </table>
    
        
    </body>
    </html>
        `;
    }

    async reportEntrancePacking(packing:EntrancePacking){
        let content = this.headReportEntrancePacking()+this.bodyReportEntrancePacking(packing);
        return content;
    }


    headReportOven(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rovianda2</title>
        <style>
          .espa{
            height: 15px;
          }
           #mueve{
            width: 194px;
               margin-left: 820px;
           } 
           #mueve2{
            width: 300px;
            text-align: center;
           }  
           #mueve3{
            width: 100px;
            text-align: center;
           }
           #mueve4{
            width: 120px;
            text-align: center;
           }
           #mueve5{
            width: 50px;

            text-align: center;
           } 
           #mueve6{
               text-align: center;
           }
           #mueve7{
               width: 90px;
               text-align: left;
           }    
           #ult{
               height: 120px;
           }
           .fir{
               width: 120px;
               text-align: left;
           }
           .seg{
               width: 370px;
               text-align: left; 
           }
         </style>
        </head>

      `;
    }

    bodyReportOven(revisionOven:OvenProducts,dataRevision:RevisionsOvenProducts[]){
        let content = `
        <body>
        <div id="pageHeader">
        <b><p align="center">EMPACADORA ROVIANDA S.A.P.I. DE C.V.</p></b>
        <b><p align="center">CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO</p></b>
        
        </div>

         <table  align="center"    width="100%" > 
             <tr> <!-- columna-->
                 
                 <td colspan="2" align="center"><font size=1></font></td>
             </tr>
                 <td align="center"><font size=1></font></td>
         </table>
 
         <table align="right" border="1px">
             <tr>
                <th colspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="60px">    </th>
                <th colspan="3"></th>
                 <th><font size=1>Tiempo estimado:${revisionOven.stimatedTime}</font></th>   
             </tr>
             <tr>
                <th colspan="2"><font size=1>Producto: ${revisionOven.product.name}</font></th>
                <th><font size=1>PCC: ${revisionOven.pcc}</font></th>
                <th id="mueve7"><font size=1>Fecha: ${revisionOven.date}</font></th>
                <th colspan="2"> <font size=1>PCC = 70° C</font></th>
             <tr>
 
             <tr>
                 <td id="mueve5"><font size=1>Hora</font></td>
                 <td  id="mueve3"><font size=1>Temperatura interna del producto</font></td>
                 <td id="mueve4"><font size=1>Temperatura del horno</font></td>
                 <td id="mueve6"><font size=1>Humedad</font></td>
                 <td colspan="2" id="mueve2"><font size=1>Observaciones</font></td>
             </tr>`;
 
             
             let content2="";
             for(let i = 0; i<dataRevision.length; i++){
                 content2=content2 + `     
             <tr>
                 <td class="espa"><font size=1>${dataRevision[i].hour}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].interTemp}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].ovenTemp}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].humidity}</font></td>
                 <td colspan="2" class="espa"><font size=1>${dataRevision[i].observations}</font></td> 
             </tr >
             `;
            }

 
         return content+content2
     }

    footerReportOven(revisionOven:OvenProducts){
        return `
            <tr>
                <th colspan="3" class="seg"><font size=1>Elaboró: ${revisionOven.nameElaborated} </font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td colspan="2"><font size=1>Puesto: ${revisionOven.jobElaborated}</font> </td>
            </tr>
            <tr>
                <th colspan="3" class="seg"><font size=1>Revisó: ${revisionOven.nameCheck} </font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td colspan="2"><font size=1><Puesto: ${revisionOven.jobCheck}</font></td>
            </tr>
            <tr>
                <th colspan="3" class="seg"><font size=1>Verificó: ${revisionOven.nameVerify} </font</th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td colspan="2"><font size=1>Puesto: ${revisionOven.jobVerify}</font></td>
            </tr>
       
             <tr>  
                <td colspan="5"></td>   
                <td><font size=1>F-HACCP-RO-05</font></td>
             </tr>
        </table>
        </body>
    </html>         

        `;
    }

     async reportOven(revisionOven:OvenProducts,data:RevisionsOvenProducts[]){
        let content = this.headReportOven()+this.bodyReportOven(revisionOven,data)+this.footerReportOven(revisionOven);
        return content;
    }
 

    headReportEntryDriefs(user:User){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabla 1</title>
            <style>
        
            .ta{   
                text-align: left;
            }
        
            .ma{
               text-align: left;
               width: 200px;
            }
        
            #fec{
                width:148px;
            }
        
            header{
                text-align: center;
            }
        
            #mueve{
                width: 185px;
                margin-left: 780px
            }
        
            img{
                width: 80px;
                height:100px;
                transform: translateY(78%) translateX(474%);
            }
        
            #title{
                transform: translateY(507%) translateX(-2%);
                top: 200px;
            }
        </style>
        </head>
        <body  bgcolor="">
        <header>
            <b><p id="title">RECEPCIÓN DE MATERIA PRIMA SECOS</p></b>
        </header>
       
                <table border="1" align="rigth" width="90%">
                    <tr>
                        <th rowspan="3"><img src="${LOGO.data}" alt="" align="left" ></th> 
                        <th class="ta" colspan="4">Nombre: ${user.name} </th>
                    </tr>
                    <tr>
                        <th class="ta" colspan="4">Firma: </th>
                    </tr>
                    <tr>
                        <th class="ta" colspan="4">Puesto: ${user.job}</th>
                    </tr>
                
      `;
    }

    bodyReportEntryDriefs(data:EntranceDrief[]){

        let content=" ";
        for(let i = 0; i<data.length; i++){
            content =content + `
                    <tr>
                        <th class="ma">Materia prima: ${data[i].product.description} </th>
                        <th  rowspan="2" colspan="3">Lote proveedor: ${data[i].loteProveedor} </th>
                        <th  id="fec" rowspan="2">Fecha: ${data[i].date}</th>
                    </tr>
                    <tr>
                        <th class="ma">Proveedor: ${data[i].proveedor}</th>
                    </tr>
    <!--------------------------------------------------------------------------->
                    <tr>
                        <th>Control</th>
                        <th>Estandar</th>
                        <th>Aceptado</th>
                        <th>Rechazado</th>
                        <th>Observaciones</th>
                    </tr>
                    <tr>
                        <th><font size=1 > Certificado de calidad </font></th>
                        <th><font size=1 > Entrega de Certificado </font></th>
                        <th>${data[i].quality ? "Ok" : ""}</th>
                        <th>${!data[i].quality ? "Ok" : ""}</th>
                        <th><font size=1 > ${data[i].observations} </font></th>
                    </tr>
                    <tr>
                        <th><font size=1> Caducidad </font></th>
                        <th><font size=1> Vigente </font></th>
                        <th>${data[i].expiration ? "Ok" : ""}</th>
                        <th>${!data[i].expiration ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Materia Extraña </font></th>
                        <th><font size=1> Ausente </font></th>
                        <th>${data[i].strangeMaterial ? "Ok" : ""}</th>
                        <th>${!data[i].strangeMaterial ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Transporte </font></th>
                        <th><font size=1> Limpio </font></th>
                        <th>${data[i].transport ? "Ok" : ""}</th>
                        <th>${!data[i].transport ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Empaque </font></th>
                        <th><font size=1> Sin daños y limpio </font></th>
                        <th>${data[i].paking ? "Ok" : ""}</th>
                        <th>${!data[i].paking ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Olor </font></th>
                        <th><font size=1> Caracteristico </font></th>
                        <th>${data[i].odor ? "Ok" : ""}</th>
                        <th>${!data[i].odor ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Color </font></th>
                        <th><font size=1> Caracteristico </font></th>
                        <th>${data[i].color ? "Ok" : ""}</th>
                        <th>${!data[i].color ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th><font size=1> Textura </font></th>
                        <th><font size=1> Caracteristico </font></th>
                        <th>${data[i].texture ? "Ok" : ""}</th>
                        <th>${!data[i].texture ? "Ok" : ""}</th>
                        <th></th> 
                    </tr>
                    <tr>
                        <th><font size=1> Peso </font></th>
                        <th><font size=1> Según Empaque </font></th>
                        <th>${data[i].weight ? "Ok" : ""}</th>
                        <th>${!data[i].weight ? "Ok" : ""}</th>
                        <th></th>
                    </tr>
                
             `;
        }
        return content
     }

     footerReportEntryDriefs(){
        return `
            <tr> 
                <td colspan="4"></td>   
                <td>F-CAL-RO-02</td>
            </tr>
        </table>
      </body>
    </html>      

        `;
    }

     async reportEntryDriefs(user:User,data:EntranceDrief[]){
        let content = this.headReportEntryDriefs(user)+this.bodyReportEntryDriefs(data)+this.footerReportEntryDriefs();
        return content;
    }


    headReportEntryMeats(){
        return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rovianda</title>
        <style>
            .espa{
            height: 15px;
            }

            .separa{
            height: 15px;
            }

            table{
            border: #65768C 3px solid;
            }

            #ubica{
            margin-bottom: 70px;;
            }    
        </style>
    </head>
    <body bgcolor="">

    <header align="center">
        <b><p id="title"> ROVIANDA S.A.P.I. DE C.V.</p></b>
        <b><font size=2>RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</font> </b>
    </header>
    `;
    }

    bodyReportEntryMeats(meat:EntranceMeat[]){
        let content=" ";
        for(let i = 0; i<meat.length; i++){
            content =content + `
    <table  align="center" border="1px"   width="90%" > 
    ${i>0 ? `<div style="page-break-after:always;"></div>` : " "}     
    <tr>
        <td rowspan="2" align="center">  <img src="${LOGO.data}" alt=""  height="60px"></td>
        <td align="center" rowspan="2" colspan="5"><font size=1>LOTE INTERNO: ${meat[i].loteInterno}</font> </td>
     </tr>
     <tr></tr>
         <tr>
            <img src="" alt="">
            <th><font size=1>Fecha</font></th>
            <th><font size=1>Proveedor</font></th>
            <th colspan="2"><font size=1>Materia prima</font></th>
            <th><font size=1>Lote proveedor</font></th>
         </tr>
<!-- ************************************************************************************************-->
         <tr>
            <th class="espa"><font size=1>${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}</font></th>
            <th class="espa"><font size=1>${meat[i].proveedor}</font></th>
            <th class="espa"  colspan="2"><font size=1>${meat[i].rawMaterial}</font></th>
            <th class="espa"><font size=1>${meat[i].loteProveedor}</font></th>
         </tr>
<!-- ************************************************************************************************-->  
        <th><font size=1>Control</font></th>
        <th><font size=1>Estándar</font></th>
        <th><font size=1>Aceptado</font></th>
        <th><font size=1>Rechazado</font></th>
        <th><font size=1>Observaciones</font></th>
<!-- ************************************************************************************************-->
         <tr>
            <td><font size=1>Transporte</font> </td>
            <td align="center" height="2px"><font size=1>Limpio, sin olores,sin material ajeno, sin plagas</font></td>
            <td><font size=1>${meat[i].transport.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].transport.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>
         
         <tr>
            <td><font size=1>Empaque</font></td>
            <td><font size=1>Sin daños y limpio</font> </td>
            <td><font size=1>${meat[i].packing.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].packing.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Caducidad</font></td>
            <td><font size=1>Vigente:</font></td>
            <td><font size=1>${meat[i].expiration.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].expiration.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Peso</font></td>
            <td><font size=1>Según el empaque</font></td>
            <td><font size=1>${meat[i].weight.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].weight.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${!meat[i].weight.value}</font></td>
         </tr>

         <tr>
            <td><font size=1>Materia extraña</font></td>
            <td><font size=1>Ausente</font></td>
            <td><font size=1>${meat[i].strangeMaterial.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].strangeMaterial.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>${meat[i].temperature.accepted && (+meat[i].temperature.value <= 4 && +meat[i].temperature.value >= -17) ? "Ok" : "N/A"}</font></td>
            <td><font size=1>${!meat[i].temperature.accepted && (+meat[i].temperature.value <= 4 && +meat[i].temperature.value >= -17) ? "No ok" : "N/A"}</font></td>
            <td><font size=1>${(+meat[i].temperature.value <= 4 && +meat[i].temperature.value >= -17) ? meat[i].temperature.value : ""}</font></td>
         </tr>  

         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>${meat[i].temperature.accepted && (+meat[i].temperature.value <= -18) ? "Ok" : "N/A"}</font></td>
            <td><font size=1>${!meat[i].temperature.accepted && (+meat[i].temperature.value <= -18) ? "No ok" : "N/A"}</font></td>
            <td><font size=1>${(+meat[i].temperature.value <= -18) ? meat[i].temperature.value : "N/A"}</font></td>
         </tr>

         <tr>
            <td><font size=1>Olor</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat[i].odor.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].odor.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>
        
         <tr>
            <td><font size=1>Color</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat[i].color.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].color.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Textura</font></td>
            <td><font size=1>Firme, Característico</font></td>
            <td><font size=1>${meat[i].texture.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat[i].texture.accepted ? "No ok" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td colspan="5"><font size=1>Desviación:</font></td>
         </tr>

         <tr>
            <td class ="separa" colspan="5"></td>
         </tr>

         <tr>
            <td colspan="5"><font size=1>Acción correctiva:</font></td>
         </tr>

         <tr>
            <td  class ="separa" colspan="5"></td>
         </tr>

         <tr>
            <td height="60px"  width="" colspan="5" > <div id="ubica"><font size=1>Etiqueta: </font></div>  </td>
         </tr>
        `;
    }

    return content;
}

    footerReportEntryMeats(user:User){
    return `
      <tr>
        <th class="fin" ><font size=1>Realizó:</font></th>
        <th class="fin"  ><font size=1>${user.name} </font> </th>
        <th class="fin" colspan="3" ><font size=1>Firma:</font></th>
      </tr>
      <tr>
      <td colspan="3"></td>
      <td colspan="2" align="center"><font size=1>F-CAL-RO-04</font></td>
      </tr>
    </table>
    <div id="pageFooter" padding-top: 5px;">
        <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p>
    </div>
    <br>
  </body>
</html>      
    `;
    }

    async reportEntryMeats(user:User,meat:EntranceMeat[]){
        let content = this.headReportEntryMeats()+this.bodyReportEntryMeats(meat)+this.footerReportEntryMeats(user);
        return content;
    }


    headReportEntryPacking(entrancePacking:EntrancePacking){
        return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tabla Nueva</title>
        <style>
            .ta{
                width:400px;   
                text-align: left;
            }
            .te{
                width:187px;   
                text-align: left;
            }
            .ma{
               text-align: left;
            }
            #fec{   
                width:148px;
            }
            header{
                text-align: center;
            }
            .separa{
                height: 15px;
                }
            #mueve{
                width: 185px;
                margin-left: 773px
            }
            #go{
                width: 185px;
                margin-left: 780px
            }
            img{
                height:55px;
              }
        
            #title{
                transform: translateY(507%) translateX(-2%);
                top: 200px;
            }
        </style>
        </head>

        
    <header>
        <b><p id="title">EMPACADORA ROVIANDA S.A.P.I DE C.V</p></b>
        <p id="title">BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES  </p>
    </header>
  
    <table border="1" align="center" width="100%">

        <tr>
            <td rowspan="3"><img src="${LOGO.data}"></td>
            <th class="ma" colspan="4"><font size=1>Nombre: ${entrancePacking.make.name} </font></th>
        </tr>
        <tr>
            <th class="ma" colspan="4"><font size=1>Firma: </font></th>
        </tr>
        <tr>
            <th class="ma" colspan="4"><font size=1>Puesto: ${entrancePacking.make.job}</font></th>
        </tr>
            </br>
    `;
    }

    bodyReportEntryPacking(data:EntrancePacking[]){
        let content=" ";
        for(let i = 0; i<data.length; i++){
            content =content + `
            <!--------------------------------------------------------------------------->
                <tr>
                    <th colspan="2" class="ma"><font size=1>Materia prima: ${data[i].product.description}</font></th>
                    <th colspan="2" rowspan="2"><font size=1>Lote proveedor: ${data[i].loteProveedor}</font></th>
                    <th  id="fec" rowspan="2"><font size=1>Fecha: ${data[i].date}</font></th>
                </tr>
                <tr>
                    <th colspan="2" class="ma"><font size=1>Proveedor: ${data[i].proveedor}</font> </th>
                </tr>
<!--------------------------------------------------------------------------->
                <tr>
                    <th><font size=1>Control</font></th>
                    <th><font size=1>Estandar</font></th>
                    <th><font size=1>Aceptado</font></th>
                    <th><font size=1>Rechazado</font></th>
                    <th><font size=1>Observaciones</font></th>
                </tr>

                  <tr>
                      <th><font size=1>Certificado de calidad</font></th>
                      <th><font size=1>Entrega de Certificado</font></th>
                      <th><font size=1>${data[i].quality ? "Ok" : ""}</font></th> 
                      <th><font size=1>${!data[i].quality ? "No ok" : ""}</font></th>
                      <th><font size=1>${data[i].observations ? data[i].observations :""}</font></th>
                </tr>
                <tr>
                    <th><font size=1>Materia extraña</font></th>
                    <th><font size=1>Ausente</font></th>
                    <th><font size=1>${data[i].strangeMaterial ? "Ok" : ""}</font></th>
                    <th><font size=1>${!data[i].strangeMaterial ? "No ok" : ""}</font></th>
                    <th></th>
                </tr>
                <tr>
                    <th><font size=1>Transporte</font></th>
                    <th><font size=1>Limpio</font></th>
                    <th><font size=1>${data[i].transport ? "Ok" : ""}</font></th>
                    <th><font size=1>${!data[i].transport ? "No ok" : ""}</font></th>
                    <th></th>
                </tr>
                <tr>
                    <th><font size=1>Empaque</font></th>
                    <th><font size=1>Sin daños y limpios</font></th>
                    <th><font size=1>${data[i].paking ? "Ok" : ""}</font></th>
                    <th><font size=1>${!data[i].paking ? "No ok" : ""}</font></th>
                    <th></th>
                </tr>
        `;
    }

    return content;
    }   

    footerReportEntryPacking(entrancePacking:EntrancePacking){
    return `
        <tr>
            <td colspan="2"><font size=1><b>Verifico: ${entrancePacking.verifit == null ? "": entrancePacking.verifit.name} </b> </font></td> 
        <b> <td colspan="2" class="te"> <font size=1><b> Firma: </b></font></td>  
        <b> <td class="te"><font size=1><b> Puesto: ${entrancePacking.verifit == null ? "": entrancePacking.verifit.job}</b></font>  </td>
        </tr> 
        <tr>  
           <td colspan="4"></td>   
           <td><font size=2>F-CAL-RO-03 </font></td>
        </tr>
    </table>
    </body>
    </html>
    `;
    }

    async reportEntryPacking(user:User,packing:EntrancePacking[]){
        let content = this.headReportEntryPacking(packing[0])+this.bodyReportEntryPacking(packing)+this.footerReportEntryPacking(packing[0]);
        return content;
    }


    headReportOvenProducts(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rovianda2</title>
        <style>
          .espa{
            height: 15px;
          }
           #mueve{
            width: 194px;
               margin-left: 820px;
           } 
           #mueve2{
            width: 300px;
            text-align: center;
           }  
           #mueve3{
            width: 100px;
            text-align: center;
           }
           #mueve4{
            width: 120px;
            text-align: center;
           }
           #mueve5{
            width: 50px;

            text-align: center;
           } 
           #mueve6{
               text-align: center;
           }
           #mueve7{
               width: 90px;
               text-align: left;
           }    
           #ult{
               height: 120px;
           }
           .fir{
               width: 120px;
               text-align: left;
           }
           .seg{
               width: 370px;
               text-align: left; 
           }
         </style>
        </head>

        <body>
         <div id="pageHeader"  align="center"    width="100%" > 
                 
                 <p colspan="2" align="center"><font size=1>EMPACADORA ROVIANDA S.A.P.I. DE C.V.</font></p>
             
                 <p align="center"><font size=1>CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO</font></p>
         </div>
      `;
    }

    bodyReportOvenProducts(data:OvenProducts[],users:Map<number,{userVerify:User,userElaborated:User}>){
        console.log("PDF");
        let content=`<table border="1" align="center" width="100%"> `;
        for(let i = 0; i<data.length; i++){
            content += ` 
            <tr>
            ${i==0?`<td>  <img src="${LOGO.data}" alt=""  height="80px">    </td>`:"<td></td>"}
                 <td colspan="4"></td>   
                 <td><font size=1>Tiempo estimado:${data[i].stimatedTime}</font></td>   
             </tr>
         
             <th colspan="2"><font size=1>Producto: ${data[i].product.name}</font></th>
             <th><font size=1>PCC: ${data[i].pcc}</font></th>
             <th id="mueve7" colspan="2"><font size=1>Fecha: ${data[i].date}</font></th>
             <th> <font size=1>PCC = 70° C</font></th>
 
             <tr>
             <td ><font size=1>Lote del día</font></td>
                 <td id="mueve5"><font size=1>Hora</font></td>
                 <td  id="mueve3"><font size=1>Temperatura interna del producto</font></td>
                 <td id="mueve4"><font size=1>Temperatura del horno</font></td>
                 <td id="mueve6"><font size=1>Humedad</font></td>
                 <td id="mueve2"><font size=1>Observaciones</font></td>
             </tr>`;
             
              for(let j=0; j<data[i].revisions.length;j++){   
                
                content +=`
             <tr>
                <td ><font size=1>${data[i].newLote}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].hour}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].interTemp}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].ovenTemp}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].humidity}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].observations}</font></td> 
             </tr >
             `
              }
              let usersM = users.get(data[i].id);
             content+=`<tr>
             <th colspan="3" class="seg"><font size=1>Elaboró: ${usersM.userElaborated.name}</font></th>
             <th class="fir" colspan="2"><font size=1>Firma:</font></th>
             <td><font size=1>Puesto: ${usersM.userElaborated.job}</font> </td>
         </tr>
         <tr>
             <th colspan="3" class="seg"><font size=1>Revisó: ${usersM.userVerify.name}</font></th>
             <th class="fir"  colspan="2"><font size=1>Firma:</font></th>
             <td><font size=1><Puesto: ${usersM.userVerify.job}</font></td>
         </tr>
         <tr>
             <th colspan="3" class="seg"><font size=1>Verificó: ${usersM.userVerify.name}</font</th>
             <th class="fir"  colspan="2"><font size=1>Firma:</font></th>
             <td><font size=1>Puesto: ${usersM.userVerify.job}</font></td>
         </tr>
              <tr>
              <td colspan="4"></td>
              <td coslpan="2"></td>
              </tr>
          `    
           
        }
         return content;
     }

    footerReportOvenProducts(){
        return `
        <tr>  
             <td colspan="4"></td>   
             <td><font size=1>F-HACCP-RO-05</font></td>
          </tr>
        </table>
        </body>
    </html>         

        `;
    }

     async reportOvenProducts(users: Map<number,{userVerify:User,userElaborated:User}>,data:OvenProducts[]){
        let content = this.headReportOvenProducts()+this.bodyReportOvenProducts(data,users)+this.footerReportOvenProducts();
        return content;
    }

     headReportFormulation (){
        return `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Index4</title>
        
            <style>
              .wi {
                width: 80%;
                height: 20px;

              }
        
              #ta {
                text-align: center;
                width: 80%;
              }
        
        
              #ini {
                text-align: left;
                margin-left: 100px;
                width: 80%;
              }
        
              img{
                width: 60px;
                height:80px;
                transform: translateY(78%) translateX(474%);
              }
        
            .title{
                transform: translateY(507%) translateX(-2%);
                top: 200px;
            }
        
              header {
                text-align: center;
                margin-bottom: -30px;
              }
        
              #fo1 {
                margin-left: 100px;
                width: 70%;
              }
        
              #fo {
                margin-left: 290px;
                width: 30%;
              }
            </style>
          </head>`;
    }

    bodyReportFormulationInfo(formulations: Formulation[]){
        const formulationHeaderInfo = `<div id="pageHeader">
        <b><p class="title" align="center">BITACORA DE CONTROL DE CALIDAD FORMULACION</p></b>
      </div>
  
      
    `;
    let formulationTableInfo = `
        <table id="ta" border="1" align="center" width="90%">
        <tr>
            <th rowspan="3"><img src="${LOGO.data}" alt="" /></th>`;
    formulations.forEach( (formulation,index) => {
     formulationTableInfo += `
            ${index>0? `<tr><th rowspan="3"></th>` : ``}
            <th colspan="5">Realizo, Nombre:  ${formulation.make.name}</th>
        </tr>
        <tr>
          <th colspan="5">Firma:</th>
        </tr>
        <th colspan="5">Puesto:  ${formulation.make.job}</th>
        <tr></tr>
      <tr>
        <td>Producto</td>
        <td>Lote</td>
        <td>Temperatura carne</td>
        <td>Temperatura agua</td>
        <td>Ingredientes</td>
        <td>Fechas</td>
      </tr>
        <tr>
            <td >${formulation.productRovianda.name}</td>
            <td>${formulation.lotDay}</td>
            <td>${formulation.temp ? formulation.temp : ""}</td>
            <td>${formulation.waterTemp ? formulation.waterTemp : ""}</td>
            <td>${formulation.ingredients.length && formulation.ingredients[0].product.description ? formulation.ingredients[0].product.description : "" }</td>
            <td>${formulation.date ? new Date(formulation.date).toLocaleDateString() : "" }</td>
        </tr>`;
            
            for(let index = 1; index < formulation.ingredients.length; index++){
                
                formulationTableInfo+= `
                    <tr>
                    <td ></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${formulation.ingredients[index].product.description}</td>
                    <td></td>
                </tr>`;
            }
      
     formulationTableInfo +=`
        <tr>
          <td align="left">Verifico:  ${formulation.verifit.name} </td>
          <td align="left" colspan="2">Firma:</td>
          <td align="left" colspan="3">Puesto:  ${formulation.verifit.job}</td>
        </tr>
    
    
        `
      

    });
      formulationTableInfo+=`
      <tr>
            <th colspan="5"></th>
            <th>F-CAL-RO-05</th>
        </tr>
      </table>
    </body>
  </html>
  `;
        return formulationHeaderInfo + formulationTableInfo;
    }

    generateFormulationReport(formulation: Formulation[]){
        return this.headReportFormulation()+this.bodyReportFormulationInfo(formulation);
    }
 

    headReportProcess(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Index3</title>
            <style>

            table{
                border-spacing:0px;
                border: 1px solid black;
                font-size:.5em
                }
                
                
            </style>
        </head>
        <body bgcolor="">
    <header align="center">
        <b><p>EMPACADORA ROVIANDA S.A.P.I. DE C.V</p></b>
        <p>BITACORA DE CONTROL DE CALIDAD SALA DE TRABAJO</p>
    </header>
        `;
    }

    async bodyReportProcess(process:Process){
        let content =` 
        
    <table  border="1" width="100%">
        <tr>
            <th colspan="2"><img src="${LOGO.data}" height="60px" /></th>
            <th colspan="2">No.Lote: ${process.formulation.lotDay}</th>
            <th colspan="2">Producto: ${process.product.name}</th>
            <th colspan="1">Fecha: ${process.createAt} </th>
        </tr>
        <tr>
            <th>DESCOGELADO</th>
            <th colspan="6"></th>
        </tr>
        <tr>
            <th>MATERIA PRIMA</th>
            <th>FECHA</th>
            <th>PESO Kg</th>
            <th>T*C</th>
            <th>HORA DE ENTRADA</th>
            <th colspan="2">HORA DE SALIDA</th>
        </tr>`;
        for(let defrost of process.formulation.defrosts){
            content+=`<tr>
            <td class="formacion" >${defrost.defrost.outputCooling.rawMaterial.rawMaterial}</td>
            <td>${defrost.defrost.dateEnd}</td>
            <td>${defrost.defrost.weigth}</td>
            <td>${defrost.defrost.temp}</td>
            <td>${defrost.defrost.entranceHour}</td>
            <td colspan="2">${defrost.defrost.outputHour}</td>
            </tr>`
        }
        content+=`<tr>
        <th colspan="2">ACONDICIONAMIENTO</th>
        <th colspan="5"></th>
        </tr>
        <tr>
                <th>MATERIA PRIMA</th>
                <th>FECHA</th>
                <th>PROCESO</th>
                <th>PESO Kg</th>
                <th>Tº C</th> 
                <th></th> 
                <th></th> 
            </tr>`;
            let arrTd:Array<string>=[
                "<td>Clave</td><td>Proceso</td>",
                "<td>D</td><td>Deshuese</td>",
                "<td>L</td><td>Limpieza</td>",
                "<td>SC</td><td>Salado y curado</td>"];
        let sizeConditioningRows=0;
        
        for(let i=0;i<process.conditioning.length;i++){
            let conditioning=process.conditioning[i];
            let dateParsed = new Date(conditioning.date);
            dateParsed.setHours(dateParsed.getHours()-6);
            let month=dateParsed.getMonth()+1;
            let year = dateParsed.getFullYear().toString();
            year = year.slice(2,4);
            content+=`
            <tr>
            <td  class="formacion">${conditioning.raw} - ${conditioning.lotId}</td>
            <td>${(dateParsed.getDate()<10?'0'+dateParsed.getDate():dateParsed.getDate())+(month<10?'0'+month.toString():month.toString())+year}</td>
            <td>${conditioning.clean==true?"L,":""}${conditioning.bone==true?"D":""}${conditioning.healthing==true?(conditioning.bone==true)?",SC":"SC":""}</td>
            <td>${conditioning.weight}</td>
            <td>${conditioning.temperature}</td>
            ${(i<5)?arrTd[i]:"<td></td><td></td>"}
            </tr>
            `
            sizeConditioningRows++;
        }
        if(sizeConditioningRows<4){
            for(let i=sizeConditioningRows;i<4;i++){
            content+=`
            <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            ${arrTd[i]}
            </tr>
            `;
            }
        }

        
       content+= `
        <tr>
            <td class="formacion" ></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
            <tr>
                <th>MOLIENDA</th>
                <th colspan="6"></th>
            </tr>
            <tr>
                <th>MATERIA PRIMA</th>
                <th>FECHA</th>
                <th>PROCESO</th>
                <th>PESO Kg</th>
                <th>Tº C</td>
                <th></th>
                <th></th>
            </tr>
        `;
        
        for(let grinding of process.grinding){
            let grindingEntity:Grinding= await this.grindingRepository.getGrindingWithRaw(grinding.id);
            let dateParsed = new Date(grinding.date);
            dateParsed.setHours(dateParsed.getHours()-6);
            let month=dateParsed.getMonth()+1;
            let year = dateParsed.getFullYear().toString();
            year = year.slice(2,4);
        content+=    `
                <tr>
                    <th class="formacion">${grindingEntity.raw.rawMaterial} - ${grinding.lotId}</th>
                    <td>${(dateParsed.getDate()<10?'0'+dateParsed.getDate():dateParsed.getDate())+(month<10?'0'+month.toString():month.toString())+year}</td>
                    <th>${grinding.singleProcess}</th>
                    <th>${grinding.weight}</th>
                    <th>${grinding.temperature}</th>
                    <th></th>
                    <th></th>
                </tr>
            `
        };
        content+=`
            <br><br>            
              <tr>
                  <th colspan="2">INYECCION/TENDERIZADO</th>
                  <th colspan="5"></th>
              </tr>
              <tr>
                  <th>MATERIA PRIMA</th>
                  <th>FECHA</th>
                  <th>PESO Kg</th>
                  <th>T*C</th>
                  <th>PESO SALMUERA Kg</th>
                  <th>%INYECCION</th>
                  <th></th>
              </tr>
              `
        for(let tenderized of process.tenderized){
            let dateParsed = new Date(tenderized.date);
            dateParsed.setHours(dateParsed.getHours()-6);
            let month=dateParsed.getMonth()+1;
            let year = dateParsed.getFullYear().toString();
            year = year.slice(2,4);
            content+=`<tr>
            <th class="formacion">${process.product.name}</th>
            <td>${(dateParsed.getDate()<10?'0'+dateParsed.getDate():dateParsed.getDate())+(month<10?'0'+month.toString():month.toString())+year}</td>
            <th>${tenderized.weight}</th>
            <th>${tenderized.temperature}</th>
            <th>${tenderized.weightSalmuera}</th>
            <th>${tenderized.percentInject}</th>
            <th></th>
        </tr>`;
        }
        content+=`
            <tr>
            <th>EMBUTIDO</th>
            <th colspan="6"></th>
            </tr>
            <tr>
                <th>PRODUCTO</th>
                <th>FECHA</th>
                <th>T*C</th>
                <th>PESO Kg.Inicio(Hra)</th>
                <th>PESO Kg.Medio(Hra)</th>
                <th>PESO Kg. Fin (Hra)</th>
                <th></th>
            </tr>
        `;
        for(let sausage of process.sausage){
            let dateParsed = new Date(sausage.date);
            dateParsed.setHours(dateParsed.getHours()-6);
            let month=dateParsed.getMonth()+1;
            let year = dateParsed.getFullYear().toString();
            year = year.slice(2,4);
            let hour1=new Date(sausage.hour1);
            let hour2=new Date(sausage.hour2);
            let hour3=new Date(sausage.hour3);
                content+=`
                <tr>
                <th class="formacion">${process.product.name}</th>
                <td>${(dateParsed.getDate()<10?'0'+dateParsed.getDate():dateParsed.getDate())+(month<10?'0'+month.toString():month.toString())+year}</td>
                <th>${sausage.temperature}</th>
                <th>${sausage.weightIni} (${!isNaN(hour1.getHours())?hour1.getHours()+":"+hour1.getMinutes():"No aplica"})</th>
                <th>${sausage.weightMedium} (${!isNaN(hour2.getHours())?hour2.getHours()+":"+hour2.getMinutes():"No aplica"})</th>
                <th>${sausage.weightExit} (${!isNaN(hour3.getHours())?hour3.getHours()+":"+hour3.getMinutes():"No aplica"})</th>
                <th></th>
                </tr>
                `
        }

        content+=`
            <tr>
            <th>REPROCESOS</th>
            <th colspan="6"></th>
            </tr>
            <tr>
                <th>PRODUCTO</th>
                <th>LOTE</th>
                <th>FECHA</th>
                <th>ALERJENO</th>
                <th>PESO</th>
                <th></th>
                <th></th>
            </tr>
        `;
        for(let reprocesing of process.reprocesings){
            let dateParsed=new Date(reprocesing.dateUsed);
            dateParsed.setHours(dateParsed.getHours()-6);
            content+=`
            <tr>
                <th>${reprocesing.defrost?reprocesing.defrost.outputCooling.rawMaterial.rawMaterial:reprocesing.packagingProductName}</th>
                <th>${reprocesing.defrost?reprocesing.defrost.outputCooling.loteInterno:reprocesing.packagingReprocesingOvenLot}</th>
                <th>${dateParsed.getDate()+"-"+(dateParsed.getMonth()+1)+"-"+dateParsed.getFullYear()}</th>
                <th>${reprocesing.allergens}</th>
                <th>${reprocesing.weigthUsed}</th>
                <th></th>
                <th></th>
            </tr>
            `;
        }
          content+=`
            <tr>
                <td colspan="6"></td>     
                <td>F-CAL-RO-07</td>
            </tr>
        <tr>
            <th colspan="3">Elaboro: ${process.nameElaborated}  </th>
            <th colspan="2">Firma: </th>
            <th colspan="2">Puesto: ${process.jobElaborated}</th>
        </tr>
        <tr>
          <div id="text">
            <th colspan="3">Verifico: ${process.nameVerify} </th>
            <th colspan="2">Firma: </th>
            <th colspan="2">Puesto: ${process.jobVerify}</th>
          </div>
        </tr>
    </table>
`
         return content;
     }

     async bodyReportProcessByEntranceId(process:Process[]){

     }
    
     async reportProcess(process:Process){
        let content = this.headReportProcess()+await this.bodyReportProcess(process);
        content+=`</body>
        </html>`;
        return content;
    }

    async reportProcessByEntranceId(process:Process[]){
        let content = this.headReportProcess();
        for(let pro of process){
            content+=await this.bodyReportProcess(pro);
            content+=`<br><br>`;
        }
        return content;
    }

    headReportPackaging(){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>R4</title>
            <style>
                body{
                    margin: 0;
                    padding:0;
                }
                .cel{
                    height: 3px;
                }
        
                header{
                   text-align: center;
                    transform: translateY(190%);
                }
        
                #ta{
                    margin-left: 770px;
        
                }
        
                #fec{
                   transform:translateY(450%) translateX(20%);
                }
        
                #mueve{
                  width: 194px;
               margin-left: 898px;
           }
              
              img{
                  width: 70px;
                  height:80px;
                  transform: translateY(50%) translateX(350%);
              }
        
              .anch{
                  width: 314px;
              }
            </style>
        </head>
        `;
    }

    bodyReportPackaging(data:Packaging, properties:PropertiesPackaging[]){
        let date=new Date();
        let content =` 
        </head>
        <body>
        
            <div id="pageHeader" >
                <p align="center"> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
                <p align="center"> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
            </div>
            
            <table border="1" align="center" width="90%" height="50px">
            <tr>
                <th>
                    <img src="${LOGO.data}" alt=""> 
                </th>
                <th colspan="5"></th>
                <th>            
                    <p>Fecha: ${date.getFullYear().toString()}-${date.getMonth()+1}-${date.getDate()}</p>
                </th>
            </tr>
        
                <tr>
                    <th>PRODUCTO</th>
                    <th>LOTE Y CADUCIDAD</th>
                    <th>PRESENTACIONES</th>
                    <th>UNIDADES</th>
                    <th>PESO(KG)</th>
                    <th>OBSERVACIONES</th>
                    <th>USUARIOS</th>
                </tr>
            
                <tr>
                <td class="cel">${data.productId == null ? " " : data.productId.name}</td>
                <td class="cel">${data.lotId ? data.lotId:" "} (Cad. ${data.expiration})</td>
                <td class="cel">${!properties ? " " : properties[0].presentation.presentation+" "+properties[0].presentation.presentationType}</td>
                <td class="cel">${!properties ? " " : properties[0].units}</td>
                <td class="cel">${!properties ? " " : properties[0].weight}</td>
                <td class="cel">${!properties ? " " : properties[0].observations}</td>
                <td class="cel">${!data ? " " : data.userId.name}</td>
                </tr>
                `;
                let content2 = "";
                for(let i = 1; i<properties.length; i++){
                    content2 = content2 + `
                    <tr>
                        <td class="cel"></td>
                        <td class="cel"></td>
                        <td class="cel">${!properties ? " " : properties[i].presentation.presentation+" "+properties[i].presentation.presentationType}</td>
                        <td class="cel">${!properties ? " " : properties[i].units}</td>
                        <td class="cel">${!properties ? " " : properties[i].weight}</td>
                        <td class="cel">${!properties ? " " : properties[i].observations}</td>
                        <td class="cel">${!data?"":data.userId.name}</td>
                    </tr>
                    `;
                }
                let content3 = `
                <tr>    
                    <td colspan="6"></td>
                    <td>F-CALL-RO-020</td>
                </tr>
            </table>
            
        </body>
        </html>
                `;
         return content+content2+content3;
     }

     bodyReportPackagings(data:Packaging[]){
        let content =` 
        </head>
        <body>
        
            <div id="pageHeader" >
                <p align="center"> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
                <p align="center"> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
            </div>
            `;
            for(let pack of data){
                content+=`
                <table border="1" align="center" width="90%" height="50px">
                <tr>
                    <th>
                        <img src="${LOGO.data}" alt=""> 
                    </th>
                    <th colspan="5"></th>
                    <th>            
                        <p>Fecha: ${pack.registerDate}</p>
                    </th>
                </tr>
            
                    <tr>
                        <th>PRODUCTO</th>
                        <th>LOTE Y CADUCIDAD</th>
                        <th>PRESENTACIONES</th>
                        <th>UNIDADES</th>
                        <th>PESO(KG)</th>
                        <th>OBSERVACIONES</th>
                        <th>USUARIOS</th>
                    </tr>
                `;
                for(let i=0;i<pack.propertiesPackaging.length;i++){
                    let property = pack.propertiesPackaging[i];
                    content+=  `<tr>
                                <td class="cel">${(i==0)?pack.productId.name:""}</td>
                                <td class="cel">${(i==0)?pack.lotId:""}</td>
                                <td class="cel">${!property ? " " : property.presentation.presentation+" "+property.presentation.presentationType}</td>
                                <td class="cel">${!property ? " " : property.outputOfWarehouse}</td>
                                <td class="cel">${!property ? " " : property.weight}</td>
                                <td class="cel">${!property ? " " : property.observations}</td>
                                <td class="cel">${!pack?"":pack.userId.name}</td>
                            </tr>
                            `;
                }
                    content+= `
                    <tr>    
                        <td colspan="6"></td>
                        <td>F-CALL-RO-020</td>
                    </tr>
                </table>
                <br><br>`;
            }
            
           
       content+=`</body></html>`;
         return content;
     }
    

    async reportPackagingById(data:Packaging,properties: PropertiesPackaging[]){
        let content = this.headReportPackaging()+this.bodyReportPackaging(data,properties);
        return content;
    }
    async reportPackagings(data:Packaging[]){
        let content = this.headReportPackaging()+this.bodyReportPackagings(data);
        return content;
    }

    getHeaderReportPackaging(){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>R4</title>
            <style>
                body{
                    margin: 0;
                    padding:0;
                }
                .cel{
                    height: 3px;
                }
        
                header{
                   text-align: center;
                    transform: translateY(190%);
                }
        
                #ta{
                    margin-left: 770px;
        
                }
        
                #fec{
                   transform:translateY(450%) translateX(20%);
                }
        
                #mueve{
                  width: 194px;
               margin-left: 898px;
           }
              
              img{
                  width: 70px;
                  height:80px;
                  transform: translateY(50%) translateX(350%);
              }
        
              .anch{
                  width: 314px;
              }
            </style>`;
    }

    async getPackagingDevolution(devolution:Devolution,productName:string){
        return `
        ${this.getHeaderReportPackaging()}    
        </head>
        <body>
        
            <div id="pageHeader" >
                <p align="center"> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
                <p align="center"> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
            </div>
            
            <table border="1" align="center" width="90%" height="50px">
            <tr>
                <th>
                    <img src="${LOGO.data}" alt=""> 
                </th>
                <th colspan="5">Devolucion</th>
                <th>            
                    <p>Fecha: ${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}</p>
                </th>
            </tr>
        
                <tr>
                    <th>PRODUCTO</th>
                    <th>LOTE</th>
                    <th>PRESENTACION</th>
                    <th>UNIDADES</th>
                    <th>FECHA</th>
                </tr>
            
                <tr>
                <td class="cel">${productName}</td>
                <td class="cel">${devolution.lotId}</td>
                <td class="cel">${devolution.presentationProduct.presentation} ${devolution.presentationProduct.presentationType}</td>
                <td class="cel">${devolution.units}</td>
                <td class="cel">${devolution.date}</td>
                
                </tr>
                <tr>    
                    <td colspan="6"></td>
                    <td>F-CALL-RO-020</td>
                </tr>
            </table>
            
        </body>
        </html>`;
    }

    async getPackagingDeliveredReport(orderSeller:OrderSeller,mapSubOrder:Map<number,number>,mode:string){
        let content="";
        let date=new Date();
        date.setHours(date.getHours()-6);
        let cheeses = await this.cheeseRepository.getAllCheeses();
        let cheesesIds = cheeses.map(x=>x.product.id);
        content+=` 
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>R4</title>
            <style>
                body{
                    margin: 0;
                    padding:0;
                }
                .cel{
                    height: 3px;
                }
        
                header{
                   text-align: center;
                    transform: translateY(190%);
                }
        
                #ta{
                    margin-left: 770px;
        
                }
        
                #fec{
                   transform:translateY(450%) translateX(20%);
                }
        
                #mueve{
                  width: 194px;
               margin-left: 898px;
           }
              
              img{
                  width: 70px;
                  height:80px;
                  transform: translateY(50%) translateX(350%);
              }
              td{
                  font-size: 10px;
              }
              .anch{
                  width: 314px;
              }
            </style>
        </head>
        <body>
        
            <div id="pageHeader" >
                <p align="center"> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
                <p align="center"> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
                <p align="center"> <b> ORDEN No. ${orderSeller.id} </b></p>
            </div>
            
            <table border="1" align="center" width="90%" height="50px">
            <tr>
                <th>
                    <img src="${LOGO.data}" alt=""> 
                </th>
                <th colspan="3">Entrega a vendedor: ${orderSeller.seller.name}</th>
                <th colspan="2">            
                    <p>Fecha: ${date.getDate()}-${date.getMonth()+ 1}-${date.getFullYear()}</p>
                </th>
            </tr>
        
                <tr>
                    <th>ARTICULO</th>
                    <th>DESCRIPCION</th>
                    <th>PRESENTACION</th>
                    <th>CANTIDAD</th>
                    <th>PESO</th>
                    <th>OBSERVACIONES</th>
                    <th>PRECIO</th>
                </tr>
        `;
        for(let subOrder of orderSeller.subOrders){
            if(!subOrder.active){
            if(mode==undefined || mode==null){
                if(!cheesesIds.includes(subOrder.productRovianda.id)){
                content+=`
                <tr>
                <td>${subOrder.presentation.keySae}</td>
                <td>${subOrder.productRovianda.name}</td>
                <td>${subOrder.presentation.presentation} ${subOrder.presentation.presentationType}</td>
                <td>${subOrder.units}</td>
                <td>${(mapSubOrder.get(subOrder.subOrderId)).toFixed(2)}</td>
                <td>${subOrder.observations}</td>
                <td>${subOrder.presentation.presentationPricePublic}</td>
                </tr>
                `;
                }
            }else{
                if(cheesesIds.includes(subOrder.productRovianda.id) && mode=="cheese"){
                    content+=`
                    <tr>
                    <td>${subOrder.productRovianda.code}</td>
                    <td>${subOrder.productRovianda.name}</td>
                    <td>${subOrder.presentation.presentation} ${subOrder.presentation.presentationType}</td>
                    <td>${subOrder.units}</td>
                    <td>${(mapSubOrder.get(subOrder.subOrderId)).toFixed(2)}</td>
                    <td>${subOrder.observations}</td>
                    <td>${subOrder.presentation.presentationPricePublic}</td>
                    </tr>
                    `;
                }
            }
        }
            
        }
        content+="</table></html>"
        return content;
    }

    async getReprocesingPackagingReport(reprocesing:Reprocessing){
        let content = await this.getHeaderReportPackaging();
        let date=new Date(reprocesing.date);
        date.setHours(date.getHours()-6);
        content+=`
        </head>
        <body>
        <div id="pageHeader" >
        <p align="center"> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
        <p align="center"> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
    </div>
    
        <table border="1" align="center" width="90%" height="50px">
        <tr>
            <th>
                <img src="${LOGO.data}" alt=""> 
            </th>
            <th colspan="2">Reproceso de ${reprocesing.packagingProductName}</th>
            <th>Lote: ${reprocesing.packagingReprocesingOvenLot}</th>
            <th colspan="2">            
                <p>Fecha: ${date.getDate()}-${date.getMonth()+ 1}-${date.getFullYear()}</p>
            </th>
        </tr>
        <tr>
        <th>PESO</th>
            <th>ALERGENO</th>
            <th>OBSERVACIONES</th>
        </tr>
        <tr>
            <td>${reprocesing.weigth}</td>
            <td>${reprocesing.allergens}</td>
            <td>${reprocesing.comment}</td>
        </tr>
        </table>
        </body>
        </html>
        `;
        return content;
    }

    getReportPlanDelivery(records:Array<OutputsDeliveryPlant>,from:string,to:string){
        let content=`
        <html>
        <head>
        <style>
            td{
                font-size:8px;
            }
            th{
                font-size: 10px;
            }
        </style>
        </head>
        <body>
        <div>
            <p align="center"> <b> Salida general de producto de planta </b></p>
            <p align="center"> <b>Fecha: ${from} a ${to}  </b></p>
        </div>
    
        <table border="1" align="center" width="100%">
        <tr>
        <th>Vendedor/Tienda/Surcursal</th>
        <th>Codigo</th>
        <th>Producto</th>
        <th>Presentación</th>
        <th>Lote</th>
        <th>Unidades</th>
        <th>Peso</th>
        <th>Fecha de salida</th>
        </tr>`;
        
        for(let record of records){
            content+=`
            <tr>
            <td>${record.seller}</td>
            <td>${record.code}</td>
            <td>${record.name}</td>
            <td>${record.presentation}</td>
            <td>${record.loteId}</td>
            <td>${record.units}</td>
            <td>${record.weight}</td>
            <td>${record.outputDate}</td>
            </tr>
            `;
        }

        content+=`</table>
        </body>
        </html>
        `;
        return content;
    }
}
