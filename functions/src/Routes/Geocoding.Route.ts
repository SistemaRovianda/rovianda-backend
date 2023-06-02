import { GeoCodingController } from "../Controllers/GeoCoding.controller";
import { routeInterface } from "../Models/Route.Interface";
export const GeocodingRoutes:Array<routeInterface>=[

    {
        url:"/rovianda/geocodingaddress",
        method:"post",
        controller:GeoCodingController,
        target:"getCoordenatesAddress"
    },
    {
        url: "/rovianda/getcurrentvisits/clients-location",
        method: "get",
        controller: GeoCodingController,
        target: "getCurrentVisitsClientsLocation"
    }
];