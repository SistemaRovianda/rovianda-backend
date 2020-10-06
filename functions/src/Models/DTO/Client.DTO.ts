export interface ClientDTO{
    clientId:number;
    name:string;
    firstSurname:string;
    lastSurname:string;
    debId:number;
    amount:number;
    daysPending:number;
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
    keyClient:number;
    name: string;
    rfc: string;
    curp:string;
    phone:number;
    //country siempre es mexico
    typeClient: string; // CONTADO O CREDITO
    credit: number;
    saleUid: string;
    daysCredit: number; // dias de credito
    dayCharge: number; // dia del mes que se cobra
    addressClient: addressClient; 
    cfdi:string;
    paymentSat:string;
    contacts:contactForm[]
    clasification:string; // limitado a 4 letras    
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
        intNumber: number;
        intersectionOne:string;
        intersectionTwo:string;
        suburb: string; //colonia
        location:string;
        reference: string;
        population:string; //poblacion
        cp:number;
        state: string;
        municipality: string;
        nationality: string;
        
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