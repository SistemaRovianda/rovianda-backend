export interface ConditioningDTO{
    bone: boolean;
    clean: boolean;
    healthing: boolean;
    weight: number;
    temperature: string;
    date: string;
    defrostId:number;
}

export interface conditioningDetails{
    conditioningId:number,
    lotId:string,
    rawMaterial: string,
    clean: boolean,
    healthing: boolean,
    weight: number,
    bone: boolean,
    temperature: string,
    date: string,
    formulation:{
        id: number,
        lotDay: string
    }
}