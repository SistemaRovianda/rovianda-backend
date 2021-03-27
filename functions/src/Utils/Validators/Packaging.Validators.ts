import {  PackagingOutput } from "../../Models/DTO/PackagingDTO";

export async function validPackagingOutput(packagingOutput:PackagingOutput){
    console.log(packagingOutput.loteId);
    console.log(packagingOutput.subOrderId);
    console.log(packagingOutput.presentationId);
    if(!packagingOutput.loteId) throw new Error("[400], falta la propiedad orderSellerId en el request");
    if(packagingOutput.presentationId<1) throw new Error("[400], la propiedad orderSellerId en el request no puede ser menor a cero");
    if(!packagingOutput.quantity) throw new Error("[400], falta la propiedad quantity en el request");
    if(!packagingOutput.subOrderId) throw new Error("[400], falta la propiedad subOrderId");
    
    console.log(packagingOutput.quantity);
}