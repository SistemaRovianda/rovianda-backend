// import inquirer from "inquirer";
// import {Connection,createConnection, format} from "mysql";
// import showBanner from "node-banner";
// import {exec} from "child_process";
// class RoviandaTool{
// private roviandaBdConnectionOptions={
//     host: "rovisapi.dyndns.tv",
//     user: "master_rovianda",
//     password:"Sistemas2020",
//     database:"bd_rovianda"
// };
// private roviandaBdConnection:Connection;

// questions = [
//     {
//         type: 'list',
//         name: 'operation',
//         message: '¿Que operacion desea realizar?',
//         choices: ['Traspaso de ventas a Aspel Sae','Salir'],
//         filter(val:string){
//             return val.toLowerCase();
//         }
//     }
// ];

// questionMiddle = [
//     {
//         type: 'input',
//         name: 'date',
//         message: '¿Introduce la fecha de operacion? ej. yyyy-mm-dd',
//         validate(value:string){
//             const regex = value.match(
//                 /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
//             );
//             if(regex){
//                 return true;
//             }
//             return "Por favor introduce una fecha de busqueda valida"
//         }
//     }
// ];

// questionFinal=[
//     {
//         type: 'input',
//         name: 'exitOp',
//         message: '¿Quiere regresar al menu S/N ?',
//         validate(value:string){
//             if(value=="S" || value=="s" || value=="N" || value=="n"){
//                 return true;
//             }
//             return "Por favor Elije una opción"
//         }
//     }
// ];

// async main(){
//     inquirer.prompt(
//         this.questions
//     ).then(async (answers)=>{
//         if((answers.operation as string).includes("traspaso")){
//         inquirer.prompt(this.questionMiddle).then(async(answerMiddle)=>{
//             exec(`start  /D C:\\Users\\"Jose Ignacio"\\Documents\\Proyectos\\Rovianda\\rovianda-backend\\functions\\src ts-node schedule.ts -d `+answerMiddle.date ,(error,stdout,stderr)=>{
//                 console.log(stdout);
//             })
//             await this.questionFinalAsk();
//         });
//     }else if((answers.operation as string).includes("salir")){
//         this.exit();
        
//     }
    
//     })
// }

// async questionFinalAsk(){
//     console.log('\n\n');
//     inquirer.prompt(this.questionFinal).then((anwerFinal)=>{
//         if(anwerFinal.exitOp=="N" || anwerFinal.exitOp=="n"){
//             console.clear();
//             this.exit();
//         }else{
//             console.clear();
//             this.main();
//         }
//     });
// }

// async exit(){
//     if(this.roviandaBdConnection){
//     this.roviandaBdConnection.end();
//     }
//     process.exit();
// }
// async queryMysql(queryStr: string) {
//         return new Promise((resolve,reject)=>{
//             this.roviandaBdConnection.query(queryStr,(err,resul)=>{
//                 if(err) {
//                     console.log("Error en query mysql",err);
//                     reject();
//                 };
//                 resolve(resul);
//             });
//         })
//     }
// }
// let service:RoviandaTool;
// (async()=>{
//         await showBanner('Sistema Rovianda', 'Suite de herramientas');
//             console.log("Llamando...");
//             service=  new RoviandaTool();
//             service.main();
// })();
