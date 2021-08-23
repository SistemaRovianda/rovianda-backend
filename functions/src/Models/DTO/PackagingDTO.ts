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
    
        loteId:string,
        subOrderId:number,
        quantity:number,
        weight:number,
        presentationId:number
    
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

export interface PackagingReprocesingRequest{
    date:string;
    lotId:string;
    productId:number;
    allergen:string;
    weight:number;
    weightMerm:number;
    comment:string;
}

export interface DevolutionRequest{
    lotId:string;
    date:string;
    productId:number;
    presentationId:number;
    units:number;
    weight:number;
}

export interface LotsStockInventory{
    lotId: string;
    quantity: number;
}
export interface LotsStockInventoryPresentation{
    units:number,
    weight:number,
    presentation_id:number,
    name: string,
    type_presentation:string,
    lot_id:string,
    packaging_id:number,
    key_sae?:string,
    price?:number,
    uni_med?:string,
    price_presentation_min:number,
    product_rovianda_id:number,
    register_date:string
}

export interface UpdateStockPlant{
    
        lot_id:string,
        units:number,
        weight:number,
        packaging_id:number,
        unitsTemp:number,
        weightTemp:number,
        presentation_id:number,
        unitTypeOp:number,
        weightTypeOp:number
    
}

export interface OutputsDeliveryPlant{
    seller:string,
    code:string,
    name:string,
    presentation:string,
    loteId:string,
    units:number,
    weight:number,
    outputDate:string
}