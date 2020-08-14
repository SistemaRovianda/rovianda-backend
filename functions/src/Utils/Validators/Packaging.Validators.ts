import {  PackagingOutput } from "../../Models/DTO/PackagingDTO";

export async function validPackagingOutput(packagingOutput:PackagingOutput){
    if(!packagingOutput.orderSellerId) throw new Error("[400], falta la propiedad orderSellerId en el request");
    if(packagingOutput.orderSellerId<1) throw new Error("[400], la propiedad orderSellerId en el request no puede ser menor a cero");
    if(!packagingOutput.dateOutput) throw new Error("[400], falta la propiedad dateOutput en el request");
    for(let i=0;i<packagingOutput.products.length;i++){
        let product = packagingOutput.products[i];
        if(!product.productId) throw new Error(`[400], no existe la propiedad productId en productos del request en la posicion ${i+1}`);
        if(product.productId<1) throw new Error(`[400], la propiedad productId no puede ser menor a cero en productos del request en la posicion ${i+1}`);
        for(let j=0;j<product.presentations.length;j++){
            let presentation = product.presentations[j];
            if(!presentation.presentationId) throw new Error(`[400], no existe la propiedad presentationId en productos posicion [${i+1},${j+1}]`);
            if(presentation.presentationId<1) throw new Error(`[400],la propiedad presentationId no puede ser menor a cero en productos posicion [${i+1},${j+1}]`);
            if(!presentation.subOrderId) throw new Error(`[400], la propiedad subOrderId no existe en prodictps posicion [${i+1},${j+1}]`);
            for(let k=0;k<presentation.lots.length;k++){
                let lote = presentation.lots[k];
                if(!lote.lotId || lote.lotId.length==0) throw new Error(`[400], no existe la propiedad loteId en productos posicion [${i+1},${j+1},${k+1}]`);
                if(lote.quantity<1) throw new Error(`[400], la cantidad de un lote no puede ser menor a cero en productos posicion [${i+1},${j+1},${k+1}]`);
            }
        }
    }
}