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

    getReportWarehouseDeliveredBySeller(orders:DeliverToWarehouse[],seller:User,dateStart:string,dateEnd:string,type:string){
        return this.getHeader(seller,dateStart,dateEnd)+this.getBodyReport(orders,type)+this.getFotter();
    }

    getReportWarehouseDeliveredByPlant(orders:DeliverToWarehouse[],dateStart:string,dateEnd:string){
        return this.getHeaderPlant()+this.getBodyReportPlant(orders,dateStart,dateEnd)+this.getFotter();
    }
    getHeaderPlant(){
        return `
        <html>
        <head>
        <style>
        *{
            font-size: 14px
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
    getBodyReportPlant(orders:DeliverToWarehouse[],dateStart:string,dateEnd:string){

        let content = `
        <div>
        <table width="100%">
        <tr class="without">
        <td colspan="3" style="border:none" ></td>
        <td colspan="2">Realizó: </td>
        </tr>
        <tr class="without">
        <td colspan="3" class="without">Fecha: ${dateStart.split("-").reverse().join("/")} </td>
        <td colspan="2">Firma: </td>
        </tr>
        <tr class="without" >
        <td colspan="3" class="without"></td>
        <td colspan="2">Puesto: </td>
        </tr>
        <tr>
        <td><strong>PRODUCTO</strong></td>
        <td><strong>LOTE Y CADUCIDAD</strong></td>
        <td><strong>PIEZAS</strong></td>
        <td><strong>PESO (KG)</strong></td>
        <td><strong>OBSERVACIONES</strong></td>
      
        </tr>
        `;
        orders=orders.sort((a,b)=>{
            if(a.NAME<b.NAME){
                return -1;
            }
            if(a.NAME>b.NAME){
                return 1;
            }
            return 0;
        });
        for(let order of orders){
            
            let date = order.LOT.slice(order.LOT.length-6,order.LOT.length);
            date = date.slice(0,2)+"/"+date.slice(2,4)+"/"+date.slice(4,6);
            content+=`
            <tr>
            <td>${order.NAME}</td>
            <td>${order.LOT.slice(0,order.LOT.length-6)+" - "+ date}</td>
            <td>${order.UNITS}</td>
            <td>${order.WEIGHT.toFixed(2)}</td>
            <td>${order.OBSERVATIONS}</td>
         
            </tr>
            `;
        }
        // <td>${order.LOT.slice(0,order.LOT.length-6)+" - "+ date}</td>

        content+=`
        <tr class="without">
        <td class="without" colspan="5"></td>
        <td>F-CAL-RO-20</td>
        </tr>
        </table></div>
        `;
        return content;

    }

    getBodyReport(orders:DeliverToWarehouse[],type:string){


        let content = `
        <table><tr>
        <th>CODIGO</th>
        <th>NOMBRE</th>
        ${type!='acumulated'?`<th>LOTE</th>`:''}
        <th>UNIDADES</th>
        <th>PESO</th>
        ${type!='acumulated'?`<th>FECHA</th>`:''}
        </tr>
        `;
        for(let order of orders){
           
            content+=`
            <tr>
            <td>${order.CODE}</td>
            <td>${order.NAME}</td>
            ${type!='acumulated'?`<td>${order.LOT}</td>`:''}
            <td>${order.UNITS}</td>
            <td>${order.WEIGHT.toFixed(2)}</td>
            ${type!='acumulated'?`<td>${order.DATE}</td>`:''}
            </tr>
            `;
        }

        content+=`
        </table>
        `;
        return content;

    }

}