export interface ReceptionMaterialInterface{
    entranceId:number,
    date:string,
    provider:string,
    productName:string,
    lotIntern:string,
    lotProvider:string,
    evidence:string,
    qualityInspector:string,
    area:string,
    status:string,
    propertiesEvaluated:PropertyEvaluatedType1[],
}

export interface PropertyEvaluatedType1{
    accepted:boolean,
    observations:string,
    property:string,
    value?:string,
    fridge?:string
}

export interface OutputsByEntrance{
    id:number,
    temp:number,
    date:string,
    waterTemp:number,
    status:string,
    type:string,
    lotDay:string,
    ingredientsProcessIds:string,
    name:string,
    verifyBy:string,
    makedBy:string,
    productId:number,
    typeFormulation:string,
    ingredients:IngredientsFormulation[],
    totalIngredients:number
}

export interface IngredientsFormulation{
    productName:string,
    lotProvider:string,
    dateOutput:string,
    observations:string
}

export interface ProcessFormulation{
    id:number,
    status:string,
    currentProcess:string,
    createAt:string,
    typeProcess:string,
    productName:string,
    productId:number
}

export interface EntranceOutputsOven{
    id:number,
    estimatedTime:string,
    newLote:string,
    pcc:string,
    oven:string,
    date:string,
    status:string,
    observations:string,
    productId:number,
    productName:string
}

export interface EntranceOutputPackingFromOven{
    id:number,
    registerDate:string,
    lotId:string,
    expiration:string,
    productId:number,
    productName:string,
    presentation:string,
    quantity:number,
    uniMed:string,
    packagingId:number
}

export interface ProductInfoFromPackTrazability{
    propertiesId:number,
    productId:number,
    productName:string,
    presentation:string,
    registerDate:string,
    expiration:string,
    lotId:string,
    uniMed:string,
    outputOfWarehouse:number,
    weightOfWarehouse:number,
    presentationId:number,
    active:number
}
export interface ProductInfoFromPackDefrostTrazability{
    dateEntrance:string,
    temperature:string,
    lotProvider:string,
    lotIntern:string,
    slaughterDate:string,
    rawMaterial:string,
    provider:string,
    fridge:string
}
export interface ProductInfoFromPackIngredientsTrazability{
    lotProvider:string,
    entranceDate:string,
    productName:string,
    provider:string
}

export interface InventoryTypeQuality{
    id:number,
    createAt:string,
    status:string,
    lotIntern?:string,
    lotProvider:string,
    provider:string,
    quantity:number,
    receiver:string,
    temp?:string,
    fridgeDescription?: string;
    description:string
}

export interface ProductQualityDetails{
    name:string,
    presentations:ProductQualityPresentationDetails[],
    ingredients:ProductQualityIngredientDetails[]
}
export interface ProductQualityPresentationDetails{
    presentation:string,
    code:string
}
export interface ProductQualityIngredientDetails{
    id:number,
    productName:string,
    mark:string,
    presentation:string,
    variant:string
}

export interface NewIngredientQuality{
    productId?:number,
    productName:string,
    variant:string,
    mark:string,
    presentation:string
}


export interface OutputsOfWarehouse{
    name:string,
    outputDate:string,
    quantity:number,
    status:string,
    lot:string
}

export interface ProcessInventory{
    id:number,
    name:string,
    lotDay:string,
    typeProcess:string,
    currentProcess:string,
    statusProcess:string,
    createAt:string
}
export interface OvensInventory{
    id:number,
    antLot:string,
    newLot:string,
    status:string,
    createAt:string,
    name:string;
}

export interface ProductEndedIventory{
    id?:number,
    weight:number,
    units:number,
    name:string,
    presentation:string,
    lot:string,
    registerDate:string
}

export interface DeliveryToSeller{
    id:number,
    loteId:string,
    outputDate:string,
    quantity:number,
    weight:number,
    productName:string,
    presentation:string,
    name:string
}
export interface DeliveryToSellerRequest{
    sellers:string[],
    lot?:string,
    startDate?:string,
    endDate?:string
    page:number,
    perPage:number
}