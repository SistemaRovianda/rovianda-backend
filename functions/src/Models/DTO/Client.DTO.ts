import { Client } from "../Entity/Client";

export interface ClientDTO{
    clientId:number;
    name:string;
    firstSurname:string;
    lastSurname:string;
    debId:number;
    amount:number;
    daysPending:number;
    products:String[];
}

export interface ClientsBySeller{
    debId:number;
    clientId:number;
    name:string;
    firstSurname:string;
    lastSurname:string;
    amount:number;
    createDay:string;
    days:number;
}

export interface ClientCreation{
    clientCode:number,
    clientCodeAssigned:number,
    clientName:string,
    clientType:string,
    clientCredit:number,
    clientCurrentCredit:number,
    clientRfc:string,
    clientStreet:string,
    clientSuburb:string,
    clientMunicipality:string,
    clientLocality:string,
    clientCp:string,
    clientExtNumber:string,
    clientSeller:string,
    clientState:string,
    clientNationality:string,
    monday:boolean,
    tuesday:boolean,
    wednesday:boolean,
    thursday:boolean,
    friday:boolean,
    saturday:boolean,
    sunday:boolean
}

export interface ClientCreationV2{
    clientMobileId:number,
    clientRovId:number;
    clientName:string,
    clientType:string,
    clientStreet:string,
    clientSuburb:string,
    clientMunicipality:string,
    clientCp:string,
    clientContact:string,
    clientPhoneNumber:string,
    clientReference:string,
    clientExtNumber?:string,
    clientSellerUid:string,
    isTemp:boolean,
    monday:boolean,
    tuesday:boolean,
    wednesday:boolean,
    thursday:boolean,
    friday:boolean,
    saturday:boolean,
    longitude:number,
    latitude:number
}
export interface ClientUpdateV2{
    clientId:number,
    clientKey:number,
    clientName:string,
    clientStreet:string,
    clientSuburb:string,
    clientMunicipality:string,
    clientCp:string,
    clientExtNumber?:string,
    clientContact:string,
    clientPhoneNumber:string,
    clientReference:string,
    monday:boolean,
    tuesday:boolean,
    wednesday:boolean,
    thursday:boolean,
    friday:boolean,
    saturday:boolean,
    longitude:number,
    latitude:number
}

export interface contactForm{
    name:string;
    address:string;
    phone:number;
    email:string;
    typeContact:string;
}

export interface addressClient{
        street: string;
        extNumber: number;
        intNumber?: number;
        intersectionOne:string;
        intersectionTwo:string;
        suburb: string; //colonia
        location:string;
        reference: string;
        population:string; //poblacion
        cp:number;
        state: string;
        municipality: string;
        nationality?: string;
}


export enum typeContact{
    ADMINISTRADOR="A",
    ALMACEN="L",
    COBRANZA="C",
    COMPRAS="O",
    PAGOS="P",
    VENTAS="V",
    OTROS="T"
}

