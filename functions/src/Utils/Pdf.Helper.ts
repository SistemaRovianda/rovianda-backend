
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
import { Conditioning } from '../Models/Entity/Conditioning';
import { Sausaged } from '../Models/Entity/Sausaged';
import { Tenderized } from '../Models/Entity/Tenderized';
import { productRoutes } from '../Routes/Product.Routes';
import { ProductRovianda } from '../Models/Entity/Product.Rovianda';
import { PropertiesPackaging } from '../Models/Entity/Properties.Packaging';
import { PresentationProducts } from '../Models/Entity/Presentation.Products';
import { Packaging } from '../Models/Entity/Packaging';
import { response } from 'express';

export default class PdfHelper{

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
            <b><p id="title" align="center">EMPACADORA ROVIANDA S.A.P.I DE CV</p></b>
            <br>
            <b><p id="title" align="center" >BITACORA DE CONTROL DE CALIDAD DE ALMACEN EMPAQUES</p></b>
        </div>
        
        <table border="1" WIDTH="450" align="center">
            <tr>
                <th><img src="${LOGO.data}" alt="" ></th>
                <th class="ta" colspan="3">Nombre: ${user.name} ${user.firstSurname} ${user.lastSurname}</th>
                <th></th>
            </tr>

            <tr>
                <th></th>
                <th class="ta" colspan="3">Firma: </th>
                <th></th>
            </tr>

            <tr>
                <th></th>
                <th class="ta" colspan="3">Puesto: ${user.job}</th>
                <th></th>
            </tr>
            
        <!--------------------------------------------------------------------------->
            <tr>
                <th class="ma">Materia prima: ${drief.product.description}</th>
                <th  rowspan="2" colspan="3" >Lote proveedor: ${drief.loteProveedor}</th>
                <th  id="fec" rowspan="2">Fecha: ${drief.date}</th>
            </tr>

            <tr>
                <th class="ma">Proveedor: ${drief.proveedor}</th>
                
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
        return `
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
            <th><font size=1>Fecha</font></th>
            <th><font size=1>Proveedor</font</th>
            <th colspan="2"><font size=1>Materia prima</font></th>
            <th><font size=1>Lote proveedor</font></th>
         </tr>
<!-- ************************************************************************************************-->
         <tr>
            <th class="espa"><font size=1>${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}</font></th>
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
            <td><font size=1>${meat.weight.observations ? meat.weight.observations : ""}</font></td>
         </tr>
         <tr>
            <td><font size=1>Materia extraña</font></td>
            <td><font size=1>Ausente</font></td>
            <td><font size=1>${meat.strangeMaterial.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.strangeMaterial.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.strangeMaterial.observations ? meat.strangeMaterial.observations : ""}</font></td>
         </tr>
         <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>${meat.temperature.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.temperature.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.temperature.descriptions ? meat.temperature.descriptions : ""}</font></td>
         </tr>  
         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>${meat.fridge.accepted ? "Ok" : ""}</font></td>
            <td><font size=1>${!meat.fridge.accepted ? "No ok" : ""}</font></td>
            <td><font size=1>${meat.fridge.observations ? meat.fridge.observations : ""}</font></td>
         </tr>
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
            <th ><font size=1>${meat.qualityInspector.name} ${meat.qualityInspector.firstSurname} ${meat.qualityInspector.lastSurname}</font> </th>
            <th colspan="3" ><font size=1>Firma:</font></th>
         </tr>
         <tr>
            <td colspan="4"></td>
            <td align="center"><font size=1>F-CAL-RO-04</font></td>
         </tr>
        </table>
      </body>
    </html>`;
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
                
