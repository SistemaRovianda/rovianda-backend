export interface TenderizedDTO{
    formulationId:number;
    temperature: string
    weight: number
    weightSalmuera: number
    percentage: number
    date: string
}

export interface TenderizedDetails{
    tenderizedId:number,
    lotId:string,
    temperature: string,
    weight: number,
    weightSalmuera:number,
    percentage: number,
    date: string,
    product: {
        id: number,
        description: string
    }
}