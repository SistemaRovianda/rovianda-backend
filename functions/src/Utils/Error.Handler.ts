import {Response} from 'express';


export class ErrorHandler{
    parser(message:string,res:Response){
        let code = message.split(",")[0];
        let messageToSend = message.split(",")[1];
        let codeParse = code.substring(1,code.length-1);
        return res.status(+codeParse).send({
            msg: messageToSend
        });
    }
}