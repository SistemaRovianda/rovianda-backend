export interface AddressGEODTO{
    results:AddressGEOComponentMain[]
}

export interface AddressGEOComponentMain{
    address_components:AddressGEOComponent[]
}

export interface AddressGEOComponent{
    long_name:string,
    short_name:string,
    types:string[]
}

export interface AddressGEOResponse{
    street:string,
    municipality:string,
    suburb:string,
    cp:string
}