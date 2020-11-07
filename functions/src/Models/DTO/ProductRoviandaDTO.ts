export interface ProductRoviandaDTO{
    name:string;
    ingredients:Array<number>;
}

export interface SaveProductRoviandaDTO{
    keyProduct?: string;
    nameProduct: string;
    productLine:string;
    ingredients: [
       {
          productId: number,
          nameProduct: string
       }
    ];
    presentations: [
       {
          presentationId?:number,
          presentation: number,
          typePresentation: string,
          pricePresentation: number,
          pricePresentationMin?:number,
          pricePresentationLiquidation?:number,
          unitMeasure:string,
          unitPackage:string,
          stockMin:number,
          stockMax:number,
          existence:number,
          keyProductServiceSat:number,
          keyUnitSat:string,
          warehouseKey:number,
          taxSchema?:number
       }
    ],
    productRoviandaImage:string
}

export interface UpdateProductRoviandaDTO{
   keyProduct?: string,
   nameProduct: string,
   image: string,
   ingredients: [
      {
         productId?: number,
         nameProduct: string
      }
   ],
   presentations: [
      {
         presentationId?:number,
         presentation: number,
         typePresentation: string,
         pricePresentation: number,
         warehouseKey:number
      }
   ]
}


export interface ProductLineSae{
   CVE_LIN: number;
   DESC_LIN:string;
   ESUNGPO:string;
   CUENTA_COI:string;
   STATUS:string;
}

export interface ProductLineSaeForm{
   clave:string;
   description:string;
   grupo: string;
}

export interface FileInterface{
   fieldname:string;
   originalname:string;
   encoding:string;
   mimetype:string;
   buffer: Buffer
}