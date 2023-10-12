export interface DailyReportRequest{
    folio:string,
    dateStart:string,
    dateEnd:string
}

export interface DailyReportRecord{
    claveCliente:string,
    nombre:string,
    vendedorId:string,
    vendedor:string,
    calle:string,
    numero_exterior:string,
    colonia:string,
    ciudad:string,
    estado:string,
    codigo_postal:string,
    referencia:string,
    contacto:string,
    fecha:string,
    totalKg:number,
    totalMonto:number,
    lunes:boolean,
    martes:boolean,
    miercoles:boolean,
    jueves:boolean,
    viernes:boolean,
    sabado: boolean
}

export interface DailyReportSalesADayRecord{
    vendedorId:string,
    vendedor:string,
    folio:string,
    fecha:string,
    producto:string,
    presentacion:string,
    cantidad:number,
    monto:number,
    section:string,
    modificated:number,
    prevendedor:string,
    claveCliente:string,
    nombreCliente:string
}

export interface EffectiveDeliverPreSalesReport{
    vendedor:string,
    folio:string,
    fecha:string,
    monto:number,
    solded:boolean,
    folioVenta:string,
    montoVenta:number,
    modificado:boolean,
    section:string,
    claveCliente:string,
    nombreCliente:string,
    dateDelivered:string
}


export interface VisitDailyRecord{
    vendedorId:string,
    vendedor:string,
    cliente:string,
    visito:number,
    section:string
}