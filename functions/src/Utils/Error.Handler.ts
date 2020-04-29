import {Response} from 'express';


export class ErrorHandler{
    parser(message:string,res:Response){
        let code = message.split(",")[0];
        let messageToSend = message.split(",")[1];
        let codeParse = code.substring(1,code.length-1);
        if(!isNaN(+codeParse)){
        return res.status(+codeParse).send({
            msg: messageToSend
        });
        }else{
            return res.status(500).send({msg: message})
        }
    }
}