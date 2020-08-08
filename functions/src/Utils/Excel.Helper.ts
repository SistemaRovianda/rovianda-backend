
import * as excel from "excel4node";
import Logo from "../Models/Logo";
import * as fs from "fs";
import * as os from "os";
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { User } from "../Models/Entity/User";
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
import { EntranceMeat } from '../Models/Entity/Entrances.Meat';
import { Formulation } from "../Models/Entity/Formulation";
export default class Excel4Node{

    generateFormulationDocumentByDates(formulations: Formulation[]){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); // se inicializa un workbook (archivo de excel)

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');// Se convierte a buffer el base64 (solo el base64 no la informacion de tipo de archivo)

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);//Se crea el archivo imagen en la carpeta temporal

        formulations.forEach((formulation , index) => {

            let worksheet = workbook.addWorksheet('Pagina '+(index+1)); //Se añade una hoja de calculo y se pasa el nombre por parametro

            
            worksheet.addImage({ //comando para añadir una imagen
                path: `${tmp}/imageTmp.png`,//path de la imagen
                name: 'logo', // nombre no es obligatorio
                type: 'picture', // el tipo de archivo
                position: { // existen diferentes posiciones
                    type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                    //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                    from: { //
                    col: 1,//columna donde empieza la esquina superior izquierda
                    colOff: '1in', //margen
                    row: 1, // fila donde empieza la esquina superior izquierda
                    rowOff: '0.1in', // margen 
                    },
                    to: {
                        col: 3, // columna donde termina la esquina inferior derecha
                        colOff: '1in',
                        row: 8, // fila donde termina la esquina inferior derecha
                        rowOff: '0.1in',
                    }
                }
            });

            let style = workbook.createStyle({ // se crea un nuevo estilo
                font: {
                color: '#000000',//colo formato html hexadecimal
                size: 12, //tamaño de la fuente
                },
                border: { //configuracion de bordes
                    top: {
                        style:'double' //stilo de borde
                        //colo: #FFFFFF color de borde
                    },
                    bottom: {
                        style:'double'//existen mas estilos de borde, consultar documentacion
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: { //alineacion de columnas
                    wrapText: true //alinear en base al texto
                }
            });

            let styleUser = workbook.createStyle({//se puede crear mas de un estilo
                font: {
                    bold: true,
                    size: 12
                },
                border: {
                    top: {
                        style:'double'
                    },
                    bottom: {
                        style:'double'
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: {
                    wrapText: true
                }
            })
            //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
            //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
            //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
            worksheet.cell(2, 6, 2, 10, true).string("BITACORA DE CONTROL DE CALIDAD FORMULACION").style({//se crea una nueva celda 
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',//alineamiento del texto
                }
            });

            worksheet.cell(4, 5, 4, 8, true).string(`Realizo, Nombre:  ${formulation.make.name} ${formulation.make.firstSurname} ${formulation.make.lastSurname}`).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento

            worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);

            worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${formulation.make.job}`).style(styleUser);
            
            worksheet.cell(9, 4, 9, 5, true).string("Producto").style(style);
            worksheet.cell(9, 6, 9, 7, true).string("Lote").style(style);
            worksheet.cell(9, 8, 9, 9, true).string("Temperatura carne").style(style);
            worksheet.cell(9, 10, 9, 11, true).string("Temperatura agua").style(style);
            worksheet.cell(9, 12, 9, 13, true).string("Ingredientes").style(style);
            worksheet.cell(9, 14, 9, 15, true).string("Fechas").style(style);
            
            let row = 10;
            let col = 4;

            //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal

            worksheet.cell(row, col, row, ++col, true).string(`${formulation.productRovianda.name}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.loteInterno}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.temp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.waterTemp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.formulationIngredients[0].productId.description}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.date}`).style(style);
            for (let i = 1; i < formulation.formulationIngredients.length; i++) {
                col = 4;
                row++;
                worksheet.cell(row, col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string(`${formulation.formulationIngredients[i].productId.description}`).style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
            }
            

            worksheet.cell(++row, 4, row, 7,true).string(`Realizo, Nombre:  ${formulation.verifit.name} ${formulation.verifit.firstSurname} ${formulation.verifit.lastSurname}`).style(styleUser);

            worksheet.cell(row, 8, row, 9, true).string("Firma:  ").style(styleUser);

            worksheet.cell(row, 10, row, 11, true).string(`Puesto:  ${formulation.verifit.job}`).style(styleUser);
        });

        return workbook;//se retorna el workbook
    }
  
    generatePackingDocumentByDates(user:User,data:EntrancePacking[]){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('Packaging'); //Se añade una hoja de calculo y se pasa el nombre por parametro

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');// Se convierte a buffer el base64 (solo el base64 no la informacion de tipo de archivo)

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);//Se crea el archivo imagen en la carpeta temporal

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        
        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 5, 2, 11, true).string("BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${data[0].make ? data[0].make.name+" "+data[0].make.firstSurname+" "+data[0].make.lastSurname : "" }`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${data[0].make ? data[0].make.job : "" }`).style(styleUser);

        let row = 9;
        let col = 4;

        for (let i = 0; i < data.length; i++) {
       
            worksheet.cell(row, col, row, col+2, true).string(`Materia prima: ${data[i].product.description} `).style(style);
            worksheet.cell(row, col+3, row+1, col+3, true).string(`Lote proveedor: ${data[i].loteProveedor}`).style(style);
            worksheet.cell(row, col+4, row+1, col+4, true).string(`Fecha: ${data[i].date}`).style(style);
            worksheet.cell(row+1, col, row+1, col+2, true).string(`Proveedor: ${data[i].proveedor}`).style(style);
    
            worksheet.cell(row+2, col,   row+2, col,   true).string("Control").style(style);
            worksheet.cell(row+2, col+1, row+2, col+1, true).string("Estandar").style(style);
            worksheet.cell(row+2, col+2, row+2, col+2, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+3, row+2, col+3, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col,   true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+1, row+3, col+1, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+2, row+3, col+2, true).string(` ${data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+3, row+3, col+3, true).string(` ${!data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data[i].observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col,   true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+1, row+4, col+1, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+2, row+4, col+2, true).string(` ${data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+3, row+4, col+3, true).string(` ${!data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col,   true).string("Transpote").style(style);
            worksheet.cell(row+5, col+1, row+5, col+1, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+2, row+5, col+2, true).string(` ${data[i].transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+3, row+5, col+3, true).string(` ${!data[i].transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col,   true).string("Empaque").style(style);
            worksheet.cell(row+6, col+1, row+6, col+1, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+2, row+6, col+2, true).string(` ${data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+3, row+6, col+3, true).string(` ${!data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(`  `).style(style);
            row = row + 7;
        }
        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal
        worksheet.cell(++row, 4, row, 6,true).string(`Verifico:  ${data[0].verifit == null ? "": data[0].verifit.name} ${data[0].verifit == null ? "": data[0].verifit.firstSurname} ${data[0].verifit == null ? "": data[0].verifit.lastSurname}`).style(styleUser);
        worksheet.cell(row, 7, row, 7, true).string("Firma:  ").style(styleUser);
        worksheet.cell(row, 8, row, 8, true).string(`Puesto: ${data[0].verifit == null ? "": data[0].verifit.job}`).style(styleUser);

        return workbook;//se retorna el workbook
    }
  

    generateEntryMeatsDocumentByDate(user:User, meat: EntranceMeat[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 
        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        meat.forEach((m , index)=>{
            let worksheet = workbook.addWorksheet('Pagina '+(index+1)); 

            

            worksheet.addImage({ 
                path: `${tmp}/imageTmp.png`,
                name: 'logo', 
                type: 'picture', 
                position: { 
                    type: 'twoCellAnchor', 
                    
                    from: { 
                    col: 1,
                    colOff: '1in', 
                    row: 1, 
                    rowOff: '0.1in', 
                    },
                    to: {
                        col: 3, 
                        colOff: '1in',
                        row: 8, 
                        rowOff: '0.1in',
                    }
                }
            });

            let style = workbook.createStyle({ 
                font: {
                color: '#000000',
                size: 12, 
                },
                border: { 
                    top: {
                        style:'double' 
                        
                    },
                    bottom: {
                        style:'double'
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: { 
                    wrapText: true 
                }
            });

            let styleUser = workbook.createStyle({
                font: {
                    bold: true,
                    size: 12
                },
                border: {
                    top: {
                        style:'double'
                    },
                    bottom: {
                        style:'double'
                    },
                    left: {
                        style:'double'
                    },
                    right: {
                        style:'double'
                    }
                },
                alignment: {
                    wrapText: true
                }
            })
            worksheet.cell(1, 4, 2, 8, true).string("ROVIANDA S.A.P.I. DE C.V").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(1, 10, 2, 12, true).string("F-CAL-RO-04").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(3, 4, 4, 9, true).string("CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO").style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(3, 10, 4, 11, true).string("LOTE INTERNO: "+m.loteInterno).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            worksheet.cell(3, 12).string(`Pag: ${(index+1)} de ${meat.length}`).style({
                font: {
                    bold: true
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'center'
                }
            });

            let row = 5;

            worksheet.cell(row, 4).string(`Fecha`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 5, row, 9, true).string(`Proveedor`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10, row, 11, true).string(`Materia prima`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 12).string(`Lote proveedor`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`${new Date(m.createdAt).toLocaleDateString()}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 5, row, 9, true).string(`${m.proveedor}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10, row, 11, true).string(`${m.rawMaterial}`).style(style).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(row, 12).string(`${m.loteProveedor}`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`Control`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 5, row, 9, true).string(`Estándar`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 10).string(`Aceptado`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 11).string(`Rechazado`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });
            worksheet.cell(row, 12).string(`Observaciones`).style(styleUser).style({
                aligment:{
                    horizontal: 'center'
                }
            });

            worksheet.cell(++row, 4).string(`Transporte`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Limpio, sin olores,sin material ajeno, sin plagas	`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.transport.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.transport.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);
            
            worksheet.cell(++row, 4).string(`Empaque`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Sin daños y limpio`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.packing.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.packing.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            
            worksheet.cell(++row, 4).string(`Caducidad`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Vigente:`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.expiration.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.expiration.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            
            worksheet.cell(++row, 4).string(`Peso`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Segun el empaque`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.weight.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.weight.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            
            worksheet.cell(++row, 4, ++row, 4, true).string(`Temperatura`).style(styleUser);
            worksheet.cell(row-1, 5, row-1, 9, true).string(`Fresco: Max. 4°C`).style(styleUser);
            worksheet.cell(row-1, 10).string(`${m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row-1, 11).string(`${!m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row-1, 12).string(``).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Fresco: Max. -18°C`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.temperature.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            
            worksheet.cell(++row, 4).string(`Olor`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Caracteristico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.odor.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.odor.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);
            
            worksheet.cell(++row, 4).string(`Color`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Caracteristico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            
            worksheet.cell(++row, 4).string(`Texture`).style(styleUser);
            worksheet.cell(row, 5, row, 9, true).string(`Firme, Característico`).style(styleUser);
            worksheet.cell(row, 10).string(`${m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 11).string(`${!m.texture.accepted? "xxx" : ""}`).style(styleUser);
            worksheet.cell(row, 12).string(``).style(styleUser);

            worksheet.cell(++row, 4, row, 12, true).string(`Desviación:`).style(styleUser);
            worksheet.cell(++row, 4, row, 12, true).string(``).style(style);
            
            worksheet.cell(++row, 4, row, 12, true).string(`Accion correctiva:`).style(styleUser);
            worksheet.cell(++row, 4, row, 12, true).string(``).style(style);

            
            worksheet.cell(++row, 4, row+10, 12, true).string(`Etiqueta:`).style(styleUser);
            row+=10;
            worksheet.cell(++row, 4, row, 9, true).string(`Realizó:`).style(styleUser);
            worksheet.cell(row, 10, row, 12, true).string(`Firma:`).style(styleUser);
        });
        return workbook;
    }
  
    generateOvenProductsDocumentsByDate(userElaborated:User, userVerify: User, data: OvenProducts[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('OvenProducts'); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(1, 6, 1, 12, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        worksheet.cell(3, 6, 3, 12, true).string("CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        let row = 5;

        data.forEach(ovenProduct => {
            worksheet.cell(row, 11, row, 13, true).string(`Tiempo estimado: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(++row, 4, row, 6, true).string(`Producto: ${ovenProduct.product.name}`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`PCC: ${ovenProduct.pcc}`).style(styleUser);
            worksheet.cell(row, 9, row, 11, true).string(`Fecha: ${ovenProduct.date}`).style(styleUser);
            worksheet.cell(row, 12, row, 13, true).string(`PCC = 70°`).style(styleUser);

            worksheet.cell(++row, 4).string(`Hora`).style(styleUser);
            worksheet.cell(row, 5, row, 6, true).string(`Temperatura interna del producto`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`Temperatura del horno`).style(styleUser);
            worksheet.cell(row, 9).string(`Humedad`).style(styleUser);
            worksheet.cell(row, 10, row, 13, true).string(`Observaciones`).style(styleUser);

            for(let i = 0 ; i < ovenProduct.revisions.length ; i++){
                worksheet.cell(++row, 4).string(`${ovenProduct.revisions[i].hour}`).style(style);
                worksheet.cell(row, 5, row, 6, true).string(`${ovenProduct.revisions[i].interTemp}`).style(style);
                worksheet.cell(row, 7, row, 8, true).string(`${ovenProduct.revisions[i].ovenTemp}`).style(style);
                worksheet.cell(row, 9).string(`${ovenProduct.revisions[i].humidity}`).style(style);
                worksheet.cell(row, 10, row, 13, true).string(`${ovenProduct.revisions[i].observations}`).style(style);
            }
            row+=2;

        });

        worksheet.cell(++row, 4,row, 8, true).string(`Elaboró: ${userElaborated.name} ${userElaborated.firstSurname}, ${userElaborated.lastSurname}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${data[0].jobElaborated}`).style(style);

        worksheet.cell(++row, 4,row, 8, true).string(`Revisó: ${userVerify.name} ${userVerify.firstSurname}, ${userVerify.lastSurname}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${data[0].jobVerify}`).style(style); 

        worksheet.cell(++row, 4,row, 8, true).string(`Verificó: ${userVerify.name} ${userVerify.firstSurname}, ${userVerify.lastSurname}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${data[0].nameVerify}`).style(style); 

        return workbook;
    }

    generateEntrysDriefsDocumentByDates(user:User,data:EntranceDrief[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Entrances-Driefs');
        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 1,//columna donde empieza la esquina superior izquierda
                  colOff: '1in', //margen
                  row: 1, // fila donde empieza la esquina superior izquierda
                  rowOff: '0.1in', // margen 
                },
                to: {
                    col: 3, // columna donde termina la esquina inferior derecha
                    colOff: '1in',
                    row: 8, // fila donde termina la esquina inferior derecha
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ // se crea un nuevo estilo
            font: {
              color: '#000000',//colo formato html hexadecimal
              size: 12, //tamaño de la fuente
            },
            border: { //configuracion de bordes
                top: {
                    style:'double' //stilo de borde
                    //colo: #FFFFFF color de borde
                },
                bottom: {
                    style:'double'//existen mas estilos de borde, consultar documentacion
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { //alineacion de columnas
                wrapText: true //alinear en base al texto
            }
        });

        let styleUser = workbook.createStyle({//se puede crear mas de un estilo
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        //worksheet.cell(n,m).string("HOLA MUNDO") crea una celda en la fila n, columna m con el texto "HOLA MUNDO"
        //worksheet.cell(n,m,o,p,false).string("NA") llena las celdas del rango de la fila n columna m, hasta fila o columna p, con el texto "NA"
        //worsheet.cell(n,m,o,p, true).string("BIG PUPPA") Crea una mega celda con el rango de la fila n columna m, hasta la fila o columna p
        worksheet.cell(2, 4, 2, 11, true).string("RECEPCIÓN DE MATERIA PRIMA SECOS").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre:  ${user.name} ${user.firstSurname} ${user.lastSurname}`).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${user.job}`).style(styleUser);
  
        let row = 9;
        let col = 3;

        for (let i = 0; i < data.length; i++) {
       
            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data[i].product.description} `).style(style);
            worksheet.cell(row+1, col,   row+1, col+3, true).string(`Proveedor: ${data[i].proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data[i].loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${data[i].date}`).style(style);
           
            worksheet.cell(row+2, col,   row+2, col+1, true).string("Control").style(style);
            worksheet.cell(row+2, col+2, row+2, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+5, row+2, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+6, row+2, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data[i].quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data[i].observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data[i].strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data[i].transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data[i].transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data[i].paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

            worksheet.cell(row+7, col,   row+7, col+1, true).string("Olor").style(style);
            worksheet.cell(row+7, col+2, row+7, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(` ${data[i].odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+5, row+7, col+5, true).string(` ${!data[i].odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+6, row+7, col+7, true).string(`  `).style(style);

            worksheet.cell(row+8, col,   row+8, col+1, true).string("Color").style(style);
            worksheet.cell(row+8, col+2, row+8, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+8, col+4, row+8, col+4, true).string(` ${data[i].color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+5, row+8, col+5, true).string(` ${!data[i].color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+6, row+8, col+7, true).string(`  `).style(style);

            worksheet.cell(row+9, col,   row+9, col+1, true).string("Textura").style(style);
            worksheet.cell(row+9, col+2, row+9, col+3, true).string("Caracteristico").style(style);
            worksheet.cell(row+9, col+4, row+9, col+4, true).string(` ${data[i].texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+5, row+9, col+5, true).string(` ${!data[i].texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+6, row+9, col+7, true).string(`  `).style(style);

            worksheet.cell(row+10, col,   row+10, col+1, true).string("Peso").style(style);
            worksheet.cell(row+10, col+2, row+10, col+3, true).string("Según Empaque").style(style);
            worksheet.cell(row+10, col+4, row+10, col+4, true).string(` ${data[i].weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+5, row+10, col+5, true).string(` ${!data[i].weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+6, row+10, col+7, true).string(`  `).style(style);
            row = row + 11;
        }
        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal
        worksheet.cell(++row, 9, row, 10,true).string("F-CAL-RO-02").style(style);
        return workbook;//se retorna el workbook
    }


    generateOvenProductsDocumentsById(userElaborated:User, userVerify: User, ovenProduct:OvenProducts,revisionOven:RevisionsOvenProducts[]){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook(); 

        let worksheet = workbook.addWorksheet('OvenProductsById'); 

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');

        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor', 

                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({ 
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 

                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(1, 6, 1, 12, true).string("EMPACADORA ROVIANDA S.A.P.I. DE C.V").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        worksheet.cell(3, 6, 3, 12, true).string("CONTROL DE TEMPERATURA DEL CONOCIMENTO DEL PRODUCTO").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center'
            }
        });

        let row = 5;
            worksheet.cell(row, 11, row, 13, true).string(`Tiempo estimado: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(++row, 4, row, 6, true).string(`Producto: ${ovenProduct.stimatedTime}`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`PCC: ${ovenProduct.pcc}`).style(styleUser);
            worksheet.cell(row, 9, row, 11, true).string(`Fecha: ${ovenProduct.date}`).style(styleUser);
            worksheet.cell(row, 12, row, 13, true).string(`PCC = 70°`).style(styleUser);

            worksheet.cell(++row, 4).string(`Hora`).style(styleUser);
            worksheet.cell(row, 5, row, 6, true).string(`Temperatura interna del producto`).style(styleUser);
            worksheet.cell(row, 7, row, 8, true).string(`Temperatura del horno`).style(styleUser);
            worksheet.cell(row, 9).string(`Humedad`).style(styleUser);
            worksheet.cell(row, 10, row, 13, true).string(`Observaciones`).style(styleUser);

            for(let i = 0 ; i < revisionOven.length ; i++){
                worksheet.cell(++row, 4).string(`${revisionOven[i].hour}`).style(style);
                worksheet.cell(row, 5, row, 6, true).string(`${revisionOven[i].interTemp}`).style(style);
                worksheet.cell(row, 7, row, 8, true).string(`${revisionOven[i].ovenTemp}`).style(style);
                worksheet.cell(row, 9).string(`${revisionOven[i].humidity}`).style(style);
                worksheet.cell(row, 10, row, 13, true).string(`${revisionOven[i].observations}`).style(style);
            }
            row+=2;
       

        worksheet.cell(++row, 4,row, 8, true).string(`Elaboró: ${userElaborated.name} ${userElaborated.firstSurname}, ${userElaborated.lastSurname}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobElaborated}`).style(style);

        worksheet.cell(++row, 4,row, 8, true).string(`Revisó: ${ovenProduct.nameCheck ? ovenProduct.nameCheck:" " } `).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.jobCheck ? ovenProduct.jobCheck : " " }`).style(style); 

        worksheet.cell(++row, 4,row, 8, true).string(`Verificó: ${userVerify.name} ${userVerify.firstSurname}, ${userVerify.lastSurname}`).style(styleUser);
        worksheet.cell(row, 9,row, 10, true).string(`Firma: `).style(styleUser);
        worksheet.cell(row, 11,row, 13, true).string(`Puesto: ${ovenProduct.nameVerify}`).style(style); 

        return workbook;
    }
 
   generatePackingDocumentById(user:User,data:EntrancePacking){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Packaging');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ 
            path: `${tmp}/imageTmp.png`,
            name: 'logo', 
            type: 'picture', 
            position: { 
                type: 'twoCellAnchor',
                from: { 
                  col: 1,
                  colOff: '1in', 
                  row: 1, 
                  rowOff: '0.1in', 
                },
                to: {
                    col: 3, 
                    colOff: '1in',
                    row: 8, 
                    rowOff: '0.1in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(2, 5, 2, 11, true).string("BITACORA DE CONTROL DE CALIDAD ALMACEN EMPAQUES").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${data.make ? data.make.name+" "+data.make.firstSurname+" "+data.make.lastSurname : "" }`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${data.make ? data.make.job : "" }`).style(styleUser);
  
        let row = 9;
        let col = 3;

            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data.product.description} `).style(style);
            worksheet.cell(row+1, col,   row+1, col+3, true).string(`Proveedor: ${data.proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data.loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${data.date}`).style(style);
           
            worksheet.cell(row+2, col,   row+2, col+1, true).string("Control").style(style);
            worksheet.cell(row+2, col+2, row+2, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+5, row+2, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+6, row+2, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data.observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data.transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data.transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

           worksheet.cell(row+8, 3, row+8, 5, true).string(`Verifico:  ${data.verifit == null ? "": data.verifit.name} ${data.verifit == null ? "": data.verifit.firstSurname} ${data.verifit == null ? "": data.verifit.lastSurname}`).style(styleUser);
           worksheet.cell(row+8, 6, row+8, 7, true).string("Firma:  ").style(styleUser);
           worksheet.cell(row+8, 8, row+8, 10, true).string(`Puesto:  ${data.verifit == null ? "": data.verifit.job}`).style(styleUser);
           worksheet.cell(row+9, 9, row+9, 10, true).string("F-CAL-RO-03").style(styleUser);
        return workbook;
    }

    generateEntryMeatDocumentById(user:User,data:EntranceMeat){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Entry-Meat');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
    
        worksheet.cell(4, 5, 4, 7, true).string("ROVIANDA S.A.P.I DE C.V").style(styleUser);
        worksheet.cell(4, 8, 4, 9, true).string("F-CAL-RO-04").style(styleUser);
        worksheet.cell(5, 5, 6, 7, true).string("RECEPCIÓN DE MATERIA PRIMA CÁRNICOS").style(styleUser);
        worksheet.cell(5, 8, 6, 8, true).string(`Lote interno: ${data.loteInterno}`).style(styleUser);
        worksheet.cell(5, 9, 6, 9, true).string("Pág.: 1 de 1").style(styleUser);
  
        let row = 9;
        let col = 3;

        worksheet.cell(8, 3, 8, 4, true).string(" Fecha ").style(styleUser);
        worksheet.cell(8, 5, 8, 6, true).string(" Proveedor ").style(styleUser);
        worksheet.cell(8, 7, 8, 8, true).string(" Materia Prima ").style(styleUser);
        worksheet.cell(8, 9, 8, 10, true).string(" Lote proveedor ").style(styleUser);

        worksheet.cell(9, 3, 9, 4, true).string(`${data.createdAt}`).style(style);
        worksheet.cell(9, 5, 9, 6, true).string(`${data.proveedor}`).style(style);
        worksheet.cell(9, 7, 9, 8, true).string(`${data.rawMaterial}`).style(style);
        worksheet.cell(9, 9, 9, 10, true).string(`${data.loteProveedor}`).style(style);

        worksheet.cell(10, 3, 10, 4, true).string(" Control ").style(styleUser);
        worksheet.cell(10, 5, 10, 6, true).string(" Estandar ").style(styleUser);
        worksheet.cell(10, 7, 10, 7, true).string(" Aceptado ").style(styleUser);
        worksheet.cell(10, 8, 10, 8, true).string(" Recahzado").style(styleUser);
        worksheet.cell(10, 9, 10, 10, true).string(" Observaciones ").style(styleUser);

        worksheet.cell(11, 3, 12, 4, true).string("Transporte").style(style);
        worksheet.cell(11, 5, 12, 6, true).string("Limpio, sin olores, sin material ajeno, sin plagas").style(style);
        worksheet.cell(11, 7, 12, 7, true).string(` ${data.transport.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(11, 8, 12, 8, true).string(` ${!data.transport.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(11, 9, 12, 10, true).string(` ${data.transport.observations} `).style(style);

        worksheet.cell(13, 3, 13, 4, true).string("Empaque").style(style);
        worksheet.cell(13, 5, 13, 6, true).string("Sin daños y limpio").style(style);
        worksheet.cell(13, 7, 13, 7, true).string(` ${data.packing.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(13, 8, 13, 8, true).string(` ${!data.packing.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(13, 9, 13, 10, true).string(` ${data.packing.observations} `).style(style);
            
        worksheet.cell(14, 3, 14, 4, true).string("Caducidad").style(style);
        worksheet.cell(14, 5, 14, 6, true).string("Vigente").style(style);
        worksheet.cell(14, 7, 14, 7, true).string(` ${data.expiration.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(14, 8, 14, 8, true).string(` ${!data.expiration.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(14, 9, 14, 10, true).string(` ${data.expiration.observations} `).style(style);

        worksheet.cell(15, 3, 15, 4, true).string("Peso").style(style);
        worksheet.cell(15, 5, 15, 6, true).string("Segun el empaque").style(style);
        worksheet.cell(15, 7, 15, 7, true).string(` ${data.weight.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(15, 8, 15, 8, true).string(` ${!data.weight.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(15, 9, 15, 10,true).string(` ${data.weight.observations} `).style(style);

        worksheet.cell(16, 3, 16, 4, true).string("Materia extraña").style(style);
        worksheet.cell(16, 5, 16, 6, true).string("Ausente").style(style);
        worksheet.cell(16, 7, 16, 7, true).string(` ${data.strangeMaterial.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(16, 8, 16, 8, true).string(` ${!data.strangeMaterial.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(16, 9, 16, 10,true).string(` ${data.strangeMaterial.observations} `).style(style);

        worksheet.cell(17, 3, 18, 4, true).string("Temperatura").style(style);
        worksheet.cell(17, 5, 17, 6, true).string("Fresco: Max. 4C°").style(style);
        worksheet.cell(17, 7, 17, 7, true).string(` ${data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(17, 8, 17, 8, true).string(` ${!data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(18, 5, 18, 6, true).string("Congelado: Max -18C°").style(style);
        worksheet.cell(18, 7, 18, 7, true).string(` ${data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(18, 8, 18, 8, true).string(` ${!data.temperature.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(17, 9, 18, 10,true).string(` ${data.temperature.value} `).style(style);

        worksheet.cell(19, 3, 19, 4, true).string("Olor").style(style);
        worksheet.cell(19, 5, 19, 6, true).string("Característico").style(style);
        worksheet.cell(19, 7, 19, 7, true).string(` ${data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(19, 8, 19, 8, true).string(` ${!data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(19, 9, 19, 10,true).string(` ${data.odor.observations} `).style(style);

        worksheet.cell(20, 3, 20, 4, true).string("Color").style(style);
        worksheet.cell(20, 5, 20, 6, true).string("Característico").style(style);
        worksheet.cell(20, 7, 20, 7, true).string(` ${data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(20, 8, 20, 8, true).string(` ${!data.odor.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(20, 9, 20, 10,true).string(` `).style(style);

        worksheet.cell(21, 3, 21, 4, true).string("Textura").style(style);
        worksheet.cell(21, 5, 21, 6, true).string("Firme Característico").style(style);
        worksheet.cell(21, 7, 21, 7, true).string(` ${data.texture.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(21, 8, 21, 8, true).string(` ${!data.texture.accepted ? "xxx" : ""} `).style(style);
        worksheet.cell(21, 9, 21, 10,true).string(` ${data.texture.observations} `).style(style);

        worksheet.cell(22, 3, 22, 10,true).string("Desviación").style(style);
        worksheet.cell(23, 3, 23, 10,true).string("").style(style);

        worksheet.cell(24, 3, 24, 10, true).string("Acción correctiva").style(style);
        worksheet.cell(25, 3, 25, 10, true).string("").style(style);
        
        worksheet.cell(26, 3, 26, 10, true).string("Etiqueta").style(style);
        worksheet.cell(27, 3, 37, 10, true).string("").style(style);

        worksheet.cell(38, 3, 38, 7, true).string(`Realizó:  ${user.name} ${user.firstSurname} ${user.lastSurname}`).style(styleUser);
        worksheet.cell(38, 8, 38, 10, true).string("Firma:  ").style(styleUser);
           
        return workbook;
    }


    generateEntryDriefDocumentById(user:User,data:EntranceDrief){
        let tmp = os.tmpdir(); 
        var workbook = new excel.Workbook();

        let worksheet = workbook.addWorksheet('Entry-Drief');

        let buff = new Buffer(Logo.data.split(',')[1], 'base64');
        fs.writeFileSync(`${tmp}/imageTmp.png`, buff);

        worksheet.addImage({ //comando para añadir una imagen
            path: `${tmp}/imageTmp.png`,//path de la imagen
            name: 'logo', // nombre no es obligatorio
            type: 'picture', // el tipo de archivo
            position: { // existen diferentes posiciones
                type: 'twoCellAnchor', //oneCellAnchor para respetar tamaño de imagen y solo se manda from
                //twoCellAnchor para modificar el tamaño de imagen y se manda from y to
                from: { //
                  col: 3,//columna donde empieza la esquina superior izquierda
                  colOff: '0in', //margen
                  row: 2, // fila donde empieza la esquina superior izquierda
                  rowOff: '0in', // margen 
                },
                to: {
                    col: 4, // columna donde termina la esquina inferior derecha
                    colOff: '0in',
                    row: 6, // fila donde termina la esquina inferior derecha
                    rowOff: '0in',
                  }
              }
          });

        let style = workbook.createStyle({
            font: {
              color: '#000000',
              size: 12, 
            },
            border: { 
                top: {
                    style:'double' 
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: { 
                wrapText: true 
            }
        });

        let styleUser = workbook.createStyle({
            font: {
                bold: true,
                size: 12
            },
            border: {
                top: {
                    style:'double'
                },
                bottom: {
                    style:'double'
                },
                left: {
                    style:'double'
                },
                right: {
                    style:'double'
                }
            },
            alignment: {
                wrapText: true
            }
        })
        worksheet.cell(2, 5, 2, 11, true).string("RECEPCIÓN DE MATERIA PRIMA SECOS").style({
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            }
        });
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre: ${user.name +" "+user.firstSurname+" "+user.lastSurname}`).style(styleUser);
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto: ${user.job }`).style(styleUser);
  
        let row = 9;
        let col = 3;

            worksheet.cell(row,   col,   row,   col+3, true).string(`Materia prima: ${data.product.description} `).style(style);
            worksheet.cell(row+1, col,   row+1, col+3, true).string(`Proveedor: ${data.proveedor}`).style(style);
            worksheet.cell(row,   col+4, row+1, col+5, true).string(`Lote proveedor: ${data.loteProveedor}`).style(style);
            worksheet.cell(row,   col+6, row+1, col+7, true).string(`Fecha: ${data.date}`).style(style);
           
            worksheet.cell(row+2, col,   row+2, col+1, true).string("Control").style(style);
            worksheet.cell(row+2, col+2, row+2, col+3, true).string("Estándar").style(style);
            worksheet.cell(row+2, col+4, row+2, col+4, true).string("Aceptado").style(style);
            worksheet.cell(row+2, col+5, row+2, col+5, true).string("Rechazado").style(style);
            worksheet.cell(row+2, col+6, row+2, col+7, true).string("Observaciones").style(style);
            
            worksheet.cell(row+3, col,   row+3, col+1, true).string("Certificado de calidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Entrega de Certificado").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data.observations} `).style(style);

            worksheet.cell(row+3, col,   row+3, col+1, true).string("Caducidad").style(style);
            worksheet.cell(row+3, col+2, row+3, col+3, true).string("Vigente").style(style);
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+5, row+3, col+5, true).string(` ${!data.quality ? "xxx" : ""} `).style(style);
            worksheet.cell(row+3, col+6, row+3, col+7, true).string(` ${data.observations} `).style(style);
            
            worksheet.cell(row+4, col,   row+4, col+1, true).string("Materia extraña").style(style);
            worksheet.cell(row+4, col+2, row+4, col+3, true).string("Ausente").style(style);
            worksheet.cell(row+4, col+4, row+4, col+4, true).string(` ${data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+5, row+4, col+5, true).string(` ${!data.strangeMaterial ? "xxx" : ""} `).style(style);
            worksheet.cell(row+4, col+6, row+4, col+7, true).string(`  `).style(style);
           
            worksheet.cell(row+5, col,   row+5, col+1, true).string("Transporte").style(style);
            worksheet.cell(row+5, col+2, row+5, col+3, true).string("Limpio").style(style);
            worksheet.cell(row+5, col+4, row+5, col+4, true).string(` ${data.transport ? "xxx" : ""}`).style(style);
            worksheet.cell(row+5, col+5, row+5, col+5, true).string(` ${!data.transport ? "xxx" : ""} `).style(style);
            worksheet.cell(row+5, col+6, row+5, col+7, true).string(`  `).style(style);

            worksheet.cell(row+6, col,   row+6, col+1, true).string("Empaque").style(style);
            worksheet.cell(row+6, col+2, row+6, col+3, true).string("Sin daños y limpio").style(style);
            worksheet.cell(row+6, col+4, row+6, col+4, true).string(` ${data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+5, row+6, col+5, true).string(` ${!data.paking ? "xxx" : ""} `).style(style);
            worksheet.cell(row+6, col+6, row+6, col+7, true).string(`  `).style(style);

            worksheet.cell(row+7, col,   row+7, col+1, true).string("Olor").style(style);
            worksheet.cell(row+7, col+2, row+7, col+3, true).string("Característico").style(style);
            worksheet.cell(row+7, col+4, row+7, col+4, true).string(` ${data.odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+5, row+7, col+5, true).string(` ${!data.odor ? "xxx" : ""} `).style(style);
            worksheet.cell(row+7, col+6, row+7, col+7, true).string(`  `).style(style);

            worksheet.cell(row+8, col,   row+8, col+1, true).string("Color").style(style);
            worksheet.cell(row+8, col+2, row+8, col+3, true).string("Caraterístico").style(style);
            worksheet.cell(row+8, col+4, row+8, col+4, true).string(` ${data.color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+5, row+8, col+5, true).string(` ${!data.color ? "xxx" : ""} `).style(style);
            worksheet.cell(row+8, col+6, row+8, col+7, true).string(`  `).style(style);

            worksheet.cell(row+9, col,   row+9, col+1, true).string("Textura").style(style);
            worksheet.cell(row+9, col+2, row+9, col+3, true).string("Característico").style(style);
            worksheet.cell(row+9, col+4, row+9, col+4, true).string(` ${data.texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+5, row+9, col+5, true).string(` ${!data.texture ? "xxx" : ""} `).style(style);
            worksheet.cell(row+9, col+6, row+9, col+7, true).string(`  `).style(style);

            worksheet.cell(row+10, col,   row+10, col+1, true).string("Peso").style(style);
            worksheet.cell(row+10, col+2, row+10, col+3, true).string("Según empaque").style(style);
            worksheet.cell(row+10, col+4, row+10, col+4, true).string(` ${data.weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+5, row+10, col+5, true).string(` ${!data.weight ? "xxx" : ""} `).style(style);
            worksheet.cell(row+10, col+6, row+10, col+7, true).string(`  `).style(style);

           worksheet.cell(row+11, 9, row+11, 10, true).string("F-CAL-RO-03").style(styleUser);
           
        return workbook;
    }

}