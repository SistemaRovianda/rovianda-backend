import {App} from "./App/App";

let server = new App();
server.app.listen(3000,()=>{
    console.log("Sistema iniciado");
});