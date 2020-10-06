import {config,ConnectionPool} from "mssql";

const configoptions:config ={
    server: "aspeldemo.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",//"192.168.1.67",
    database: "SAE70Empre01",//"aspel_sae",//
    password: "Holamundo1250",
    user:"AspelAdmin",
    options:{
        encrypt: true
    }
};
let connectionSqlS:ConnectionPool =null;
export const getSqlServerCon =  ()=>{
    if(!connectionSqlS){
        connectionSqlS=   new ConnectionPool(configoptions);
    }
    return connectionSqlS;
}