                img{
                    width: 60px;
                    height:80px;
                    transform: translateY(78%) translateX(474%);
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
            <td rowspan="3"><img src="${LOGO.data}" width=60px height=70px ></td>
            <th colspan="5">Nombre: ${formulation.make.name} ${formulation.make.firstSurname} ${formulation.make.lastSurname}</th>
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
                <td>${formulation.loteInterno}</td>
                <td>${formulation.temp}</td>
                <td>${formulation.waterTemp}</td>
                <td>${ingredents[0].productId.description}</td>
                <td>${formulation.date}</td>
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
                <td>${ingredents[i].productId.description}</td>
                <td></td>
            </tr>
            `;
        }
        return content + content2 + content3;
    }

    footerReportFormulation(formulation:Formulation){
        return `
                <tr>
                    <td colspan="3">Verifico: ${formulation.verifit.name} ${formulation.verifit.firstSurname} ${formulation.verifit.lastSurname}</td>
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
            Nombre: ${packing.make ? packing.make.name+" "+packing.make.firstSurname+" "+packing.make.lastSurname : "" }
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
            <td>${packing.quality ? "---" : ""}</td>
            <td>${!packing.quality ? "---" : ""}</td>
            <td colspan="2" style="max-width:140px"><div style="width: 140px;height: auto;word-wrap: break-word;">${packing.observations}</div></td>
        </tr>
        <tr>
            <td>Materia extraña</td>
            <td>Ausente</td>
            <td>${packing.strangeMaterial ? "---" : ""}</td>
            <td>${!packing.strangeMaterial ? "---" : ""}</td>
            <td colspan="2"></td>
        </tr>
       
        <tr>
                <td>Transporte</td>
                <td>Limpio</td>
                <td>${packing.transport ? "---" : ""}</td>
                <td>${!packing.transport ? "---" : ""}</td>
                <td colspan="2"></td>
        </tr>
     
        <tr>
            <td>Empaque</td>
            <td>Sin daños y limpios</td>
            <td>${packing.paking ? "---" : ""}</td>
            <td>${!packing.paking ? "---" : ""}</td>
            <td colspan="2"></td>
        </tr>
        <tr>
        <td colspan="2"><b>Verifico: ${packing.verifit ? packing.verifit.name+" "+packing.verifit.firstSurname+" "+packing.verifit.lastSurname : "" }</b> </td> 
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

         <table  align="center"    width="100%" > 
             <tr> <!-- columna-->
                 <td rowspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="60px">    </td>
                 <td colspan="2" align="center"><font size=1>EMPACADORA ROVIANDA S.A.P.I. DE C.V.</font></td>
             </tr>
                 <td align="center"><font size=1>CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO</font></td>
         </table>
 
         <table align="right" border="1px">
             <tr>       
                 <th><font size=1>Tiempo estimado:${revisionOven.stimatedTime}</font></th>   
             </tr>
         </table>
 
         <table border="1" align="center" width="100%"> 
             <th colspan="2"><font size=1>Producto: ${revisionOven.product.name}</font></th>
             <th><font size=1>PCC: ${revisionOven.pcc}</font></th>
             <th id="mueve7"><font size=1>Fecha: ${revisionOven.date}</font></th>
             <th> <font size=1>PCC = 70° C</font></th>
 
             <tr>
                 <td id="mueve5"><font size=1>Hora</font></td>
                 <td  id="mueve3"><font size=1>Temperatura interna del producto</font></td>
                 <td id="mueve4"><font size=1>Temperatura del horno</font></td>
                 <td id="mueve6"><font size=1>Humedad</font></td>
                 <td id="mueve2"><font size=1>Observaciones</font></td>
             </tr>`;
 
             
             let content2="";
             for(let i = 0; i<dataRevision.length; i++){
                 content2=content2 + `     
             <tr>
                 <td class="espa"><font size=1>${dataRevision[i].hour}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].interTemp}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].ovenTemp}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].humidity}</font></td>
                 <td class="espa"><font size=1>${dataRevision[i].observations}</font></td> 
             </tr >
             `;
            }

 
         return content+content2
     }

    footerReportOven(userElaborated:User,userVerify:User,revisionOven:OvenProducts){
        return `
        </table>
        <table align="center" border="1" id="ult" width="100%" ">
            <tr>
                <th class="seg"><font size=1>Elaboró: ${userElaborated.name} ${userElaborated.firstSurname}, ${userElaborated.lastSurname}</font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1>Puesto: ${revisionOven.jobElaborated}</font> </td>
            </tr>
            <tr>
                <th class="seg"><font size=1>Revisó: ${userVerify.name} ${userVerify.firstSurname} ${userVerify.lastSurname}</font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1><Puesto: ${revisionOven.jobVerify}</font></td>
            </tr>
            <tr>
                <th class="seg"><font size=1>Verificó: ${userVerify.name} ${userVerify.firstSurname} ${userVerify.lastSurname}</font</th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1>Puesto: ${revisionOven.nameVerify}</font></td>
            </tr>
        </table>

        <table align="right" border="1px">
             <tr>     
                <td><font size=1>F-HACCP-RO-05</font></td>
             </tr>
        </table>
        </body>
    </html>         

        `;
    }

     async reportOven(userElaborated:User,userVerify:User,revisionOven:OvenProducts,data:RevisionsOvenProducts[]){
        let content = this.headReportOven()+this.bodyReportOven(revisionOven,data)+this.footerReportOven(userElaborated,userVerify,revisionOven);
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
                        <th class="ta" colspan="4">Nombre: ${user.name} ${user.firstSurname} ${user.lastSurname}</th>
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
    <table  align="center" border="1px"   width="70%" > 
     <tr>
        <td rowspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="60px"></td>
        <td align="center"><font size=1>ROVIANDA S.A.P.I. DE C.V.</font></td>
        <td colspan="2" align="center"><font size=1>F-CAL-RO-04</font></td>
     </tr>
        <td align="center"><font size=1>RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</font></td>
        <td align="center"><font size=1></font> </td>
        <td align="center"><font size=1>Pág.:1 de 1</font></td>
    </table>
    `;
    }

    bodyReportEntryMeats(meat:EntranceMeat[]){
        let content=" ";
        for(let i = 0; i<meat.length; i++){
            content =content + `
        <table align="center" border="1px"  width="90%"  >
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
            <td><font size=1>${meat[i].transport.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].transport.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>
         
         <tr>
            <td><font size=1>Empaque</font></td>
            <td><font size=1>Sin daños y limpio</font> </td>
            <td><font size=1>${meat[i].packing.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].packing.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Caducidad</font></td>
            <td><font size=1>Vigente:</font></td>
            <td><font size=1>${meat[i].expiration.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].expiration.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Peso</font></td>
            <td><font size=1>Según el empaque</font></td>
            <td><font size=1>${meat[i].weight.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].weight.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Materia extraña</font></td>
            <td><font size=1>Ausente</font></td>
            <td><font size=1>${meat[i].strangeMaterial.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].strangeMaterial.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>${meat[i].temperature.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].temperature.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>  

         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>${meat[i].temperature.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].temperature.accepted ? "xxx" : ""}</font></td>
            <td></td>   
         </tr>

         <tr>
            <td><font size=1>Olor</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat[i].odor.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].odor.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>
        
         <tr>
            <td><font size=1>Color</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat[i].color.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].color.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Textura</font></td>
            <td><font size=1>Firme, Característico</font></td>
            <td><font size=1>${meat[i].texture.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat[i].texture.accepted ? "xxx" : ""}</font></td>
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
         </table>
         </br>`;
    }

    return content;
}

    footerReportEntryMeats(user:User){
    return `
    <table align="center" width="90%" border="1px">
      <tr>
        <th class="fin" ><font size=1>Realizó:</font></th>
        <th class="fin"  ><font size=1>${user.name} ${user.firstSurname} ${user.lastSurname}</font> </th>
        <th class="fin" colspan="3" ><font size=1>Firma:</font></th>
      </tr>
    </table>
  </body>
</html>      
    `;
    }

    async reportEntryMeats(user:User,meat:EntranceMeat[]){
        let content = this.headReportEntryMeats()+this.bodyReportEntryMeats(meat)+this.footerReportEntryMeats(user);
        return content;
    }


    headReportEntryPacking(user:User){
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
               width: 300px; 
            }
            #fec{   
                width:148px;
            }
            header{
                text-align: center;
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

        
    <header>
        <b><p id="title">EMPACADORA ROVIANDA S.A.P.I DE C.V</p></b>
        <p id="title">BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES  </p>
    </header>
  

        <img src="${LOGO.data}" alt="" align="left" >

        <table border="1" align="center" width="80%">
            <tr>
                <th class="ta">Nombre: ${user.name} ${user.firstSurname} ${user.lastSurname}</th>
            </tr>
            <tr>
                <th class="ta">Firma: </th>
            </tr>
            <tr>
                <th class="ta">Puesto: ${user.job}</th>
            </tr>
        </table>
            </br>
    `;
    }

    bodyReportEntryPacking(data:EntrancePacking[]){
        let content=" ";
        for(let i = 0; i<data.length; i++){
            content =content + `
            <!--------------------------------------------------------------------------->
            <table border="1" align="center" width="90%">
                <tr>
                    <th class="ma">Materia prima: ${data[i].product.description}</th>
                    <th  rowspan="2" >Lote proveedor: ${data[i].loteProveedor} </th>
                    <th  id="fec" rowspan="2">Fecha: ${data[i].date}</th>
                </tr>
                <tr>
                    <th class="ma">Proveedor: ${data[i].proveedor}</th>
                </tr>
            </table>

<!--------------------------------------------------------------------------->
            <table border="1" align="center" width="90%">
                <tr>
                    <th>Control</th>
                    <th>Estandar</th>
                    <th>Aceptado</th>
                    <th>Rechazado</th>
                    <th>Observaciones</th>
                </tr>

                  <tr>
                      <th><font size=1>Certificado de calidad</font></th>
                      <th><font size=1>Entrega de Certificado</font></th>
                      <th>${data[i].quality ? "xxx" : ""}</th>
                      <th>${!data[i].quality ? "xxx" : ""}</th>
                      <th><font size=1>${data[i].observations ? data[i].observations :""}</font></th>
                </tr>
                <tr>
                    <th><font size=1>Materia extraña</font></th>
                    <th><font size=1>Ausente</font></th>
                    <th>${data[i].strangeMaterial ? "xxx" : ""}</th>
                    <th>${!data[i].strangeMaterial ? "xxx" : ""}</th>
                    <th></th>
                </tr>
                <tr>
                    <th><font size=1>Transporte</font></th>
                    <th><font size=1>Limpio</font></th>
                    <th>${data[i].transport ? "xxx" : ""}</th>
                    <th>${!data[i].transport ? "xxx" : ""}</th>
                    <th></th>
                </tr>
                <tr>
                    <th><font size=1>Empaque</font></th>
                    <th><font size=1>Sin daños y limpios</font></th>
                    <th>${data[i].paking ? "xxx" : ""}</th>
                    <th>${!data[i].paking ? "xxx" : ""}</th>
                    <th></th>
                </tr>
        `;
    }

    return content;
    }   

    footerReportEntryPacking(entrancePacking:EntrancePacking){
    return `
    <table border="1px"  align="center" width="90%">
        <tr>
            <td class="te"><b>Verifico: ${entrancePacking.verifit == null ? "": entrancePacking.verifit.name} ${entrancePacking.verifit == null ? "": entrancePacking.verifit.firstSurname} ${entrancePacking.verifit == null ? "": entrancePacking.verifit.lastSurname}</b> </td> 
        <b> <td class="te"> <b> Firma: </b></td>  
        <b> <td class="te"> <b> Puesto: ${entrancePacking.verifit == null ? "": entrancePacking.verifit.job}</b> </td>
        </tr> 
    </table>
    <table align="right" width="25%" border="1px">
        <tr>     
           <td >F-CAL-RO-03 </td>
        </tr>
    </table>
    </body>
    </html>
    `;
    }

    async reportEntryPacking(user:User,packing:EntrancePacking[]){
        let content = this.headReportEntryPacking(user)+this.bodyReportEntryPacking(packing)+this.footerReportEntryPacking(packing[0]);
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
         <table  align="center"    width="100%" > 
             <tr> <!-- columna-->
                 <td rowspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="80px">    </td>
                 <td colspan="2" align="center"><font size=1>EMPACADORA ROVIANDA S.A.P.I. DE C.V.</font></td>
             </tr>
                 <td align="center"><font size=1>CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO</font></td>
         </table>
      `;
    }

    bodyReportOvenProducts(data:OvenProducts[]){
        let content="";
        for(let i = 0; i<data.length; i++){
            content =content + ` 
         <table align="right" border="1px">
             <tr>       
                 <th><font size=1>Tiempo estimado:${data[i].stimatedTime}</font></th>   
             </tr>
         </table>
 
         <table border="1" align="center" width="100%"> 
             <th colspan="2"><font size=1>Producto: ${data[i].product.name}</font></th>
             <th><font size=1>PCC: ${data[i].pcc}</font></th>
             <th id="mueve7"><font size=1>Fecha: ${data[i].date}</font></th>
             <th> <font size=1>PCC = 70° C</font></th>
 
             <tr>
                 <td id="mueve5"><font size=1>Hora</font></td>
                 <td  id="mueve3"><font size=1>Temperatura interna del producto</font></td>
                 <td id="mueve4"><font size=1>Temperatura del horno</font></td>
                 <td id="mueve6"><font size=1>Humedad</font></td>
                 <td id="mueve2"><font size=1>Observaciones</font></td>
             </tr>`;
             let content2="";
              for(let j=0; j<data[i].revisions.length;j++){   
                content =content + content2 + `
             <tr>
                 <td class="espa"><font size=1>${data[i].revisions[j].hour}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].interTemp}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].ovenTemp}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].humidity}</font></td>
                 <td class="espa"><font size=1>${data[i].revisions[j].observations}</font></td> 
             </tr >
             `
            }
        }
         return content;
     }

    footerReportOvenProducts(userElaborated:User,userVerify:User,oven:OvenProducts){
        return `
        </table>
        <table align="center" border="1" id="ult" width="100%" ">
            <tr>
                <th class="seg"><font size=1>Elaboró: ${userElaborated.name} ${userElaborated.firstSurname}, ${userElaborated.lastSurname}</font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1>Puesto: ${oven.jobElaborated}</font> </td>
            </tr>
            <tr>
                <th class="seg"><font size=1>Revisó: ${userVerify.name} ${userVerify.firstSurname} ${userVerify.lastSurname}</font></th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1><Puesto: ${oven.jobVerify}</font></td>
            </tr>
            <tr>
                <th class="seg"><font size=1>Verificó: ${userVerify.name} ${userVerify.firstSurname} ${userVerify.lastSurname}</font</th>
                <th class="fir"><font size=1>Firma:</font></th>
                <td><font size=1>Puesto: ${oven.nameVerify}</font></td>
            </tr>
        </table>

        <table align="right" border="1px">
             <tr>     
                <td><font size=1>F-HACCP-RO-05</font></td>
             </tr>
        </table>
        </body>
    </html>         

        `;
    }

     async reportOvenProducts(userElaborated:User,userVerify:User,data:OvenProducts[]){
        let content = this.headReportOvenProducts()+this.bodyReportOvenProducts(data)+this.footerReportOvenProducts(userElaborated,userVerify,data[0]);
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
        const formulationHeaderInfo = `<header>
        <b><p class="title">BITACORA DE CONTROL DE CALIDAD FORMULACION</p></b>
      </header>
  
      <img src="${LOGO.data}" alt="" />
    `;
    let formulationTableInfo = "";
    formulations.forEach( formulation => {
     formulationTableInfo += `
      <table id="ini" border="1">
        <tr>
          <th>Realizo, Nombre:  ${formulation.make.name} ${formulation.make.firstSurname} ${formulation.make.lastSurname}</th>
        </tr>
        <tr>
          <th>Firma:</th>
        </tr>
        <th>Puesto:  ${formulation.make.job}</th>
        <tr></tr>
      </table>

      <table id="ta" border="1" align="center" width="60%">
      <tr>
        <td class="pro">Producto</td>
        <td>Lote</td>
        <td>Temperatura carne</td>
        <td>Temperatura agua</td>
        <td>Ingredientes</td>
        <td style="width:50px;">Fechas</td>
      </tr>
        <tr>
            <td class="wi">${formulation.productRovianda.name}</td>
            <td>${formulation.loteInterno}</td>
            <td>${formulation.temp ? formulation.temp : ""}</td>
            <td>${formulation.waterTemp ? formulation.waterTemp : ""}</td>
            <td>${formulation.formulationIngredients.length && formulation.formulationIngredients[0].productId.description ? formulation.formulationIngredients[0].productId.description : "" }</td>
            <td>${formulation.date ? new Date(formulation.date).toLocaleDateString() : "" }</td>
        </tr>`;
            
            for(let index = 1; index < formulation.formulationIngredients.length; index++){
                
                formulationTableInfo+= `
                    <tr>
                    <td class="wi"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${formulation.formulationIngredients[index].productId.description}</td>
                    <td></td>
                </tr>`;
            }
      
     formulationTableInfo +=`</table>   <table id="fo1" border="1">
        <tr>
          <td>Verifico:  ${formulation.verifit.name} ${formulation.verifit.firstSurname} ${formulation.verifit.lastSurname}</td>
          <td>Firma:</td>
          <td>Puesto:  ${formulation.verifit.job}</td>
        </tr>
      </table>
      <br>
      `
      

    });
      formulationTableInfo+=`
  
      <table id="fo" border="1">
        <tr>
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

            .formacion{
                width: 131px;
                height: 18px;
            }

            </style>
        </head>
        `;
    }

    bodyReportProcess(data:Process,conditioning:Conditioning,sausaged:Sausaged,tenderized:Tenderized){
        let content =` 
        <body bgcolor="">
    <header align="center">
        <p>EMPACADORA ROVIANDA S.A.P.I. DE C.V</p>
        <P>BITACORA DE CONTROL DE CALIDAD SALA DE TRABAJO</P>
    </header>

    <table border="0" width="100%">
       <tr>
        <td> <img src="${LOGO.data}" align="left"  height="80px"></td>
        <td>
          <p align="right">No.Lote: ${data.loteInterno}</p>
          <p align="right">Fecha: ${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}</p>
        </td> 
       </tr>
    </table>
   </br>
    <table  align="left" border="1">
        <tr>
            <th>DESCOGELADO</th>
        </tr>
    </table>
    <table border="1"  align="center" width="100%">
        <tr>
            <th>MATERIA PRIMA</th>
            <th>FECHA</th>
            <th>PESO Kg</th>
            <th>T*C</th>
            <th>HORA DE ENTRADA</th>
            <th>HORA DE SALIDA</th>
        </tr>
        <tr>
        <td class="formacion" >${data.product == null ? "" : data.product.name}</td>
        <td>${data.startDate ? data.startDate : ""}</td>
        <td>${data.weigth ? data.weigth : ""}</td>
        <td>${data.temperature ? data.temperature :""}</td>
        <td>${data.entranceHour ? data.entranceHour :""}</td>
        <td>${data.outputHour}</td>
        </tr>
    </table>

    <table  align="left" border="1">
        <tr>
            <th>ACONDICIONAMIENTO</th>
        </tr>
    </table>

    <table border="1" align="center" width="100%">
        <tr>
            <th>MATERIA PRIMA</th>
            <th>FECHA</th>
            <th>PROCESO</th>
            <th>PESO Kg</th>
            <th>PRODUCTO(s)</th> 
        </tr>
        <tr>
            <td  class="formacion">${data.conditioningId == null ? "" : data.conditioningId.raw}</td>
            <td>${data.conditioningId == null ? "" :data.conditioningId.date}</td>
            <td>${data.conditioningId == null ? "" :data.currentProcess}</td>
            <td>${data.conditioningId == null ? "" :data.conditioningId.weight}</td>
            <td>${conditioning.productId == null ? "" :conditioning.productId.name}</td>
            <td cellspacing="0">clave</td>
            <td cellspacing="0">Proceso</td>
            
    
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>D</td>
            <td>Deshuese</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>L</td>
            <td>Limpieza</td>
    
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>SC</td>
            <td>Salado y curado</td>
        </tr>
        <tr>
            <td class="formacion" ></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        </table>

        <table align="left" border="1">
            <tr>
                <th>MOLIENDA</th>
            </tr>
        </table>

        <table border="1" align="center" width="100%">
            <tr>
                <th>MATERIA PRIMA</th>
                <th>FECHA</th>
                <th>PROCESO</th>
                <th>PESO Kg</th>
                <th>T*C</td>
                <th>PRODUCTO(s)</th>
            </tr>

            <tr>
                <th class="formacion">${data.grindingId == null ? "" : data.grindingId.raw}</th>
                <th>${data.grindingId == null ? "" : data.grindingId.date}</th>
                <th>${data.grindingId == null ? "" : data.grindingId.process}</th>
                <th>${data.grindingId == null ? "" : data.grindingId.weight}</th>
                <th>${data.temperature}</th>
                <th>${data.product == null ? "" : data.product.name}</th>
            </tr>
        </table>


          <table align="left" border="1">
              <tr>
                  <th>INYECCION/TENDERIZADO</th>
              </tr>
          </table>

          <table border="1"  align="center" width="100%">
              <tr>
                  <th>PRODUCTO</th>
                  <th>FECHA</th>
                  <th>PESO Kg</th>
                  <th>T*C</th>
                  <th>PESO SALMUERA Kg</th>
                  <th>%INYECCION</th>
              </tr>

              <tr>
                <th class="formacion">${tenderized.productId == null ? "" : tenderized.productId.name}</th>
                <th>${data.tenderizedId == null ? "" : data.tenderizedId.date}</th>
                <th>${data.tenderizedId == null ? "" : data.tenderizedId.weight}</th>
                <th>${data.tenderizedId == null ? "" : data.tenderizedId.temperature}</th>
                <th>${data.tenderizedId == null ? "" : data.tenderizedId.weightSalmuera}</th>
                <th>${data.tenderizedId == null ? "" : data.tenderizedId.percentInject}</th>
            </tr>
          </table>

          <table align="left" border="1">
            <tr>
                <th>EMBUTIDO</th>
            </tr>
        </table>

          <table border="1"  align="center" width="100%">
            <tr>
                <th>PRODUCTO</th>
                <th>FECHA</th>
                <th>T*C</th>
                <th>PESO Kg.Inicio(Hra)</th>
                <th>PESO Kg.Medio(Hra)</th>
                <th>PESO Kg. Fin (Hra)</th>
            </tr>

            <tr>
              <th class="formacion">${sausaged.productId == null ? "" :sausaged.productId.name}</th>
              <th>${data.sausageId == null ? "" : data.sausageId.date}</th>
              <th>${data.sausageId == null ? "" : data.sausageId.temperature}</th>
              <th>${data.sausageId == null ? "" : data.sausageId.weightIni} (${data.sausageId == null ? "" : data.sausageId.hour1})</th>
              <th>${data.sausageId == null ? "" : data.sausageId.weightMedium} (${data.sausageId == null ? "" : data.sausageId.hour2})</th>
              <th>${data.sausageId == null ? "" : data.sausageId.weightExit} (${data.sausageId == null ? "" : data.sausageId.hour3})</th>
          </tr>

        </table>

        <table align="right" width="20%" border="1px">
            <tr>     
                    <td>F-CAL-RO-07</td>
            </tr>
        </table>

        <table align="center" height="60px" width="100%" border="1">
        <tr>
            <th>Elaboro: ${data.nameElaborated ? data.nameElaborated : ""}  </th>
            <th>Firma: </th>
            <th>Puesto: ${data.jobElaborated? data.jobElaborated:""}</th>
        </tr>
    </table>
    <table align="center" height="60px" width="100%" border="1">
        <tr>
            <div id="text">
            <th>Verifico: ${data.nameVerify? data.nameVerify : ""} </th>
            <th>Firma: </th>
            <th>Puesto: ${data.jobVerify?data.jobVerify:""}</th>
        </div>
        </tr>
    </table>
</body>
</html>`
         return content;
     }
    
     async reportProcess(data:Process,conditioning:Conditioning,sausaged:Sausaged,tenderized:Tenderized){
        let content = this.headReportProcess()+this.bodyReportProcess(data,conditioning,sausaged,tenderized);
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
                    height: 15px;
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
                  width: 80px;
                  height:100px;
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
        let content =` 
        </head>
        <body>
        
            <header >
                <p> <b> EMPACADORA ROVIANDA S.A.P.I DE C.V. </b></p>
                <p> <b> BITACORA DE CONTROL DE REBANADO Y EMPACADO </b></p>
            </header>
        
             
            <img src="${LOGO.data}" alt=""> 
              
            <div id="fec" >
            <p>Fecha: ${new Date().getFullYear().toString()}-${new Date().getMonth().toString()}-${new Date().getDate().toString()}</p>
             </div><br>
        
        
            <table border="1" align="center" width="60%">
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
                <td class="cel">${!properties ? " " : properties[0].presentationId.presentation}</td>
                <td class="cel">${!properties ? " " : properties[0].units}</td>
                <td class="cel">${!properties ? " " : properties[0].weight}</td>
                <td class="cel">${!properties ? " " : properties[0].observations}</td>
                <td class="cel">${!data ? " " : data.userId.name} ${!data ? " " : data.userId.firstSurname} ${!data ? " " : data.userId.lastSurname}</td>
                </tr>
                `;
                let content2 = "";
                for(let i = 1; i<properties.length; i++){
                    content2 = content2 + `
                    <tr>
                        <td class="cel"></td>
                        <td class="cel"></td>
                        <td class="cel">${!properties ? " " : properties[i].presentationId.presentation}</td>
                        <td class="cel">${!properties ? " " : properties[i].units}</td>
                        <td class="cel">${!properties ? " " : properties[i].weight}</td>
                        <td class="cel">${!properties ? " " : properties[i].observations}</td>
                        <td class="cel"></td>
                    </tr>
                    `;
                }
                let content3 = `
            </table>
        
            <table align="right" width="25%" border="1px" w>
                <tr>     
                        <td>F-CALL-RO-020</td>
                        <td >F-CALL-RO-020</td>
                </tr>
            </table>
            
        </body>
        </html>
                `;
         return content+content2+content3;
     }
    

    async reportPackagingById(data:Packaging,properties: PropertiesPackaging[]){
        let content = this.headReportPackaging()+this.bodyReportPackaging(data,properties);
        return content;
    }
}
