
export interface ProcessUpdateDTO{
    hourExit:string;
    dateFin:string;
    status:string;
}

export interface DefrostDTO{
    outputCoolingId:number;
    weight: string;
    temp: string;
    entranceHour: string;
    dateInit: string;
    
}

export interface DefrostFormUpdate{
    dateEnd:string;
    outputHour:string;
}

export interface lotesToProcess{
    loteId:string;
    outputId:number;
}

export interface UserProcessDTO{
    nameElaborated: string
    jobElaborated: string
    nameVerify: string
    jobVerify: string
}

export interface processIngredient{
    processId:number,
    dateEnded:string,
    ingredients: processIngredientItem[],
    productName:string
}

export interface processIngredientItem{
    lotId:string,
    rawMaterial:string;
}