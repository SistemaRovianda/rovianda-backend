import { ProductInfoFromPackDefrostTrazability, ProductInfoFromPackIngredientsTrazability, ProductInfoFromPackTrazability } from "../../Models/DTO/Quality.DTO";
import { FridgeRepository } from "../../Repositories/Fridges.Repository";

export class ReportTrazability{

    private fridgeRepository:FridgeRepository;
    constructor(){
        this.fridgeRepository = new FridgeRepository();
    }

    async getReportOfTrazability(productInfo:ProductInfoFromPackTrazability,productDefrost:ProductInfoFromPackDefrostTrazability[],ingredients:ProductInfoFromPackIngredientsTrazability[],rangeDate:{startDate:string,endDate:string}[]){
        let report= `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Reporte de trazabilidad</title>
                <style>
                    .bottom{
                        border-bottom: solid 1px black;
                    } 
                    .left{
                        border-left: solid 1px black;
                    }
                    .right{
                        border-right: solid 1px black;
                    }
                    .top{
                        border-top: solid 1px black;
                    }
                    .bottom-strong{
                        border-bottom: solid 3px black;
                    } 
                    .left-strong{
                        border-left: solid 3px black;
                    }
                    .right-strong{
                        border-right: solid 3px black;
                    }
                    .top-strong{
                        border-top: solid 3px black;
                    }
                    .center{
                        text-align: center;
                    }
                    body{
                        font-size: 8px;
                    }
                    
                </style>
            </head>
            <body>
                <table style="width:100%" class="top-strong right-strong " cellspacing="0px">
                    <tr>
                    <td colspan="3" class="left-strong"><img src="https://firebasestorage.googleapis.com/v0/b/sistema-rovianda.appspot.com/o/logo%2Flogo_rovianda.svg?alt=media&token=b23beb9d-bc1f-45c3-b360-9e6c77148971" width="100px" height="60px"></td>
                    <td colspan="5"><u>REPORTE DE TRAZABILIDAD</u></td>
                    
                    </tr>
                    <tr >
                        <td colspan="8" class="left-strong " style=" background-color: #c9d4cc;">
                            <p style=" background-color: #c9d4cc;">Con el fin de rastrear la procedencia y el tipo de preparación de nuestros productos, 
                            se realizará un proceso de trazabilidad, por medio de el que se podran investigar las presentaciones de cada
                        uno de los productos como: lote,materia prima,cocimiento del producto,ingredientes,temperaturas,maquinaria por donde pasa el producto,
                        el control de quimicos para lavar la maquinaria, como también el nombre del repartidor/cliente al que se le entrego el producto.</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: center; background-color: #abb3ad;" class="left-strong top-strong bottom-strong">
                            <strong><label>OBJETIVOS</label></strong>
                        </td>
                    </tr>
                    <tr >
                        <td colspan="8" style="background-color: #c9d4cc;" class="left-strong">
                            <ul style="list-style: none;">
                                <li style="text-align: center;">- Recopilar los números de lote y cantidades de materia prima.</li>
                                <li style="text-align: center;">- Localizar los mismos lotes de producto y cantidad que se han utilizado para la producción.</li>
                                <li style="text-align: center;">- Localizar las cantidades localizadas con las cantidades de producción registradas.</li>
                                <li style="text-align: center;">- Inmovilizar el producto.</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: center; background-color: #abb3ad;" class="top-strong bottom-strong left-strong">
                            <strong><label>1.-DATOS DEL PRODUCTO</label></strong>
                        </td>
                    </tr>
                    <tr >
                        <td colspan="3" class="bottom  center left-strong"><strong>Producto</strong></td>
                        <td class="bottom left center"><strong>Lote</strong></td>
                        <td colspan="3" class="bottom left center"><strong>Fecha de caducidad</strong></td>
                        <td class="bottom left  center"><strong>Lote del producto</strong></td>
                    </tr>
                    <tr >
                        <td colspan="3" class="bottom  center left-strong">${productInfo.productName} ${productInfo.presentation}</td>
                        <td class="bottom left center">${productInfo.lotId.slice(0,2)}</td>
                        <td colspan="3" class="bottom left center">${productInfo.expiration}</td>
                        <td class="bottom left  center">${productInfo.lotId}</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="center left-strong"><strong>No de pz o paquetes</strong></td>
                        <td class="center left">${productInfo.outputOfWarehouse}</td>
                        <td class="center left">${productInfo.weightOfWarehouse}</td>
                        <td colspan="2" class="left center"><strong>Fecha de distribución</strong></td>
                        <td class="left">${rangeDate.length?((rangeDate[0].startDate!=null)?rangeDate[0].startDate.split("T")[0]:""):""}</td>
                        <td class="center left">${(productInfo.active==0?(rangeDate.length?(rangeDate[0].endDate!=null?rangeDate[0].endDate.split("T")[0]:""):""):"")}</td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: center; background-color: #abb3ad; " class="top-strong bottom-strong left-strong" >
                            <strong><label>2.-RECEPCIÓN DE MATERIAS PRIMAS Y MATERIALES EMVASADOS</label></strong>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: center; background-color: #abb3ad;  " class="bottom-strong left-strong">
                            <strong><label>A. Entrada de materia prima</label></strong>
                        </td>
                    </tr>
                    <tr>
                        <td class="bottom center left-strong">Fecha</td>
                        <td class="bottom left center">Temperatura °C</td>
                        <td class="bottom left center">Lote Interno</td>
                        <td class="bottom left center">Lote Proveedor</td>
                        <td class="bottom left center">Fecha de matanza</td>
                        <td class="bottom left center">Materia prima</td>
                        <td class="bottom left center">Conservación/Congelador</td>
                        <td  class="bottom left center">Proveedor</td>
                    </tr>
                    `;
                    for(let defrost of productDefrost){
                        let temp = JSON.parse(defrost.temperature);
                        let slaughter=JSON.parse(defrost.slaughterDate);
                        let frige = JSON.parse(defrost.fridge);
                        let frigeEntity = await this.fridgeRepository.getFridgeByIdFridge(+frige.fridgeId);

                        report+=`
                        <tr>
                            <td class="bottom center left-strong">${defrost.dateEntrance}</td>
                            <td class="bottom left center">${temp.value}</td>
                            <td class="bottom left center">${defrost.lotIntern}</td>
                            <td class="bottom left center">${defrost.lotProvider}</td>
                            <td class="bottom left center">${slaughter.value}</td>
                            <td class="bottom left center">${defrost.rawMaterial}</td>
                            <td class="bottom left center">${frigeEntity.temp} ${frigeEntity.description}</td>
                            <td  class="bottom left center">${defrost.provider}</td>
                        </tr>
                        `;
                    }
                    
                    report+=`
                    <tr>
                        <td class="left-strong"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="left-strong"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="8" style="text-align: center; background-color: #abb3ad; " class="top-strong bottom-strong left-strong" >
                            <strong><label>3.-Control de PEP´S Almacenes</label></strong>
                        </td>
                    </tr>
                    <tr>
                        <td class="bottom center left-strong"><strong>Ingredientes</strong></td>
                        <td colspan="2" class="bottom left center"><strong>Nombre o Marca</strong></td>
                        <td class="bottom left center"><strong>Lote</strong></td>
                        <td class="bottom left center"><strong>Fecha de entrada</strong></td>
                        <td colspan="3" class="bottom left center"><strong>Distribuidora</strong></td>
                    </tr>
                    `;
                    if(ingredients.length){
                        let ingreFirst = ingredients[0];
                        let ingreList=`${ingreFirst.productName}, `;;
                        let subValues ="";
                    for(let i=1;i<ingredients.length;i++){
                        let ingre = ingredients[i];
                        subValues+=`
                        <tr>
                            
                            <td colspan="2" class=" ${(i+1==ingredients.length)?"bottom-strong":"bottom"} left center">${ingre.productName}</td>
                            <td class="${(i+1==ingredients.length)?"bottom-strong":"bottom"} left center">${ingre.lotProvider}</td>
                            <td class="${(i+1==ingredients.length)?"bottom-strong":"bottom"} left center">${ingre.entranceDate}</td>
                            <td colspan="3" class="${(i+1==ingredients.length)?"bottom-strong":"bottom"} left center">${ingre.provider}</td>
                        </tr>
                        `;
                        ingreList+=`${ingre.productName}, `;
                    }
                    ingreList+=";";
                        ingreList=ingreList.replace(", ;","");
                    report+=`
                    <tr>
                        <td rowspan="${ingredients.length}" style="max-width:150px" class="bottom-strong center left-strong">${ingreList}</td> 
                        <td colspan="2" class="bottom-strong left center">${ingreFirst.productName}</td>
                        <td class="bottom-strong left center">${ingreFirst.lotProvider}</td>
                        <td class="bottom-strong left center">${ingreFirst.entranceDate}</td>
                        <td colspan="3" class="bottom-strong left center">${ingreFirst.provider}</td>
                    </tr>
                    `;
                    report+=subValues;
                }
                    
                    report+=`
                   
                    <tr>
                        <td><strong>Fecha de elaboración:</strong></td>
                        <td colspan="4" ><strong>`;
                        let date = new Date();
                        date.setHours(date.getHours()-5);
                        let month = (date.getMonth()+1).toString();
                        let day = date.getDate().toString();
                        if(+month<10) month="0"+month;
                        if(+day<10) day="0"+day;
                        report+=`${date.getFullYear()}-${month}-${day}`;
                        report+=`</strong></td>
                        <td ><strong></strong></td>
                        <td colspan="3" class="bottom-strong left-strong "><strong>F-CAL-R0-64</strong></td>
                    </tr>
                </table>
            </body>
        </html>
        `;
        return report;
    }
}