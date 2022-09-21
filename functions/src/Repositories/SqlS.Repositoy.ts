import { ConnectionPool, Float, SmallInt } from "mssql";
import { getSqlServerCon, getSqlServerCon2 } from "../Config/SqlS";
import {Int,VarChar,DateTime,} from "mssql";
import {v4} from "uuid";
import { ClientCreation, SellerClientCreation, typeContact } from "../Models/DTO/Client.DTO";
import { WarehouseForm } from "../Models/DTO/Warehouse.DTO";
import { ProductLineSae, ProductLineSaeForm, SaveProductRoviandaDTO, UpdatePresentation } from "../Models/DTO/ProductRoviandaDTO";
import { UserDTO } from "../Models/DTO/UserDTO";
import { ProductRovianda } from "../Models/Entity/Product.Rovianda";
import { Sale } from "../Models/Entity/Sales";
import { result } from "lodash";
import { OrderSellerInterface } from "../Models/Enum/order.seller.interface";

const EMPRESA = "06";
const EMPRESA2 = "07";
export class SqlSRepository{

    constructor(){}

    private connection:ConnectionPool;
    private connection2:ConnectionPool;
    async getConnection(){
        if(!this.connection){
            this.connection = getSqlServerCon()
        }
    }

    async getConnection2(){
        if(!this.connection2){
            this.connection2 = getSqlServerCon2();
        }
    }

