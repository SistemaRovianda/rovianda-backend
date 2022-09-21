import {config,ConnectionPool} from "mssql";

const configoptions:config ={
    server: "rovianda.ddns.net",//"rovisapi.dyndns.tv",//
    database: "SAE80Empre06",//"SAE76",//
    password: "R1o2v3i4S5a6p7i8_2018",//"Holamundo1250",//
    user: "1234",//"sa",//
    connectionTimeout: 60000,
    requestTimeout: 60000,
    options:{
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        enableArithAbort: true,
        requestTimeout:60000,
        connectTimeout: 60000,
    }
};
const configoptions2:config ={
    server: "rovianda.ddns.net",//"rovisapi.dyndns.tv",//
    database: "SAE80Empre07",//"SAE76",//
    password: "R1o2v3i4S5a6p7i8_2018",//"Holamundo1250",//
    user: "1234",//"sa",//
    connectionTimeout: 60000,
    requestTimeout: 60000,
    options:{
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        enableArithAbort: true,
        requestTimeout:60000,
        connectTimeout: 60000,
    }
};
let connectionSqlS:ConnectionPool =null;
export const getSqlServerCon =  ()=>{
    if(!connectionSqlS){
        connectionSqlS=   new ConnectionPool(configoptions);
    }
    return connectionSqlS;
}

let connectionSqlS2:ConnectionPool =null;
export const getSqlServerCon2 =  ()=>{
    if(!connectionSqlS2){
        connectionSqlS2=   new ConnectionPool(configoptions2);
    }
    return connectionSqlS2;
}