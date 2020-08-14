export interface ReprocessingDTO{
    date: string,
    productId :  number,
    lotId : string,
    weight : number,
    allergen : string,
    area : string
}

export interface UpdateReprocessingDTO{
  loteProcess:string,
  reprocessingId:number
}