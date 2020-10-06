import { ProductLineSaeForm } from "../../Models/DTO/ProductRoviandaDTO";

export function validateProductLineSae(productLineSaeForm:ProductLineSaeForm){
    if(!productLineSaeForm.clave) throw new Error("[400], falta la propiedad clave en el request");
    if(!productLineSaeForm.description) throw new Error("[400], falta la propiedad description en el request");
    
}