export interface PackagingDTO{
    registerDate: string;
    productId: number;
    lotId : string;
    expiration: string;
    products: [
        {
            presentationId: number;
            units:number
            weight: number;
            observations: string;
        }
    ]
 }

export interface UserPackagingDTO{
    nameElaborated: string;
    jobElaborated: string;
    nameVerify: string;
    jobVerify: string;
}

export interface UserPackaginggDTO{
    userId: string;
}

export interface PackagingAssignedDTO{
    boxs: number,
    presentationId: number,
    packagingId: number
}

export interface PackagingProductPresentationLot{
    productId:number;
    loteId: string;
    quantity: number;
    presentationId:number;
    presentation:string;
    typePresentation:string;
    pricePresentation:number;
}

export interface PackagingOutput{
    orderSellerId:number;
    products:PackagingProductOutput[];
    dateOutput:string;
}
export interface PackagingProductOutput{
    productId:number;
    presentations: PackagingProductPresentationsOutput[];
}
export interface PackagingProductPresentationsOutput{
    presentationId:number;
    subOrderId:number;
    lots:PackagingProductLotsOutput[];
}
export interface PackagingProductLotsOutput{
    lotId:string;
    quantity: number;
}

export interface SubOrdersMetadataDTO{
    outputsProduct:[{
        
    }]
}