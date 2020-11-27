import { ConnectionPool, Float, SmallInt } from "mssql";
import { getSqlServerCon } from "../Config/SqlS";
import {Int,VarChar,DateTime,} from "mssql";
import {v4} from "uuid";
import { ClientCreation, SellerClientCreation, typeContact } from "../Models/DTO/Client.DTO";
import { WarehouseForm } from "../Models/DTO/Warehouse.DTO";
import { ProductLineSae, ProductLineSaeForm, SaveProductRoviandaDTO, UpdatePresentation } from "../Models/DTO/ProductRoviandaDTO";
import { UserDTO } from "../Models/DTO/UserDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Sale } from "../Models/Entity/Sales";

export class SqlSRepository{

    constructor(){}

    private connection:ConnectionPool;
    async getConnection(){
        if(!this.connection){
            this.connection = getSqlServerCon()
        }
    }


    async createSeller(userDto:UserDTO){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().input('CVE_VEND',Int,userDto.clave)
            .input('STATUS',VarChar,'A').input('NOMBRE',VarChar,userDto.name)
            .input('COMI',Int,userDto.comision).input('CLASIFIC',VarChar,null)
            .input('CORREOE',VarChar,userDto.email).input('UUID',VarChar,v4())
            .input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' ')).query(
                `insert into VEND01(CVE_VEND,STATUS,NOMBRE,COMI,CLASIFIC,CORREOE,UUID,VERSION_SINC) 
                values(@CVE_VEND,@STATUS,@NOMBRE,@COMI,@CLASIFIC,@CORREOE,@UUID,@VERSION_SINC);`
            )
        );
        await this.connection.close();
        return result;
    }

    async getClientsByKey(keyClient:number){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().query(`select * from CLIE01 where CLAVE=${keyClient}`)
        });   
        await this.connection.close();
        return result;
    }

    async saveClient(client:ClientCreation){
        await this.getConnection();
        let result = await this.connection.connect().then(
            async(pool)=>{
                await pool.request().input('CLAVE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('STATUS',VarChar,'A')
                .input('NOMBRE',VarChar,client.name).input('RFC',VarChar,client.rfc).input('CALLE',VarChar,client.addressClient.street)
                .input('NUMINT',VarChar,client.addressClient.intNumber).input('NUMEXT',VarChar,client.addressClient.extNumber)
                .input('CRUZAMIENTOS',VarChar,client.addressClient.intersectionOne).input('CRUZAMIENTOS2',VarChar,client.addressClient.intersectionTwo)
                .input('COLONIA',VarChar,client.addressClient.suburb).input('CODIGO',VarChar,client.addressClient.cp).input('LOCALIDAD',VarChar,client.addressClient.location)
                .input('MUNICIPIO',VarChar,client.addressClient.municipality).input('ESTADO',VarChar,client.addressClient.state).input('PAIS',VarChar,'MEXICO')
                .input('NACIONALIDAD',VarChar,client.addressClient.nationality).input('REFERDIR',VarChar,client.addressClient.reference).input('TELEFONO',VarChar,client.phone)
                .input('CLASIFIC',VarChar,client.clasification).input('FAX',VarChar,null).input('PAG_WEB',VarChar,null).input('CURP',VarChar,client.curp)
                .input('CVE_ZONA',VarChar,null).input('IMPRIR',VarChar,'S').input('MAIL',VarChar,'S').input('NIVELSEC',Int,0).input('ENVIOSILEN',VarChar,'N')
                .input('EMAILPRED',VarChar,null).input('DIAREV',VarChar,null).input('DIAPAGO',VarChar,null).input('CON_CREDITO',VarChar,client.typeClient!='CREDITO'?'N':'S')
                .input('DIASCRED',Int,client.daysCredit).input('LIMCRED',Float,client.credit).input('SALDO',Float,0).input('LISTA_PREC',Int,null).input('CVE_BITA',Int,null)
                .input('ULT_PAGOD',VarChar,null).input('ULT_PAGOM',Float,0).input('ULT_PAGOF',DateTime,null).input('DESCUENTO',Float,null)
                .input('ULT_VENTAD',VarChar,null).input('ULT_COMPM',Float,0).input('FCH_ULTCOM',DateTime,null).input('VENTAS',Float,0).input('CVE_VEND',VarChar,null)
                .input('CVE_OBS',Int,0).input('TIPO_EMPRESA',VarChar,'M').input('MATRIZ',Int,1).input('PROSPECTO',VarChar,'N').input('CALLE_ENVIO',VarChar,null)
                .input('NUMINT_ENVIO',VarChar,null).input('NUMEXT_ENVIO',VarChar,null).input('CRUZAMIENTOS_ENVIO',VarChar,null).input('CRUZAMIENTOS_ENVIO2',VarChar,null)
                .input('COLONIA_ENVIO',VarChar,null).input('LOCALIDAD_ENVIO',VarChar,null).input('MUNICIPIO_ENVIO',VarChar,null).input('ESTADO_ENVIO',VarChar,null)
                .input('PAIS_ENVIO',VarChar,null).input('CODIGO_ENVIO',VarChar,null).input('CVE_ZONA_ENVIO',VarChar,null).input('REFERENCIA_ENVIO',VarChar,null)
                .input('CUENTA_CONTABLE',VarChar,null).input('ADDENDAF',VarChar,null).input('ADDENDAD',VarChar,null).input('NAMESPACE',VarChar,null)
                .input('METODODEPAGO',VarChar,null).input('NUMCTAPAGO',VarChar,null).input('MODELO',VarChar,null).input('DES_IMPU1',VarChar,'N')
                .input('DES_IMPU2',VarChar,'N').input('DES_IMPU3',VarChar,'N').input('DES_IMPU4',VarChar,'N').input('DES_PER',VarChar,'M').input('LAT_GENERAL',Float,0).input('LON_GENERAL',Float,0)
                .input('LAT_ENVIO',Float,0).input('LON_ENVIO',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                .input('USO_CFDI',VarChar,client.cfdi).input('CVE_PAIS_SAT',VarChar,null).input('NUMIDREGFISCAL',VarChar,null).input('FORMADEPAGOSAT',VarChar,client.paymentSat).input('ADDENDAG',VarChar,null)
                .input('ADDENDAE',VarChar,null).query(
                    `insert into CLIE01(CLAVE,STATUS,NOMBRE,RFC,CALLE,NUMINT,NUMEXT,CRUZAMIENTOS,CRUZAMIENTOS2,COLONIA,CODIGO,LOCALIDAD,MUNICIPIO,ESTADO,PAIS,NACIONALIDAD,REFERDIR,TELEFONO,CLASIFIC,FAX,PAG_WEB,CURP,CVE_ZONA,IMPRIR,MAIL,NIVELSEC,ENVIOSILEN,EMAILPRED,
                        DIAREV,DIAPAGO,CON_CREDITO,DIASCRED,LIMCRED,SALDO,LISTA_PREC,CVE_BITA,ULT_PAGOD,ULT_PAGOM,ULT_PAGOF,DESCUENTO,ULT_VENTAD,ULT_COMPM,FCH_ULTCOM,VENTAS,CVE_VEND,CVE_OBS,TIPO_EMPRESA,MATRIZ,PROSPECTO,CALLE_ENVIO,NUMINT_ENVIO,NUMEXT_ENVIO,CRUZAMIENTOS_ENVIO,
                        CRUZAMIENTOS_ENVIO2,COLONIA_ENVIO,LOCALIDAD_ENVIO,MUNICIPIO_ENVIO,ESTADO_ENVIO,PAIS_ENVIO,CODIGO_ENVIO,CVE_ZONA_ENVIO,REFERENCIA_ENVIO,CUENTA_CONTABLE,ADDENDAF,ADDENDAD,NAMESPACE,METODODEPAGO,NUMCTAPAGO,MODELO,DES_IMPU1,DES_IMPU2,DES_IMPU3,DES_IMPU4,DES_PER,
                        LAT_GENERAL,LON_GENERAL,LAT_ENVIO,LON_ENVIO,UUID,VERSION_SINC,USO_CFDI,CVE_PAIS_SAT,NUMIDREGFISCAL,FORMADEPAGOSAT,ADDENDAG,ADDENDAE) 
                        values(@CLAVE,@STATUS,@NOMBRE,@RFC,@CALLE,@NUMINT,@NUMEXT,@CRUZAMIENTOS,@CRUZAMIENTOS2,@COLONIA,@CODIGO,@LOCALIDAD,@MUNICIPIO,@ESTADO,@PAIS,@NACIONALIDAD,@REFERDIR,@TELEFONO,@CLASIFIC,@FAX,@PAG_WEB,@CURP,@CVE_ZONA,@IMPRIR,@MAIL,@NIVELSEC,@ENVIOSILEN,@EMAILPRED,
                        @DIAREV,@DIAPAGO,@CON_CREDITO,@DIASCRED,@LIMCRED,@SALDO,@LISTA_PREC,@CVE_BITA,@ULT_PAGOD,@ULT_PAGOM,@ULT_PAGOF,@DESCUENTO,@ULT_VENTAD,@ULT_COMPM,@FCH_ULTCOM,@VENTAS,@CVE_VEND,@CVE_OBS,@TIPO_EMPRESA,@MATRIZ,@PROSPECTO,@CALLE_ENVIO,@NUMINT_ENVIO,@NUMEXT_ENVIO,@CRUZAMIENTOS_ENVIO,
                        @CRUZAMIENTOS_ENVIO2,@COLONIA_ENVIO,@LOCALIDAD_ENVIO,@MUNICIPIO_ENVIO,@ESTADO_ENVIO,@PAIS_ENVIO,@CODIGO_ENVIO,@CVE_ZONA_ENVIO,@REFERENCIA_ENVIO,@CUENTA_CONTABLE,@ADDENDAF,@ADDENDAD,@NAMESPACE,@METODODEPAGO,@NUMCTAPAGO,@MODELO,@DES_IMPU1,@DES_IMPU2,@DES_IMPU3,@DES_IMPU4,@DES_PER,
                        @LAT_GENERAL,@LON_GENERAL,@LAT_ENVIO,@LON_ENVIO,@UUID,@VERSION_SINC,@USO_CFDI,@CVE_PAIS_SAT,@NUMIDREGFISCAL,@FORMADEPAGOSAT,@ADDENDAG,@ADDENDAE)`
                );
                let lastSaved= await pool.request().query(`select * from CLIE01 where CLAVE=${client.keyClient}`);
                
                if(lastSaved.recordset.length){
                    let idCountRecord=await pool.request().query("select * from TBLCONTROL01 WHERE ID_TABLA=59");
                    let countClientRecord=await pool.request().query("select * from TBLCONTROL01 WHERE ID_TABLA=0");
                    if(idCountRecord.recordset.length){
                        let secuenceCount=+idCountRecord.recordset[0].ULT_CVE;
                        for(let i=0;i<client.contacts.length;i++){
                            secuenceCount++;
                            await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('NCONTACTO',Int,secuenceCount).input('NOMBRE',VarChar,client.contacts[i].name)
                            .input('DIRECCION',VarChar,client.contacts[i].address).input('TELEFONO',VarChar,client.contacts[i].phone).input('EMAIL',VarChar,client.contacts[i].email).input('TIPOCONTAC',VarChar,typeContact[client.contacts[i].typeContact])
                            .input('STATUS',VarChar,'A').input('USUARIO',VarChar,null).input('LAT',Int,0).input('LON',Int,0)
                            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                            .query(
                                `insert into CONTAC01(CVE_CLIE,NCONTACTO,NOMBRE,DIRECCION,TELEFONO,EMAIL,TIPOCONTAC,STATUS,USUARIO,LAT,LON,UUID,VERSION_SINC) 
                                values (@CVE_CLIE,@NCONTACTO,@NOMBRE,@DIRECCION,@TELEFONO,@EMAIL,@TIPOCONTAC,@STATUS,@USUARIO,@LAT,@LON,@UUID,@VERSION_SINC)`
                            );   
                        }
                        await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${secuenceCount} where ID_TABLA=59`);
                        await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${(+countClientRecord.recordset[0].ULT_CVE)+1} WHERE ID_TABLA=0`);
                    }
                    await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).query(`
                        insert into CLIE_CLIB01(CVE_CLIE,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6)
                        VALUES(@CVE_CLIE,null,null,null,null,null,null)
                    `);
                }
            }
        );
        await this.connection.close();
        return result;
    }

    async saveSellerClient(client:SellerClientCreation){
        await this.getConnection();
        let result = await this.connection.connect().then(
            async(pool)=>{
                await pool.request().input('CLAVE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('STATUS',VarChar,'A')
                .input('NOMBRE',VarChar,client.name).input('RFC',VarChar,client.rfc).input('CALLE',VarChar,client.addressClient.street)
                .input('NUMINT',VarChar,client.addressClient.intNumber).input('NUMEXT',VarChar,client.addressClient.extNumber)
                .input('CRUZAMIENTOS',VarChar,client.addressClient.intersectionOne).input('CRUZAMIENTOS2',VarChar,client.addressClient.intersectionTwo)
                .input('COLONIA',VarChar,client.addressClient.suburb).input('CODIGO',VarChar,client.addressClient.cp).input('LOCALIDAD',VarChar,client.addressClient.location)
                .input('MUNICIPIO',VarChar,client.addressClient.municipality).input('ESTADO',VarChar,client.addressClient.state).input('PAIS',VarChar,'MEXICO')
                .input('NACIONALIDAD',VarChar,client.addressClient.nationality).input('REFERDIR',VarChar,client.addressClient.reference).input('TELEFONO',VarChar,client.phone)
                .input('CLASIFIC',VarChar,"NVL1").input('FAX',VarChar,null).input('PAG_WEB',VarChar,null).input('CURP',VarChar,client.curp)
                .input('CVE_ZONA',VarChar,null).input('IMPRIR',VarChar,'S').input('MAIL',VarChar,'S').input('NIVELSEC',Int,0).input('ENVIOSILEN',VarChar,'N')
                .input('EMAILPRED',VarChar,null).input('DIAREV',VarChar,null).input('DIAPAGO',VarChar,null).input('CON_CREDITO',VarChar,'N')
                .input('DIASCRED',Int,0).input('LIMCRED',Float,0).input('SALDO',Float,0).input('LISTA_PREC',Int,null).input('CVE_BITA',Int,null)
                .input('ULT_PAGOD',VarChar,null).input('ULT_PAGOM',Float,0).input('ULT_PAGOF',DateTime,null).input('DESCUENTO',Float,null)
                .input('ULT_VENTAD',VarChar,null).input('ULT_COMPM',Float,0).input('FCH_ULTCOM',DateTime,null).input('VENTAS',Float,0).input('CVE_VEND',VarChar,null)
                .input('CVE_OBS',Int,0).input('TIPO_EMPRESA',VarChar,'M').input('MATRIZ',Int,1).input('PROSPECTO',VarChar,'N').input('CALLE_ENVIO',VarChar,null)
                .input('NUMINT_ENVIO',VarChar,null).input('NUMEXT_ENVIO',VarChar,null).input('CRUZAMIENTOS_ENVIO',VarChar,null).input('CRUZAMIENTOS_ENVIO2',VarChar,null)
                .input('COLONIA_ENVIO',VarChar,null).input('LOCALIDAD_ENVIO',VarChar,null).input('MUNICIPIO_ENVIO',VarChar,null).input('ESTADO_ENVIO',VarChar,null)
                .input('PAIS_ENVIO',VarChar,null).input('CODIGO_ENVIO',VarChar,null).input('CVE_ZONA_ENVIO',VarChar,null).input('REFERENCIA_ENVIO',VarChar,null)
                .input('CUENTA_CONTABLE',VarChar,null).input('ADDENDAF',VarChar,null).input('ADDENDAD',VarChar,null).input('NAMESPACE',VarChar,null)
                .input('METODODEPAGO',VarChar,null).input('NUMCTAPAGO',VarChar,null).input('MODELO',VarChar,null).input('DES_IMPU1',VarChar,'N')
                .input('DES_IMPU2',VarChar,'N').input('DES_IMPU3',VarChar,'N').input('DES_IMPU4',VarChar,'N').input('DES_PER',VarChar,'M').input('LAT_GENERAL',Float,0).input('LON_GENERAL',Float,0)
                .input('LAT_ENVIO',Float,0).input('LON_ENVIO',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                .input('USO_CFDI',VarChar,'G01').input('CVE_PAIS_SAT',VarChar,null).input('NUMIDREGFISCAL',VarChar,null).input('FORMADEPAGOSAT',VarChar,'01').input('ADDENDAG',VarChar,null)
                .input('ADDENDAE',VarChar,null).query(
                    `insert into CLIE01(CLAVE,STATUS,NOMBRE,RFC,CALLE,NUMINT,NUMEXT,CRUZAMIENTOS,CRUZAMIENTOS2,COLONIA,CODIGO,LOCALIDAD,MUNICIPIO,ESTADO,PAIS,NACIONALIDAD,REFERDIR,TELEFONO,CLASIFIC,FAX,PAG_WEB,CURP,CVE_ZONA,IMPRIR,MAIL,NIVELSEC,ENVIOSILEN,EMAILPRED,
                        DIAREV,DIAPAGO,CON_CREDITO,DIASCRED,LIMCRED,SALDO,LISTA_PREC,CVE_BITA,ULT_PAGOD,ULT_PAGOM,ULT_PAGOF,DESCUENTO,ULT_VENTAD,ULT_COMPM,FCH_ULTCOM,VENTAS,CVE_VEND,CVE_OBS,TIPO_EMPRESA,MATRIZ,PROSPECTO,CALLE_ENVIO,NUMINT_ENVIO,NUMEXT_ENVIO,CRUZAMIENTOS_ENVIO,
                        CRUZAMIENTOS_ENVIO2,COLONIA_ENVIO,LOCALIDAD_ENVIO,MUNICIPIO_ENVIO,ESTADO_ENVIO,PAIS_ENVIO,CODIGO_ENVIO,CVE_ZONA_ENVIO,REFERENCIA_ENVIO,CUENTA_CONTABLE,ADDENDAF,ADDENDAD,NAMESPACE,METODODEPAGO,NUMCTAPAGO,MODELO,DES_IMPU1,DES_IMPU2,DES_IMPU3,DES_IMPU4,DES_PER,
                        LAT_GENERAL,LON_GENERAL,LAT_ENVIO,LON_ENVIO,UUID,VERSION_SINC,USO_CFDI,CVE_PAIS_SAT,NUMIDREGFISCAL,FORMADEPAGOSAT,ADDENDAG,ADDENDAE) 
                        values(@CLAVE,@STATUS,@NOMBRE,@RFC,@CALLE,@NUMINT,@NUMEXT,@CRUZAMIENTOS,@CRUZAMIENTOS2,@COLONIA,@CODIGO,@LOCALIDAD,@MUNICIPIO,@ESTADO,@PAIS,@NACIONALIDAD,@REFERDIR,@TELEFONO,@CLASIFIC,@FAX,@PAG_WEB,@CURP,@CVE_ZONA,@IMPRIR,@MAIL,@NIVELSEC,@ENVIOSILEN,@EMAILPRED,
                        @DIAREV,@DIAPAGO,@CON_CREDITO,@DIASCRED,@LIMCRED,@SALDO,@LISTA_PREC,@CVE_BITA,@ULT_PAGOD,@ULT_PAGOM,@ULT_PAGOF,@DESCUENTO,@ULT_VENTAD,@ULT_COMPM,@FCH_ULTCOM,@VENTAS,@CVE_VEND,@CVE_OBS,@TIPO_EMPRESA,@MATRIZ,@PROSPECTO,@CALLE_ENVIO,@NUMINT_ENVIO,@NUMEXT_ENVIO,@CRUZAMIENTOS_ENVIO,
                        @CRUZAMIENTOS_ENVIO2,@COLONIA_ENVIO,@LOCALIDAD_ENVIO,@MUNICIPIO_ENVIO,@ESTADO_ENVIO,@PAIS_ENVIO,@CODIGO_ENVIO,@CVE_ZONA_ENVIO,@REFERENCIA_ENVIO,@CUENTA_CONTABLE,@ADDENDAF,@ADDENDAD,@NAMESPACE,@METODODEPAGO,@NUMCTAPAGO,@MODELO,@DES_IMPU1,@DES_IMPU2,@DES_IMPU3,@DES_IMPU4,@DES_PER,
                        @LAT_GENERAL,@LON_GENERAL,@LAT_ENVIO,@LON_ENVIO,@UUID,@VERSION_SINC,@USO_CFDI,@CVE_PAIS_SAT,@NUMIDREGFISCAL,@FORMADEPAGOSAT,@ADDENDAG,@ADDENDAE)`
                );
                let lastSaved= await pool.request().query(`select * from CLIE01 where CLAVE=${client.keyClient}`);
                
                if(lastSaved.recordset.length){
                    let idCountRecord=await pool.request().query("select * from TBLCONTROL01 WHERE ID_TABLA=59");
                    let countClientRecord=await pool.request().query("select * from TBLCONTROL01 WHERE ID_TABLA=0");
                    if(idCountRecord.recordset.length){
                        let secuenceCount=+idCountRecord.recordset[0].ULT_CVE;
                        for(let i=0;i<client.contacts.length;i++){
                            secuenceCount++;
                            await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('NCONTACTO',Int,secuenceCount).input('NOMBRE',VarChar,client.contacts[i].name)
                            .input('DIRECCION',VarChar,client.contacts[i].address).input('TELEFONO',VarChar,client.contacts[i].phone).input('EMAIL',VarChar,client.contacts[i].email).input('TIPOCONTAC',VarChar,typeContact[client.contacts[i].typeContact])
                            .input('STATUS',VarChar,'A').input('USUARIO',VarChar,null).input('LAT',Int,0).input('LON',Int,0)
                            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                            .query(
                                `insert into CONTAC01(CVE_CLIE,NCONTACTO,NOMBRE,DIRECCION,TELEFONO,EMAIL,TIPOCONTAC,STATUS,USUARIO,LAT,LON,UUID,VERSION_SINC) 
                                values (@CVE_CLIE,@NCONTACTO,@NOMBRE,@DIRECCION,@TELEFONO,@EMAIL,@TIPOCONTAC,@STATUS,@USUARIO,@LAT,@LON,@UUID,@VERSION_SINC)`
                            );   
                        }
                        await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${secuenceCount} where ID_TABLA=59`);
                        await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${(+countClientRecord.recordset[0].ULT_CVE)+1} WHERE ID_TABLA=0`);
                    }
                    await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).query(`
                        insert into CLIE_CLIB01(CVE_CLIE,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6)
                        VALUES(@CVE_CLIE,null,null,null,null,null,null)
                    `);
                }
            }
        );
        await this.connection.close();
        return result;
    }

    // async getWarehouseById(warehouseId:number){
    //     await this.getConnection();
    //     let result= await this.connection.connect().then((pool)=>{
    //         return pool.request().input('WAREHOUSEID',Int,warehouseId).query(
    //             `select * from ALMACENES01 where CVE_ALM = @WAREHOUSEID`
    //         );
    //     });
    //     this.connection.close();
    //     return result;
    // }

    async createWarehouse(warehouseForm:WarehouseForm){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            let totalCounts=await pool.request().query("select * from TBLCONTROL01 WHERE ID_TABLA=68");
            let secuenceCount=+totalCounts.recordset[0].ULT_CVE;
            secuenceCount++;
            await pool.request().input('CVE_ALM',Int,secuenceCount).input('DESCR',VarChar,warehouseForm.description)
            .input('DIRECCION',VarChar,"").input('ENCARGADO',VarChar,"")
            .input('TELEFONO',VarChar,warehouseForm.phone).input('LISTA_PREC',Int,null).input('CUEN_CONT',VarChar,null)
            .input('CVE_MENT',Int,0).input('CVE_MSAL',Int,0).input('STATUS',VarChar,"A").input('LAT',Float,0).input('LON',Float,0)
            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' ')).query(
                `insert into ALMACENES01(CVE_ALM,DESCR,DIRECCION,ENCARGADO,TELEFONO,LISTA_PREC,CUEN_CONT,CVE_MENT,CVE_MSAL,STATUS,LAT,LON,UUID,VERSION_SINC) 
                values (@CVE_ALM,@DESCR,@DIRECCION,@ENCARGADO,@TELEFONO,@LISTA_PREC,@CUEN_CONT,@CVE_MENT,@CVE_MSAL,@STATUS,@LAT,@LON,@UUID,@VERSION_SINC)`
            );
            await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${secuenceCount} where ID_TABLA=68`);
        });
        await this.connection.close();
    }

    async updateWarehouse(warehouseKey:string,owner:string){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            await pool.request().input('CVE_ALM',Int,warehouseKey).input('ENCARGADO',VarChar,owner)
            .query(
                `UPDATE  ALMACENES01 SET ENCARGADO=@ENCARGADO WHERE CVE_ALM=@CVE_ALM`
            );
        });
        await this.connection.close();
    }

    async getAllWarehouses(){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(
            `select CVE_ALM,DESCR,DIRECCION,ENCARGADO,TELEFONO FROM ALMACENES01 WHERE STATUS='A'`
        ));
        await this.connection.close();
        return result.recordset;
    }

    async getLinesOfProductsSae(){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().query(
                `select * from CLIN01 where STATUS='A'`
            );
        });
        await this.connection.close();
        return result.recordset as Array<ProductLineSae>;
    }


    async saveProductLineSae(productLineSaeForm:ProductLineSaeForm){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_LIN',VarChar,productLineSaeForm.clave).input('DESC_LIN',VarChar,productLineSaeForm.description)
            .input('ESUNGPO',VarChar,!productLineSaeForm.grupo?'N':'S').input('CUENTA_COI',VarChar,null).input('STATUS',VarChar,'A').query(
                ` insert into CLIN01(CVE_LIN,DESC_LIN,ESUNGPO,CUENTA_COI,STATUS) 
                VALUES(@CVE_LIN,@DESC_LIN,@ESUNGPO,@CUENTA_COI,@STATUS)`
            );
        });
        await this.connection.close();
        return result;
    }

    async getProductLineSaeByKey(clave:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_LIN',VarChar,clave).query(
                `select * from CLIN01 where CVE_LIN=@CVE_LIN`
                )
        });
        await this.connection.close();
        return result.recordset as Array<ProductLineSae>;
    }

    async getProductLinePresentation(clave:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_ART',VarChar,clave).query(
                `select LIN_PROD from INVE01 where CVE_ART=@CVE_ART`
                )
        });
        await this.connection.close();
        return result.recordset;
    }

    async getProductSaeByKey(productKey:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(`select * from INVE01 where CVE_ART='${productKey}'`))
        await this.connection.close();
        return result.recordset;
    }

    async updateInventoryGeneralAspeSaeByProduct(keySae:string,quantity:number){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            
           let productQuery=await pool.request().input('CVE_ART',VarChar,keySae).query(`select * from INVE01 where CVE_ART='${keySae}'`)
           let product=productQuery.recordset[0];
           if(product.STOCK_MAX<(+product.EXIST+quantity)){
               await pool.request().input('STOCK_MAX',Float,(+product.EXIST+quantity))
               .input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE01 set STOCK_MAX=@STOCK_MAX,EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }else{
            await pool.request().input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE01 set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }
        });
        
        await this.connection.close();
    }

    async getWarehouseByKey(warehouseKey:number){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
            return pool.request().input('CVE_ALM',Int,warehouseKey).query(`
            select * from ALMACENES01 where CVE_ALM=@CVE_ALM
            `);
        });
        await this.connection.close();
        return result;
    }

    async saveProductRovianda(productRoviandaDTO:SaveProductRoviandaDTO){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
            let presentations = productRoviandaDTO.presentations;
            for(let i=0;i<presentations.length;i++){
            let productPresentation=presentations[i];
            let codeSae = (presentations[i].codePresentation!=null)?presentations[i].codePresentation:productRoviandaDTO.keyProduct+(i+1);
            let dateParse = new Date().toISOString().slice(0, 19).replace('T', ' ')
            await pool.request().input('CVE_PROD',VarChar,codeSae).input('CAMPLIB1',VarChar,null)
            .input('CAMPLIB2',VarChar,null).input('CAMPLIB3',VarChar,null).input('CAMPLIB4',Int,null).input('CAMPLIB5',Float,null).input('CAMPLIB6',Float,null)
            .query(`
            insert into INVE_CLIB01(CVE_PROD,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6) 
            VALUES(@CVE_PROD,@CAMPLIB1,@CAMPLIB2,@CAMPLIB3,@CAMPLIB4,@CAMPLIB5,@CAMPLIB6)
            `);

            await pool.request().input('CVE_ART',VarChar,codeSae).input('DESCR',VarChar,productRoviandaDTO.nameProduct+"-"+productPresentation.presentation+" "+productPresentation.typePresentation)
            .input('LIN_PROD',VarChar,productRoviandaDTO.productLine).input('CON_SERIE',VarChar,'N').input('UNI_MED',VarChar,productPresentation.uniMed)
            .input('UNI_EMP',Float,productPresentation.unitPackage).input('CTRL_ALM',VarChar,'').input('TIEM_SURT',Int,0)
            .input('STOCK_MIN',Float,1).input('STOCK_MAX',Float,0).input('TIP_COSTEO',VarChar,'P')
            .input('NUM_MON',Int,1).input('FCH_ULTCOM',DateTime,null).input('COMP_X_REC',Float,0).input('FCH_ULTVTA',DateTime,null)
            .input('PEND_SURT',Float,0).input('EXIST',Float,0).input('COSTO_PROM',Float,0).input('ULT_COSTO',Float,0)
            .input('CVE_OBS',Int,0).input('TIPO_ELE',VarChar,'P').input('UNI_ALT',VarChar,'pz').input('FAC_CONV',Float,1).input('APART',Float,0)
            .input('CON_LOTE',VarChar,'N').input('CON_PEDIMENTO',VarChar,'N').input('PESO',Float,1).input('VOLUMEN',Float,1).input('CVE_ESQIMPU',Int,productPresentation.taxSchema)
            .input('CVE_BITA',Int,0).input('VTAS_ANL_C',Float,0).input('VTAS_ANL_M',Float,0).input('COMP_ANL_C',Float,0).input('COMP_ANL_M',Float,0)
            .input('PREFIJO',VarChar,null).input('TALLA',VarChar,null).input('COLOR',VarChar,null).input('CUENT_CONT',VarChar,null)
            .input('CVE_IMAGEN',VarChar,"").input('BLK_CST_EXT',VarChar,'N').input('STATUS',VarChar,'A').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
            .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
            .input('VERSION_SINC_FECHA_IMG',DateTime,dateParse).input('CVE_PRODSERV',VarChar,"50112000")
            .input('CVE_UNIDAD',VarChar,(productPresentation.uniMed=="KG")?"KGM":"h87").query(
                `
                insert into INVE01(CVE_ART,DESCR,LIN_PROD,CON_SERIE,UNI_MED,UNI_EMP,CTRL_ALM,TIEM_SURT,STOCK_MIN,STOCK_MAX,TIP_COSTEO,
                    NUM_MON,FCH_ULTCOM,COMP_X_REC,FCH_ULTVTA,PEND_SURT,EXIST,COSTO_PROM,ULT_COSTO,CVE_OBS,TIPO_ELE,UNI_ALT,FAC_CONV,APART,
                    CON_LOTE,CON_PEDIMENTO,PESO,VOLUMEN,CVE_ESQIMPU,CVE_BITA,VTAS_ANL_C,VTAS_ANL_M,COMP_ANL_C,COMP_ANL_M,PREFIJO,TALLA,COLOR,
                    CUENT_CONT,CVE_IMAGEN,BLK_CST_EXT,STATUS,MAN_IEPS,APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,UUID,VERSION_SINC,
                    VERSION_SINC_FECHA_IMG,CVE_PRODSERV,CVE_UNIDAD) VALUES(@CVE_ART,@DESCR,@LIN_PROD,@CON_SERIE,@UNI_MED,@UNI_EMP,@CTRL_ALM,@TIEM_SURT,@STOCK_MIN,@STOCK_MAX,@TIP_COSTEO,
                        @NUM_MON,@FCH_ULTCOM,@COMP_X_REC,@FCH_ULTVTA,@PEND_SURT,@EXIST,@COSTO_PROM,@ULT_COSTO,@CVE_OBS,@TIPO_ELE,@UNI_ALT,@FAC_CONV,@APART,
                        @CON_LOTE,@CON_PEDIMENTO,@PESO,@VOLUMEN,@CVE_ESQIMPU,@CVE_BITA,@VTAS_ANL_C,@VTAS_ANL_M,@COMP_ANL_C,@COMP_ANL_M,@PREFIJO,@TALLA,@COLOR,
                        @CUENT_CONT,@CVE_IMAGEN,@BLK_CST_EXT,@STATUS,@MAN_IEPS,@APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@UUID,@VERSION_SINC,
                        @VERSION_SINC_FECHA_IMG,@CVE_PRODSERV,@CVE_UNIDAD)
                `
            )
            for(let h=0;h<3;h++){
                let precio = (h==0)?productPresentation.pricePresentation:(h==1)?0:0;
                await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_PRECIO',VarChar,(h+1))
                .input('PRECIO',VarChar,precio).input('UUID',VarChar,v4()).input('VERSION_SINC',VarChar,dateParse)
                .query(`
                insert into PRECIO_X_PROD01(CVE_ART,CVE_PRECIO,PRECIO,UUID,VERSION_SINC) 
                VALUES(@CVE_ART,@CVE_PRECIO,@PRECIO,@UUID,@VERSION_SINC) 
                `);
            }
            
            // await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_ALM',Int,productPresentation.warehouseKey)
            // .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,'').input('EXIST',Float,0).input('STOCK_MIN',Float,1)
            // .input('STOCK_MAX',Float,0).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
            // .query(`
            //     insert into MULT01(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
            //     values(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)
            // `);
        //     let numMov =  (await pool.request().query(`select * from MINVE01`)).recordset.length+1;
        //     await pool.request().input('CVE_ART',VarChar,codeSae).input('ALMACEN',Int,productPresentation.warehouseKey).input('NUM_MOV',Int,numMov)
        //     .input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse).input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,'IF-041020').input('CLAVE_CLPV',VarChar,null)
        //     .input('VEND',VarChar,null).input('CANT',Float,0).input('CANT_COST',Float,0).input('PRECIO',Float,null).input('COSTO',Float,0).input('AFEC_COI',VarChar,null)
        //     .input('CVE_OBS',Int,null).input('REG_SERIE',Int,0).input('UNI_VENTA',VarChar,productPresentation.uniMed).input('E_LTPD',Int,0).input('EXIST_G',Float,0)
        //     .input('EXISTENCIA',Float,0).input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Float,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,0)
        //     .input('CVE_FOLIO',VarChar,'4').input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0).input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0)
        //     .input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0).query(
        //         `
        //         INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,
        //             TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO)
        //             values (@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,@REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,
        //                 @TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,@COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
        //         `
        //     );
        //     }
        }});
        await this.connection.close();
        return result;
    }

    async updateProductSaeProperties(codeSae:string,productName:string,presentation:UpdatePresentation){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
            await pool.request().input('CVE_ART',VarChar,codeSae).input('DESCR',VarChar,productName+"-"+presentation.presentation+" "+presentation.typePresentation)
            .input('CVE_ESQIMPU',Int,presentation.taxSchema).query(
                `update INVE01 set DESCR=@DESCR,CVE_ESQIMPU=@CVE_ESQIMPU where CVE_ART=@CVE_ART`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_PRECIO',VarChar,1)
            .input('PRECIO',Float,presentation.pricePresentation).query(
                `update PRECIO_X_PROD01 set PRECIO=@PRECIO  where CVE_ART=@CVE_ART and CVE_PRECIO=@CVE_PRECIO`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_ALM',Int,presentation.warehouseKey)
            .query(
                `update MULT01 set CVE_ALM=@CVE_ALM where CVE_ART=@CVE_ART`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('ALMACEN',Int,presentation.warehouseKey)
            .query(
                `update MINVE01 set ALMACEN=@ALMACEN where CVE_ART=@CVE_ART`
            );
        });
        return result;
    }

    async addPresentationProductSae(productSaeKey:string,productLine:string,index:string,productName:string,presentation:UpdatePresentation){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
                
                let dateParse = new Date().toISOString().slice(0, 19).replace('T', ' ')
                await pool.request().input('CVE_PROD',VarChar,productSaeKey+""+index).input('CAMPLIB1',VarChar,null)
                .input('CAMPLIB2',VarChar,null).input('CAMPLIB3',VarChar,null).input('CAMPLIB4',Int,null).input('CAMPLIB5',Float,null).input('CAMPLIB6',Float,null)
                .query(`
                insert into INVE_CLIB01(CVE_PROD,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6) 
                VALUES(@CVE_PROD,@CAMPLIB1,@CAMPLIB2,@CAMPLIB3,@CAMPLIB4,@CAMPLIB5,@CAMPLIB6)
                `);



                await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('DESCR',VarChar,productName+"-"+presentation.presentation+" "+presentation.typePresentation)
                .input('LIN_PROD',VarChar,productLine).input('CON_SERIE',VarChar,'N').input('UNI_MED',VarChar,null)
                .input('UNI_EMP',Float,null).input('CTRL_ALM',VarChar,'').input('TIEM_SURT',Int,0)
                .input('STOCK_MIN',Float,1).input('STOCK_MAX',Float,0).input('TIP_COSTEO',VarChar,'P')
                .input('NUM_MON',Int,1).input('FCH_ULTCOM',DateTime,null).input('COMP_X_REC',Float,0).input('FCH_ULTVTA',DateTime,null)
                .input('PEND_SURT',Float,0).input('EXIST',Float,0).input('COSTO_PROM',Float,0).input('ULT_COSTO',Float,0)
                .input('CVE_OBS',Int,0).input('TIPO_ELE',VarChar,'P').input('UNI_ALT',VarChar,'pz').input('FAC_CONV',Float,1).input('APART',Float,0)
                .input('CON_LOTE',VarChar,'N').input('CON_PEDIMENTO',VarChar,'N').input('PESO',Float,1).input('VOLUMEN',Float,1).input('CVE_ESQIMPU',Int,presentation.taxSchema)
                .input('CVE_BITA',Int,0).input('VTAS_ANL_C',Float,0).input('VTAS_ANL_M',Float,0).input('COMP_ANL_C',Float,0).input('COMP_ANL_M',Float,0)
                .input('PREFIJO',VarChar,null).input('TALLA',VarChar,null).input('COLOR',VarChar,null).input('CUENT_CONT',VarChar,null)
                .input('CVE_IMAGEN',VarChar,"").input('BLK_CST_EXT',VarChar,'N').input('STATUS',VarChar,'A').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
                .input('VERSION_SINC_FECHA_IMG',DateTime,dateParse).input('CVE_PRODSERV',VarChar,"50112000")
                .input('CVE_UNIDAD',VarChar,"H87").query(
                    `
                    insert into INVE01(CVE_ART,DESCR,LIN_PROD,CON_SERIE,UNI_MED,UNI_EMP,CTRL_ALM,TIEM_SURT,STOCK_MIN,STOCK_MAX,TIP_COSTEO,
                        NUM_MON,FCH_ULTCOM,COMP_X_REC,FCH_ULTVTA,PEND_SURT,EXIST,COSTO_PROM,ULT_COSTO,CVE_OBS,TIPO_ELE,UNI_ALT,FAC_CONV,APART,
                        CON_LOTE,CON_PEDIMENTO,PESO,VOLUMEN,CVE_ESQIMPU,CVE_BITA,VTAS_ANL_C,VTAS_ANL_M,COMP_ANL_C,COMP_ANL_M,PREFIJO,TALLA,COLOR,
                        CUENT_CONT,CVE_IMAGEN,BLK_CST_EXT,STATUS,MAN_IEPS,APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,UUID,VERSION_SINC,
                        VERSION_SINC_FECHA_IMG,CVE_PRODSERV,CVE_UNIDAD) VALUES(@CVE_ART,@DESCR,@LIN_PROD,@CON_SERIE,@UNI_MED,@UNI_EMP,@CTRL_ALM,@TIEM_SURT,@STOCK_MIN,@STOCK_MAX,@TIP_COSTEO,
                            @NUM_MON,@FCH_ULTCOM,@COMP_X_REC,@FCH_ULTVTA,@PEND_SURT,@EXIST,@COSTO_PROM,@ULT_COSTO,@CVE_OBS,@TIPO_ELE,@UNI_ALT,@FAC_CONV,@APART,
                            @CON_LOTE,@CON_PEDIMENTO,@PESO,@VOLUMEN,@CVE_ESQIMPU,@CVE_BITA,@VTAS_ANL_C,@VTAS_ANL_M,@COMP_ANL_C,@COMP_ANL_M,@PREFIJO,@TALLA,@COLOR,
                            @CUENT_CONT,@CVE_IMAGEN,@BLK_CST_EXT,@STATUS,@MAN_IEPS,@APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@UUID,@VERSION_SINC,
                            @VERSION_SINC_FECHA_IMG,@CVE_PRODSERV,@CVE_UNIDAD)
                    `
                )
                for(let h=0;h<3;h++){
                    let precio = (h==0)?presentation.pricePresentation:(h==1)?0:0;
                    await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('CVE_PRECIO',VarChar,(h+1))
                    .input('PRECIO',VarChar,precio).input('UUID',VarChar,v4()).input('VERSION_SINC',VarChar,dateParse)
                    .query(`
                    insert into PRECIO_X_PROD01(CVE_ART,CVE_PRECIO,PRECIO,UUID,VERSION_SINC) 
                    VALUES(@CVE_ART,@CVE_PRECIO,@PRECIO,@UUID,@VERSION_SINC) 
                    `);
                }
                
                // await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('CVE_ALM',Int,presentation.warehouseKey)
                // .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,'').input('EXIST',Float,0).input('STOCK_MIN',Float,1)
                // .input('STOCK_MAX',Float,0).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
                // .query(`
                //     insert into MULT01(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
                //     values(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)
                // `);
                // let numMov =  (await pool.request().query(`select * from MINVE01`)).recordset.length+1;
                // await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('ALMACEN',Int,presentation.warehouseKey).input('NUM_MOV',Int,numMov)
                // .input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse).input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,'IF-041020').input('CLAVE_CLPV',VarChar,null)
                // .input('VEND',VarChar,null).input('CANT',Float,0).input('CANT_COST',Float,0).input('PRECIO',Float,null).input('COSTO',Float,0).input('AFEC_COI',VarChar,null)
                // .input('CVE_OBS',Int,null).input('REG_SERIE',Int,0).input('UNI_VENTA',VarChar,'pz').input('E_LTPD',Int,0).input('EXIST_G',Float,0)
                // .input('EXISTENCIA',Float,0).input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Float,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,0)
                // .input('CVE_FOLIO',VarChar,'4').input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0).input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0)
                // .input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0).query(
                //     `
                //     INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,
                //         TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO)
                //         values (@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,@REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,
                //             @TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,@COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                //     `
                // );
        });
        return result;
    }

    async getSellerActive(keySeller:number){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_VEND',VarChar,keySeller).query(
                `select * from VEND01 where STATUS='A' and CVE_VEND=@CVE_VEND`
                );
        })
        await this.connection.close();
        return result;
    }

    async getTaxSchemeById(taxScheme:number){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_ESQIMPU',Int,taxScheme).query(
                `SELECT * FROM IMPU01 WHERE CVE_ESQIMPU=@CVE_ESQIMPU`
            );
        });
        await this.connection.close();
        return result;
    }

    async createSaleSae(saleRequestForm:Sale){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{

                let date = new Date(saleRequestForm.date);
                date.setHours(date.getHours()-6);
                let dateParse=date.toISOString().slice(0, 19).replace('T', ' ')
                let countOrder = await pool.request().query(`select * from TBLCONTROL01 where ID_TABLA=32`);
                let count = (countOrder.recordset as Array<{ID_TABLA:number,ULT_CVE:number}>)[0].ULT_CVE.toString();
                let folios = await pool.request().query(
                        `
                        select top 1 * from FACTV_CLIB01 ORDER BY CLAVE_DOC DESC
                        `
                );// de FACTP A FACTV YA QUE VENTAS ES LO MAS ACTUALIZADO
                let foliosBita = await pool.request().query(
                    `
                    select top 1 * from BITA01 ORDER BY CVE_BITA DESC
                    `
            );
                let totalSaleAmount = saleRequestForm.subSales.map(x=>x.amount).reduce((a,b)=>a+b,0);
                
                //let esquimpu= await pool.request().input('CVE_ESQUIMPU',VarChar,).query(`select * from IMPU01 where CVE_ESQUIMPU=`);
                let newFolio=+folios.recordset[0].CLAVE_DOC+1;
                let foliocount = (folios.recordset.length)?'0'.repeat(10-newFolio.toString().length)+newFolio.toString():'0000000001';
                let foliocountBita = (foliosBita.recordset.length)?+foliosBita.recordset[0].CVE_BITA+1:1
                console.log("FOLIOS",+foliocount);
                foliocount=' '.repeat(10)+foliocount;
                console.log("FOLIOBITA",foliocountBita);
                console.log("CVE_VEND",saleRequestForm.seller.saeKey);
                let client = saleRequestForm.client;
                let seller = saleRequestForm.seller;
                let warehouseId=saleRequestForm.seller.warehouseKeySae;
                ////////////////////////////////pedidos
                await pool.request().input('TIP_DOC',VarChar,'P').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient)
                        .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,seller.saeKey).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                        .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,totalSaleAmount)
                        .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0).input('COM_TOT',Float,0)
                        .input('CONDICION',VarChar,null).input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S').input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O')
                        .input('NUM_MONED',Int,1).input('TIPCAMB',Float,1).input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,0).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0).input('ESCFD',VarChar,'N')
                        .input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocount).input('AUTOANIO',VarChar,'').input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,foliocountBita)
                        .input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'').input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,totalSaleAmount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,null)
                        .input('NUMCTAPAGO',VarChar,null).input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,null).input('DOC_SIG',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
                        .input('FORMADEPAGOSAT',VarChar,null).input('USO_CFDI',VarChar,null).query(
                    `
                        insert into FACTP01(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,
                        IMP_TOT2,IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS
                        ,FECHAELAB,PRIMERPAGO,RFC,CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,
                        IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI)
                        VALUES (@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,
                            @IMP_TOT2,@IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS
                            ,@FECHAELAB,@PRIMERPAGO,@RFC,@CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,
                            @IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,@TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                    `
                )
                console.log("inserto venta 1");
                
                

                await pool.request().input('CVE_BITA',Int,+foliocountBita).input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    4')
                .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No.[           ${foliocount} ] $${totalSaleAmount.toFixed(6)}`).input('STATUS',VarChar,'F')
                .input('NOM_USUARIO',VarChar,'Administrador').query(
                    `insert into BITA01(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                     VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                );
                console.log("inserto venta 2");
               
                await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                insert into FACTP_CLIB01(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);

                ////////////////remisiones
               
                console.log("inserto venta 5");
                await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient)
                .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,seller.saeKey).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,totalSaleAmount)
                .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
                .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
                .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'T').input('TIP_DOC_E',VarChar,'V').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
                .input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,0).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0)
                .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocount).input('AUTOANIO',VarChar,'')
                .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,+foliocountBita+1).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'')
                .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,totalSaleAmount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
                .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'P').input('DOC_ANT',VarChar,foliocount).input('TIP_DOC_SIG',VarChar,'V').input('DOC_SIG',VarChar,foliocount)
                .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).input('FORMADEPAGOSAT',VarChar,'').input('USO_CFDI',VarChar,null)
                .query(
                    `
                    INSERT INTO FACTR01(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
                        IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
                        CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
                        TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
                        VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
                            @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
                            @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
                            @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                    `
                );
                await pool.request().input('CVE_BITA',Int,+foliocountBita+1).input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    3')
                    .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No.[           ${foliocount} ] $${totalSaleAmount.toFixed(6)}`).input('STATUS',VarChar,'F')
                    .input('NOM_USUARIO',VarChar,'Administrador').query(
                        `insert into BITA01(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                        VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                    );

                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                    insert into FACTR_CLIB01(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                ////////////////ventas
               
                console.log("inserto venta 5");
                await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient)
                .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,seller.saeKey).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,totalSaleAmount)
                .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
                .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
                .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'T').input('TIP_DOC_E',VarChar,'V').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
                .input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,0).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0)
                .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocount).input('AUTOANIO',VarChar,'')
                .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',+foliocountBita+2).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'')
                .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,totalSaleAmount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
                .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'P').input('DOC_ANT',VarChar,foliocount).input('TIP_DOC_SIG',VarChar,'V').input('DOC_SIG',VarChar,foliocount)
                .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).input('FORMADEPAGOSAT',VarChar,'').input('USO_CFDI',VarChar,null)
                .query(
                    `
                    INSERT INTO FACTV01(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
                        IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
                        CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
                        TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
                        VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
                            @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
                            @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
                            @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                    `
                );
                await pool.request().input('CVE_BITA',Int,+foliocountBita+2).input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'')
                    .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No.[           ${foliocount} ] $${totalSaleAmount.toFixed(6)}`).input('STATUS',VarChar,'F')
                    .input('NOM_USUARIO',VarChar,'Administrador').query(
                        `insert into BITA01(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                        VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                    );

                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                    insert into FACTV_CLIB01(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                
                //////////////////////////////
                let newDate = new Date(saleRequestForm.date);
                newDate.setHours(newDate.getHours()-6);
                let day = newDate.getDate().toString();
                if(+day<10){
                    day='0'+day;
                }
                let month = (newDate.getMonth()+1).toString();
                if(+month<10){
                    month='0'+month;
                }
                let year = newDate.getFullYear().toString().slice(2,4);
                ////////////////////////////////AFACT01
                let afactRecord = await pool.request().input('PER_ACUM',DateTime,`${newDate.getFullYear()}-${month}-01 00:00:00.000`).query(
                    `select * from AFACT01 where PER_ACUM=@PER_ACUM`
                );
                if(afactRecord.recordset.length){
                    await pool.request().input('PER_ACUM',DateTime,`${newDate.getFullYear()}-${month}-01 00:00:00.000`)
                    .input('RVTA_COM',Float,+afactRecord.recordset[0].RVTA_COM+saleRequestForm.amount).input('PVTA_COM',Float,+afactRecord.recordset[0].PVTA_COM+saleRequestForm.amount).input('VVTA_COM',Float,+afactRecord.recordset[0].VVTA_COM+saleRequestForm.amount)
                    .query(
                        `
                        update AFACT01 set RVTA_COM=@RVTA_COM,PVTA_COM=@PVTA_COM,VVTA_COM=@VVTA_COM where PER_ACUM=@PER_ACUM
                        `
                    );
                }else{
                    await pool.request().input('CVE_AFACT',Int,afactRecord.recordset.length+1)
                    .input('FVTA_COM',Float,0).input('FDESCTO',Float,0).input('FDES_FIN',Float,0).input('FIMP',Float,0).input('FCOMI',Float,0)
                    .input('RVTA_COM',Float,0).input('RDESCTO',Float,0).input('RDES_FIN',Float,0).input('RIMP',Float,0).input('RCOMI',Float,0)
                    .input('DVTA_COM',Float,0).input('DDESCTO',Float,0).input('DDES_FIN',Float,0).input('DIMP',Float,0).input('DCOMI',Float,0)
                    .input('PVTA_COM',Float,0).input('PDESCTO',Float,0).input('PDES_FIN',Float,0).input('PIMP',Float,0).input('PCOMI',Float,0)
                    .input('CVTA_COM',Float,0).input('CDESCTO',Float,0).input('CDES_FIN',Float,0).input('CIMP',Float,0).input('CCOMI',Float,0)
                    .input('VVTA_COM',Float,0).input('VDESCTO',Float,0).input('VDES_FIN',Float,0).input('VIMP',Float,0).input('VCOMI',Float,0)
                    .input('WVTA_COM',Float,0).input('WDESCTO',Float,0).input('WDES_FIN',Float,0).input('WIMP',Float,0).input('WCOMI',Float,0)
                    .input('PER_ACUM',DateTime,`${newDate.getFullYear()}-${month}-01 00:00:00.000`).input('EVTA_COM',Float,0).input('EDESCTO',Float,0).input('EDES_FIN',Float,0).input('EIMP',Float,0)
                    .input('ECOMI',Float,0)
                    .query(
                        `
                        INSERT INTO AFACT01 (CVE_AFACT, FVTA_COM, FDESCTO, FDES_FIN, FIMP, FCOMI, RVTA_COM, RDESCTO, RDES_FIN, RIMP, RCOMI, DVTA_COM, DDESCTO, DDES_FIN,
                             DIMP, DCOMI, PVTA_COM, PDESCTO, PDES_FIN, PIMP, PCOMI, CVTA_COM, CDESCTO, CDES_FIN, CIMP, CCOMI, VVTA_COM, VDESCTO, VDES_FIN, VIMP, VCOMI, 
                             WVTA_COM, WDESCTO, WDES_FIN, WIMP, WCOMI, PER_ACUM, EVTA_COM, EDESCTO, EDES_FIN, EIMP, ECOMI) 
                             VALUES(@CVE_AFACT, @FVTA_COM, @FDESCTO, @FDES_FIN, @FIMP, @FCOMI, @RVTA_COM, @RDESCTO, @RDES_FIN, @RIMP, @RCOMI, @DVTA_COM, @DDESCTO, @DDES_FIN,
                                @DIMP, @DCOMI, @PVTA_COM, @PDESCTO, @PDES_FIN, @PIMP, @PCOMI, @CVTA_COM, @CDESCTO, @CDES_FIN, @CIMP, @CCOMI, @VVTA_COM, @VDESCTO, @VDES_FIN, @VIMP, @VCOMI, 
                                @WVTA_COM, @WDESCTO, @WDES_FIN, @WIMP, @WCOMI, @PER_ACUM, @EVTA_COM, @EDESCTO, @EDES_FIN, @EIMP, @ECOMI)
                        `
                    );
                }
                let CUENTDET01 = await pool.request().query(
                    `SELECT * FROM CUEN_DET01`
                );
                
                await pool.request().input('CVE_CLIE',VarChar,'0'.repeat(10-(+foliocount)).toString().length).input('REFER',VarChar,foliocount).input('NUM_CPTO',Int,2).input('NUM_CARGO',Int,1)
                .input('CVE_OBS',Int,0).input('NO_FACTURA',VarChar,foliocount).input('DOCTO',VarChar,foliocount).input('IMPORTE',Float,saleRequestForm.amount).input('FECHA_APLI',DateTime,dateParse)
                .input('FECHA_VENC',DateTime,dateParse).input('AFEC_COI',VarChar,'A').input('STRCVEVEND',VarChar,seller.saeKey).input('NUM_MONED',Int,1).input('TCAMBIO',Int,1).input('IMPMON_EXT',Float,saleRequestForm.amount)
                .input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,null).input('CVE_FOLIO',VarChar,null).input('TIPO_MOV',VarChar,'C').input('CVE_BITA',Int,null).input('SIGNO',Int,1).input('CVE_AUT',Int,null)
                .input('USUARIO',SmallInt,0).input('ENTREGADA',VarChar,'S').input('FECHA_ENTREGA',DateTime,dateParse).input('STATUS',VarChar,'A').input('REF_SIST',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
                .query(`
                        INSERT INTO CUEN_M01 (CVE_CLIE, REFER, NUM_CPTO, NUM_CARGO, CVE_OBS, NO_FACTURA, DOCTO, IMPORTE, FECHA_APLI, FECHA_VENC, AFEC_COI, STRCVEVEND, NUM_MONED, TCAMBIO, IMPMON_EXT, FECHAELAB, CTLPOL, CVE_FOLIO,
                             TIPO_MOV, CVE_BITA, SIGNO, CVE_AUT, USUARIO, ENTREGADA, FECHA_ENTREGA, STATUS, REF_SIST, UUID, VERSION_SINC) 
                             VALUES (@CVE_CLIE, @REFER, @NUM_CPTO, @NUM_CARGO, @CVE_OBS, @NO_FACTURA, @DOCTO, @IMPORTE, @FECHA_APLI, @FECHA_VENC, @AFEC_COI, @STRCVEVEND, @NUM_MONED, @TCAMBIO, @IMPMON_EXT, @FECHAELAB, @CTLPOL, @CVE_FOLIO,
                                @TIPO_MOV, @CVE_BITA, @SIGNO, @CVE_AUT, @USUARIO, @ENTREGADA, @FECHA_ENTREGA, @STATUS, @REF_SIST, @UUID, @VERSION_SINC)
                `);

                console.log("inserto venta 3");
                for(let i=0;i<saleRequestForm.subSales.length;i++){
                    
                    let product = saleRequestForm.subSales[i];
                    let pricesOfProduct = await pool.request().input("CVE_ART",VarChar,product.presentation.keySae)
                    .query(`SELECT * FROM PRECIO_X_PROD01 WHERE CVE_ART=@CVE_ART`);
                    let priceByProduct=0;
                    if(pricesOfProduct.recordset.length){
                        priceByProduct=+pricesOfProduct.recordset[0].PRECIO;
                    }
                    let lastExist = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).input('ALMACEN',Int,warehouseId)
                .query(`SELECT * FROM MINVE01 WHERE CVE_ART=@CVE_ART AND ALMACEN=@ALMACEN`);
                   ///////////////// PARTES DEL PEDIDO
                    
                    await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.amount/product.quantity).input('PXS',Float,product.quantity)
                    .input('PREC',Float,priceByProduct).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,0).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).query(
                        `
                        insert into PAR_FACTP01(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                            ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                            APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                            (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                                ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                                @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                        `
                    );
                    console.log("Ingresando docs");
                    await pool.request().input("TIP_DOC",VarChar,'P').input('CVE_DOC',VarChar,' '.repeat(10)+foliocount)
                    .input('ANT_SIG',VarChar,'S').input('TIP_DOC_E',VarChar,'R').input('CVE_DOC_E',VarChar,' '.repeat(10)+foliocount)
                    .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    .query(`
                        INSERT INTO DOCTOSIGF01(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                        VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    `);
                    console.log("inserto venta 4");
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                        `insert into PAR_FACTP_CLIB01(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    );
                    ///////////////// PARTES DE LA REMISSION

                    await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.amount/product.quantity).input('PXS',Float,product.quantity)
                    .input('PREC',Float,priceByProduct).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,0).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).query(
                        `
                        insert into PAR_FACTR01(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                            ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                            APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                            (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                                ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                                @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                        `
                    );
                    console.log("inserto venta 4");
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                        `insert into PAR_FACTR_CLIB01(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    );


                    await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,' '.repeat(10)+foliocount)
                    .input('ANT_SIG',VarChar,'A').input('TIP_DOC_E',VarChar,'P').input('CVE_DOC_E',VarChar,foliocount)
                    .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    .query(`
                        INSERT INTO DOCTOSIGF01(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                        VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    `);
                    
                            /////////////// PARTES DE LA VENTA
                    await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.amount/product.quantity).input('PXS',Float,product.quantity)
                    .input('PREC',Float,priceByProduct).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,+lastExist.recordset.length+1).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).query(
                        `
                        insert into PAR_FACTV01(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                            ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                            APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                            (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                                ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                                @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                        `
                    );
                    console.log("inserto venta 4");
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                        `insert into PAR_FACTV_CLIB01(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    );


                    // await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,foliocount)
                    // .input('ANT_SIG',VarChar,'S').input('TIP_DOC_E',VarChar,'V').input('CVE_DOC_E',VarChar,foliocount)
                    // .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    // .query(`
                    //     INSERT INTO DOCTOSIGF01(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                    //     VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    // `);

                    await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,' '.repeat(10)+foliocount)
                    .input('ANT_SIG',VarChar,'A').input('TIP_DOC_E',VarChar,'R').input('CVE_DOC_E',VarChar,' '.repeat(10)+foliocount)
                    .input('PARTIDA',Int,1).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    .query(`
                        INSERT INTO DOCTOSIGF01(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                        VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    `);
                
                let inve01 = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).query(`
                SELECT EXIST,UNI_MED FROM INVE01 WHERE CVE_ART=@CVE_ART
                `)
                
                let existenceByWarehouse = lastExist.recordset[lastExist.recordset.length-1];
                    await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).input('ALMACEN',Int,warehouseId)
                    .input('NUM_MOV',Int,+lastExist.recordset.length+1).input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse)
                    .input('TIPO_DOC',VarChar,'R').input('REFER',VarChar,`IF-${day}${month}${year}`).input('CLAVE_CLPV',VarChar,null)
                    .input('VEND',VarChar,seller.saeKey).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,null)
                    .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
                    .input('UNI_VENTA',VarChar,inve01.recordset[0].UNI_MED).input('E_LTPD',Int,0).input('EXIST_G',Float,inve01.recordset[0].EXIST).input('EXISTENCIA',Float,existenceByWarehouse.EXIST-product.quantity)
                    .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,1).input('FECHAELAB',DateTime,dateParse).input('CTL_POL',Int,null)
                    .input('CVE_FOLIO',VarChar,count.toString()).input('SIGNO',Int,-1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
                    .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
                    .query(`
                            INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                                REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COST_PROM_INI,
                                COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                                    @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COST_PROM_INI,
                                    @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                    `);

                    await this.updateInventoryGeneralAspeSaeByProduct(product.presentation.keySae,-product.quantity);
                    await pool.connect();

                    await pool.request().input('CVE_CLIE',VarChar,+CUENTDET01[0].CVE_CLIE+(i+1)).input('REFER',VarChar,foliocount).input('ID_MOV',+lastExist.recordset.length+1)
                    .input('NUM_CPTO',Int,10).input('NUM_CARGO',Int,1).input('CVE_OBS',Int,0).input('NO_FACTURA',VarChar,foliocount).input('DOCTO',VarChar,'').input('IMPORTE',Float,product.amount)
                    .input('FECHA_APLI',DateTime,dateParse).input('FECHA_VENC',DateTime,dateParse).input('AFEC_COI',VarChar,null).input('STRCVEVEND',VarChar,'').input('NUM_MONED',Int,1)
                    .input('TCAMBIO',Int,1).input('IMPMON_EXT',Float,product.amount).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Float,0).input('CVE_FOLIO',VarChar,'').input('TIPO_MOV',VarChar,'A')
                    .input('CVE_BITA',Int,null).input('SIGNO',Int,-1).input('CVE_AUT',Int,0).input('USUARIO',SmallInt,0).input('OPERACIONPL',VarChar,null).input('REF_SIST',VarChar,null).input('NO_PARTIDA',Int,(i+1))
                    .input('REFBANCO_ORIGEN',VarChar,null).input('REFBANCO_DEST',VarChar,null).input('NUMCTAPAGO_ORIGEN',VarChar,null).input('NUMCTAPAGO_DESTINO',VarChar,null).input('NUMCHEQUE',VarChar,null).input('BENEFICIARIO',VarChar,null)
                    .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).input('ID_OPERACION',VarChar,null).input('CVE_DOC_COMPPAGO',VarChar,null).query(
                        `
                        INSERT INTO CUEN_DET01 (CVE_CLIE, REFER, ID_MOV, NUM_CPTO, NUM_CARGO, CVE_OBS, NO_FACTURA, DOCTO, IMPORTE, FECHA_APLI, FECHA_VENC, AFEC_COI, STRCVEVEND,
                             NUM_MONED, TCAMBIO, IMPMON_EXT, FECHAELAB, CTLPOL, CVE_FOLIO, TIPO_MOV, CVE_BITA, SIGNO, CVE_AUT, USUARIO, OPERACIONPL, REF_SIST, NO_PARTIDA, REFBANCO_ORIGEN,
                              REFBANCO_DEST, NUMCTAPAGO_ORIGEN, NUMCTAPAGO_DESTINO, NUMCHEQUE, BENEFICIARIO, UUID, VERSION_SINC, ID_OPERACION, CVE_DOC_COMPPAGO) 
                              VALUES(@CVE_CLIE, @REFER, @ID_MOV, @NUM_CPTO, @NUM_CARGO, @CVE_OBS, @NO_FACTURA, @DOCTO, @IMPORTE, @FECHA_APLI, @FECHA_VENC, @AFEC_COI, @STRCVEVEND,
                                @NUM_MONED, @TCAMBIO, @IMPMON_EXT, @FECHAELAB, @CTLPOL, @CVE_FOLIO, @TIPO_MOV, @CVE_BITA, @SIGNO, @CVE_AUT, @USUARIO, @OPERACIONPL, @REF_SIST, @NO_PARTIDA, @REFBANCO_ORIGEN,
                                 @REFBANCO_DEST, @NUMCTAPAGO_ORIGEN, @NUMCTAPAGO_DESTINO, @NUMCHEQUE, @BENEFICIARIO, @UUID, @VERSION_SINC, @ID_OPERACION, @CVE_DOC_COMPPAGO)
                        `
                    );

                }

                
                return foliocount;

            }
        );
        await this.connection.close();
        return result;
    }

    async getAllTaxSchemas(){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().query(
                `select CVE_ESQIMPU,DESCRIPESQ FROM IMPU01 WHERE STATUS='A'`
            )
        );
        await this.connection.close();
        return result.recordset;
    }


    async getClientCount(){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().query(
                `select  TOP 1 CLAVE FROM CLIE01 ORDER BY CLAVE DESC`
            )
        );
        await this.connection.close();
        return result.recordset;
    }

    async getSellerCount(){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().query(
                `
                select TOP 1 CVE_VEND FROM VEND01 ORDER BY CVE_VEND DESC
                `
            )
        )
        await this.connection.close();
        return result.recordset;
    }

    async getProductExist(productKey:string,quantity:number){
        await this.getConnection();
        let result = await this.connection.connect().then((pool)=>
            pool.request().query(`
            select * from MINVE01 where CVE_ART= '${productKey}' and EXISTENCIA>${quantity}
            `)
        );
        await this.connection.close();
        return result.recordset;
    }

    async deleteProductRovianda(productRovianda:ProductRovianda){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
            for(let presentation of productRovianda.presentationProducts){
                await pool.request().input('CVE_ART',VarChar,presentation.keySae).query(
                    `
                    delete from MINVE01 where =@CVE_ART
                    `
                );
                await pool.request().input('CVE_ART',Int,presentation.keySae)
            .query(`
                delete from MULT01 where CVE_ART=@CVE_ART
            `);
            
            await pool.request().input('CVE_ART',VarChar,presentation.keySae)
                .query(`
                delete from PRECIO_X_PROD01 where CVE_ART=@CVE_ART
                `);

                await pool.request().input('CVE_ART',VarChar,presentation.keySae).query(
                    `
                    delete from INVE01 where CVE_ART=@CVE_ART
                    `
                )
            
            await pool.request().input('CVE_PROD',VarChar,)
            .query(`
            delete from INVE_CLIB01 where CVE_PROD=@CVE_PROD
            `);
 
        }

        });
    }

    async updateProductInSaeBySellerWarehouse(warehouseId:number,productKeySae:string,units:number,sellerKeySae:string,uniMed:string){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
            
                let warehouseSeller = await pool.request()
                .input('CVE_ALM',Int,warehouseId).input('CVE_ART',VarChar,productKeySae).input('STATUS',VarChar,'A')
                .query(
                    `
                     select CVE_ART,CVE_ALM,EXIST,STOCK_MAX FROM MULT01 WHERE CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM AND STATUS=@STATUS
                    `
                );
                let dateParse = new Date()
                dateParse.setHours(dateParse.getHours()-6)
                let dateStr=dateParse.toISOString().slice(0, 19).replace('T', ' ')
                if(warehouseSeller.recordset.length){
                    let warehouse:any = warehouseSeller.recordset[0];
                    if(warehouse.EXIST+units>warehouse.STOCK_MAX){
                        await pool.request().input('CVE_ART',VarChar,productKeySae)
                        .input('CVE_ALM',Int,warehouseId).input('STOCK_MAX',Float,warehouse.EXIST+units)
                        .input('EXIST',Float,warehouse.EXIST+units).query(
                            `UPDATE MULT01 SET STOCK_MAX=@STOCK_MAX,EXIST=@EXIST where CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM`
                        );
                    }else{
                        await pool.request().input('CVE_ART',VarChar,productKeySae)
                        .input('CVE_ALM',Int,warehouseId)
                        .input('EXIST',Float,warehouse.EXIST+units).query(
                            `UPDATE MULT01 SET EXIST=@EXIST where CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM`
                        );
                       
                    }
                    await this.updateInventoryGeneralAspeSaeByProduct(productKeySae,units)
                    await pool.connect();
                }else{
                    await pool.request().input('CVE_ART',VarChar,productKeySae).input('CVE_ALM',Int,warehouseId)
                    .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,null).input('EXIST',Float,units).input('STOCK_MIN',Float,0)
                    .input('STOCK_MAX',Float,units).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateStr)
                    .query(
                        `INSERT INTO MULT01(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
                        VALUE(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)`
                    );

                    await this.updateInventoryGeneralAspeSaeByProduct(productKeySae,units);
                    await pool.connect();
                }
                let counts = await pool.request().query(`
                    SELECT COUNT(*) AS CANTIDAD FROM MINVE01
                `);
                let day = dateParse.getDate().toString();
                if(+day<10){
                    day='0'+day;
                }
                let month = (dateParse.getMonth()+1).toString();
                if(+month<10){
                    month='0'+month;
                }
                let year = dateParse.getFullYear().toString().slice(2,4);
                let inve01 = await pool.request().input('CVE_ART',VarChar,productKeySae).input('ALMACEN',Int,warehouseId).query(`
                SELECT EXIST FROM INVE01 WHERE CVE_ART=@CVE_ART AND ALMACEN=@ALMACEN
                `)
                if(counts.recordset.length && inve01.recordset.length){
                    let count:number = +counts.recordset[0].CANTIDAD;
                        
                        await pool.request().input('CVE_ART',VarChar,productKeySae).input('ALMACEN',Int,warehouseId)
                        .input('NUM_MOV',Int,+count+1).input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse)
                        .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,`IF-${day}${month}${year}`).input('CLAVE_CLPV',VarChar,null)
                        .input('VEND',VarChar,sellerKeySae).input('CANT',Float,units).input('CANT_COST',Float,0).input('PRECIO',Float,null)
                        .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
                        .input('UNI_VENTA',VarChar,uniMed).input('E_LTPD',Int,0).input('EXIST_G',Float,inve01[0].EXIST).input('EXISTENCIA',Float,units)
                        .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,1).input('FECHAELAB',DateTime,dateStr).input('CTL_POL',Int,null)
                        .input('CVE_FOLIO',VarChar,count.toString()).input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
                        .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
                        .query(`
                                INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                                    REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COST_PROM_INI,
                                    COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                                        @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COST_PROM_INI,
                                        @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                        `);
                    
                }
        });
        await this.connection.close();
    }
}