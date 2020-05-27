
export interface ProcessUpdateDTO{
    hourExit:string;
    dateFin:string;
    status:string;
}

export interface ProcessDTO{
    productId: number;
    lotId : number;
    weight: number;
    temperature: string;
    hourEntrance: string;
    dateIni: string;
}