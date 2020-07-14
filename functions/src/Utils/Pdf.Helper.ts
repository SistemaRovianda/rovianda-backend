
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
                margin-left: 440px
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

    bodyReportEntranceDrief(user:User,drief:EntranceDrief){
        return `
        <body>
        <br><br><br><br>
        <header>
            <b><p id="title">RECEPCIÓN DE MATERIA PRIMA SECOS</p></b>
        </header>
        <img src="${LOGO.data}" alt="" >
        <table border="1" align="center">
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
        <!--------------------------------------------------------------------------->
        <table border="1" align="center">
            <tr>
                <th class="ma">Materia prima: ${drief.product.description}</th>
                <th  rowspan="2" >Lote proveedor: ${drief.loteProveedor}</th>
                <th  id="fec" rowspan="2">Fecha: ${drief.date}</th>
            </tr>

            <tr>
                <th class="ma">Proveedor: ${drief.proveedor}</th>
                
            </tr>
        </table>
        <!--------------------------------------------------------------------------->
        <table border="1" WIDTH="630" align="center">
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
                <th></th>
                <th></th>
                <th>${drief.observations}</th>
            </tr>
            <tr>
                <th>Caducidad</th>
                <th>Vigente</th>
                <th>${drief.expiration ? "---" : ""}</th>
                <th>${!drief.expiration ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Materia Extraña</th>
                <th>Ausente</th>
                <th>${drief.strangeMaterial ? "---" : ""}</th>
                <th>${!drief.strangeMaterial ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Transporte</th>
                <th>Limpio</th>
                <th>${drief.transport ? "---" : ""}</th>
                <th>${!drief.transport ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Empaque</th>
                <th>Sin daños y limpio</th>
                <th>${drief.paking ? "---" : ""}</th>
                <th>${!drief.paking ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Olor</th>
                <th>Caracteristico</th>
                <th>${drief.odor ? "---" : ""}</th>
                <th>${!drief.odor ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Color</th>
                <th>Caracteristico</th>
                <th>${drief.color ? "---" : ""}</th>
                <th>${!drief.color ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Textura</th>
                <th>Caracteristico</th>
                <th>${drief.texture ? "---" : ""}</th>
                <th>${!drief.texture ? "---" : ""}</th>
                <th></th>
            </tr>

            <tr>
                <th>Peso</th>
                <th>Según Empaque</th>
                <th>${drief.weight ? "---" : ""}</th>
                <th>${!drief.weight ? "---" : ""}</th>
                <th></th>
            </tr>
        </table>
        <table id="mueve" border="1px">
            <tr>     
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

            #ubica{
            margin-bottom: 70px;;
            }    
        </style>
    </head>`;
    }

    bodyReportEntranceMeat(user:User,meat:EntranceMeat){
        return `
        <body bgcolor="">
        <table  align="center" border="1px"   width="70%" > 
         <tr>
            <td rowspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="60px"></td>
            <td align="center"><font size=1>ROVIANDA S.A.P.I. DE C.V.</font></td>
            <td colspan="2" align="center"><font size=1>F-CAL-RO-04</font></td>
         </tr>
            <td align="center"><font size=1>RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</font></td>
            <td align="center"><font size=1>LOTE INTERNO: ${meat.loteInterno}</font> </td>
            <td align="center"><font size=1>Pág.:1 de 1</font></td>
        </table>
<!-- ************************************************************************************************-->
        <table align="center" border="1px"  width="90%"  >
         <tr>
            <img src="" alt="">
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
            <td align="center" height="2px"><font size=1>Limpio, sin olores,sin material ajeno, sin plagas</font></td>
            <td><font size=1>${meat.transport.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.transport.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>
         
         <tr>
            <td><font size=1>Empaque</font></td>
            <td><font size=1>Sin daños y limpio</font> </td>
            <td><font size=1>${meat.packing.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.packing.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Caducidad</font></td>
            <td><font size=1>Vigente:</font></td>
            <td><font size=1>${meat.expiration.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.expiration.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Peso</font></td>
            <td><font size=1>Según el empaque</font></td>
            <td><font size=1>${meat.weight.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.weight.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Materia extraña</font></td>
            <td><font size=1>Ausente</font></td>
            <td><font size=1>${meat.strangeMaterial.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.strangeMaterial.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td rowspan="2"><font size=1>Temperatura</font></td>
            <td><font size=1>Fresco: Max. 4°C</font></td> 
            <td><font size=1>${meat.temperature.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.temperature.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>  

         <tr>
            <td><font size=1>Congelado: Max. -18°C</font></td>
            <td><font size=1>${meat.temperature.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.temperature.accepted ? "xxx" : ""}</font></td>
            <td></td>   
         </tr>

         <tr>
            <td><font size=1>Olor</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat.odor.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.odor.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>
        
         <tr>
            <td><font size=1>Color</font></td>
            <td><font size=1>Característico</font></td>
            <td><font size=1>${meat.texture.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.texture.accepted ? "xxx" : ""}</font></td>
            <td></td>
         </tr>

         <tr>
            <td><font size=1>Textura</font></td>
            <td><font size=1>Firme, Característico</font></td>
            <td><font size=1>${meat.texture.accepted ? "xxx" : ""}</font></td>
            <td><font size=1>${!meat.texture.accepted ? "xxx" : ""}</font></td>
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
         <tr>
            <th class="fin" ><font size=1>Inspector de calidad</font></th>
            <th class="fin"  ><font size=1>${meat.qualityInspector.name} ${meat.qualityInspector.firstSurname} ${meat.qualityInspector.lastSurname}</font> </th>
            <th class="fin" colspan="3" ><font size=1>Firma:</font></th>
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
                    margin-left: 275px;
                    width: 350px;
                    height: 100px;
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
                header{
                    text-align: center;
                    margin-bottom: -70px;
                }
                #fo1{
                    margin-left: 0px;
                    width: 627px;
                    height: 30px;
                }
                #fo{
                    margin-left: 430px;
                    width:200px ;
                }
            </style>
        </head>
        `;
    }

    bodyReportFormulation(formulation:Formulation,ingredents:FormulationIngredients[]){
        let content = `
        <body>
        <br><br><br>
        <header>
            <b><p id="title">  BITACORA DE CONTROL DE CALIDAD FORMULACION</p></b>
        </header>
        <img src="${LOGO.data}" alt="">
        <table id="ini" border="1"  >
            <tr>
                <th>Realizo, Nombre: ${formulation.make.name} ${formulation.make.firstSurname} ${formulation.make.lastSurname}</th>
            </tr>
            <tr>
                <th>Firma: </th>
            </tr>      
            <th>Puesto: ${formulation.make.job}</th>
            <tr>
            </tr>
        </table>
        `;
        let content2 = `
        <table  id="ta" border="1" align="center" width="100%">
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
            </table>
            <table id="fo1" border="1" >
                <tr>
                    <td>Verifico: ${formulation.verifit.name} ${formulation.verifit.firstSurname} ${formulation.verifit.lastSurname}</td>
                    <td>Firma: </td>
                    <td>Puesto: ${formulation.verifit.job}</td>
                </tr>
            </table>
            <table id="fo" border="1" >
                <tr>
                    <th>F-CAL-RO-05</th>
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
       <header>
           <img src="${LOGO.data}" alt="" align="left">
           <p>EMPACADORA ROVIANDA S.A.P.I. DE C.V.</p>
           <P>BITACORA DE CONTROL DE PEP´S ALAMACENES</P>
       </header>
        <br>
        <table align="right"  border="1" width="30%">
            <tr>
                <td> ALMACEN:</td>
            </tr>
        </table>
        <br>
       <table border="1" align="center" width="100%">
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
            `};
        

        let content3 = `
        </table>

        <table align="right" border="1px" >
            <tr>     
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
                margin-left: 445px
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
        <img src="${LOGO.data}" alt="" >
        <table border="1" align="center">
            <tr>
                <th class="ta">Nombre: ${packing.make ? packing.make.name+" "+packing.make.firstSurname+" "+packing.make.lastSurname : "" }</th>
            </tr>
            <tr>
                <th class="ta">Firma: </th>
            </tr>
            <tr>
                <th class="ta">Puesto: ${packing.make ? packing.make.job : "" }</th>
            </tr>
        </table>
    
    <!--------------------------------------------------------------------------->
        <table border="1" WIDTH="630" align="center">
            <tr>
                <th class="ma">Materia prima: ${packing.product.description}</th>
                <th  rowspan="2" >Lote proveedor: ${packing.loteProveedor}</th>
                <th  id="fec" rowspan="2">Fecha: ${packing.date}</th>
            </tr>
            <tr>
                <th class="ma">Proveedor: ${packing.proveedor}</th>
            </tr>
        </table>
    
    <!--------------------------------------------------------------------------->
        <table border="1" WIDTH="630" align="center">
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
                <th>${packing.quality ? "---" : ""}</th>
                <th>${!packing.quality ? "---" : ""}</th>
                <th>${packing.observations}</th>
            </tr>
            <tr>
                <th>Materia extraña</th>
                <th>Ausente</th>
                <th>${packing.strangeMaterial ? "---" : ""}</th>
                <th>${!packing.strangeMaterial ? "---" : ""}</th>
                <th></th>
            </tr>
            <tr>
                <th>Transporte</th>
                <th>Limpio</th>
                <th>${packing.transport ? "---" : ""}</th>
                <th>${!packing.transport ? "---" : ""}</th>
                <th></th>
            </tr>
            <tr>
                <th>Empaque</th>
                <th>Sin daños y limpios</th>
                <th>${packing.paking ? "---" : ""}</th>
                <th>${!packing.paking ? "---" : ""}</th>
                <th></th>
            </tr>
        </table>
    
        <table border="1px" WIDTH="630" align="center">
                <tr>
                    <td class="te"><b>Verifico: ${packing.verifit ? packing.verifit.name+" "+packing.verifit.firstSurname+" "+packing.verifit.lastSurname : "" }</b> </td> 
                <b> <td class="te"> <b> Firma: </b></td>  
                <b> <td class="te"> <b> Puesto: ${packing.verifit ? packing.verifit.job : "" }</b> </td>
                </tr> 
        </table>
        <table id="mueve" border="1px">
            <tr>     
                    <td >F-CAL-RO-03 </td>
                
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
 
}