export interface ClientSAE{
    CLAVE:string,
    STATUS:string,
    NOMBRE:string,
    RFC:string,
    CALLE:string,
    NUMINT:string,
    NUMEXT:string,
    CRUZAMIENTOS:string,
    CRUZAMIENTOS2:string,
    COLONIA:string,
    CODIGO:string,
    LOCALIDAD:string,
    MUNICIPIO:string,
    ESTADO:string,
    PAIS:string,
    NACIONALIDAD:string,
    REFERDIR:string,
    TELEFONO:string,
    CLASIFIC:string,
    FAX:string,
    PAG_WEB:string,
    CURP:string,
    CVE_ZONA:string,
    IMPRIR:string,
    MAIL:string,
    NIVELSEC:string,
    ENVIOSILEN:string,
    EMAILPRED:string,
    DIAREV:string,
    DIAPAGO:string,
    CON_CREDITO:string,
    DIASCRED:number,
    LIMCRED:number,
    SALDO:number,
    LISTA_PREC:number,
    CVE_BITA:number,
    ULT_PAGOD:string,
    ULT_PAGOM:number,
    ULT_PAGOF:number,
    DESCUENTO:number,
    ULT_VENTAD:string,
    ULT_COMPM:number,
    FCH_ULTCOM:string,
    VENTAS:number,
    CVE_VEND:string,
    CVE_OBS:number,
    TIPO_EMPRESA:string,
    MATRIZ:string,
    PROSPECTO:string,
    CALLE_ENVIO:string,
    NUMINT_ENVIO:string,
    NUMEXT_ENVIO:string,
    CRUZAMIENTOS_ENVIO:string,
    CRUZAMIENTOS_ENVIO2:string,
    COLONIA_ENVIO:string,
    LOCALIDAD_ENVIO:string,
    MUNICIPIO_ENVIO:string,
    ESTADO_ENVIO:string,
    PAIS_ENVIO:string,
    CODIGO_ENVIO:string,
    CVE_ZONA_ENVIO:string,
    REFERENCIA_ENVIO:string,
    CUENTA_CONTABLE:string,
    ADDENDAF:string,
    ADDENDAD:string,
    NAMESPACE:string,
    METODODEPAGO:string,
    NUMCTAPAGO:string,
    MODELO:string,
    DES_IMPU1:string,
    DES_IMPU2:string,
    DES_IMPU3:string,
    DES_IMPU4:string,
    DES_PER:string,
    LAT_GENERAL:number,
    LON_GENERAL:number,
    LAT_ENVIO:number,
    LON_ENVIO:number,
    UUID:string,
    VERSION_SINC:string,
    USO_CFDI:string,
    CVE_PAIS_SAT:string,
    NUMIDREGFISCAL:string,
    FORMADEPAGOSAT:string,
    ADDENDAG:string,
    ADDENDAE:string
}

export interface SellerClientCreation{
    keyClient:number;
    name: string;
    rfc: string;
    curp:string;
    phone:number;
    saleUid: string;
    addressClient: addressClient;
    contacts:contactForm[],
    daysVisited:daysVisitedInterface,
    typeClient:number
}

export interface daysVisitedInterface{
    monday:boolean,
    tuesday:boolean,
    wednesday:boolean,
    thursday:boolean,
    friday:boolean,
    saturday:boolean,
    sunday:boolean
}

export interface ClientVisitedDTO{
    client:Client,
    visitedStatus:ClientVisitedStatus,
    clientVisitId:number,
    time: string
}

export enum ClientVisitedStatus{
    PENDING="PENDING",INVISIT="INVISIT",VISITED="VISITED"
}

export interface clientVisitDTO{
    clientId:number
}



export interface ClientEditRequest{
    keyClientId:number,
    name: string,
    street: string,
    suburb: string,
    cp: number,
    state: string,
    city:string,
    keySaeNew: string,
    daysVisited:{
        id: number,
        monday: boolean,
        tuesday: boolean,
        wednesday: boolean,
        thursday: boolean,
        friday: boolean,
        saturday: boolean,
        sunday: boolean
    }
}

export interface ClientItemBySeller{
    TIPO:string,
    CLAVE_SISTEMA:string,
    CLAVE_SAE:string,
    NOMBRE: string,
    RFC: string,
    VENDEDOR:string,
    CALLE: string,
    NUMERO_EXTERIOR:string,
    COLONIA:string,
    CIUDAD:string,
    ESTADO:string,
    CODIGO_POSTAL:string,
    REFERENCIA: string,
    CONTACTO: string
}

export interface ClientGeolocationVisits{
    clientId:number,
    keyClient:number,
    clientName:string,
    latitude:number,
    longitude:number,
    visited:boolean,
    mustVisited:boolean
}
export interface ClientsListVisitedResult{
    clientId:number,
    keyClient:number,
    name:string,
    latitude:number,
    longitude:number,
    count:number,
    monday:number,
    tuesday:number,
    wednesday:number,
    thursday:number,
    friday:number,
    saturday:number,
    sunday:number
}
export interface ClientVisitBySellerRequest{
    sellerId:string,
    date:string
}
export interface ClientVisitBySellerRecord{
    sellerName:string,
    visits: ClientVisitData[]
}

export interface ClientVisitData{
    amount:number,
    code:string,
    visitId:number,
    clientName:string,
    visited:boolean,
    withSale:boolean,
    observations:string,
    latitude:number,
    longitude:number
}