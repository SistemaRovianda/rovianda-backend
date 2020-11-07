import { Sale } from "../../Models/Entity/Sales";
import { SubSales } from "../../Models/Entity/Sub.Sales";
import { User } from "../../Models/Entity/User";

export class TicketUtil{
    async TicketSale(sale:Sale,subSales:SubSales[],seller?:User){
        let date=new Date();
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
            ticket+=`
            ${saleItem.product.code+saleItem.presentation.keySae} ${saleItem.product.name} ${saleItem.presentation.presentation + saleItem.presentation.presentationType} 
            ${saleItem.quantity} ${saleItem.amount}
            `;
            total+=saleItem.amount;
            pieces+=saleItem.quantity;
        }
        ticket+=`
            --------------------------------
                        TOTAL: ${total}

            Piezas: ${pieces}

            *** GRACIAS POR SU COMPRA ***
        `;
        return ticket;
    }
}