export interface ProductRoviandaDTO{
    name:string;
    ingredients:Array<number>;
}

export interface SaveProductRoviandaDTO{
    code: string,
    nameProduct: string,
    ingredients: [
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
   ingredients: [
      {
         ingredientId: number,
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