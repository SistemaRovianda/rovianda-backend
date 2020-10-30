export interface TenderizedDTO{
    defrostId:number;
    temperature: string;
    weight: number;
    weightSalmuera: number;
    percentage: number;
    date: string;
    lotId:string;
}

export interface TenderizedDetails{
    tenderizedId:number,
    lotId:string,
    temperature: string,
    weight: number,
    weightSalmuera:number,
    percentage: number,
    date: string,
    rawMaterial:string,
    formulation:string
}