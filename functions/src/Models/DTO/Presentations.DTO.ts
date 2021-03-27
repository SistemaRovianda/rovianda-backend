export interface Presentation{
    presentationId:number,
    presentation:string,
    pricePresentationPublic:number,
    pricePresentationMin:number,
    pricePresentationLiquidation:number,
    typePresentation:string,
    typePrice:number,
    quantity:number,
    keySae:string,
    isPz:boolean
}

export interface PresentationsAvailables{
    presentationType:string,
    price:number,
    keySae:string,
    presentationId: number,
    isPz:boolean,
    nameProduct:string,
    quantity:number,
    weight?: number
    }