import {config,ConnectionPool} from "mssql";

const configoptions:config ={
    server: "rovisapi.dyndns.tv",//"aspeldemo.cvhdnlqgutrq.us-west-2.rds.amazonaws.com",//"192.168.1.67","192.168.1.68",//
    database:"SAE76",//"SAE8",//"SAE70Empre01", "SAE70Empre01",//
    password: "R1o2v3i4S5a6p7i8_2018",//"Holamundo1250",//"Holamundo1250",//
    user: "1234",//"AspelAdmin",//"sa",//
    options:{
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
    }
};
let connectionSqlS:ConnectionPool =null;
export const getSqlServerCon =  ()=>{
    if(!connectionSqlS){
        connectionSqlS=   new ConnectionPool(configoptions);
    }
    return connectionSqlS;
}