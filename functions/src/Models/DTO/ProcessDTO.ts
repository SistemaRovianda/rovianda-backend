export interface ProcessUpdateDTO{
    hourExit:string;
    dateFin:string;
    status:string;
}

export interface ProcessCreationDTO{
    productId:number;
    lotId:string;
    weight:number;
    temperature:string;
    hourEntrance:string;
    dateIni:string;
}