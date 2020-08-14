export interface MaintenanceDTO{
    typeFailure : string;
    description : string;
    fullName : string;
    dateInit : string;
    image : string;
}

export interface MaintenanceUpdateDTO{
    description : string;
    image : string;
    storeId : number;
    cost: number;
    deviceId: number
}