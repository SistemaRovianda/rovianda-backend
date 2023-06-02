export interface UserDTO{
    clave?:number;
    comision?:number;
    name:string;
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    rolId: number;
    job:string;
    warehouse:string;
    folio:string;
}

export interface UpdatePassword{
    uid:string,
    password:string
}

export interface UserRegisterRequest{
    name:string,
    email:string
    password:string,
    rol:string,
    jobDescription:string
}

export interface UserRegisterResponse{
    name:string,
    email:string
    password:string,
    rol:string,
    jobDescription:string
}

export interface SimpleUserUpdateRequest{
    name:string,
    password:string,
    jobDescription:string
}

export interface UserSellerRegisterRequest{
    name:string,
    email:string,
    password:string,
    warehouseId:string,
    rol:string,
    keySae:number,
    folio:string
}

export interface UserSellerRegisterResponse{
    name:string,
    email:string,
    password:string,
    warehouseId:string,
    rol:string,
    keySae:number,
    folio:string
}

export interface UserSellerUpdateRequest{
    name:string,
    password:string,
    warehouseId:string,
    keySae:number,
    folio:string
}

export interface UserPreSaleRegisterRequest{
    name:string,
    email:string,
    password:string,
    warehouseId:string,
    rol:string,
    folio:string,
    sellers:string[]
}

export interface UserPreSaleRegisterResponse{
    name:string,
    email:string,
    password:string,
    warehouseId:string,
    rol:string,
    keySae:number,
    folio:string,
    sellers:string[]
}

export interface UserPreSaleUpdateRequest{
    name:string,
    password:string,
    folio:string,
    sellers:string[]
}