export interface PackagingDeliveredAcumulated{
    seller: string,
    productId:number,
    name: string,
    presentationId:number,
    presentation:string,
    quantity: number,
    weight: number
}

export interface PackagingDeliveredIndividual{
    seller:string,
    productId:number,
    name:string,
    presentationId:number,
    presentation:string,
    lotId:string,
    quantity:number,
    weight:number,
    outputDate:string
}


export interface DevolutionListItemInterface{
    devolutionId:number,
    units:number,
    weight:number,
    lot:string,
    date:string,
    name:string,
    presentation:string
}