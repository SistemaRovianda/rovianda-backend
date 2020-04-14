import  * as pdf from 'html-pdf';
import { Entrances_Meat } from '../Models/Entity/Entrances.Meat';
  

export class pdfEntryMeat{

    async createEntryMeatPDF(entrances_meat:Entrances_Meat){
    
    let temA,temR; 
    if(entrances_meat.temperature.accepted==true){ temA="Aceptado",temR="";} else { temR="Rechazado",temA="";} 
    let traA,traR;
    if(entrances_meat.transport.accepted==true){traA="Aceptado", traR="";}else{ traR="Rechazado",traA="";} 
    let texA,texR;
    if(entrances_meat.texture.accepted==true){ texR="", texA="Aceptado";}else{ texA="",texR="Rechazado";}
    let wehA,wehR;
    if(entrances_meat.weight.accepted==true){ wehA="Aceptado",wehR="";}else{ wehR="Rechazado",wehA="";}
    let odoA,odoR
    if(entrances_meat.odor.accepted==true){ odoR="", odoA="Aceptado";}else{ odoA="", odoR="Rechazado";}
    let packA,packR
    if(entrances_meat.packing.accepted==true){ packR="",packA="Aceptado";}else{packA="", packR="Rechazado";}
    let smA,smR;
    if(entrances_meat.strageMaterial.accepted==true){ smR="", smA="Aceptado";}else{smA="",smR="Rechazado";}
    let expA,expR;
    if(entrances_meat.expiration.accepted==true){ expR="",expA="Aceptado";}else{ expA="",expR="Rechazado";}
    
    let content=`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rovianda</title>


<style>
    .espa{
        height: 10px;
    }
    .separa{
        height: 10px;
    }
    table{
        border: #65768C 3px solid;
    }
    #ubica{
        margin-bottom: 150px;;
    }
</style>

</head>

<body bgcolor="#9FB0BF">

<table  align="center" border="1px"   width="50%" > 
    <tr>
        <td rowspan="2" align="center" >  <img src="${"./rovi.png"}" alt=""  height="90px">    </td>
        <td align="center">ROVIANDA S.A.P.I. DE C.V.</td>
        <td colspan="2" align="center">F-CAL-RO-04</td>
    </tr>
        
        <td align="center">RECEPCIÓN DE MATERIA PRIMA CÁRNICOS</td>
        <td align="center">LOTE INTERNO: ${entrances_meat.lote_interno}</td>
        <td align="center">Pág.: 1 de 1</td>
</table>
<!-- ************************************************************************************************-->


<table align="center" border="1px"  width="50%"  >
    <tr>

        <img src="" alt="">
       
        <th>Fecha</th>
        <th>Proveedor</th>
        <th colspan="2">Materia prima</th>
        <th>Lote proveedor</th>
    </tr>
     <!-- ************************************************************************************************-->
    <tr>
        <th class="espa">${entrances_meat.created_at}</th>
        <th class="espa">${entrances_meat.proveedor}</th>
        <th class="espa"  colspan="2">${entrances_meat.raw_material}</th>
        <th class="espa" >${entrances_meat.lote_proveedor}</th>
    </tr>
   <!-- ************************************************************************************************-->  
     <th>Control</th>
     <th>Estándar</th>
     <th>Aceptado</th>
     <th>Rechazado</th>
     <th>Observaciones</th>
<!-- ************************************************************************************************-->
     <tr>
         <td>Transporte </td>
         <td align="center" height="2px">Limpio, sin olores,sin material ajeno, sin plagas </td>
         
         <td>${traA}</td>
         <td>${traR}</td>
         <td>${entrances_meat.transport.descriptions}</td>
     </tr>

     <tr>
         <td>Empaque</td>
         <td>Sin daños y limpio </td>
         <td>${packA}</td>
         <td>${packR}</td>
         <td>${entrances_meat.packing.descriptions}</td>
     </tr>

     <tr>
         <td>Caducidad</td>
         <td>Vigente:</td>
         <td>${expA}</td>
         <td>${expR}</td>
         <td>${entrances_meat.expiration.descriptions}</td>

     </tr>

     <tr>
         <td>Peso</td>
         <td>Según el empaque</td>
         <td>${wehA}</td>
         <td>${wehR}</td>
         <td>${entrances_meat.weight.descriptions}</td>

     </tr>

     <tr>
         <td>Materia extraña</td>
         <td>Ausente</td>
         <td>${smA}</td>
         <td>${smR}</td>
         <td>${entrances_meat.strageMaterial.descriptions}</td>

     </tr>

     <tr>
         <td rowspan="2">Temperatura</td>
         <td>Fresco: Max. 4°C </td> 
         <td>${temA}</td>
         <td>${temR}</td>
         <td>${entrances_meat.temperature.descriptions}</td>

     </tr>  

     <tr>
        <td>Congelado: Max. -18°C</td>
        <td>${temA}</td>
        <td>${temR}</td>
        <td>${entrances_meat.temperature.descriptions}</td>   
     </tr>

     <tr>
        <td>Olor</td>
        <td>Característico</td>
        <td>${odoA}</td>
        <td>${odoR}</td>
        <td>${entrances_meat.odor.descriptions}</td>

     </tr>

     <tr>
        <td>Color</td>
        <td>Característico</td>
        <td>${texA}</td>
        <td>${texR}</td>
        <td>${entrances_meat.texture.descriptions}</td>

     </tr>

     <tr>
        <td>Textura </td>
        <td>Firme, Característico</td>
        <td>${texA}</td>
        <td>${texR}</td>
        <td>${entrances_meat.texture.descriptions}</td>

     </tr>

     <tr>
        <td colspan="5">Desviación:</td>
     </tr>

     <tr>
        <td class ="separa" colspan="5"></td>
     </tr>

     <tr>
        <td colspan="5">Acción correctiva:</td>
     </tr>
     <tr>
        <td  class ="separa" colspan="5"></td>
    </tr>

    <tr>
        <td height="180px"  width="" colspan="5" > <div id="ubica"> Etiqueta: </div>  </td>
    </tr>

    <tr>
        <th class="fin" >Inspector de calidad</th>
        <th class="fin"  >Ing. Tlazalo Aparicio Josué Jair</th>
        <th class="fin" colspan="3" >Firma:</th>
    </tr>         
</table>

</body>
</html>
    `;

    pdf.create(content).toFile('./Entrances-Meat-pdf.pdf', function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });

}
}

       