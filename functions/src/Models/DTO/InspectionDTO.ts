export interface InspectionDTO{
    lotId: string,
    expirationDate: string,
    productId: string,
    presentationId:number,
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
       },
       processId:number,
       uid:string
}

export interface InspectionUsersDTO{
    nameElaborated: string
    jobElaborated: string
    nameVerify: string
    jobVerify: string
}