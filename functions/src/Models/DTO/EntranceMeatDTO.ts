export interface EntranceMeatDTO{

    proveedor:string;
    loteProveedor:string;
    createdAt:string;
    rawMaterial:string;
    loteInterno:string;
    weight:PropsEntrance;
    temperature:PropsEntrance;
    strangeMaterial:PropsEntrance;
    expiration:PropsEntrance;
    packing: PropsEntrance;
    odor: PropsEntrance;
    transport:PropsEntrance
    texture: PropsEntrance;
    fridge: PropsFridge;
    slaughterDate: PropsEntrance;
    job: string;
    qualityInspectorId:string;
    
    }

    export interface PropsEntrance{
        value: string,
        descriptions: string,
        accepted: boolean
    }
    export interface PropsFridge{
        fridgeld: string,
        descriptions: string,
        accepted: boolean
        }