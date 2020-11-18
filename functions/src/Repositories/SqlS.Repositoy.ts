import { ConnectionPool, Float, pool, SmallInt } from "mssql";
import { getSqlServerCon } from "../Config/SqlS";
import {Int,VarChar,DateTime,} from "mssql";
import {v4} from "uuid";
import { ClientCreation, ClientSAE, SellerClientCreation, typeContact } from "../Models/DTO/Client.DTO";
import { WarehouseForm } from "../Models/DTO/Warehouse.DTO";
import { ProductLineSae, ProductLineSaeForm, ProductRoviandaDTO, SaveProductRoviandaDTO, UpdatePresentation } from "../Models/DTO/ProductRoviandaDTO";
import { ImpuSchemaSAE, SaleRequestForm } from "../Models/DTO/Sales.ProductDTO";
import { UserDTO } from "../Models/DTO/UserDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { In } from "typeorm";

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
            .input('DIRECCION',VarChar,warehouseForm.address).input('ENCARGADO',VarChar,warehouseForm.admin)
            .input('TELEFONO',VarChar,warehouseForm.phone).input('LISTA_PREC',Int,null).input('CUEN_CONT',VarChar,null)
            .input('CVE_MENT',Int,warehouseForm.movEntrance).input('CVE_MSAL',Int,warehouseForm.movOutput).input('STATUS',VarChar,"A").input('LAT',Float,0).input('LON',Float,0)
            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' ')).query(
                `insert into ALMACENES01(CVE_ALM,DESCR,DIRECCION,ENCARGADO,TELEFONO,LISTA_PREC,CUEN_CONT,CVE_MENT,CVE_MSAL,STATUS,LAT,LON,UUID,VERSION_SINC) 
                values (@CVE_ALM,@DESCR,@DIRECCION,@ENCARGADO,@TELEFONO,@LISTA_PREC,@CUEN_CONT,@CVE_MENT,@CVE_MSAL,@STATUS,@LAT,@LON,@UUID,@VERSION_SINC)`
            );
            await pool.request().query(`update TBLCONTROL01 set ULT_CVE=${secuenceCount} where ID_TABLA=68`);
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
            let dateParse = new Date().toISOString().slice(0, 19).replace('T', ' ')
            await pool.request().input('CVE_PROD',VarChar,productRoviandaDTO.keyProduct+(i+1)).input('CAMPLIB1',VarChar,null)
            .input('CAMPLIB2',VarChar,null).input('CAMPLIB3',VarChar,null).input('CAMPLIB4',Int,null).input('CAMPLIB5',Float,null).input('CAMPLIB6',Float,null)
            .query(`
            insert into INVE_CLIB01(CVE_PROD,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6) 
            VALUES(@CVE_PROD,@CAMPLIB1,@CAMPLIB2,@CAMPLIB3,@CAMPLIB4,@CAMPLIB5,@CAMPLIB6)
            `);

            await pool.request().input('CVE_ART',VarChar,productRoviandaDTO.keyProduct+(i+1)).input('DESCR',VarChar,productRoviandaDTO.nameProduct+"-"+productPresentation.presentation+" "+productPresentation.typePresentation)
            .input('LIN_PROD',VarChar,productRoviandaDTO.productLine).input('CON_SERIE',VarChar,'N').input('UNI_MED',VarChar,productPresentation.unitMeasure)
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
                let precio = (h==0)?productPresentation.pricePresentation:(h==1)?0:0;
                await pool.request().input('CVE_ART',VarChar,productRoviandaDTO.keyProduct+(i+1)).input('CVE_PRECIO',VarChar,(h+1))
                .input('PRECIO',VarChar,precio).input('UUID',VarChar,v4()).input('VERSION_SINC',VarChar,dateParse)
                .query(`
                insert into PRECIO_X_PROD01(CVE_ART,CVE_PRECIO,PRECIO,UUID,VERSION_SINC) 
                VALUES(@CVE_ART,@CVE_PRECIO,@PRECIO,@UUID,@VERSION_SINC) 
                `);
            }
            
            await pool.request().input('CVE_ART',VarChar,productRoviandaDTO.keyProduct+(i+1)).input('CVE_ALM',Int,productPresentation.warehouseKey)
            .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,'').input('EXIST',Float,0).input('STOCK_MIN',Float,1)
            .input('STOCK_MAX',Float,0).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
            .query(`
                insert into MULT01(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
                values(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)
            `);
            let numMov =  (await pool.request().query(`select * from MINVE01`)).recordset.length+1;
            await pool.request().input('CVE_ART',VarChar,productRoviandaDTO.keyProduct+(i+1)).input('ALMACEN',Int,productPresentation.warehouseKey).input('NUM_MOV',Int,numMov)
            .input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse).input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,'IF-041020').input('CLAVE_CLPV',VarChar,null)
            .input('VEND',VarChar,null).input('CANT',Float,0).input('CANT_COST',Float,0).input('PRECIO',Float,null).input('COSTO',Float,0).input('AFEC_COI',VarChar,null)
            .input('CVE_OBS',Int,null).input('REG_SERIE',Int,0).input('UNI_VENTA',VarChar,'pz').input('E_LTPD',Int,0).input('EXIST_G',Float,0)
            .input('EXISTENCIA',Float,0).input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Float,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,0)
            .input('CVE_FOLIO',VarChar,'4').input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0).input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0)
            .input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0).query(
                `
                INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,
                    TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO)
                    values (@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,@REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,
                        @TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,@COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                `
            );
            }
        });
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
                
                await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('CVE_ALM',Int,presentation.warehouseKey)
                .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,'').input('EXIST',Float,0).input('STOCK_MIN',Float,1)
                .input('STOCK_MAX',Float,0).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse)
                .query(`
                    insert into MULT01(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
                    values(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)
                `);
                let numMov =  (await pool.request().query(`select * from MINVE01`)).recordset.length+1;
                await pool.request().input('CVE_ART',VarChar,productSaeKey+""+index).input('ALMACEN',Int,presentation.warehouseKey).input('NUM_MOV',Int,numMov)
                .input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse).input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,'IF-041020').input('CLAVE_CLPV',VarChar,null)
                .input('VEND',VarChar,null).input('CANT',Float,0).input('CANT_COST',Float,0).input('PRECIO',Float,null).input('COSTO',Float,0).input('AFEC_COI',VarChar,null)
                .input('CVE_OBS',Int,null).input('REG_SERIE',Int,0).input('UNI_VENTA',VarChar,'pz').input('E_LTPD',Int,0).input('EXIST_G',Float,0)
                .input('EXISTENCIA',Float,0).input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Float,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,0)
                .input('CVE_FOLIO',VarChar,'4').input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0).input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0)
                .input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0).query(
                    `
                    INSERT INTO MINVE01(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,
                        TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO)
                        values (@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,@REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,
                            @TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,@COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                    `
                );
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

    async createSaleSae(saleRequestForm:SaleRequestForm,sellerkey:number,client:ClientSAE){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
                let dateParse = new Date().toISOString().slice(0, 19).replace('T', ' ')
                let countOrder = await pool.request().query(`select * from TBLCONTROL01 where ID_TABLA=32`);
                let count = (countOrder.recordset as Array<{ID_TABLA:number,ULT_CVE:number}>)[0].ULT_CVE.toString();
                let folios = await pool.request().query(
                        `
                        select top 1 * from FACTP_CLIB01 ORDER BY CLAVE_DOC DESC
                        `
                );
                let foliosBita = await pool.request().query(
                    `
                    select top 1 * from BITA01 ORDER BY CVE_BITA DESC
                    `
            );
                let newFolio=+folios.recordset[0].CLAVE_DOC+1;
                let foliocount = (folios.recordset.length)?'0'.repeat(10-newFolio.toString().length)+newFolio.toString():('0'.repeat(9)+'1');
                let foliocountBita = (foliosBita.recordset.length)?foliosBita.recordset[0].CVE_BITA:1
                console.log("FOLIOS",+foliocount);
                console.log("FOLIOBITA",foliocountBita);
                console.log("CVE_VEND",sellerkey);
                let total = saleRequestForm.products.map(x=>x.total).reduce((a,b)=>a+b,0);
                
                await pool.request().input('TIP_DOC',VarChar,'P').input('CVE_DOC',VarChar,'0'.repeat(10-count.length)+count).input('CVE_CLPV',VarChar,'1')
                        .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,sellerkey).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                        .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,0).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,total)
                        .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0).input('COM_TOT',Float,0)
                        .input('CONDICION',VarChar,null).input('CVE_OBS',Int,0).input('NUM_ALMA',Int,1).input('ACT_CXC',VarChar,'S').input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O')
                        .input('NUM_MONED',Int,1).input('TIPCAMB',Float,1).input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,0).input('RFC',VarChar,client.RFC).input('CTLPOL',Int,0).input('ESCFD',VarChar,'N')
                        .input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocount+1).input('AUTOANIO',VarChar,'').input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,foliocountBita)
                        .input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'').input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,total).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,null)
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
                let folioSaleToBITA = '0'.repeat(10-(+foliocount).toString().length)+(+foliocount).toString();
                

                await pool.request().input('CVE_BITA',Int,foliocountBita+1).input('CVE_CLIE',VarChar,client.CLAVE).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'4')
                .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No.[     ${folioSaleToBITA}] $${total.toFixed(6)}`).input('STATUS',VarChar,'F')
                .input('NOM_USUARIO',VarChar,'Administrador').query(
                    `insert into BITA01(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                     VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                );
                console.log("inserto venta 2");
               
                await pool.request().input('CLAVE_DOC',VarChar,folioSaleToBITA).query(`
                insert into FACTP_CLIB01(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                console.log("inserto venta 3");
                for(let i=0;i<saleRequestForm.products.length;i++){
                    
                    let sale = saleRequestForm.products[i];
                    let impu = await this.getTaxSchemeById(sale.taxSchema);
                    if(!pool.connected){
                        pool=await pool.connect();
                    }
                    let impuEntity:ImpuSchemaSAE = (impu.recordset as Array<ImpuSchemaSAE>)[0];
                    await pool.request().input('CVE_DOC',VarChar,folioSaleToBITA).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,sale.productKey).input('CANT',Float,sale.quantity).input('PXS',Float,sale.quantity)
                    .input('PREC',Float,sale.price).input('COST',Float,0).input('IMPU1',Float,impuEntity.IMPUESTO1).input('IMPU2',Float,impuEntity.IMPUESTO2).input('IMPU3',Float,impuEntity.IMPUESTO3).input('IMPU4',Float,impuEntity.IMPUESTO4)
                    .input('IMP1APLA',Float,impuEntity.IMP1APLICA).input('IMP2APLA',Float,impuEntity.IMP2APLICA).input('IMP3APLA',Float,impuEntity.IMP3APLICA).input('IMP4APLA',Float,impuEntity.IMP4APLICA).input('TOTIMP1',Float,0)
                    .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,sale.total-(sale.price*sale.quantity)).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    .input('ACT_INV',VarChar,'N').input('NUM_ALM',sale.warehouseKey).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,0).input('TOT_PARTIDA',Float,sale.price*sale.quantity).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',sale.taxSchema).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse).query(
                        `
                        insert into PAR_FACTP01(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                            ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                            APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                            (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                                ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                                @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                        `
                    );
                    console.log("inserto venta 4");
                    await pool.request().input('CLAVE_DOC',VarChar,folioSaleToBITA).input('NUM_PART',Int,(i+1)).query(
                        `insert into PAR_FACTP_CLIB01(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    );
                    console.log("inserto venta 5");
                    
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

    async updateProductInSae(aspelProductKey:string,units:number){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
            
                let result = await pool.request().input('CVE_ART',VarChar,aspelProductKey).query(
                    `
                    select EXIST,STOCK_MAX FROM MULT01 WHERE CVE_ART=@CVE_ART
                    `
                );
                
                if(result.recordset.length){
                    let record:any = result.recordset[0];
                    if(record.EXIST+units>record.STOCK_MAX){
                        await pool.request().input('CVE_ART',VarChar,aspelProductKey).input('STOCK_MAX',Float,record.EXIST+units)
                        .input('EXIST',Float,record.EXIST+units).query(
                            `UPDATE MULT01 SET STOCK_MAX=@STOCK_MAX,EXIST=@EXIST where CVE_ART=@CVE_ART`
                        )
                    }else{
                        await pool.request().input('CVE_ART',VarChar,aspelProductKey)
                        .input('EXIST',Float,record.EXIST+units).query(
                            `UPDATE MULT01 EXIST=@EXIST where CVE_ART=@CVE_ART`
                        )
                    }
                }

                   
                let result2 = await pool.request().input('CVE_ART',VarChar,aspelProductKey).query(
                    `
                    select CANT,EXIST_G,EXISTENCIA FROM MINVE01 WHERE CVE_ART=@CVE_ART
                    `
                );
                
                if(result2.recordset.length){
                    let record:any = result2.recordset[0];
                        await pool.request().input('CVE_ART',VarChar,aspelProductKey).input('CANT',Float,record.CANT+units)
                        .input('EXIST_G',Float,record.EXIST_G+units).input('EXISTENCIA',Float,record.EXISTENCIA+units)
                        .query(
                            `
                            UPDATE MINVE01 SET CANT=@CANT,EXIST_G=@EXIST_G,EXISTENCIA=@EXISTENCIA where CVE_ART=@CVE_ART
                            `
                        )
                    
                }


                let result3 = await pool.request().input('CVE_ART',VarChar,aspelProductKey).query(
                    `
                    select EXIST,STOCK_MIN,STOCK_MAX FROM INVE01 WHERE CVE_ART=@CVE_ART
                    `
                );
                
                if(result3.recordset.length){
                    let record:any = result3.recordset[0];
                        await pool.request().input('CVE_ART',VarChar,aspelProductKey)
                        .input('EXIST',Float,record.EXIST+units).query(
                            `
                            UPDATE INVE01 SET EXIST=@EXIST where CVE_ART=@CVE_ART
                            `
                        )
                    if(+record.STOCK_MAX+units< +record.EXIST+units ){
                        await pool.request().input('CVE_ART',VarChar,aspelProductKey)
                        .input('STOCK_MAX',Float,record.EXIST+units).query(
                            `
                            UPDATE INVE01 SET STOCK_MAX=@STOCK_MAX where CVE_ART=@CVE_ART
                            `
                        )
                    }
                }
                //INVE01 STOCK_MAX EXIST
                
        });
    }
}