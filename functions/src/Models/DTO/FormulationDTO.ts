export interface FormulationDTO {
    productRoviandaId: number,
    temperature: string,
    temperatureWater: string,
    verifitId:string,
    date:string,
    makeId:string
    lotsDefrost: lotDefrost[],
    ingredient: formulationIngredients[]
}

export interface lotDefrost{
    lotId:string;
    defrostId:number;
}
export interface formulationIngredients{
    ingredientId:number,
    lotRecordId:number
}
export interface outputCoolingByStatusAndRawId{
    outputId:number,
    lotId:string,
    quantity:number
}

export interface FomulationByProductRovianda{
    formulationId:number,
    productName:string,
    lotDay:string,
    createAt:string
}