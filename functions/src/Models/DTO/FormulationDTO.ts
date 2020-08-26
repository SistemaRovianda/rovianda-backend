export interface FormulationDTO {
    productRoviandaId: number,
    lotIdRecordId: string,
    temperature: string,
    temperatureWater: string,
    verifitId:string,
    date:string,
    makeId:string
    assignmentLot: {
        newLotId: string,
        dateEntry: string
    },
    ingredient: [
        {
            lotId: string,
            ingredientId: number,
            lotRecordId:number
        }
    ]


}