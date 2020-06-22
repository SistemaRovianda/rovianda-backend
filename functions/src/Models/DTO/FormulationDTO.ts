export interface FormulationDTO {
    productRoviandaId: number,
    lotId: string,
    temperature: string,
    temperatureWater: string,
    assignmentLot: {
        newLotId: string,
        dateEntry: string
    },
    ingredient: [
        {
            lotId: string,
            ingredientId: number
        }
    ]


}