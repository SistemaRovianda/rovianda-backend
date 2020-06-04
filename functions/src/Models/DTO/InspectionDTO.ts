export interface InspectionDTO{
    lotId: string,
    expirationDate: string,
    productId: string,
    numberPackages: string,
    observations: string,
    validations:    
       {
        packagingControl: boolean,
        foreignMatter: boolean,
        transport: boolean,
        weightPerPiece: boolean,
        temperature: boolean,
        odor: boolean,
        colour: boolean,
        texture: boolean
       }
}