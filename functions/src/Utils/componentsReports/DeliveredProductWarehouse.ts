import { DeliverToWarehouse } from "../../Services/Packaging.Service";
import LOGO from "../../Models/Logo"
import { User } from "../../Models/Entity/User";
export class DeliveredProductWarehouse{

    getHeader(seller:User,dateStart:string,dateEnd:string){
        return `
        <html>
        <head>
        <style>
        table{
        border-collapse: collapse;
        }
        table, td, th {
        border: 1px solid black;
        }
        </style>
        </head>
        <body>
        <img src="${LOGO.data}" width="100px" heigth="100px">
        <h4>ROVIANDA S.A.P.I. DE C.V</h4><h4>PRODUCTO ENTREGADO</h4>
        <h3>${seller?"VENDEDOR: "+seller.name:"ALMACEN PLANTA"}</h3>
        <h3>Desde: ${dateStart} hasta: ${dateEnd}</h3>
        `;
    }

    getFotter(){
        return `
        </body></html>
        `;
    }

    getReportWarehouseDeliveredBySeller(orders:DeliverToWarehouse[],seller:User,dateStart:string,dateEnd:string){
        return this.getHeader(seller,dateStart,dateEnd)+this.getBodyReport(orders)+this.getFotter();
    }

    getReportWarehouseDeliveredByPlant(orders:DeliverToWarehouse[],dateStart:string){
        return this.getHeaderPlant()+this.getBodyReportPlant(orders,dateStart)+this.getFotter();
    }
    getHeaderPlant(){
        return `
        <html>
        <head>
        <style>
        *{
            font-size: 10px
        }
        
        table {
        border-collapse: collapse;
        }
        td,th{
            border-collapse: collapse;
            border: 1px solid black;
        }
        .without{
            border: none
        }
        </style>
        </head>
        <body>
        <div>
        <div style="float:left">
        <img src="${LOGO.data}" width="100px" heigth="100px">
        </div>
        <div style="float: left">
        <h4  style="width:'100%' ;text-align:center">EMPACADORA ROVIANDA S.A.P.I. DE C.V</h4>
        <h4  style="width:'100%' ;text-align:center">BITACORA DE CONTROL DE REBANADO Y EMPACADO</h4>
        </div>
        </div>
        
        `;
    }
    getBodyReportPlant(orders:DeliverToWarehouse[],dateStart:string){

        let content = `
        <div>
        <table width="100%">
        <tr class="without">
        <td colspan="3" style="border:none" ></td>
        <td colspan="3">Realizó: </td>
        </tr>
        <tr class="without">
        <td colspan="3" class="without">Fecha: ${dateStart} </td>
        <td colspan="3">Firma: </td>
        </tr>
        <tr class="without" >
        <td colspan="3" class="without"></td>
        <td colspan="3">Puesto: </td>
        </tr>
        <tr>
        <td><strong>PRODUCTO</strong></td>
        <td><strong>LOTE Y CADUCIDAD</strong></td>
        <td><strong>PIEZAS</strong></td>
        <td><strong>PAQUETES</strong></td>
        <td><strong>PESO (KG)</strong></td>
        <td><strong>OBSERVACIONES</strong></td>
        </tr>
        `;
        for(let order of orders){
            let date= new Date(order.EXPRATION);
            
            let month:string = (date.getMonth()+1).toString();
            let day:string = date.getDate().toString();
            if(+month<10) month="0"+month;
            if(+day<10) day="0"+day;
            

            content+=`
            <tr>
            <td>${order.NAME}</td>
            <td>${order.LOT}${order.EXPRATION?"/"+day+"-"+month+"-"+date.getFullYear():""}</td>
            <td>${order.UNITS}</td>
            <td>${order.UNITS}</td>
            <td>${order.WEIGHT}</td>
            <td>${order.OBSERVATIONS}</td>
            </tr>
            `;
        }

        content+=`
        <tr class="without">
        <td class="without" colspan="5"></td>
        <td>F-CAL-RO-20</td>
        </tr>
        </table></div>
        `;
        return content;

    }

    getBodyReport(orders:DeliverToWarehouse[]){


        let content = `
        <table><tr>
        <th>CODE</th>
        <th>NAME</th>
        <th>LOTE</th>
        <th>UNIDADES</th>
        <th>PESO</th>
        <th>FECHA</th></tr>
        `;
        for(let order of orders){
            let date= new Date(order.DATE);
            
            let month:string = (date.getMonth()+1).toString();
            let day:string = date.getDate().toString();
            if(+month<10) month="0"+month;
            if(+day<10) day="0"+day;
            let hours:string = date.getHours().toString();
            let minutes:string = date.getMinutes().toString();
            if(+hours<10) hours="0"+hours;
            if(+minutes<10) minutes="0"+minutes;
            content+=`
            <tr>
            <td>${order.CODE}</td>
            <td>${order.NAME}</td>
            <td>${order.LOT}</td>
            <td>${order.UNITS}</td>
            <td>${order.WEIGHT}</td>
            <td>${date.getFullYear()+"-"+month+"-"+day+" "+((hours!="00" && minutes!="00")?hours+":"+minutes:"")}</td>
            </tr>
            `;
        }

        content+=`
        </table>
        `;
        return content;

    }

}