    async createSeller(userDto:UserDTO){
        await this.getConnection();
        let stringKey=(+userDto.clave).toString();
        
        let result = await this.connection.connect().then(
            async(pool)=>{
               await pool.request().input('CVE_VEND',VarChar," ".repeat(5-stringKey.length)+stringKey)
            .input('STATUS',VarChar,'A').input('NOMBRE',VarChar,userDto.name)
            .input('COMI',Int,userDto.comision).input('CLASIFIC',VarChar,null)
            .input('CORREOE',VarChar,userDto.email).input('UUID',VarChar,v4())
            .input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' ')).query(
                `insert into VEND${EMPRESA}(CVE_VEND,STATUS,NOMBRE,COMI,CLASIFIC,CORREOE,UUID,VERSION_SINC) 
                values(@CVE_VEND,@STATUS,@NOMBRE,@COMI,@CLASIFIC,@CORREOE,@UUID,@VERSION_SINC);`
            );
            await pool.request().input('ULT_CVE',Int,+stringKey).query(`
                    UPDATE TBLCONTROL${EMPRESA} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=4
            `)
            }
            // alterar tabla con id 4 <con id siguiente para el vendedor>;
        );
        await this.connection.close();
        return result;
    }

    async getClientsByKey(keyClient:number){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().query(`select * from CLIE${EMPRESA} where CLAVE='${' '.repeat(10-keyClient.toString().length)+keyClient.toString()}'`)
        });   
        await this.connection.close();
        return result;
    }

    /*async saveClient(client:ClientCreation){
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
                .input('DIASCRED',Int,client.daysCredit).input('LIMCRED',Float,client.currentCredit).input('SALDO',Float,0).input('LISTA_PREC',Int,null).input('CVE_BITA',Int,null)
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
                    `insert into CLIE${EMPRESA}(CLAVE,STATUS,NOMBRE,RFC,CALLE,NUMINT,NUMEXT,CRUZAMIENTOS,CRUZAMIENTOS2,COLONIA,CODIGO,LOCALIDAD,MUNICIPIO,ESTADO,PAIS,NACIONALIDAD,REFERDIR,TELEFONO,CLASIFIC,FAX,PAG_WEB,CURP,CVE_ZONA,IMPRIR,MAIL,NIVELSEC,ENVIOSILEN,EMAILPRED,
                        DIAREV,DIAPAGO,CON_CREDITO,DIASCRED,LIMCRED,SALDO,LISTA_PREC,CVE_BITA,ULT_PAGOD,ULT_PAGOM,ULT_PAGOF,DESCUENTO,ULT_VENTAD,ULT_COMPM,FCH_ULTCOM,VENTAS,CVE_VEND,CVE_OBS,TIPO_EMPRESA,MATRIZ,PROSPECTO,CALLE_ENVIO,NUMINT_ENVIO,NUMEXT_ENVIO,CRUZAMIENTOS_ENVIO,
                        CRUZAMIENTOS_ENVIO2,COLONIA_ENVIO,LOCALIDAD_ENVIO,MUNICIPIO_ENVIO,ESTADO_ENVIO,PAIS_ENVIO,CODIGO_ENVIO,CVE_ZONA_ENVIO,REFERENCIA_ENVIO,CUENTA_CONTABLE,ADDENDAF,ADDENDAD,NAMESPACE,METODODEPAGO,NUMCTAPAGO,MODELO,DES_IMPU1,DES_IMPU2,DES_IMPU3,DES_IMPU4,DES_PER,
                        LAT_GENERAL,LON_GENERAL,LAT_ENVIO,LON_ENVIO,UUID,VERSION_SINC,USO_CFDI,CVE_PAIS_SAT,NUMIDREGFISCAL,FORMADEPAGOSAT,ADDENDAG,ADDENDAE) 
                        values(@CLAVE,@STATUS,@NOMBRE,@RFC,@CALLE,@NUMINT,@NUMEXT,@CRUZAMIENTOS,@CRUZAMIENTOS2,@COLONIA,@CODIGO,@LOCALIDAD,@MUNICIPIO,@ESTADO,@PAIS,@NACIONALIDAD,@REFERDIR,@TELEFONO,@CLASIFIC,@FAX,@PAG_WEB,@CURP,@CVE_ZONA,@IMPRIR,@MAIL,@NIVELSEC,@ENVIOSILEN,@EMAILPRED,
                        @DIAREV,@DIAPAGO,@CON_CREDITO,@DIASCRED,@LIMCRED,@SALDO,@LISTA_PREC,@CVE_BITA,@ULT_PAGOD,@ULT_PAGOM,@ULT_PAGOF,@DESCUENTO,@ULT_VENTAD,@ULT_COMPM,@FCH_ULTCOM,@VENTAS,@CVE_VEND,@CVE_OBS,@TIPO_EMPRESA,@MATRIZ,@PROSPECTO,@CALLE_ENVIO,@NUMINT_ENVIO,@NUMEXT_ENVIO,@CRUZAMIENTOS_ENVIO,
                        @CRUZAMIENTOS_ENVIO2,@COLONIA_ENVIO,@LOCALIDAD_ENVIO,@MUNICIPIO_ENVIO,@ESTADO_ENVIO,@PAIS_ENVIO,@CODIGO_ENVIO,@CVE_ZONA_ENVIO,@REFERENCIA_ENVIO,@CUENTA_CONTABLE,@ADDENDAF,@ADDENDAD,@NAMESPACE,@METODODEPAGO,@NUMCTAPAGO,@MODELO,@DES_IMPU1,@DES_IMPU2,@DES_IMPU3,@DES_IMPU4,@DES_PER,
                        @LAT_GENERAL,@LON_GENERAL,@LAT_ENVIO,@LON_ENVIO,@UUID,@VERSION_SINC,@USO_CFDI,@CVE_PAIS_SAT,@NUMIDREGFISCAL,@FORMADEPAGOSAT,@ADDENDAG,@ADDENDAE)`
                );
                let lastSaved= await pool.request().query(`select * from CLIE${EMPRESA} where CLAVE=${client.keyClient}`);
                
                if(lastSaved.recordset.length){
                    let idCountRecord=await pool.request().query(`select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=59`);
                    let countClientRecord=await pool.request().query(`select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=0`);
                    if(idCountRecord.recordset.length){
                        let secuenceCount=+idCountRecord.recordset[0].ULT_CVE;
                        for(let i=0;i<client.contacts.length;i++){
                            secuenceCount++;
                            await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('NCONTACTO',Int,secuenceCount).input('NOMBRE',VarChar,client.contacts[i].name)
                            .input('DIRECCION',VarChar,client.contacts[i].address).input('TELEFONO',VarChar,client.contacts[i].phone).input('EMAIL',VarChar,client.contacts[i].email).input('TIPOCONTAC',VarChar,typeContact[client.contacts[i].typeContact])
                            .input('STATUS',VarChar,'A').input('USUARIO',VarChar,null).input('LAT',Int,0).input('LON',Int,0)
                            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                            .query(
                                `insert into CONTAC${EMPRESA}(CVE_CLIE,NCONTACTO,NOMBRE,DIRECCION,TELEFONO,EMAIL,TIPOCONTAC,STATUS,USUARIO,LAT,LON,UUID,VERSION_SINC) 
                                values (@CVE_CLIE,@NCONTACTO,@NOMBRE,@DIRECCION,@TELEFONO,@EMAIL,@TIPOCONTAC,@STATUS,@USUARIO,@LAT,@LON,@UUID,@VERSION_SINC)`
                            );   
                        }
                        await pool.request().query(`update TBLCONTROL${EMPRESA} set ULT_CVE=${secuenceCount} where ID_TABLA=59`);
                        await pool.request().query(`update TBLCONTROL${EMPRESA} set ULT_CVE=${(+countClientRecord.recordset[0].ULT_CVE)+1} WHERE ID_TABLA=0`);
                    }
                    await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).query(`
                        insert into CLIE_CLIB${EMPRESA}(CVE_CLIE,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6)
                        VALUES(@CVE_CLIE,null,null,null,null,null,null)
                    `);
                }
            }
        );
        await this.connection.close();
        return result;
    }*/

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
                    `insert into CLIE${EMPRESA}(CLAVE,STATUS,NOMBRE,RFC,CALLE,${(client.addressClient.intNumber!=null && client.addressClient.intNumber.toString()!="")?'NUMINT,':''}NUMEXT,CRUZAMIENTOS,CRUZAMIENTOS2,COLONIA,CODIGO,LOCALIDAD,MUNICIPIO,ESTADO,PAIS,NACIONALIDAD,REFERDIR,TELEFONO,CLASIFIC,FAX,PAG_WEB,${(client.curp!=null && client.curp!="")?'CURP,':''}CVE_ZONA,IMPRIR,MAIL,NIVELSEC,ENVIOSILEN,EMAILPRED,
                        DIAREV,DIAPAGO,CON_CREDITO,DIASCRED,LIMCRED,SALDO,LISTA_PREC,CVE_BITA,ULT_PAGOD,ULT_PAGOM,ULT_PAGOF,DESCUENTO,ULT_VENTAD,ULT_COMPM,FCH_ULTCOM,VENTAS,CVE_VEND,CVE_OBS,TIPO_EMPRESA,MATRIZ,PROSPECTO,CALLE_ENVIO,NUMINT_ENVIO,NUMEXT_ENVIO,CRUZAMIENTOS_ENVIO,
                        CRUZAMIENTOS_ENVIO2,COLONIA_ENVIO,LOCALIDAD_ENVIO,MUNICIPIO_ENVIO,ESTADO_ENVIO,PAIS_ENVIO,CODIGO_ENVIO,CVE_ZONA_ENVIO,REFERENCIA_ENVIO,CUENTA_CONTABLE,ADDENDAF,ADDENDAD,NAMESPACE,METODODEPAGO,NUMCTAPAGO,MODELO,DES_IMPU1,DES_IMPU2,DES_IMPU3,DES_IMPU4,DES_PER,
                        LAT_GENERAL,LON_GENERAL,LAT_ENVIO,LON_ENVIO,UUID,VERSION_SINC,USO_CFDI,CVE_PAIS_SAT,NUMIDREGFISCAL,FORMADEPAGOSAT,ADDENDAG,ADDENDAE) 
                        values(@CLAVE,@STATUS,@NOMBRE,@RFC,@CALLE,${(client.addressClient.intNumber!=null && client.addressClient.intNumber.toString()!="")?'@NUMINT,':''}@NUMEXT,@CRUZAMIENTOS,@CRUZAMIENTOS2,@COLONIA,@CODIGO,@LOCALIDAD,@MUNICIPIO,@ESTADO,@PAIS,@NACIONALIDAD,@REFERDIR,@TELEFONO,@CLASIFIC,@FAX,@PAG_WEB,${(client.curp!=null && client.curp!="")?'@CURP,':''}@CVE_ZONA,@IMPRIR,@MAIL,@NIVELSEC,@ENVIOSILEN,@EMAILPRED,
                        @DIAREV,@DIAPAGO,@CON_CREDITO,@DIASCRED,@LIMCRED,@SALDO,@LISTA_PREC,@CVE_BITA,@ULT_PAGOD,@ULT_PAGOM,@ULT_PAGOF,@DESCUENTO,@ULT_VENTAD,@ULT_COMPM,@FCH_ULTCOM,@VENTAS,@CVE_VEND,@CVE_OBS,@TIPO_EMPRESA,@MATRIZ,@PROSPECTO,@CALLE_ENVIO,@NUMINT_ENVIO,@NUMEXT_ENVIO,@CRUZAMIENTOS_ENVIO,
                        @CRUZAMIENTOS_ENVIO2,@COLONIA_ENVIO,@LOCALIDAD_ENVIO,@MUNICIPIO_ENVIO,@ESTADO_ENVIO,@PAIS_ENVIO,@CODIGO_ENVIO,@CVE_ZONA_ENVIO,@REFERENCIA_ENVIO,@CUENTA_CONTABLE,@ADDENDAF,@ADDENDAD,@NAMESPACE,@METODODEPAGO,@NUMCTAPAGO,@MODELO,@DES_IMPU1,@DES_IMPU2,@DES_IMPU3,@DES_IMPU4,@DES_PER,
                        @LAT_GENERAL,@LON_GENERAL,@LAT_ENVIO,@LON_ENVIO,@UUID,@VERSION_SINC,@USO_CFDI,@CVE_PAIS_SAT,@NUMIDREGFISCAL,@FORMADEPAGOSAT,@ADDENDAG,@ADDENDAE)`
                );
                let lastSaved= await pool.request().query(`select * from CLIE${EMPRESA} where CLAVE=${client.keyClient}`);
                
                if(lastSaved.recordset.length){
                    let idCountRecord=await pool.request().query(`select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=59`);
                    let countClientRecord=await pool.request().query(`select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=0`);
                    if(idCountRecord.recordset.length){
                        let secuenceCount=+idCountRecord.recordset[0].ULT_CVE;
                        if(client.contacts!=null && client.contacts.length){
                        for(let i=0;i<client.contacts.length;i++){
                            secuenceCount++;
                            await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).input('NCONTACTO',Int,secuenceCount).input('NOMBRE',VarChar,client.contacts[i].name)
                            .input('DIRECCION',VarChar,client.contacts[i].address).input('TELEFONO',VarChar,client.contacts[i].phone).input('EMAIL',VarChar,client.contacts[i].email).input('TIPOCONTAC',VarChar,typeContact[client.contacts[i].typeContact])
                            .input('STATUS',VarChar,'A').input('USUARIO',VarChar,null).input('LAT',Int,0).input('LON',Int,0)
                            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' '))
                            .query(
                                `insert into CONTAC${EMPRESA}(CVE_CLIE,NCONTACTO,NOMBRE,DIRECCION,TELEFONO,EMAIL,TIPOCONTAC,STATUS,USUARIO,LAT,LON,UUID,VERSION_SINC) 
                                values (@CVE_CLIE,@NCONTACTO,@NOMBRE,@DIRECCION,@TELEFONO,@EMAIL,@TIPOCONTAC,@STATUS,@USUARIO,@LAT,@LON,@UUID,@VERSION_SINC)`
                            );   
                        }
                    }
                        await pool.request().query(`update TBLCONTROL${EMPRESA} set ULT_CVE=${secuenceCount} where ID_TABLA=59`);
                        await pool.request().query(`update TBLCONTROL${EMPRESA} set ULT_CVE=${(+countClientRecord.recordset[0].ULT_CVE)+1} WHERE ID_TABLA=0`);
                    }
                    await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keyClient.toString().length)+`${client.keyClient}`).query(`
                        insert into CLIE_CLIB${EMPRESA}(CVE_CLIE,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6)
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
            let totalCounts=await pool.request().query(`select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=68`);
            let secuenceCount=+totalCounts.recordset[0].ULT_CVE;
            secuenceCount++;
            await pool.request().input('CVE_ALM',Int,secuenceCount).input('DESCR',VarChar,null)
            .input('DIRECCION',VarChar,"").input('ENCARGADO',VarChar,warehouseForm.description)
            .input('TELEFONO',VarChar,warehouseForm.phone).input('LISTA_PREC',Int,null).input('CUEN_CONT',VarChar,null)
            .input('CVE_MENT',Int,0).input('CVE_MSAL',Int,0).input('STATUS',VarChar,"A").input('LAT',Float,0).input('LON',Float,0)
            .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,new Date().toISOString().slice(0, 19).replace('T', ' ')).query(
                `insert into ALMACENES${EMPRESA}(CVE_ALM,DESCR,DIRECCION,ENCARGADO,TELEFONO,LISTA_PREC,CUEN_CONT,CVE_MENT,CVE_MSAL,STATUS,LAT,LON,UUID,VERSION_SINC) 
                values (@CVE_ALM,@DESCR,@DIRECCION,@ENCARGADO,@TELEFONO,@LISTA_PREC,@CUEN_CONT,@CVE_MENT,@CVE_MSAL,@STATUS,@LAT,@LON,@UUID,@VERSION_SINC)`
            );
            await pool.request().query(`update TBLCONTROL${EMPRESA} set ULT_CVE=${secuenceCount} where ID_TABLA=68`);
        });
        await this.connection.close();
    }

    async updateWarehouse(warehouseKey:string,owner:string){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            let value = await pool.request().input('CVE_ALM',Int,warehouseKey).query(
                `SELECT ENCARGADO FROM ALMACENES${EMPRESA} WHERE CVE_ALM=@CVE_ALM`
            );
            if(value.recordset.length){
                let valueToAssign=value.recordset[0].ENCARGADO+"-ASSIGNED";
                await pool.request().input('CVE_ALM',Int,warehouseKey).input('ENCARGADO',VarChar,valueToAssign)
                .query(
                    `UPDATE  ALMACENES${EMPRESA} SET ENCARGADO=@ENCARGADO WHERE CVE_ALM=@CVE_ALM`
                );
            }
        });
        await this.connection.close();
    }

    async getAllWarehouses(){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(
            `select CVE_ALM,DESCR,DIRECCION,ENCARGADO,TELEFONO FROM ALMACENES${EMPRESA} WHERE STATUS='A'`
        ));
        await this.connection.close();
        return result.recordset;
    }

    async getLinesOfProductsSae(){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().query(
                `select * from CLIN${EMPRESA} where STATUS='A'`
            );
        });
        await this.connection.close();
        return result.recordset as Array<ProductLineSae>;
    }

    async deleteLinesOfProductsSae(cve:string){
        await this.getConnection();
        await this.connection.connect().then(pool=>{
            return pool.request().query(
                `update CLIN${EMPRESA} set STATUS='B' where CVE_LIN='${cve}'`
            );
        });
        await this.connection.close();
        
    }

    // async getClientsPaginated(page:number,perPage:number){
    //     await this.getConnection();
    //     let result = await this.connection.connect().then(pool=>{
    //         return pool.request().query(
    //             `select * from CLIE06 where STATUS='A' order by CLAVE OFFSET (${page-1}*${perPage}) ROWS FETCH NEXT ${perPage} ROWS ONLY;`
    //         );
    //     });

    //     let result2 = await this.connection.connect().then(pool=>{
    //         return pool.request().query(
    //             `select count(*) as cantidad from CLIE06 where STATUS='A'`
    //         );
    //     });
    //     return{
    //         total: result2.recordset[0].cantidad,
    //         items: result.recordset as Array<ClientSAE> 
    //     }
        
    // }


    async saveProductLineSae(productLineSaeForm:ProductLineSaeForm){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_LIN',VarChar,productLineSaeForm.clave).input('DESC_LIN',VarChar,productLineSaeForm.description)
            .input('ESUNGPO',VarChar,!productLineSaeForm.grupo?'N':'S').input('CUENTA_COI',VarChar,null).input('STATUS',VarChar,'A').query(
                ` insert into CLIN${EMPRESA}(CVE_LIN,DESC_LIN,ESUNGPO,CUENTA_COI,STATUS) 
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
                `select * from CLIN${EMPRESA} where CVE_LIN=@CVE_LIN`
                )
        });
        await this.connection.close();
        return result.recordset as Array<ProductLineSae>;
    }

    async getProductLinePresentation(clave:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_ART',VarChar,clave).query(
                `select LIN_PROD from INVE${EMPRESA} where CVE_ART=@CVE_ART`
                )
        });
        await this.connection.close();
        return result.recordset;
    }

    async getProductSaeByKey(productKey:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(`select * from INVE${EMPRESA} where CVE_ART='${productKey}'`))
        await this.connection.close();
        return result.recordset;
    }
    async getProductSaeByKeyLike(productKey:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(`select * from INVE${EMPRESA} where CVE_ART LIKE '%${productKey}'`))
        await this.connection.close();
        return result.recordset;
    }

    async updateInventoryGeneralAspeSaeByProduct(keySae:string,quantity:number){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            
           let productQuery=await pool.request().input('CVE_ART',VarChar,keySae).query(`select * from INVE${EMPRESA} where CVE_ART='${keySae}'`)
           let product=productQuery.recordset[0];
           if(product.STOCK_MAX<(+product.EXIST+quantity)){
               await pool.request().input('STOCK_MAX',Float,(+product.EXIST+quantity))
               .input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE${EMPRESA} set STOCK_MAX=@STOCK_MAX,EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }else{
            await pool.request().input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }
        //    await pool.request().input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
        //     `UPDATE INVE${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
        // );
        let lastExist = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae)
        .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE CVE_ART='${keySae}' and ALMACEN=53 ORDER BY CAST(NUM_MOV as decimal) DESC;`);
        
        let lastExist2 = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae)
        .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE  ORDER BY CAST(CVE_FOLIO as decimal) DESC;`);

        let existenceByWarehouse = lastExist.recordset[0];
        let dateParse = new Date();
        let month = (dateParse.getMonth()+1).toString();
        let day = dateParse.getDate().toString();
        if(+month<10){
            month='0'+month;
        }
        if(+day<10){
            day='0'+day;
        }
        await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).input('ALMACEN',Int,53)
        .input('NUM_MOV',Int,+existenceByWarehouse.NUM_MOV+1).input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse)
        .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,`IF-${day}${month}${dateParse.getFullYear()}`).input('CLAVE_CLPV',VarChar,null)
        .input('VEND',VarChar,null).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,null)
        .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
        .input('UNI_VENTA',VarChar,existenceByWarehouse.UNI_VENTA).input('E_LTPD',Int,0).input('EXIST_G',Float,existenceByWarehouse.EXIST-product.quantity).input('EXISTENCIA',Float,existenceByWarehouse?existenceByWarehouse.EXIST-product.quantity:0)
        .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,null)
        .input('CVE_FOLIO',+lastExist2.recordset[0].CVE_FOLIO+1).input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
        .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
        .query(`
                INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                    REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                    COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                        @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                        @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
        `);

        });
        
        await this.connection.close();
    }

    
    async updateInventoryGeneralAspeSaeByProductOnlyBySeller(keySae:string,quantity:number,sellerWareheouse:number){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            
           let productQuery=await pool.request().input('CVE_ART',VarChar,keySae).query(`select * from INVE${EMPRESA} where CVE_ART='${keySae}'`)
           let product=productQuery.recordset[0];
           if(product.STOCK_MAX<(+product.EXIST+quantity)){
               await pool.request().input('STOCK_MAX',Float,(+product.EXIST+quantity))
               .input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE${EMPRESA} set STOCK_MAX=@STOCK_MAX,EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }else{
            await pool.request().input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           }
        //    await pool.request().input('EXIST',Float,(+product.EXIST+quantity)).input('CVE_ART',VarChar,keySae).query(
        //     `UPDATE INVE${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
        // );
        let lastExist = await pool.request().input('CVE_ART',VarChar,keySae)
        .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE CVE_ART='${keySae}' and ALMACEN=${sellerWareheouse} ORDER BY CAST(CVE_FOLIO as decimal) DESC;`);
        
        let lastExist2 = await pool.request().input('CVE_ART',VarChar,keySae)
        .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE  ORDER BY CAST(CVE_FOLIO as decimal) DESC;`);

        let lastExist3 = await pool.request().input('CVE_ART',VarChar,keySae)
        .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE CVE_ART='${keySae}' and ALMACEN=53 ORDER BY CAST(CVE_FOLIO as decimal) DESC;`);

        let existenceByWarehouse = lastExist.recordset[0];
        let existenceByWarehouseGeneral = lastExist3.recordset[0];
        let dateParse = new Date();
	dateParse.setHours(dateParse.getHours()-24);
        let month = (dateParse.getMonth()+1).toString();
        let day = dateParse.getDate().toString();
        if(+month<10){
            month='0'+month;
        }
        if(+day<10){
            day='0'+day;
        }
        await pool.request().input('CVE_ART',VarChar,keySae).input('ALMACEN',Int,sellerWareheouse)
        .input('NUM_MOV',Int,+existenceByWarehouse.NUM_MOV+1).input('CVE_CPTO',Int,7).input('FECHA_DOCU',DateTime,dateParse)
        .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,`IF-${day}${month}${dateParse.getFullYear()}`).input('CLAVE_CLPV',VarChar,null)
        .input('VEND',VarChar,null).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,null)
        .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
        .input('UNI_VENTA',VarChar,existenceByWarehouse.UNI_VENTA).input('E_LTPD',Int,0).input('EXIST_G',Float,existenceByWarehouse.EXIST-product.quantity).input('EXISTENCIA',Float,existenceByWarehouse?existenceByWarehouse.EXIST-product.quantity:0)
        .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,null)
        .input('CVE_FOLIO',+lastExist2.recordset[0].CVE_FOLIO+1).input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
        .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
        .query(`
                INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                    REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                    COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                        @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                        @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
        `);
        await pool.request().input('CVE_ART',VarChar,keySae).input('ALMACEN',Int,53)
        .input('NUM_MOV',Int,+existenceByWarehouseGeneral.NUM_MOV+1).input('CVE_CPTO',Int,58).input('FECHA_DOCU',DateTime,dateParse)
        .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,`IF-${day}${month}${dateParse.getFullYear()}`).input('CLAVE_CLPV',VarChar,null)
        .input('VEND',VarChar,null).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,null)
        .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
        .input('UNI_VENTA',VarChar,existenceByWarehouseGeneral.UNI_VENTA).input('E_LTPD',Int,0).input('EXIST_G',Float,existenceByWarehouseGeneral.EXIST-product.quantity).input('EXISTENCIA',Float,existenceByWarehouseGeneral?existenceByWarehouseGeneral.EXIST-product.quantity:0)
        .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,-1).input('FECHAELAB',DateTime,dateParse).input('CTLPOL',Int,null)
        .input('CVE_FOLIO',+lastExist2.recordset[0].CVE_FOLIO+2).input('SIGNO',Int,-1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
        .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
        .query(`
                INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                    REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                    COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                        @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                        @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
        `);

        });
        
        
        await this.connection.close();
    }
    

    async getWarehouseByKey(warehouseKey:number){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
            return pool.request().input('CVE_ALM',Int,warehouseKey).query(`
            select * from ALMACENES${EMPRESA} where CVE_ALM=@CVE_ALM
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
            insert into INVE_CLIB${EMPRESA}(CVE_PROD,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6) 
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
                insert into INVE${EMPRESA}(CVE_ART,DESCR,LIN_PROD,CON_SERIE,UNI_MED,UNI_EMP,CTRL_ALM,TIEM_SURT,STOCK_MIN,STOCK_MAX,TIP_COSTEO,
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
                insert into PRECIO_X_PROD${EMPRESA}(CVE_ART,CVE_PRECIO,PRECIO,UUID,VERSION_SINC) 
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
                `update INVE${EMPRESA} set DESCR=@DESCR,CVE_ESQIMPU=@CVE_ESQIMPU where CVE_ART=@CVE_ART`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_PRECIO',VarChar,1)
            .input('PRECIO',Float,presentation.pricePresentation).query(
                `update PRECIO_X_PROD${EMPRESA} set PRECIO=@PRECIO  where CVE_ART=@CVE_ART and CVE_PRECIO=@CVE_PRECIO`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('CVE_ALM',Int,presentation.warehouseKey)
            .query(
                `update MULT${EMPRESA} set CVE_ALM=@CVE_ALM where CVE_ART=@CVE_ART`
            );

            await pool.request().input('CVE_ART',VarChar,codeSae).input('ALMACEN',Int,presentation.warehouseKey)
            .query(
                `update MINVE${EMPRESA} set ALMACEN=@ALMACEN where CVE_ART=@CVE_ART`
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
                insert into INVE_CLIB${EMPRESA}(CVE_PROD,CAMPLIB1,CAMPLIB2,CAMPLIB3,CAMPLIB4,CAMPLIB5,CAMPLIB6) 
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
                    insert into INVE${EMPRESA}(CVE_ART,DESCR,LIN_PROD,CON_SERIE,UNI_MED,UNI_EMP,CTRL_ALM,TIEM_SURT,STOCK_MIN,STOCK_MAX,TIP_COSTEO,
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
                    insert into PRECIO_X_PROD${EMPRESA}(CVE_ART,CVE_PRECIO,PRECIO,UUID,VERSION_SINC) 
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
            return pool.request().input('CVE_VEND',VarChar,' '.repeat(5-keySeller.toString().length)+keySeller.toString()).query(
                `select * from VEND${EMPRESA} where STATUS='A' and CVE_VEND=@CVE_VEND`
                );
        })
        await this.connection.close();
        return result;
    }

    async getTaxSchemeById(taxScheme:number){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>{
            return pool.request().input('CVE_ESQIMPU',Int,taxScheme).query(
                `SELECT * FROM IMPU${EMPRESA} WHERE CVE_ESQIMPU=@CVE_ESQIMPU`
            );
        });
        await this.connection.close();
        return result;
    }

    async getLastFolioCount(){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{
            let foliosP = await pool.request().query(
                `
                select top 1 * from FACTP_CLIB${EMPRESA} ORDER BY CLAVE_DOC DESC
                `);
            let foliosR = await pool.request().query(
                    `
                    select top 1 * from FACTR_CLIB${EMPRESA} ORDER BY CLAVE_DOC DESC
            `);

            let foliosV = await pool.request().query(
                `
                select top 1 * from FACTV_CLIB${EMPRESA} ORDER BY CLAVE_DOC DESC
        `);

               let folioPCount= +foliosP.recordset[0].CLAVE_DOC;
               let folioRCount=+foliosR.recordset[0].CLAVE_DOC;
               let folioVCount=+foliosV.recordset[0].CLAVE_DOC;
               if(folioPCount>folioRCount && folioPCount>folioVCount){
                   return folioPCount;
               }else if(folioRCount>folioPCount && folioRCount>folioVCount){
                    return folioRCount;
               }else if(folioVCount>folioRCount && folioVCount>folioPCount){
                    return folioVCount;
               }else{
                   return 0;
               }
        })
        
    await this.connection.close();
    return {folio:result};
    }

    async checkIfSaleAlreadyExist(folio:string,date:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.request().query(
                `
                select * FROM FACTV${EMPRESA} WHERE CVE_DOC='${folio}' and FECHA_DOC BETWEEN '${date}' and '${date}'
                `
            )
        );
        return result.recordset;
    }

    async deleteSaeSale(folio:string){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
            await pool.query(`DELETE FROM PAR_FACTV_CLIB${EMPRESA} WHERE CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM PAR_FACTV${EMPRESA} WHERE CVE_DOC='${folio}';`);
                await pool.query(`DELETE FROM PAR_FACTR_CLIB${EMPRESA} WHERE  CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM PAR_FACTR${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM PAR_FACTP_CLIB${EMPRESA} WHERE CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM PAR_FACTP${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM MINVE${EMPRESA} WHERE REFER='${folio}';`);
               await pool.query(`DELETE FROM FACTV_CLIB${EMPRESA} WHERE CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM FACTV${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM FACTR_CLIB${EMPRESA} WHERE CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM FACTR${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM FACTP_CLIB${EMPRESA} WHERE CLAVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM FACTP${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM DOCTOSIGF${EMPRESA} WHERE CVE_DOC='${folio}';`);
               await pool.query(`DELETE FROM CUEN_M${EMPRESA} WHERE REFER='${folio}';`);
               await pool.query(`DELETE FROM CUEN_DET${EMPRESA} WHERE REFER='${folio}';`);
               await pool.query(`DELETE FROM BITA${EMPRESA} WHERE OBSERVACIONES LIKE '% ${folio} ]%';`);
        })
    }

    async transferWarehouseEntranceLikeRemission(orderSeller:OrderSellerInterface){
        await this.getConnection2();
        await this.connection2.connect().then(async(pool)=>{
            let date = new Date(orderSeller.dateAttended);
                
            let month = (date.getMonth()+1).toString();
            let day = date.getDate().toString();
            if(+month<10){
                month="0"+month;
            }
            if(+day<10){
                day="0"+day
            }
            let dateParse=date.getFullYear()+"-"+month+"-"+day+" 00:00:00:000";
            let dateParse2=date.getFullYear()+"-"+month+"-"+day+" 00:00:00:000";
            let countOrder = await pool.request().query(`select * from TBLCONTROL${EMPRESA2} where ID_TABLA=32`);
            let countFolio = ((countOrder.recordset as Array<{ID_TABLA:number,ULT_CVE:number}>)[0].ULT_CVE+1).toString();
            
            let foliosBita = await pool.request().query(
                `
                SELECT ULT_CVE FROM TBLCONTROL${EMPRESA2} WHERE ID_TABLA=62
                `
            );
            
            
            let foliocount:any ='0'.repeat(10-(orderSeller.folioRemission.toString().length))+`${orderSeller.folioRemission}`;
            let foliocountNumber:number = orderSeller.folioRemission;   
            let foliocountBita = (foliosBita.recordset.length)?+foliosBita.recordset[0].ULT_CVE+1:1
            let keySaeSeller = ' '.repeat(5-orderSeller.saeKey.length)+`${orderSeller.saeKey}`;
            let clienteEntityRecords = await pool.request().query(`SELECT * FROM CLIE${EMPRESA2} WHERE CLAVE='${orderSeller.clientCode}'`);
            let clientEntity = clienteEntityRecords.recordset[0];
            let warehouseId=orderSeller.warehouseCode;
            
           
            ////////////////remisiones
           
            // console.log(`insertando FACTR${EMPRESA}`);
            
            // await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,' '.repeat(10)+`${foliocount}`).input('CVE_CLPV',VarChar,orderSeller.clientCode)
            // .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,'').input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
            // .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,orderSeller.amount)
            // .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
            // .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
            // .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
            // .input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,orderSeller.amount).input('RFC',VarChar,clientEntity.RFC).input('CTLPOL',Int,0)
            // .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocountNumber).input('AUTOANIO',VarChar,'')
            // .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,foliocountBita).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'')
            // .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,orderSeller.amount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
            // .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,'V').input('DOC_SIG',VarChar,'')
            // .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).input('FORMADEPAGOSAT',VarChar,'').input('USO_CFDI',VarChar,null)
            // .query(
            //     `
            //     INSERT INTO FACTR${EMPRESA}(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
            //         IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
            //         CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
            //         TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
            //         VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
            //             @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
            //             @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
            //             @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
            //     `
            // );
            // console.log(`Insertando BITA${EMPRESA} FACTR${EMPRESA}`);
            // await pool.request().input('CVE_BITA',Int,(' '.repeat(10-(foliocountBita).toString().length)+foliocountBita.toString())).input('CVE_CLIE',VarChar,orderSeller.clientCode).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    3')
            //     .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No. [ ${foliocount} ] $ ${orderSeller.amount.toFixed(6)}`).input('STATUS',VarChar,'F')
            //     .input('NOM_USUARIO',VarChar,'Administrador').query(
            //         `insert into BITA${EMPRESA}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
            //         VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
            //     );
            //     console.log(`Insertando FACTR_CLIB${EMPRESA}`);
            //     await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
            //     insert into FACTR_CLIB${EMPRESA}(CLAVE_DOC) VALUES(@CLAVE_DOC)
            // `);
            // console.log(`Insertando TBLCONTROL${EMPRESA} BITA`);
            // await pool.request().query(`
            // update TBLCONTROL${EMPRESA} set ULT_CVE=${foliocountBita}  WHERE ID_TABLA=62
            // `);
                    
            // await pool.request().input('ULT_DOC',VarChar,' '.repeat(10-(+foliocountBita).toString().length)+(+foliocount).toString()).input('TIP_DOC',VarChar,'R')
            // .query(`
            //     UPDATE FOLIOSF${EMPRESA} SET ULT_DOC=@ULT_DOC WHERE TIP_DOC=@TIP_DOC;
            // `);

            // DESDE REMISION DE MUEVE EN MINVE06 COMO QUITAR PRODUCTO
            //CVP_T0 = 51 TIPO_DOC=R REFER = <FOLIO> CLAVE_CLPV = <ID DE REGISTRO DE PEDIDO VINCULADO>, VEND=<CLAVE VENDEDOR>
            // DESDE_INVE=NM SIGNO=-1,CVE_FOLIO=<CONTADOR DE BITA01>
            //FALTA QUERY

            ////////////////ventas
        
            console.log(`Insertando FACTR${EMPRESA2}`);
            console.log(`${dateParse}`);
            console.log(`${dateParse2}`);
            let amountBySale = orderSeller.amount;
            let imp1Total =0; // iva
            let imp2Total =0; // ieps
            for(let subSale of orderSeller.subOrders){
                
                let esqImp = subSale.esqImp;
                let amount = subSale.amount;
                let quantity = subSale.quantity;
                let singleAmountByProduct = (amount/quantity);
                let imp1=0; // iva
                let imp2=0; // ieps
                switch(esqImp){
                    case 1:
                            imp1=this.extractIva(singleAmountByProduct);
                        break;
                    case 4:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),8);
                        break;
                    case 5:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),25);
                        break;
                    case 6:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),50);
                        break;
                }
                imp1Total+=(imp1*quantity);
                imp2Total+=(imp2*quantity);
            }
            let firstPayment =orderSeller.amount;
            let typePayment = "P01";
            firstPayment=0;
            
            
            //foliocountBita++;
            let contado='N';
            let paymentoForm ='';
            
            
            await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,' '.repeat(10)+`${foliocount}`).input('CVE_CLPV',VarChar,' '.repeat(10-orderSeller.clientCode.length)+`${orderSeller.clientCode}`)
            .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,' '.repeat(5-keySaeSeller.length)+keySaeSeller).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',VarChar,dateParse)
            .input('FECHA_ENT',VarChar,dateParse).input('FECHA_VEN',VarChar,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,(amountBySale-(imp1Total+imp2Total)))
            .input('IMP_TOT1',Float,imp2Total).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,imp1Total).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
            .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
            .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
            .input('NUM_PAGOS',Int,1).input('FECHAELAB',VarChar,dateParse).input('PRIMERPAGO',Float,firstPayment).input('RFC',VarChar,clientEntity.RFC).input('CTLPOL',Int,0)
            .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocountNumber).input('AUTOANIO',VarChar,'')
            .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,contado).input('CVE_BITA',foliocountBita).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,null)
            .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,amountBySale).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
            .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,null).input('DOC_SIG',VarChar,null)
            .input('UUID',VarChar,v4().toUpperCase()).input('VERSION_SINC',VarChar,dateParse2).input('FORMADEPAGOSAT',VarChar,paymentoForm).input('USO_CFDI',VarChar,typePayment)
            .query(
                `
                INSERT INTO FACTR${EMPRESA2}(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
                    IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
                    CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
                    TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
                    VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
                        @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
                        @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
                        @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                `
            );
            console.log(`Insertando BITA${EMPRESA2} FACTV${EMPRESA2}`);
            await pool.request().input('CVE_BITA',Int,foliocountBita).input('CVE_CLIE',VarChar,orderSeller.clientCode).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    3')
                .input('FECHAHORA',VarChar,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No. [           ${foliocount} ] $ ${(amountBySale).toFixed(6)}`).input('STATUS',VarChar,'F')
                .input('NOM_USUARIO',VarChar,'Administrador').query(
                    `insert into BITA${EMPRESA2}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                    VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                );
                    console.log(`Insertando FACV_CLIB${EMPRESA2}`);
                await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                insert into FACTR_CLIB${EMPRESA2}(CLAVE_DOC) VALUES(@CLAVE_DOC)
            `);
                    console.log(`Insertando TBLCONTROL${EMPRESA2} BITA`);
            await pool.request().query(`
            update TBLCONTROL${EMPRESA2} set ULT_CVE=${foliocountBita} WHERE ID_TABLA=62
            `);
            // await pool.request().input('ULT_DOC',VarChar,' '.repeat(10-(+foliocountBita).toString().length)+(+foliocount).toString()).input('TIP_DOC',VarChar,'V')
            // .query(`
            //     UPDATE FOLIOSF${EMPRESA} SET ULT_DOC=@ULT_DOC WHERE TIP_DOC=@TIP_DOC;
            // `);
                
            //////////////////////////////
            let newDate = new Date(orderSeller.dateAttended);

            ////////////////////////////////AFACT01
            console.log(`Actualizando AFACT${EMPRESA2} INSERTANTO VALORES DE VENTA`);
            let afactRecord = await pool.request().query(
                `select * from AFACT${EMPRESA2} WHERE PER_ACUM BETWEEN '${newDate.getFullYear()}${month}01' and '${newDate.getFullYear()}${month}02'`
            );
            if(afactRecord.recordset.length){
                await pool.request().input('PER_ACUM',DateTime,`${newDate.getFullYear()}-${month}-01 00:00:00.000`)
                .input('RVTA_COM',Float,+afactRecord.recordset[0].RVTA_COM+orderSeller.amount).input('VVTA_COM',Float,+afactRecord.recordset[0].VVTA_COM+orderSeller.amount)
                .query(
                    `
                    update AFACT${EMPRESA2} set RVTA_COM=@RVTA_COM,VVTA_COM=@VVTA_COM where PER_ACUM=@PER_ACUM
                    `
                );
            }else{
                let afactRecord2 = await pool.request().query(
                    `select * from AFACT${EMPRESA2}`
                );
                await pool.request().input('CVE_AFACT',Int,afactRecord2.recordset.length+1)
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
                    INSERT INTO AFACT${EMPRESA2} (CVE_AFACT, FVTA_COM, FDESCTO, FDES_FIN, FIMP, FCOMI, RVTA_COM, RDESCTO, RDES_FIN, RIMP, RCOMI, DVTA_COM, DDESCTO, DDES_FIN,
                         DIMP, DCOMI, PVTA_COM, PDESCTO, PDES_FIN, PIMP, PCOMI, CVTA_COM, CDESCTO, CDES_FIN, CIMP, CCOMI, VVTA_COM, VDESCTO, VDES_FIN, VIMP, VCOMI, 
                         WVTA_COM, WDESCTO, WDES_FIN, WIMP, WCOMI, PER_ACUM, EVTA_COM, EDESCTO, EDES_FIN, EIMP, ECOMI) 
                         VALUES(@CVE_AFACT, @FVTA_COM, @FDESCTO, @FDES_FIN, @FIMP, @FCOMI, @RVTA_COM, @RDESCTO, @RDES_FIN, @RIMP, @RCOMI, @DVTA_COM, @DDESCTO, @DDES_FIN,
                            @DIMP, @DCOMI, @PVTA_COM, @PDESCTO, @PDES_FIN, @PIMP, @PCOMI, @CVTA_COM, @CDESCTO, @CDES_FIN, @CIMP, @CCOMI, @VVTA_COM, @VDESCTO, @VDES_FIN, @VIMP, @VCOMI, 
                            @WVTA_COM, @WDESCTO, @WDES_FIN, @WIMP, @WCOMI, @PER_ACUM, @EVTA_COM, @EDESCTO, @EDES_FIN, @EIMP, @ECOMI)
                    `
                );
            }
            
       

            console.log("insertando subventas");
            for(let i=0;i<orderSeller.subOrders.length;i++){
                let product = orderSeller.subOrders[i];
                
                let numMovResult = await pool.request().query(
                    `
                    SELECT ULT_CVE FROM TBLCONTROL${EMPRESA2} WHERE ID_TABLA=44
                    `
                );
                let numMov = (+numMovResult.recordset[0].ULT_CVE)+1;
                let imp1=0; // IVA
                let imp2=0; // IEPS
                let singleAmountByProduct = product.amount/product.quantity;
                
                switch(product.esqImp){
                    case 1:
                        imp1 = this.extractIva(singleAmountByProduct);
                        break;
                    case 4:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),8);
                        break;
                    case 5:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),25);
                        break;
                    case 6:
                            imp1=this.extractIva(singleAmountByProduct);
                            imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),50);
                        break;
                }
                singleAmountByProduct=singleAmountByProduct-(imp1+imp2);
                if(product.typeProduct=="ABARROTES"){
                    product.presentationCode=product.presentationCodeAltern;
                    product.quantity=product.quantity*product.quantityByAbarrotes;
                }
                console.log("Obteniendo ultimas existencias del producto: "+product.presentationCode);
                ///////////////// PARTES DE LA REMISSION
                console.log(`Insertando PAR_FACTR${EMPRESA2}`);
                let impu01=0;
                let impu04=0;
                let impua1pla=6;
                let impua4pla=6;
                
                switch(product.esqImp){
                    case 1:
                        impu01=0;
                        impu04=16;
                        impua1pla=6;
                        impua4pla=0;
                        
                        break;
                    case 3:
                        impua4pla=4;
                        break;
                    case 4:
                        impu01=8;
                        impu04=16;
                        impua1pla=0;
                        impua4pla=1;
                        
                        break;
                    case 5:
                        impu01=25;
                        impu04=16;
                        impua1pla=0;
                        impua4pla=1;
                        
                        break;
                    case 6:
                        impu01=50;
                        impu04=16;
                        impua1pla=0;
                        impua4pla=1;
                        break;
                }
                imp1=imp1*product.quantity;
                imp2=imp2*product.quantity;
                
                await pool.request().input('CVE_DOC',VarChar,' '.repeat(10)+`${foliocount}`).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentationCode).input('CANT',Float,product.quantity).input('PXS',Float,product.quantity)
                .input('PREC',Float,singleAmountByProduct).input('COST',Float,0).input('IMPU1',Float,impu01).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,impu04)
                .input('IMP1APLA',Float,impua1pla).input('IMP2APLA',Float,6).input('IMP3APLA',Float,6).input('IMP4APLA',Float,impua4pla).input('TOTIMP1',Float,imp2)
                .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,imp1).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,0)
                .input('ACT_INV',VarChar,'S').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,product.uniMed).input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,numMov).input('TOT_PARTIDA',Float,(product.amount-((imp1)+(imp2)))).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',product.esqImp).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4().toUpperCase()).input('VERSION_SINC',DateTime,dateParse2).query(
                    `
                    insert into PAR_FACTR${EMPRESA2}(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                        ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                        APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                        (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                            ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                            @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                    `
                );
                console.log(`Insertando PAR_FACTV_CLIB${EMPRESA2}`);
                await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                    `insert into PAR_FACTR_CLIB${EMPRESA2}(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                );
            console.log(`Insertando en INVE${EMPRESA2}`);
            let inve01 = await pool.request().input('CVE_ART',VarChar,product.presentationCode).query(`
            SELECT EXIST,UNI_MED FROM INVE${EMPRESA2} WHERE CVE_ART=@CVE_ART
            `)
            console.log(`Insertando en MINVE${EMPRESA2}`);
            let productInMultiwarehouse= await pool.request().input('CVE_ART',VarChar,product.presentationCode).query(
                `SELECT * FROM MULT${EMPRESA2} WHERE CVE_ART=@CVE_ART`
                );
            let multiwarehouse= productInMultiwarehouse.recordset[0];
            
                await pool.request().input('CVE_ART',VarChar,product.presentationCode).input('ALMACEN',Int,warehouseId)
                .input('NUM_MOV',Int,numMov).input('CVE_CPTO',Int,51).input('FECHA_DOCU',VarChar,dateParse)
                .input('TIPO_DOC',VarChar,'R').input('REFER',VarChar,' '.repeat(10)+`${foliocount}`).input('CLAVE_CLPV',VarChar,orderSeller.clientCode )
                .input('VEND',VarChar,'').input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,singleAmountByProduct)
                .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
                .input('UNI_VENTA',VarChar,inve01.recordset[0].UNI_MED).input('E_LTPD',Int,0).input('EXIST_G',Float,inve01.recordset[0].EXIST).input('EXISTENCIA',Float,multiwarehouse.EXIST)
                .input('TIPO_PROD',VarChar,null).input('FACTOR_CON',Int,1).input('FECHAELAB',VarChar,dateParse).input('CTLPOL',Int,null)
                .input('CVE_FOLIO',VarChar,countFolio.toString()).input('SIGNO',Int,-1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
                .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'N').input('MOV_ENLAZADO',Int,0)
                .query(`
                        INSERT INTO MINVE${EMPRESA2}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                            REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                            COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                                @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                                @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                `);
                console.log(`ACTUALIZANDO TBLCONTROL${EMPRESA2} ID_TABLA=44`);
                await pool.request().query(`
                UPDATE TBLCONTROL${EMPRESA2} set ULT_CVE=${numMov} WHERE ID_TABLA=44
                `);

                console.log("Removiendo de almacen de vendedor");
                
                await pool.connect();    
            }
            let doctoSig = await pool.request().query(
                `
                select top 1 * from MINVE${EMPRESA2} WHERE ISNUMERIC(CVE_FOLIO)=1 ORDER BY CAST(CVE_FOLIO AS DECIMAL) DESC
                `
                );
            let tipDocCount=doctoSig.recordset[0].CVE_FOLIO;
            await pool.request().input('ULT_CVE',Int,+tipDocCount).input('ID_TABLA',Int,32)
            .query(`
                UPDATE TBLCONTROL${EMPRESA2} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=@ID_TABLA
            `);
            let minve = await pool.request().query(
                `
                select top 1 * from MINVE${EMPRESA2}  ORDER BY CAST(NUM_MOV AS DECIMAL) DESC
                `
                );
            let minveCount=minve.recordset[0].NUM_MOV;
            await pool.request().input('ULT_CVE',Int,+minveCount).input('ID_TABLA',Int,44)
            .query(`
                UPDATE TBLCONTROL${EMPRESA2} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=@ID_TABLA
            `);
            await pool.request().query(
                `
                UPDATE FOLIOSF${EMPRESA2} SET ULT_DOC=${orderSeller.folioRemission} WHERE TIP_DOC='R'
                `
            );
            return foliocount;

        }
    );
    await this.connection2.close();
    return result;            
        
    }

    async createSaleSae(saleRequestForm:Sale){
        await this.getConnection();
        let result = await this.connection.connect().then(async(pool)=>{

                let date = new Date(saleRequestForm.date);
                
                let month = (date.getMonth()+1).toString();
                let day = date.getDate().toString();
                if(+month<10){
                    month="0"+month;
                }
                if(+day<10){
                    day="0"+day
                }
                let dateParse=date.getFullYear()+"-"+month+"-"+day+" 00:00:00:000";
                let dateParse2=date.getFullYear()+"-"+month+"-"+day+" 00:00:00:000";
                let countOrder = await pool.request().query(`select * from TBLCONTROL${EMPRESA} where ID_TABLA=32`);
                let countFolio = ((countOrder.recordset as Array<{ID_TABLA:number,ULT_CVE:number}>)[0].ULT_CVE+1).toString();
                // let folios = await pool.request().query(
                //         `
                //         select  * from FOLIOSF${EMPRESA} WHERE TIP_DOC='R'
                //         `
                // );// de FACTP A FACTV YA QUE VENTAS ES LO MAS ACTUALIZADO
                // let folios2 = await pool.request().query(
                //     `
                //     select  * from FOLIOSF${EMPRESA} WHERE TIP_DOC='V'
                //     `
                // );
                // if(folios2.recordset[0].ULT_DOC>folios.recordset[0].ULT_DOC){
                //     folios = folios2;
                // }
                let foliosBita = await pool.request().query(
                    `
                    SELECT ULT_CVE FROM TBLCONTROL${EMPRESA} WHERE ID_TABLA=62
                    `
                );
                
                //let totalSaleAmount = saleRequestForm.subSales.map(x=>x.amount).reduce((a,b)=>a+b,0);
                
                //let esquimpu= await pool.request().input('CVE_ESQUIMPU',VarChar,).query(`select * from IMPU01 where CVE_ESQUIMPU=`);
                //let newFolio=+folios.recordset[0].ULT_DOC+1;
                let foliocount:any =saleRequestForm.folioTemp;
                let foliocountNumber:number = +(saleRequestForm.folioTemp.replace(saleRequestForm.seller.cve,""));   
                let foliocountBita = (foliosBita.recordset.length)?+foliosBita.recordset[0].ULT_CVE+1:1
                let client = saleRequestForm.client;
                let seller = saleRequestForm.seller;
                let warehouseId=saleRequestForm.seller.warehouseKeySae;
                
                ////////////////////////////////pedidos
                /*await pool.request().input('TIP_DOC',VarChar,'P').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-client.keyClient.toString().length)+client.keyClient)
                        .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,' '.repeat(5-seller.saeKey.toString().length)+seller.saeKey).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                        .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,totalSaleAmount)
                        .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0).input('COM_TOT',Float,0)
                        .input('CONDICION',VarChar,null).input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S').input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'T').input('TIP_DOC_E',VarChar,'R')
                        .input('NUM_MONED',Int,1).input('TIPCAMB',Float,1).input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,(saleRequestForm.status)?0:totalSaleAmount).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0).input('ESCFD',VarChar,'N')
                        .input('AUTORIZA',Int,1).input('SERIE',VarChar,'').input('FOLIO',Int,+foliocount).input('AUTOANIO',VarChar,'').input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,foliocountBita)
                        .input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'').input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,totalSaleAmount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,null)
                        .input('NUMCTAPAGO',VarChar,null).input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,null).input('DOC_SIG',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2)
                        .input('FORMADEPAGOSAT',VarChar,null).input('USO_CFDI',VarChar,null).query(
                    `
                        insert into FACTP${EMPRESA}(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,
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
                .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No. [ ${foliocount} ] $ ${totalSaleAmount.toFixed(6)}`).input('STATUS',VarChar,'F')
                .input('NOM_USUARIO',VarChar,'Administrador').query(
                    `insert into BITA${EMPRESA}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                     VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                );
                console.log("inserto venta 2");
               
                await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                insert into FACTP_CLIB${EMPRESA}(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                
                await pool.request().input('ULT_DOC',VarChar,' '.repeat(10-(+foliocountBita).toString().length)+(+foliocount).toString()).input('TIP_DOC',VarChar,'P')
                .query(`
                    UPDATE FOLIOSF${EMPRESA} SET ULT_DOC=@ULT_DOC WHERE TIP_DOC=@TIP_DOC;
                `);*/
                ////////////////remisiones
               /*
                console.log(`insertando FACTR${EMPRESA}`);
                
                await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString())
                .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,' '.repeat(5-seller.saeKey.toString().length)+seller.saeKey.toString()).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',DateTime,dateParse)
                .input('FECHA_ENT',DateTime,dateParse).input('FECHA_VEN',DateTime,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,totalSaleAmount)
                .input('IMP_TOT1',Float,0).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,0).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
                .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
                .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
                .input('NUM_PAGOS',Int,1).input('FECHAELAB',DateTime,dateParse).input('PRIMERPAGO',Float,totalSaleAmount).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0)
                .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,seller.cve).input('FOLIO',Int,+foliocountNumber).input('AUTOANIO',VarChar,'')
                .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,'N').input('CVE_BITA',Int,foliocountBita).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'')
                .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,totalSaleAmount).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
                .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,'V').input('DOC_SIG',VarChar,foliocount)
                .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).input('FORMADEPAGOSAT',VarChar,'').input('USO_CFDI',VarChar,null)
                .query(
                    `
                    INSERT INTO FACTR${EMPRESA}(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
                        IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
                        CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
                        TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
                        VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
                            @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
                            @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
                            @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                    `
                );
                console.log(`Insertando BITA${EMPRESA} FACTR${EMPRESA}`);
                await pool.request().input('CVE_BITA',Int,(' '.repeat(10-(foliocountBita).toString().length)+foliocountBita.toString())).input('CVE_CLIE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString()).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    3')
                    .input('FECHAHORA',DateTime,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No. [ ${foliocount} ] $ ${totalSaleAmount.toFixed(6)}`).input('STATUS',VarChar,'F')
                    .input('NOM_USUARIO',VarChar,'Administrador').query(
                        `insert into BITA${EMPRESA}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                        VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                    );
                    console.log(`Insertando FACTR_CLIB${EMPRESA}`);
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                    insert into FACTR_CLIB${EMPRESA}(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                console.log(`Insertando TBLCONTROL${EMPRESA} BITA`);
                await pool.request().query(`
                update TBLCONTROL${EMPRESA} set ULT_CVE=${foliocountBita}  WHERE ID_TABLA=62
                `);
                        */
                // await pool.request().input('ULT_DOC',VarChar,' '.repeat(10-(+foliocountBita).toString().length)+(+foliocount).toString()).input('TIP_DOC',VarChar,'R')
                // .query(`
                //     UPDATE FOLIOSF${EMPRESA} SET ULT_DOC=@ULT_DOC WHERE TIP_DOC=@TIP_DOC;
                // `);

                // DESDE REMISION DE MUEVE EN MINVE06 COMO QUITAR PRODUCTO
                //CVP_T0 = 51 TIPO_DOC=R REFER = <FOLIO> CLAVE_CLPV = <ID DE REGISTRO DE PEDIDO VINCULADO>, VEND=<CLAVE VENDEDOR>
                // DESDE_INVE=NM SIGNO=-1,CVE_FOLIO=<CONTADOR DE BITA01>
                //FALTA QUERY

                ////////////////ventas
            
                console.log(`Insertando FACTV${EMPRESA}`);
		console.log(`${dateParse}`);
		console.log(`${dateParse2}`);
                let amountBySale = saleRequestForm.amount;
                let imp1Total =0; // iva
                let imp2Total =0; // ieps
                for(let subSale of saleRequestForm.subSales){
                    
                    let esqImp = subSale.presentation.esqKey;
                    let amount = subSale.amount;
                    let quantity = subSale.quantity;
                    let singleAmountByProduct = (amount/quantity);
                    let imp1=0; // iva
                    let imp2=0; // ieps
                    switch(esqImp){
                        case 1:
                                imp1=this.extractIva(singleAmountByProduct);
                            break;
                        case 4:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),8);
                            break;
                        case 5:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),25);
                            break;
                        case 6:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),50);
                            break;
                    }
                    imp1Total+=(imp1*quantity);
                    imp2Total+=(imp2*quantity);
                }
                let firstPayment =saleRequestForm.amount;
                let typePayment = "P01";
                if(saleRequestForm.typeSale.toUpperCase()=="CREDITO"){
                    firstPayment=0;
                    let clientSae = await pool.request().input('CLAVE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString()).query(`
                        SELECT * FROM CLIE${EMPRESA} WHERE CLAVE=@CLAVE
                    `);
                    let limit = clientSae.recordset[0].LIMCRED;
                    let observations= `Límit de crédito = $`+limit;
                    await pool.request().input('CVE_BITA',Int,foliocountBita).input('CVE_CLIE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString()).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'    1')
                    .input('FECHAHORA',VarChar,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,observations).input('STATUS',VarChar,'F')
                    .input('NOM_USUARIO',VarChar,'Administrador').query(
                        `insert into BITA${EMPRESA}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                        VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                    );
                    foliocountBita++;
                }
                
                //foliocountBita++;
                let contado='S';
                let paymentoForm ='01';
                let typeSale =saleRequestForm.typeSale.toLocaleUpperCase();
                switch(typeSale){
                    case "CONTADO":
                            contado='S';
                            paymentoForm='01';
                        break;
                    case "CREDITO":
                            contado='N';
                            paymentoForm='99';
                        break;
                    case 'CHEQUE':
                            contado='S'
                            paymentoForm='';
                        break;
                    case 'TRANSFERENCIA':
                            contado='S';
                            paymentoForm='';
                        break;
                }
                
                await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,foliocount).input('CVE_CLPV',VarChar,' '.repeat(10-(client.keySaeNew.toString().length))+client.keySaeNew.toString())
                .input('STATUS',VarChar,'E').input('DAT_MOSTR',Int,0).input('CVE_VEND',VarChar,(' '.repeat(5-seller.saeKey.toString().length)+seller.saeKey.toString())).input('CVE_PEDI',VarChar,'').input('FECHA_DOC',VarChar,dateParse)
                .input('FECHA_ENT',VarChar,dateParse).input('FECHA_VEN',VarChar,dateParse).input('FECHA_CANCELA',DateTime,null).input('CAN_TOT',Float,(amountBySale-(imp1Total+imp2Total)))
                .input('IMP_TOT1',Float,imp2Total).input('IMP_TOT2',Float,0).input('IMP_TOT3',Float,0).input('IMP_TOT4',Float,imp1Total).input('DES_TOT',Float,0).input('DES_FIN',Float,0)
                .input('COM_TOT',Float,0).input('CONDICION',VarChar,'').input('CVE_OBS',Int,0).input('NUM_ALMA',Int,warehouseId).input('ACT_CXC',VarChar,'S')
                .input('ACT_COI',VarChar,'N').input('ENLAZADO',VarChar,'O').input('TIP_DOC_E',VarChar,'O').input('NUM_MONED',Int,1).input('TIPCAMB',Float,1)
                .input('NUM_PAGOS',Int,1).input('FECHAELAB',VarChar,dateParse).input('PRIMERPAGO',Float,firstPayment).input('RFC',VarChar,client.rfc).input('CTLPOL',Int,0)
                .input('ESCFD',VarChar,'N').input('AUTORIZA',Int,1).input('SERIE',VarChar,seller.cve).input('FOLIO',Int,+foliocountNumber).input('AUTOANIO',VarChar,'')
                .input('DAT_ENVIO',Int,0).input('CONTADO',VarChar,contado).input('CVE_BITA',foliocountBita).input('BLOQ',VarChar,'N').input('FORMAENVIO',VarChar,'I')
                .input('DES_FIN_PORC',Float,0).input('DES_TOT_PORC',Float,0).input('IMPORTE',Float,amountBySale).input('COM_TOT_PORC',Float,0).input('METODODEPAGO',VarChar,'PPD')
                .input('NUMCTAPAGO',VarChar,'').input('TIP_DOC_ANT',VarChar,'').input('DOC_ANT',VarChar,'').input('TIP_DOC_SIG',VarChar,null).input('DOC_SIG',VarChar,null)
                .input('UUID',VarChar,v4().toUpperCase()).input('VERSION_SINC',VarChar,dateParse2).input('FORMADEPAGOSAT',VarChar,paymentoForm).input('USO_CFDI',VarChar,typePayment)
                .query(
                    `
                    INSERT INTO FACTV${EMPRESA}(TIP_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND,CVE_PEDI,FECHA_DOC,FECHA_ENT,FECHA_VEN,FECHA_CANCELA,CAN_TOT,IMP_TOT1,IMP_TOT2,
                        IMP_TOT3,IMP_TOT4,DES_TOT,DES_FIN,COM_TOT,CONDICION,CVE_OBS,NUM_ALMA,ACT_CXC,ACT_COI,ENLAZADO,TIP_DOC_E,NUM_MONED,TIPCAMB,NUM_PAGOS,FECHAELAB,PRIMERPAGO,RFC,
                        CTLPOL,ESCFD,AUTORIZA,SERIE,FOLIO,AUTOANIO,DAT_ENVIO,CONTADO,CVE_BITA,BLOQ,FORMAENVIO,DES_FIN_PORC,DES_TOT_PORC,IMPORTE,COM_TOT_PORC,METODODEPAGO,NUMCTAPAGO,
                        TIP_DOC_ANT,DOC_ANT,TIP_DOC_SIG,DOC_SIG,UUID,VERSION_SINC,FORMADEPAGOSAT,USO_CFDI) 
                        VALUES(@TIP_DOC,@CVE_DOC,@CVE_CLPV,@STATUS,@DAT_MOSTR,@CVE_VEND,@CVE_PEDI,@FECHA_DOC,@FECHA_ENT,@FECHA_VEN,@FECHA_CANCELA,@CAN_TOT,@IMP_TOT1,@IMP_TOT2,
                            @IMP_TOT3,@IMP_TOT4,@DES_TOT,@DES_FIN,@COM_TOT,@CONDICION,@CVE_OBS,@NUM_ALMA,@ACT_CXC,@ACT_COI,@ENLAZADO,@TIP_DOC_E,@NUM_MONED,@TIPCAMB,@NUM_PAGOS,@FECHAELAB,@PRIMERPAGO,@RFC,
                            @CTLPOL,@ESCFD,@AUTORIZA,@SERIE,@FOLIO,@AUTOANIO,@DAT_ENVIO,@CONTADO,@CVE_BITA,@BLOQ,@FORMAENVIO,@DES_FIN_PORC,@DES_TOT_PORC,@IMPORTE,@COM_TOT_PORC,@METODODEPAGO,@NUMCTAPAGO,
                            @TIP_DOC_ANT,@DOC_ANT,@TIP_DOC_SIG,@DOC_SIG,@UUID,@VERSION_SINC,@FORMADEPAGOSAT,@USO_CFDI)
                    `
                );
                console.log(`Insertando BITA${EMPRESA} FACTV${EMPRESA}`);
                await pool.request().input('CVE_BITA',Int,foliocountBita).input('CVE_CLIE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString()).input('CVE_CAMPANIA',VarChar,'_SAE_').input('CVE_ACTIVIDAD',VarChar,'')
                    .input('FECHAHORA',VarChar,dateParse).input('CVE_USUARIO',SmallInt,0).input('OBSERVACIONES',VarChar,`No. [ ${foliocount} ] $ ${(amountBySale).toFixed(6)}`).input('STATUS',VarChar,'F')
                    .input('NOM_USUARIO',VarChar,'Administrador').query(
                        `insert into BITA${EMPRESA}(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                        VALUES(@CVE_BITA,@CVE_CLIE,@CVE_CAMPANIA,@CVE_ACTIVIDAD,@FECHAHORA,@CVE_USUARIO,@OBSERVACIONES,@STATUS,@NOM_USUARIO)`
                    );
                        console.log(`Insertando FACV_CLIB${EMPRESA}`);
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).query(`
                    insert into FACTV_CLIB${EMPRESA}(CLAVE_DOC) VALUES(@CLAVE_DOC)
                `);
                        console.log(`Insertando TBLCONTROL${EMPRESA} BITA`);
                await pool.request().query(`
                update TBLCONTROL${EMPRESA} set ULT_CVE=${foliocountBita} WHERE ID_TABLA=62
                `);
                // await pool.request().input('ULT_DOC',VarChar,' '.repeat(10-(+foliocountBita).toString().length)+(+foliocount).toString()).input('TIP_DOC',VarChar,'V')
                // .query(`
                //     UPDATE FOLIOSF${EMPRESA} SET ULT_DOC=@ULT_DOC WHERE TIP_DOC=@TIP_DOC;
                // `);
                    
                //////////////////////////////
                let newDate = new Date(saleRequestForm.date);

                ////////////////////////////////AFACT01
                console.log(`Actualizando AFACT${EMPRESA} INSERTANTO VALORES DE VENTA`);
                let afactRecord = await pool.request().query(
                    `select * from AFACT${EMPRESA} where cast ([PER_ACUM] as date)= '${newDate.getFullYear()+"-"+month+"-01 00:00:00.000"}';`
                );
                if(afactRecord.recordset.length){
                    await pool.request().input('PER_ACUM',DateTime,`${newDate.getFullYear()}-${month}-01 00:00:00.000`)
                    .input('RVTA_COM',Float,+afactRecord.recordset[0].RVTA_COM+saleRequestForm.amount).input('VVTA_COM',Float,+afactRecord.recordset[0].VVTA_COM+saleRequestForm.amount)
                    .query(
                        `
                        update AFACT${EMPRESA} set RVTA_COM=@RVTA_COM,VVTA_COM=@VVTA_COM where PER_ACUM=@PER_ACUM
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
                        INSERT INTO AFACT${EMPRESA} (CVE_AFACT, FVTA_COM, FDESCTO, FDES_FIN, FIMP, FCOMI, RVTA_COM, RDESCTO, RDES_FIN, RIMP, RCOMI, DVTA_COM, DDESCTO, DDES_FIN,
                             DIMP, DCOMI, PVTA_COM, PDESCTO, PDES_FIN, PIMP, PCOMI, CVTA_COM, CDESCTO, CDES_FIN, CIMP, CCOMI, VVTA_COM, VDESCTO, VDES_FIN, VIMP, VCOMI, 
                             WVTA_COM, WDESCTO, WDES_FIN, WIMP, WCOMI, PER_ACUM, EVTA_COM, EDESCTO, EDES_FIN, EIMP, ECOMI) 
                             VALUES(@CVE_AFACT, @FVTA_COM, @FDESCTO, @FDES_FIN, @FIMP, @FCOMI, @RVTA_COM, @RDESCTO, @RDES_FIN, @RIMP, @RCOMI, @DVTA_COM, @DDESCTO, @DDES_FIN,
                                @DIMP, @DCOMI, @PVTA_COM, @PDESCTO, @PDES_FIN, @PIMP, @PCOMI, @CVTA_COM, @CDESCTO, @CDES_FIN, @CIMP, @CCOMI, @VVTA_COM, @VDESCTO, @VDES_FIN, @VIMP, @VCOMI, 
                                @WVTA_COM, @WDESCTO, @WDES_FIN, @WIMP, @WCOMI, @PER_ACUM, @EVTA_COM, @EDESCTO, @EDES_FIN, @EIMP, @ECOMI)
                        `
                    );
                }
                
                console.log(`Insertando valores de CUENT_M${EMPRESA}`);
                
                let delivered=null;
                let deliveredDate = null;
                if(saleRequestForm.typeSale.toUpperCase()!="CREDITO"){
                    delivered='S';
                    deliveredDate=dateParse;
                }
                await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-(client.keySaeNew.toString().length))+client.keySaeNew.toString() ).input('REFER',VarChar,foliocount).input('NUM_CPTO',Int,2).input('NUM_CARGO',Int,1)
                .input('CVE_OBS',Int,0).input('NO_FACTURA',VarChar,foliocount).input('DOCTO',VarChar,foliocount).input('IMPORTE',Float,saleRequestForm.amount).input('FECHA_APLI',VarChar,dateParse)
                .input('FECHA_VENC',VarChar,dateParse).input('AFEC_COI',VarChar,'A').input('STRCVEVEND',VarChar," ".repeat(5-seller.saeKey.toString().length)+seller.saeKey.toString()).input('NUM_MONED',Int,1).input('TCAMBIO',Int,1).input('IMPMON_EXT',Float,saleRequestForm.amount)
                .input('FECHAELAB',VarChar,dateParse).input('CTLPOL',Int,null).input('CVE_FOLIO',VarChar,null).input('TIPO_MOV',VarChar,'C').input('CVE_BITA',Int,null).input('SIGNO',Int,1).input('CVE_AUT',Int,null)
                .input('USUARIO',SmallInt,0).input('ENTREGADA',VarChar,delivered).input('FECHA_ENTREGA',VarChar,deliveredDate).input('STATUS',VarChar,'A').input('REF_SIST',VarChar,null).input('UUID',VarChar,v4().toUpperCase()).input('VERSION_SINC',DateTime,dateParse2)
                .query(`
                        INSERT INTO CUEN_M${EMPRESA} (CVE_CLIE, REFER, NUM_CPTO, NUM_CARGO, CVE_OBS, NO_FACTURA, DOCTO, IMPORTE, FECHA_APLI, FECHA_VENC, AFEC_COI, STRCVEVEND, NUM_MONED, TCAMBIO, IMPMON_EXT, FECHAELAB, CTLPOL, CVE_FOLIO,
                             TIPO_MOV, CVE_BITA, SIGNO, CVE_AUT, USUARIO, ENTREGADA, FECHA_ENTREGA, STATUS, REF_SIST, UUID, VERSION_SINC) 
                             VALUES (@CVE_CLIE, @REFER, @NUM_CPTO, @NUM_CARGO, @CVE_OBS, @NO_FACTURA, @DOCTO, @IMPORTE, @FECHA_APLI, @FECHA_VENC, @AFEC_COI, @STRCVEVEND, @NUM_MONED, @TCAMBIO, @IMPMON_EXT, @FECHAELAB, @CTLPOL, @CVE_FOLIO,
                                @TIPO_MOV, @CVE_BITA, @SIGNO, @CVE_AUT, @USUARIO, @ENTREGADA, @FECHA_ENTREGA, @STATUS, @REF_SIST, @UUID, @VERSION_SINC)
                `);
                
            ////- 

                console.log("insertando subventas");
                for(let i=0;i<saleRequestForm.subSales.length;i++){
                    let product = saleRequestForm.subSales[i];
                    
                    let numMovResult = await pool.request().query(
                        `
                        SELECT ULT_CVE FROM TBLCONTROL${EMPRESA} WHERE ID_TABLA=44
                        `
                    );
                    let numMov = (+numMovResult.recordset[0].ULT_CVE)+1;
                    let imp1=0; // IVA
                    let imp2=0; // IEPS
                    let singleAmountByProduct = product.amount/product.quantity;
                    switch(product.presentation.esqKey){
                        case 1:
                            imp1 = this.extractIva(singleAmountByProduct);
                            break;
                        case 4:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),8);
                            break;
                        case 5:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),25);
                            break;
                        case 6:
                                imp1=this.extractIva(singleAmountByProduct);
                                imp2=this.extractIeps((singleAmountByProduct-this.extractIva(singleAmountByProduct)),50);
                            break;
                    }
                    singleAmountByProduct=singleAmountByProduct-(imp1+imp2);
                    if(product.presentation.typeProduct=="ABARROTES"){
                        product.presentation.keySae=product.presentation.keyAltern;
                        product.quantity=product.quantity*product.presentation.presentationPriceLiquidation;
                    }
                    console.log("Obteniendo ultimas existencias del producto: "+product.presentation.keySae);
                    // let lastExist = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).input('ALMACEN',Int,warehouseId)
                    // .query(`
                    // SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE CVE_ART=@CVE_ART AND ALMACEN=@ALMACEN AND ISNUMERIC(CVE_FOLIO)=1 ORDER BY CAST(CVE_FOLIO as Decimal) DESC;
                    // `);
                   ///////////////// PARTES DEL PEDIDO
                    
                    // await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.quantity).input('PXS',Float,product.quantity)
                    // .input('PREC',Float,product.presentation.presentationPricePublic).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    // .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    // .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    // .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    // .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,0).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    // .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).query(
                    //     `
                    //     insert into PAR_FACTP${EMPRESA}(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                    //         ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                    //         APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                    //         (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                    //             ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                    //             @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                    //     `
                    // );
                    // console.log("Ingresando docs",(' '.repeat(10)+foliocount).length);
                    // await pool.request().input("TIP_DOC",VarChar,'P').input('CVE_DOC',VarChar,foliocount)
                    // .input('ANT_SIG',VarChar,'S').input('TIP_DOC_E',VarChar,'R').input('CVE_DOC_E',VarChar,foliocount)
                    // .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    // .query(`
                    //     INSERT INTO DOCTOSIGF${EMPRESA}(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                    //     VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    // `);
                    // console.log("inserto venta 4");
                    // await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                    //     `insert into PAR_FACTP_CLIB${EMPRESA}(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    // );
                    ///////////////// PARTES DE LA REMISSION
                    // console.log(`Insertando parte de PAR_FACTR${EMPRESA}`);
                    // await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.quantity).input('PXS',Float,product.quantity)
                    // .input('PREC',Float,product.amount/product.quantity).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    // .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    // .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    // .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    // .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,numMov).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    // .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).query(
                    //     `
                    //     insert into PAR_FACTR${EMPRESA}(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                    //         ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                    //         APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                    //         (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                    //             ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                    //             @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                    //     `
                    // );
                    // console.log(`Insertando PAR_FACTR_CLIB${EMPRESA}`);
                    // await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                    //     `insert into PAR_FACTR_CLIB${EMPRESA}(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    // );

                    //     console.log(`Insertando DOCTOSIGF${EMPRESA}`);
                    // await pool.request().input("TIP_DOC",VarChar,'R').input('CVE_DOC',VarChar,foliocount)
                    // .input('ANT_SIG',VarChar,'A').input('TIP_DOC_E',VarChar,'V').input('CVE_DOC_E',VarChar,foliocount)
                    // .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    // .query(`
                    //     INSERT INTO DOCTOSIGF${EMPRESA}(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                    //     VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    // `);
                    
                            /////////////// PARTES DE LA VENTA
                    console.log(`Insertando PAR_FACTV${EMPRESA}`);
                    let impu01=0;
                    let impu04=0;
                    let impua1pla=6;
                    let impua4pla=6;
                    
                    switch(product.presentation.esqKey){
                        case 1:
                            impu01=0;
                            impu04=16;
                            impua1pla=6;
                            impua4pla=0;
                            
                            break;
                        case 3:
                            impua4pla=4;
                            break;
                        case 4:
                            impu01=8;
                            impu04=16;
                            impua1pla=0;
                            impua4pla=1;
                            
                            break;
                        case 5:
                            impu01=25;
                            impu04=16;
                            impua1pla=0;
                            impua4pla=1;
                            
                            break;
                        case 6:
                            impu01=50;
                            impu04=16;
                            impua1pla=0;
                            impua4pla=1;
                            break;
                    }
                    imp1=imp1*product.quantity;
                    imp2=imp2*product.quantity;
                    
                    await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.quantity).input('PXS',Float,product.quantity)
                    .input('PREC',Float,singleAmountByProduct).input('COST',Float,0).input('IMPU1',Float,impu01).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,impu04)
                    .input('IMP1APLA',Float,impua1pla).input('IMP2APLA',Float,6).input('IMP3APLA',Float,6).input('IMP4APLA',Float,impua4pla).input('TOTIMP1',Float,imp2)
                    .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,imp1).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,0)
                    .input('ACT_INV',VarChar,'S').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,product.presentation.uniMed).input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,numMov).input('TOT_PARTIDA',Float,(product.amount-((imp1)+(imp2)))).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',product.presentation.esqKey).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4().toUpperCase()).input('VERSION_SINC',DateTime,dateParse2).query(
                        `
                        insert into PAR_FACTV${EMPRESA}(CVE_DOC,NUM_PAR,CVE_ART,CANT,PXS,PREC,COST,IMPU1,IMPU2,IMPU3,IMPU4,IMP1APLA,IMP2APLA,IMP3APLA,IMP4APLA,TOTIMP1,TOTIMP2,TOTIMP3,TOTIMP4
                            ,DESC1,DESC2,DESC3,COMI,APAR,ACT_INV,NUM_ALM,POLIT_APLI,TIP_CAM,UNI_VENTA,TIPO_PROD,CVE_OBS,REG_SERIE,E_LTPD,TIPO_ELEM,NUM_MOV,TOT_PARTIDA,IMPRIMIR,MAN_IEPS,
                            APL_MAN_IMP,CUOTA_IEPS,APL_MAN_IEPS,MTO_PORC,MTO_CUOTA,CVE_ESQ,DESCR_ART,UUID,VERSION_SINC) values
                            (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                                ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                                @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                        `
                    );
                    console.log(`Insertando PAR_FACTV_CLIB${EMPRESA}`);
                    await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                        `insert into PAR_FACTV_CLIB${EMPRESA}(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    );

                    

                    // await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,foliocount)
                    // .input('ANT_SIG',VarChar,'S').input('TIP_DOC_E',VarChar,'V').input('CVE_DOC_E',VarChar,foliocount)
                    // .input('PARTIDA',Int,(i+1)).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    // .query(`
                    //     INSERT INTO DOCTOSIGF01(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                    //     VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    // `);

                    //     console.log(`Insertando DOCTOSIGF${EMPRESA}`);
                    // await pool.request().input("TIP_DOC",VarChar,'V').input('CVE_DOC',VarChar,foliocount)
                    // .input('ANT_SIG',VarChar,'A').input('TIP_DOC_E',VarChar,'R').input('CVE_DOC_E',VarChar,foliocount)
                    // .input('PARTIDA',Int,1).input('PART_E',Int,(i+1)).input('CANT_E',Float,product.quantity)
                    // .query(`
                    //     INSERT INTO DOCTOSIGF${EMPRESA}(TIP_DOC,CVE_DOC,ANT_SIG,TIP_DOC_E,CVE_DOC_E,PARTIDA,PART_E,CANT_E)
                    //     VALUES(@TIP_DOC,@CVE_DOC,@ANT_SIG,@TIP_DOC_E,@CVE_DOC_E,@PARTIDA,@PART_E,@CANT_E)
                    // `);
                console.log(`Insertando en INVE${EMPRESA}`);
                let inve01 = await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).query(`
                SELECT EXIST,UNI_MED FROM INVE${EMPRESA} WHERE CVE_ART=@CVE_ART
                `)
                console.log(`Insertando en MINVE${EMPRESA}`);
                let productInMultiwarehouse= await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).query(
                    `SELECT * FROM MULT${EMPRESA} WHERE CVE_ART=@CVE_ART`
                    );
                let multiwarehouse= productInMultiwarehouse.recordset[0];
                
                    await pool.request().input('CVE_ART',VarChar,product.presentation.keySae).input('ALMACEN',Int,warehouseId)
                    .input('NUM_MOV',Int,numMov).input('CVE_CPTO',Int,51).input('FECHA_DOCU',VarChar,dateParse)
                    .input('TIPO_DOC',VarChar,'V').input('REFER',VarChar,`${foliocount}`).input('CLAVE_CLPV',VarChar,' '.repeat(10-(client.keySaeNew.toString().length))+client.keySaeNew.toString() )
                    .input('VEND',VarChar,' '.repeat(5-seller.saeKey.toString().length)+seller.saeKey.toString()).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,singleAmountByProduct)
                    .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
                    .input('UNI_VENTA',VarChar,inve01.recordset[0].UNI_MED).input('E_LTPD',Int,0).input('EXIST_G',Float,((inve01.recordset[0].EXIST-product.quantity)<0)?0:inve01.recordset[0].EXIST-product.quantity).input('EXISTENCIA',Float,(multiwarehouse.EXIST-product.quantity)<0?0:(multiwarehouse.EXIST-product.quantity))
                    .input('TIPO_PROD',VarChar,null).input('FACTOR_CON',Int,1).input('FECHAELAB',VarChar,dateParse).input('CTLPOL',Int,null)
                    .input('CVE_FOLIO',VarChar,countFolio.toString()).input('SIGNO',Int,-1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
                    .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
                    .query(`
                            INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                                REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                                COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                                    @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                                    @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                    `);
                    console.log(`ACTUALIZANDO TBLCONTROL${EMPRESA} ID_TABLA=44`);
                    await pool.request().query(`
                    UPDATE TBLCONTROL${EMPRESA} set ULT_CVE=${numMov} WHERE ID_TABLA=44
                    `);

                    // await pool.request().input('CVE_DOC',VarChar,foliocount).input('NUM_PAR',Int,(i+1)).input('CVE_ART',VarChar,product.presentation.keySae).input('CANT',Float,product.quantity).input('PXS',Float,product.quantity)
                    // .input('PREC',Float,product.presentation.presentationPricePublic).input('COST',Float,0).input('IMPU1',Float,0).input('IMPU2',Float,0).input('IMPU3',Float,0).input('IMPU4',Float,0)
                    // .input('IMP1APLA',Float,0).input('IMP2APLA',Float,0).input('IMP3APLA',Float,0).input('IMP4APLA',Float,0).input('TOTIMP1',Float,0)
                    // .input('TOTIMP2',Float,0).input('TOTIMP3',Float,0).input('TOTIMP4',Float,0).input('DESC1',Float,0).input('DESC2',Float,0).input('DESC3',Float,0).input('COMI',Float,0).input('APAR',Float,1)
                    // .input('ACT_INV',VarChar,'N').input('NUM_ALM',warehouseId).input('POLIT_APLI',VarChar,'').input('TIP_CAM',Float,1).input('UNI_VENTA',VarChar,'pz').input('TIPO_PROD',VarChar,'P').input('CVE_OBS',Int,0).input('REG_SERIE',Int,0)
                    // .input('E_LTPD',Int,0).input('TIPO_ELEM',VarChar,'N').input('NUM_MOV',Int,+lastExist.recordset.length+1).input('TOT_PARTIDA',Float,product.amount).input('IMPRIMIR',VarChar,'S').input('MAN_IEPS',VarChar,'N').input('APL_MAN_IMP',Int,1)
                    // .input('CUOTA_IEPS',Float,0).input('APL_MAN_IEPS',VarChar,'C').input('MTO_PORC',Float,0).input('MTO_CUOTA',Float,0).input('CVE_ESQ',9).input('DESCR_ART',VarChar,null).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).query(
                    //     `
                    //     insert into PAR_FACTF${EMPRESA}(TIPO_DOC,CVE_DOC,CVE_CLPV,STATUS,DAT_MOSTR,CVE_VEND) values
                    //         (@CVE_DOC,@NUM_PAR,@CVE_ART,@CANT,@PXS,@PREC,@COST,@IMPU1,@IMPU2,@IMPU3,@IMPU4,@IMP1APLA,@IMP2APLA,@IMP3APLA,@IMP4APLA,@TOTIMP1,@TOTIMP2,@TOTIMP3,@TOTIMP4
                    //             ,@DESC1,@DESC2,@DESC3,@COMI,@APAR,@ACT_INV,@NUM_ALM,@POLIT_APLI,@TIP_CAM,@UNI_VENTA,@TIPO_PROD,@CVE_OBS,@REG_SERIE,@E_LTPD,@TIPO_ELEM,@NUM_MOV,@TOT_PARTIDA,@IMPRIMIR,@MAN_IEPS,
                    //             @APL_MAN_IMP,@CUOTA_IEPS,@APL_MAN_IEPS,@MTO_PORC,@MTO_CUOTA,@CVE_ESQ,@DESCR_ART,@UUID,@VERSION_SINC)
                    //     `
                    // );
                    // console.log("inserto venta 4");
                    // await pool.request().input('CLAVE_DOC',VarChar,foliocount).input('NUM_PART',Int,(i+1)).query(
                    //     `insert into PAR_FACTF_CLIB${EMPRESA}(CLAVE_DOC,NUM_PART) values(@CLAVE_DOC,@NUM_PART)`
                    // );
                    
                      
                    //await this.updateInventoryGeneralAspeSaeByProduct(product.presentation.keySae,-product.quantity);
                    //await this.updateInventoryGeneralAspeSaeByProductOnlyBySeller(product.presentation.keySae,product.quantity,+warehouseId);
                    console.log("Removiendo de almacen de vendedor");
                    await this.removeProductFromSeller(product.presentation.keySae,product.quantity,+warehouseId);
                    await pool.connect();

                    
                        
                    
                    
			
                
                }
                let concept = 10;
                if(saleRequestForm.typeSale!="CREDITO" && saleRequestForm.typeSale.toLocaleLowerCase()!="transferencia" && saleRequestForm.typeSale.toLocaleLowerCase()!="cheque"){
                    await pool.request().input('CVE_CLIE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString()  ).input('REFER',VarChar,foliocount).input('ID_MOV',2)
                    .input('NUM_CPTO',Int,concept).input('NUM_CARGO',Int,1).input('CVE_OBS',Int,0).input('NO_FACTURA',VarChar,foliocount).input('DOCTO',VarChar,'').input('IMPORTE',Float,saleRequestForm.amount)
                    .input('FECHA_APLI',VarChar,dateParse).input('FECHA_VENC',VarChar,dateParse).input('AFEC_COI',VarChar,null).input('STRCVEVEND',VarChar,' '.repeat(5-saleRequestForm.seller.saeKey.toString().length)+saleRequestForm.seller.saeKey.toString()).input('NUM_MONED',Int,1)
                    .input('TCAMBIO',Int,1).input('IMPMON_EXT',Float,saleRequestForm.amount).input('FECHAELAB',VarChar,dateParse).input('CTLPOL',Float,0).input('CVE_FOLIO',VarChar,'').input('TIPO_MOV',VarChar,'A')
                    .input('CVE_BITA',Int,null).input('SIGNO',Int,-1).input('CVE_AUT',Int,0).input('USUARIO',SmallInt,0).input('OPERACIONPL',VarChar,null).input('REF_SIST',VarChar,null).input('NO_PARTIDA',Int,1)
                    .input('REFBANCO_ORIGEN',VarChar,null).input('REFBANCO_DEST',VarChar,null).input('NUMCTAPAGO_ORIGEN',VarChar,null).input('NUMCTAPAGO_DESTINO',VarChar,null).input('NUMCHEQUE',VarChar,null).input('BENEFICIARIO',VarChar,null)
                    .input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateParse2).input('ID_OPERACION',VarChar,null).input('CVE_DOC_COMPPAGO',VarChar,null).query(
                        `
                        INSERT INTO CUEN_DET${EMPRESA} (CVE_CLIE, REFER, ID_MOV, NUM_CPTO, NUM_CARGO, CVE_OBS, NO_FACTURA, DOCTO, IMPORTE, FECHA_APLI, FECHA_VENC, AFEC_COI, STRCVEVEND,
                             NUM_MONED, TCAMBIO, IMPMON_EXT, FECHAELAB, CTLPOL, CVE_FOLIO, TIPO_MOV, CVE_BITA, SIGNO, CVE_AUT, USUARIO, OPERACIONPL, REF_SIST, NO_PARTIDA, REFBANCO_ORIGEN,
                              REFBANCO_DEST, NUMCTAPAGO_ORIGEN, NUMCTAPAGO_DESTINO, NUMCHEQUE, BENEFICIARIO, UUID, VERSION_SINC, ID_OPERACION, CVE_DOC_COMPPAGO) 
                              VALUES(@CVE_CLIE, @REFER, @ID_MOV, @NUM_CPTO, @NUM_CARGO, @CVE_OBS, @NO_FACTURA, @DOCTO, @IMPORTE, @FECHA_APLI, @FECHA_VENC, @AFEC_COI, @STRCVEVEND,
                                @NUM_MONED, @TCAMBIO, @IMPMON_EXT, @FECHAELAB, @CTLPOL, @CVE_FOLIO, @TIPO_MOV, @CVE_BITA, @SIGNO, @CVE_AUT, @USUARIO, @OPERACIONPL, @REF_SIST, @NO_PARTIDA, @REFBANCO_ORIGEN,
                                 @REFBANCO_DEST, @NUMCTAPAGO_ORIGEN, @NUMCTAPAGO_DESTINO, @NUMCHEQUE, @BENEFICIARIO, @UUID, @VERSION_SINC, @ID_OPERACION, @CVE_DOC_COMPPAGO)
                        `
                    );
		            }
                // await pool.request().input('ULT_CVE',Int,+folioCountBita2).input('ID_TABLA',Int,62)
                // .query(`
                //     UPDATE TBLCONTROL${EMPRESA} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=@ID_TABLA
                // `);

                let doctoSig = await pool.request().query(
                    `
                    select top 1 * from MINVE${EMPRESA} WHERE ISNUMERIC(CVE_FOLIO)=1 ORDER BY CAST(CVE_FOLIO AS DECIMAL) DESC
                    `
                    );
                let tipDocCount=doctoSig.recordset[0].CVE_FOLIO;
                await pool.request().input('ULT_CVE',Int,+tipDocCount).input('ID_TABLA',Int,32)
                .query(`
                    UPDATE TBLCONTROL${EMPRESA} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=@ID_TABLA
                `);

                let minve = await pool.request().query(
                    `
                    select top 1 * from MINVE${EMPRESA}  ORDER BY CAST(NUM_MOV AS DECIMAL) DESC
                    `
                    );
                let minveCount=minve.recordset[0].NUM_MOV;
                await pool.request().input('ULT_CVE',Int,+minveCount).input('ID_TABLA',Int,44)
                .query(`
                    UPDATE TBLCONTROL${EMPRESA} SET ULT_CVE=@ULT_CVE WHERE ID_TABLA=@ID_TABLA
                `);
                if(client.typeClient=="CREDITO" && saleRequestForm.typeSale=="CREDITO"){
                    await pool.request().input('SALDO',Float,saleRequestForm.amount).input('CLAVE',VarChar,' '.repeat(10-client.keySaeNew.toString().length)+client.keySaeNew.toString() )
                    .query(`
                        UPDATE CLIE${EMPRESA} SET SALDO=(SALDO + @SALDO) WHERE CLAVE=@CLAVE
                    `);
                }
                return foliocount;

            }
        );
        await this.connection.close();
        return result;
    }

    extractIva(amount:number){
        return (amount/116)*16;
    }
    extractIeps(amount:number,percent:number){
        return (amount/(100+percent))*percent;
    }

    async getPaymentRegister(folio:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>pool.query(`SELECT *
        FROM CUEN_DET${EMPRESA} where 
        REFER = '${folio}';`));
        return result.recordset;
    }

    async registerPayment(deb:any){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
        let cveClient=' '.repeat(10-deb.keySae.toString().length)+`${deb.keySae}`;
        let cveSeller=' '.repeat(5-deb.saeKey.toString().length)+`${deb.saeKey}`;
        let foliosBita = await pool.query(
            `
            SELECT ULT_CVE FROM TBLCONTROL${EMPRESA} WHERE ID_TABLA=62
            `
        );
        let BITA=foliosBita.recordset[0].ULT_CVE+1;
        let query =`insert into CUEN_DET06(CVE_CLIE,REFER,ID_MOV,NUM_CPTO,NUM_CARGO,CVE_OBS,NO_FACTURA,DOCTO,IMPORTE,FECHA_APLI,FECHA_VENC,STRCVEVEND,NUM_MONED,TCAMBIO,IMPMON_EXT,FECHAELAB,CTLPOL,CVE_FOLIO,TIPO_MOV,CVE_BITA,SIGNO,USUARIO,NO_PARTIDA,UUID,VERSION_SINC)
                                     VALUES('${cveClient}','${deb.folio}',2,10,1,0,'${deb.folio}','${deb.folio}',${deb.amount},'${deb.solpedAt}','${deb.solpedAt}','${cveSeller}',1,1,${deb.amount},'${deb.solpedAt}',0,'','A','${BITA}',-1,0,1,'${(v4()).toString().toUpperCase()}','${deb.solpedAt}')`;
        let query2=`insert into BITA06(CVE_BITA,CVE_CLIE,CVE_CAMPANIA,CVE_ACTIVIDAD,FECHAHORA,CVE_USUARIO,OBSERVACIONES,STATUS,NOM_USUARIO)
                                VALUES(${BITA},'${cveClient}','_SAE_',12,'${deb.solpedAt}',0,'No. [ ${deb.folio} ] $ ${(deb.amount as number).toFixed(2)}','F','Administrador')`;
        let query3= `update TBLCONTROL06 set ULT_CVE=${BITA}  WHERE ID_TABLA=62 `;                                
        console.log("TO INSERT: "+query);
        await pool.query(query);
        console.log("Bita: "+query2);
        await pool.query(query2)
        console.log("TABLECONTROL: "+query3);
        await pool.query(query3);
        });
    }

    async removeProductFromSeller(keySae:string,quantity:number,warehouseId:number){
        await this.getConnection();
        await this.connection.connect().then(async (pool)=>{
            
           let productQuery=await pool.request().input('CVE_ART',VarChar,keySae).query(`select * from INVE${EMPRESA} where CVE_ART='${keySae}'`)
           let product=productQuery.recordset[0];
           
            await pool.request().input('EXIST',Float,(((+product.EXIST-quantity)<0?0:(+product.EXIST-quantity) )) ).input('CVE_ART',VarChar,keySae).query(
                   `UPDATE INVE${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART`
               );
           let productInMultiwarehouse= await pool.request().input('CVE_ART',VarChar,keySae).query(
            `SELECT * FROM MULT${EMPRESA} WHERE CVE_ART=@CVE_ART`
            );
            let multiwarehouse= productInMultiwarehouse.recordset[0];
           await pool.request().input('EXIST',Float,( ((+multiwarehouse.EXIST-quantity)<0?0:(+multiwarehouse.EXIST-quantity) )) ).input('CVE_ART',VarChar,keySae).query(
            `UPDATE MULT${EMPRESA} set EXIST=@EXIST WHERE CVE_ART=@CVE_ART AND CVE_ALM='${warehouseId}' `
        );
        // let lastExist = await pool.request().input('CVE_ART',VarChar,keySae)
        // .query(`SELECT TOP(1) * FROM MINVE${EMPRESA} WHERE CVE_ART='${keySae}' and ALMACEN=${warehouseId} ORDER BY CAST(NUM_MOV as decimal) DESC;`);
        // let existenceByWarehouse = lastExist.recordset[0];

        // let folios = await pool.request().query(`
        // select * from TBLCONTROL${EMPRESA} WHERE ID_TABLA=32
        // `);
        // let folio = (+folios.recordset[0].ULT_CVE)+1;
        // let dateParse = new Date();
        // let month = (dateParse.getMonth()+1).toString();
        // let day = dateParse.getDate().toString();
        // if(+month<10){
        //     month='0'+month;
        // }
        // if(+day<10){
        //     day='0'+day;
        // }
        // await pool.request().input('CVE_ART',VarChar,keySae).input('ALMACEN',Int,warehouseId)
        // .input('NUM_MOV',Int,(+existenceByWarehouse.NUM_MOV)+1).input('CVE_CPTO',Int,51).input('FECHA_DOCU',DateTime,`${dateParse.getFullYear()}-${month}-${day} 00:00:00.000`)
        // .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,folioSale).input('CLAVE_CLPV',VarChar,null)
        // .input('VEND',VarChar,null).input('CANT',Float,product.quantity).input('CANT_COST',Float,0).input('PRECIO',Float,null)
        // .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
        // .input('UNI_VENTA',VarChar,"KG").input('E_LTPD',Int,0).input('EXIST_G',Float,existenceByWarehouse.EXIST-product.quantity).input('EXISTENCIA',Float,existenceByWarehouse?existenceByWarehouse.EXIST-product.quantity:0)
        // .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,-1).input('FECHAELAB',DateTime,`${dateParse.getFullYear()}-${month}-${day} 00:00:00.000`).input('CTLPOL',Int,null)
        // .input('CVE_FOLIO',folio).input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
        // .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
        // .query(`
        //         INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
        //             REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
        //             COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
        //                 @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
        //                 @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
        // `);

        });
        
        await this.connection.close();
    }

    async getAllTaxSchemas(){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().query(
                `select CVE_ESQIMPU,DESCRIPESQ FROM IMPU${EMPRESA} WHERE STATUS='A'`
            )
        );
        await this.connection.close();
        return result.recordset;
    }


    async getClientCount(){
        await this.getConnection();
        let result = await this.connection.connect().then(
            pool=>pool.request().query(
                `select  TOP 1 CLAVE FROM CLIE${EMPRESA} ORDER BY CLAVE DESC`
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
                select TOP 1 CVE_VEND FROM VEND${EMPRESA} ORDER BY CVE_VEND DESC
                `
            )
        )
        await this.connection.close();
        return result.recordset;
    }

    async getProductExist(productKey:string,quantity:number,warehouseKey:string){
        await this.getConnection();
        let result = await this.connection.connect().then((pool)=>
            pool.request().query(`
            select * from MINVE${EMPRESA} where CVE_ART= '${productKey}' and EXISTENCIA>${quantity} and ALMACEN='${warehouseKey}'
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
                    delete from MINVE${EMPRESA} where =@CVE_ART
                    `
                );
                await pool.request().input('CVE_ART',Int,presentation.keySae)
            .query(`
                delete from MULT${EMPRESA} where CVE_ART=@CVE_ART
            `);
            
            await pool.request().input('CVE_ART',VarChar,presentation.keySae)
                .query(`
                delete from PRECIO_X_PROD${EMPRESA} where CVE_ART=@CVE_ART
                `);

                await pool.request().input('CVE_ART',VarChar,presentation.keySae).query(
                    `
                    delete from INVE${EMPRESA} where CVE_ART=@CVE_ART
                    `
                )
            
            await pool.request().input('CVE_PROD',VarChar,)
            .query(`
            delete from INVE_CLIB${EMPRESA} where CVE_PROD=@CVE_PROD
            `);
 
        }

        });
    }

    async updateProductInSaeBySellerWarehouses(sale:Sale){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
                for(let subSale of sale.subSales){

                    let product = await pool.request().input('CVE_ART',VarChar,subSale.presentation.keySae).input('STATUS',VarChar,'A')
                    .query(
                        `
                         select * FROM INVE${EMPRESA} WHERE CVE_ART=@CVE_ART AND STATUS=@STATUS
                        `
                    );
                    if(product.recordset.length){
                        let exist = +product.recordset[0].EXIST;
                    let update = await pool.request().input('CVE_ART',VarChar,subSale.presentation.keySae).input('EXIST',Float,exist-subSale.quantity)
                    .query(
                        `
                         UPDATE INVE${EMPRESA} SET EXIST =@EXIST WHERE CVE_ART=@CVE_ART;
                        `
                    );

                    }
                    
                }
        });
        await this.connection.close();
    }

    async updateProductInSaeBySellerWarehouseStock(warehouseId:number,productKeySae:string,units:number,sellerKeySae:string,uniMed:string){
        await this.getConnection();
        await this.connection.connect().then(async(pool)=>{
            
                let warehouseSeller = await pool.request()
                .input('CVE_ALM',Int,warehouseId).input('CVE_ART',VarChar,productKeySae).input('STATUS',VarChar,'A')
                .query(
                    `
                     select CVE_ART,CVE_ALM,EXIST,STOCK_MAX FROM MULT${EMPRESA} WHERE CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM AND STATUS=@STATUS
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
                            `UPDATE MULT${EMPRESA} SET STOCK_MAX=@STOCK_MAX,EXIST=@EXIST where CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM`
                        );
                    }else{
                        await pool.request().input('CVE_ART',VarChar,productKeySae)
                        .input('CVE_ALM',Int,warehouseId)
                        .input('EXIST',Float,warehouse.EXIST+units).query(
                            `UPDATE MULT${EMPRESA} SET EXIST=@EXIST where CVE_ART=@CVE_ART AND CVE_ALM=@CVE_ALM`
                        );
                       
                    }
                    await this.updateInventoryGeneralAspeSaeByProductOnlyBySeller(productKeySae,units,warehouseId)
                    await pool.connect();
                }else{
                    await pool.request().input('CVE_ART',VarChar,productKeySae).input('CVE_ALM',Int,warehouseId)
                    .input('STATUS',VarChar,'A').input('CTRL_ALM',VarChar,null).input('EXIST',Float,units).input('STOCK_MIN',Float,0)
                    .input('STOCK_MAX',Float,units).input('COMP_X_REC',Float,0).input('UUID',VarChar,v4()).input('VERSION_SINC',DateTime,dateStr)
                    .query(
                        `INSERT INTO MULT${EMPRESA}(CVE_ART,CVE_ALM,STATUS,CTRL_ALM,EXIST,STOCK_MIN,STOCK_MAX,COMP_X_REC,UUID,VERSION_SINC)
                        VALUES(@CVE_ART,@CVE_ALM,@STATUS,@CTRL_ALM,@EXIST,@STOCK_MIN,@STOCK_MAX,@COMP_X_REC,@UUID,@VERSION_SINC)`
                    );
    
                    await this.updateInventoryGeneralAspeSaeByProductOnlyBySeller(productKeySae,units,warehouseId);
                    await pool.connect();
                }
                // let counts = await pool.request().query(`
                //     SELECT COUNT(*) AS CANTIDAD FROM MINVE${EMPRESA}
                // `);
                // let day = dateParse.getDate().toString();
                // if(+day<10){
                //     day='0'+day;
                // }
                // let month = (dateParse.getMonth()+1).toString();
                // if(+month<10){
                //     month='0'+month;
                // }
                // let year = dateParse.getFullYear().toString().slice(2,4);
                // let inve01 = await pool.request().input('CVE_ART',VarChar,productKeySae).query(`
                // SELECT EXIST FROM INVE${EMPRESA} WHERE CVE_ART=@CVE_ART 
                // `)
                // if(counts.recordset.length && inve01.recordset.length){
                //     let count:number = +counts.recordset[0].CANTIDAD;
                        
                //         await pool.request().input('CVE_ART',VarChar,productKeySae).input('ALMACEN',Int,warehouseId)
                //         .input('NUM_MOV',Int,+count+1).input('CVE_CPTO',Int,6).input('FECHA_DOCU',DateTime,dateParse)
                //         .input('TIPO_DOC',VarChar,'M').input('REFER',VarChar,`IF-${day}${month}${year}`).input('CLAVE_CLPV',VarChar,null)
                //         .input('VEND',VarChar,sellerKeySae).input('CANT',Float,units).input('CANT_COST',Float,0).input('PRECIO',Float,null)
                //         .input('COSTO',Float,0).input('AFEC_COI',VarChar,null).input('CVE_OBS',Int,null).input('REG_SERIE',Int,0)
                //         .input('UNI_VENTA',VarChar,uniMed).input('E_LTPD',Int,0).input('EXIST_G',Float,inve01.recordset[0].EXIST).input('EXISTENCIA',Float,units)
                //         .input('TIPO_PROD',VarChar,'P').input('FACTOR_CON',Int,1).input('FECHAELAB',DateTime,dateStr).input('CTLPOL',Int,null)
                //         .input('CVE_FOLIO',VarChar,count.toString()).input('SIGNO',Int,1).input('COSTEADO',VarChar,'S').input('COSTO_PROM_INI',Float,0)
                //         .input('COSTO_PROM_FIN',Float,0).input('COSTO_PROM_GRAL',Float,0).input('DESDE_INVE',VarChar,'S').input('MOV_ENLAZADO',Int,0)
                //         .query(`
                //                 INSERT INTO MINVE${EMPRESA}(CVE_ART,ALMACEN,NUM_MOV,CVE_CPTO,FECHA_DOCU,TIPO_DOC,REFER,CLAVE_CLPV,VEND,CANT,CANT_COST,PRECIO,COSTO,AFEC_COI,CVE_OBS,
                //                     REG_SERIE,UNI_VENTA,E_LTPD,EXIST_G,EXISTENCIA,TIPO_PROD,FACTOR_CON,FECHAELAB,CTLPOL,CVE_FOLIO,SIGNO,COSTEADO,COSTO_PROM_INI,
                //                     COSTO_PROM_FIN,COSTO_PROM_GRAL,DESDE_INVE,MOV_ENLAZADO) VALUES(@CVE_ART,@ALMACEN,@NUM_MOV,@CVE_CPTO,@FECHA_DOCU,@TIPO_DOC,@REFER,@CLAVE_CLPV,@VEND,@CANT,@CANT_COST,@PRECIO,@COSTO,@AFEC_COI,@CVE_OBS,
                //                         @REG_SERIE,@UNI_VENTA,@E_LTPD,@EXIST_G,@EXISTENCIA,@TIPO_PROD,@FACTOR_CON,@FECHAELAB,@CTLPOL,@CVE_FOLIO,@SIGNO,@COSTEADO,@COSTO_PROM_INI,
                //                         @COSTO_PROM_FIN,@COSTO_PROM_GRAL,@DESDE_INVE,@MOV_ENLAZADO)
                //         `);
                    
                // }
        });
        await this.connection.close();
    }

    async getPreRegisterProductDetaisl(code:string){
        await this.getConnection();
        let result = await this.connection.connect().then(pool=>
            pool.query(`
            SELECT INV.CVE_ART as keySae,INV.DESCR as name,INV.UNI_MED as uniMed,PXP.PRECIO as price,INV.CVE_ESQIMPU AS esqKey,IMP.DESCRIPESQ as descriptionImp
            FROM INVE${EMPRESA} AS INV
            LEFT JOIN PRECIO_X_PROD${EMPRESA}  AS PXP ON INV.CVE_ART=PXP.CVE_ART
            LEFT JOIN IMPU${EMPRESA} AS IMP on INV.CVE_ESQIMPU=IMP.CVE_ESQIMPU
            WHERE INV.CVE_ART='${code}' AND PXP.CVE_PRECIO=1;
            `));
        return result.recordset;
    }
}