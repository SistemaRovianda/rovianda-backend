import { Request, Response } from "express";
import * as https from "https";
import { takeRightWhile } from "lodash";
import { AddressGEODTO, AddressGEOResponse } from "../Models/DTO/AddressGEODTO";
import { ClientGeolocationVisits } from "../Models/DTO/Client.DTO";
import { ClientRepository } from "../Repositories/Client.Repository";
import { ClientService } from "../Services/Client.Service";
export class GeoCodingController{
    private clientService:ClientService;
    constructor(){
        this.clientService = new ClientService();
    }
    async getCoordenatesAddress(req:Request,res:Response){
        console.log(req.body.latitude);
        console.log(req.body.longitude);
        let response:AddressGEOResponse={
            cp:"",
            municipality:"",
            street:"",
            suburb:""
        };
        https.get({host:"maps.googleapis.com",port:443,path:`/maps/api/geocode/json?latlng=${req.body.latitude},${req.body.longitude}&key=AIzaSyCvk270SQghIR0To698pGFCtOnOF70AD2w`},  (resp)=>{
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
            
                let responseApi:AddressGEODTO =JSON.parse(data);
                if(responseApi.results.length){
                    for(let item of responseApi.results[0].address_components){
                        if(item.types.includes("route")){
                            response.street=item.long_name;
                        }
                        if(item.types.includes("locality")){
                            response.municipality=item.long_name;
                        }
                        if(item.types.includes("postal_code")){
                            response.cp=item.long_name;
                        }
                        if(item.types.includes("sublocality")){
                            response.suburb=item.long_name;
                        }
                    }
                }
                res.status(200).send(response);
            });
            
            }).on("error", (err) => {
                res.status(500).send();
            });
    }    

    async getCurrentVisitsClientsLocation(req:Request,res:Response){
        let sellerUid = req.query.sellerUid;
        let date = req.query.date;
        let response:ClientGeolocationVisits[]=await this.clientService.getScheduleByDateLocation(sellerUid,date);
        res.status(200).send(response);
    }
}