import LOGO from '../Models/Logo';
import { User } from '../Models/Entity/User';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { Formulation } from '../Models/Entity/Formulation';
import { FormulationIngredients } from '../Models/Entity/Formulation.Ingredients';
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
            margin-bottom: 150px;;
            }    
        </style>
    </head>`;
    }
 
bodyReportEntranceMeat(user:User,meat:EntranceMeat){
        return `
        <body bgcolor="#9FB0BF">
        <table  align="center" border="1px"   width="50%" > 
         <tr>
            <td rowspan="2" align="center" >  <img src="${LOGO.data}" alt=""  height="90px">    </td>
            <td align="center">ROVIANDA S.A.P.I. DE C.V.</td>
            <td colspan="2" align="center">F-CAL-RO-04</td>
         </tr>
            <td align="center">RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</td>
            <td align="center">LOTE INTERNO: ${meat.loteInterno} </td>
            <td align="center">Pág.: 1 de 1</td>
        </table>
<!-- ************************************************************************************************-->
        <table align="center" border="1px"  width="50%"  >
         <tr>
            <img src="" alt="">
            <th>Fecha</th>
            <th>Proveedor</th>
            <th colspan="2">Materia prima</th>
            <th>Lote proveedor</th>
         </tr>
<!-- ************************************************************************************************-->
         <tr>
            <th class="espa">${Date.toString}</th>
            <th class="espa">${meat.proveedor}</th>
            <th class="espa"  colspan="2">${meat.rawMaterial}</th>
            <th class="espa">${meat.loteProveedor}</th>
         </tr>
<!-- ************************************************************************************************-->  
        <th>Control</th>
        <th>Estándar</th>
        <th>Aceptado</th>
        <th>Rechazado</th>
        <th>Observaciones</th>
<!-- ************************************************************************************************-->
         <tr>
            <td>Transporte </td>
            <td align="center" height="2px">Limpio, sin olores,sin material ajeno, sin plagas </td>
            <td>${meat.transport.accepted ? "---" : ""}</td>
            <td>${!meat.transport.accepted ? "---" : ""}</td>
            <td></td>
         </tr>
         
         <tr>
            <td>Empaque</td>
            <td>Sin daños y limpio </td>
            <td>${meat.packing.accepted ? "---" : ""}</td>
            <td>${!meat.packing.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td>Caducidad</td>
            <td>Vigente:</td>
            <td>${meat.expiration.accepted ? "---" : ""}</td>
            <td>${!meat.expiration.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td>Peso</td>
            <td>Según el empaque</td>
            <td>${meat.weight.accepted ? "---" : ""}</td>
            <td>${!meat.weight.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td>Materia extraña</td>
            <td>Ausente</td>
            <td>${meat.strangeMaterial.accepted ? "---" : ""}</td>
            <td>${!meat.strangeMaterial.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td rowspan="2">Temperatura</td>
            <td>Fresco: Max. 4°C </td> 
            <td>${meat.temperature.accepted ? "---" : ""}</td>
            <td>${!meat.temperature.accepted ? "---" : ""}</td>
            <td></td>
         </tr>  

         <tr>
            <td>Congelado: Max. -18°C</td>
            <td>${meat.temperature.accepted ? "---" : ""}</td>
            <td>${!meat.temperature.accepted ? "---" : ""}</td>
            <td></td>   
         </tr>

         <tr>
            <td>Olor</td>
            <td>Característico</td>
            <td>${meat.odor.accepted ? "---" : ""}</td>
            <td>${!meat.odor.accepted ? "---" : ""}</td>
            <td></td>
         </tr>
        
         <tr>
            <td>Color</td>
            <td>Característico</td>
            <td>${meat.texture.accepted ? "---" : ""}</td>
            <td>${!meat.texture.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td>Textura </td>
            <td>Firme, Característico</td>
            <td>${meat.texture.accepted ? "---" : ""}</td>
            <td>${!meat.texture.accepted ? "---" : ""}</td>
            <td></td>
         </tr>

         <tr>
            <td colspan="5">Desviación:</td>
         </tr>

         <tr>
            <td class ="separa" colspan="5"></td>
         </tr>

         <tr>
            <td colspan="5">Acción correctiva:</td>
         </tr>

         <tr>
            <td  class ="separa" colspan="5"></td>
         </tr>

         <tr>
            <td height="180px"  width="" colspan="5" > <div id="ubica"> Etiqueta: </div>  </td>
         </tr>

         <tr>
            <th class="fin" >${user.job}</th>
            <th class="fin"  >${user.name} ${user.firstSurname} ${user.lastSurname} </th>
            <th class="fin" colspan="3" >Firma:</th>
         </tr>

        </table>

      </body>
    </html>
        `;
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
                <th class="ta">Nombre: ${packing.make.name} ${packing.make.firstSurname} ${packing.make.lastSurname}</th>
            </tr>
            <tr>
                <th class="ta">Firma: </th>
            </tr>
            <tr>
                <th class="ta">Puesto: ${packing.make.job}</th>
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
                    <td class="te"><b>Verifico: ${packing.verifit.name} ${packing.verifit.firstSurname} ${packing.verifit.lastSurname}</b> </td> 
                <b> <td class="te"> <b> Firma: </b></td>  
                <b> <td class="te"> <b> Puesto: ${packing.verifit.job}</b> </td>
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

}

