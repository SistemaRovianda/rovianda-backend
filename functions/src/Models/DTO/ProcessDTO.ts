
export interface ProcessUpdateDTO{
    hourExit:string;
    dateFin:string;
    status:string;
}

export interface ProcessDTO{
    productId: number;
    lotId : string;
    weight: string;
    temperature: string;
    hourEntrance: string;
    dateIni: string;
}

export interface UserProcessDTO{
    nameElaborated: string
    jobElaborated: string
    nameVerify: string
    jobVerify: string
}