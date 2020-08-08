
export interface ProcessUpdateDTO{
    hourExit:string;
    dateFin:string;
    status:string;
}

export interface ProcessDTO{
    productId: number;
    lote: {
        loteId: string;
        outputId: number;
    };
    weight: string;
    temperature: string;
    hourEntrance: string;
    dateIni: string;
    processId: number
}

export interface UserProcessDTO{
    nameElaborated: string
    jobElaborated: string
    nameVerify: string
    jobVerify: string
}