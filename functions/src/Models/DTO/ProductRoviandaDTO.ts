export interface ProductRoviandaDTO{
    name:string;
    ingredients:Array<number>;
}

export interface SaveProductRoviandaDTO{
    code: string,
    nameProduct: string,
    ingredents: [
       {
          productId: number,
          nameProduct: string
       }
    ],
    presentations: [
       {
          presentation: number,
          typePresentation: string,
          pricePresentation: string
       }
    ]
}

export interface UpdateProductRoviandaDTO{
   code: string,
   nameProduct: string,
   status: boolean,
   ingredents: [
      {
         ingredentId: number,
         description: string,
         mark: string,
         Variant: string,
         Presentation: string
      }
   ],
   presentations: [
      {
         presentationId: number,
         presentation: number,
         typePresentation: string,
         pricePresentation: string
      }
   ]
}