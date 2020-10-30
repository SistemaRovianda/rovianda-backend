export interface ReprocessingDTO{
    date: string,
    weight : number,
    allergen : string
    defrostId:number
}

export interface ReprocessingOfProcessDTO{
    reprocesingId:number,
    date:string;
    weight:number;
    allergen:string;
    lotId:string;
    productName:string;
    active:boolean;
    defrostId:number;
    used:boolean;
    process:string;
    weightUsed:string;
    dateUsed:string;
}

export interface UseReprocesingDTO{
    reprocesingId:number,
    process:string,
    weight:string;
    date:string;
}