import { ClientCreation, typeContact } from "../../Models/DTO/Client.DTO";

export function validateClient(clientRequest:ClientCreation){
    if(!clientRequest.keyClient) throw new Error("[400],falta la clave del cliente");
    if(!clientRequest.name) throw new Error("[400],falta el nombre del cliente");
    if(!clientRequest.rfc) throw new Error("[400],falta el rfc");
    if(!clientRequest.cfdi) throw new Error("[400],falta el tipo de CFDI");
    if(!clientRequest.paymentSat) throw new Error("[400],falta el tipo de pago SAT");
    if(clientRequest.contacts){
        for(let clientContact of clientRequest.contacts){
            if(!clientContact.name) throw new Error("[400],un contacto no tiene nombre");
            if(!clientContact.email) throw new Error("[400], un contacto no tiene email");
            if(!clientContact.typeContact) throw new Error("[400], un contacto no tipado");  
            if(!Object.keys(typeContact).includes(clientContact.typeContact)) throw new Error("[400], tipo de contacto no valido: "+clientContact.typeContact);     
        }
    }
}