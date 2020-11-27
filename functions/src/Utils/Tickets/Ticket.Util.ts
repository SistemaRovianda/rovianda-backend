import { Sale } from "../../Models/Entity/Sales";
import { SellerOperation } from "../../Models/Entity/Seller.Operations";
import { SubSales } from "../../Models/Entity/Sub.Sales";
import { User } from "../../Models/Entity/User";
import { SqlSRepository } from "../../Repositories/SqlS.Repositoy";

export class TicketUtil{

    private sqlServer:SqlSRepository;
    constructor(){
        this.sqlServer=new SqlSRepository();
    }

    async TicketSale(sale:Sale,subSales:SubSales[],seller?:User){
        let date=new Date();
        date.setHours(date.getHours()-6);
        let ticket =`
            ROVIANDA SAPI DE CV 
            AV.1 #5 Esquina Calle 1
            Congregación Donato Guerra
            Parque Industrial Valle de Orizaba
            ba
            C.P 94780
            RFC 8607056P8
            TEL 272 72 46077, 72 4 5690
            Pago en una Sola Exhibición
            Lugar de Expedición: Ruta
                    Nota No. ${sale.folio}
            Fecha: ${date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}

            Vendedor: ${(seller)?seller.name:sale.seller.name}

            Cliente: ${sale.client.keyClient}
            ${sale.client.name}
            Colonia: ${sale.client.address.suburb}
            Cp: ${sale.client.address.cp}
            --------------------------------
            DESCR   CANT    PRECIO  IMPORTE
            --------------------------------

        `; 
        let total=0;
        let pieces =0;
        for(let saleItem of subSales){
            let productSae = await this.sqlServer.getProductSaeByKey(saleItem.presentation.keySae);
            ticket+=`
            ${saleItem.product.code+saleItem.presentation.keySae} ${saleItem.product.name} ${saleItem.presentation.presentation + saleItem.presentation.presentationType} 
            ${saleItem.quantity} ${(productSae[0].UNI_MED as string).toUpperCase()} $${this.pipeNumber(saleItem.amount)}
            `;
            total+=saleItem.amount;
            pieces+=saleItem.quantity;
        }
        ticket+=`
            --------------------------------
                        TOTAL: $ ${this.pipeNumber(total)}

            Piezas: ${pieces}

            *** GRACIAS POR SU COMPRA ***
        `;
        return ticket;
    }

    pipeNumber(x:number){
        var parts=x.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
      }

    async TickedEndDate(sales:Sale[],seller:User,sellerOperations:SellerOperation){
        let date=new Date();
        let ticket =`
            REPORTE DE CIERRE
            Vendedor: ${seller.name}
            Fecha: ${date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}
            -----------------------------------------  
             ART.    DESCR   CANT    PRECIO  IMPORTE
            -----------------------------------------
        `; 
        let amountContado:number=0;
        let amountCredito:number=0;
        let clients:string=`
        -----------------------------------------
            DOC NOMBRE  CLIENTE IMPORTE 
        -----------------------------------------
        `;
        for(let venta of sales){
            for(let subOrder of venta.subSales){
                let productSae = await this.sqlServer.getProductSaeByKey(subOrder.presentation.keySae);
            ticket+=`
            ${subOrder.product.code}    ${subOrder.product.name} ${subOrder.presentation.presentation} ${subOrder.presentation.presentationType}    ${subOrder.quantity} ${(productSae[0].UNI_MED as string).toUpperCase()}    $${this.pipeNumber(subOrder.amount)}
            `;
            if(venta.credit==0){
            amountContado+=venta.amount;
            }else{
            amountCredito+=venta.amount;
            }
            clients+=`
            ${venta.folio}  ${venta.client.name}    $ ${this.pipeNumber(venta.amount)}
            `;
            }
        }
        ticket+=clients;
            ticket+=`
            Ventas por concepto
            EFECTIVO        $ ${this.pipeNumber(amountContado)}
            CREDITO         $ ${this.pipeNumber(amountCredito)}
                        -----------------
                            $${this.pipeNumber(amountContado+amountCredito)}
            `;
        if(sellerOperations){
            let date:any=  new Date(sellerOperations.date+'T'+sellerOperations.eatingTimeStart);
            let date2:any=  new Date(sellerOperations.date+'T'+sellerOperations.eatingTimeEnd);
            let diffMs:any = (date2-date);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            ticket+=`
            -----------------------------------------
            HORA DE COMIDA: ${sellerOperations.eatingTimeStart}
            TIEMPO: Horas: ${diffHrs} Minutos: ${diffMins} Segundos: ${diffMs/1000}
            `;
        }
        return ticket;
    }

    async getAllDeletesTickets(sales:Sale[]){
        let body=`<html>
        <body>
        <table style="width:80%" border="1" align="center">
        <tr>
            <th>No.</th>
            <th>Folio</th>
            <th>Monto</th>
            </tr>
        `;
        let amount=0;
        for(let i=0;i<sales.length;i++){
            let sale=sales[i];
            body+=`
            <tr>
            <td>${i+1}</td>
            <td>${sale.folio}</td>
            <td>${sale.amount}</td>
            </tr>
            `;
            amount+=sale.amount;
        }
        body+=`
        <tr>
        <td style="text-align:left" colspan="2">Total a retirar: </td>
        <td>$${amount}</td>
        </tr>
        </table>
        </body>
        </html>`;
        return body;
    }
}