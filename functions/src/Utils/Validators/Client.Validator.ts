import { VisitDto } from "../../Models/DTO/VisitDTO";

export function validateClientVisit(clientsVisits:Array<VisitDto>){
    for(let visit of clientsVisits){
        if(visit.clientId==null) throw new Error("[400], falta la propiedad clientId en el request");
        if(visit.date==null) throw new Error("[400], falta la propiedad date en el request");
        if(visit.observations==null) throw new Error("[400], falta la propiedad observations en el request");
        if(visit.visited==null) throw new Error("[400], falta la propiedad visited en el request");  
        if(visit.amount==null) throw new Error("[400], falta la propiedad amount en el request");  
    }
}