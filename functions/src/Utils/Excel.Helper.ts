
import * as excel from "excel4node";
import Logo from "../Models/Logo";
import * as fs from "fs";
import * as os from "os";
import { EntrancePacking } from '../Models/Entity/Entrances.Packing';
import { User } from "../Models/Entity/User";
import { OvenProducts } from '../Models/Entity/Oven.Products';
import { EntranceDrief } from '../Models/Entity/Entrances.Drief';
import { RevisionsOvenProducts } from "../Models/Entity/Revisions.Oven.Products";
export default class Excel4Node{

    generateFormulationDocumentByDates(formulationData: any){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); // se inicializa un workbook (archivo de excel)

        let worksheet = workbook.addWorksheet('Formulation'); //Se añade una hoja de calculo y se pasa el nombre por parametro

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
        worksheet.cell(2, 6, 2, 10, true).string("BITACORA DE CONTROL DE CALIDAD FORMULACION").style({//se crea una nueva celda 
            font: {
                bold: true
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',//alineamiento del texto
            }
        });

        worksheet.cell(4, 5, 4, 8, true).string(`Realizo, Nombre:  ${formulationData.performer.name}`).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento

        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);

        worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${formulationData.performer.position}`).style(styleUser);
           
        worksheet.cell(9, 4, 9, 5, true).string("Producto").style(style);
        worksheet.cell(9, 6, 9, 7, true).string("Lote").style(style);
        worksheet.cell(9, 8, 9, 9, true).string("Temperatura carne").style(style);
        worksheet.cell(9, 10, 9, 11, true).string("Temperatura agua").style(style);
        worksheet.cell(9, 12, 9, 13, true).string("Ingredientes").style(style);
        worksheet.cell(9, 14, 9, 15, true).string("Fechas").style(style);
        
        let row = 10;
        let col = 4;

        //ya que las hojas de calculo son entre comillas "matrices", los datos se deben manejar como tal

        formulationData.product.forEach((product) => {
            worksheet.cell(row, col, row, ++col, true).string(`${product.name}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${product.lot}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${product.meatTemp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${product.waterTemp}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${product.ingredients[0].name}`).style(style);
            worksheet.cell(row, ++col, row, ++col, true).string(`${product.date}`).style(style);
            for (let i = 1; i < product.ingredients.length; i++) {
                col = 4;
                row++;
                worksheet.cell(row, col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
                worksheet.cell(row, ++col, row, ++col, true).string(`${product.ingredients[i].name}`).style(style);
                worksheet.cell(row, ++col, row, ++col, true).string("").style(style);
            }
            col = 4;
            row ++; 
        });

        worksheet.cell(++row, 4, row, 7,true).string(`Realizo, Nombre:  ${formulationData.verifier.name}`).style(styleUser);

        worksheet.cell(row, 8, row, 9, true).string("Firma:  ").style(styleUser);

        worksheet.cell(row, 10, row, 11, true).string(`Puesto:  ${formulationData.verifier.ocupation}`).style(styleUser);


        return workbook;//se retorna el workbook
    }
  
      generatePackingDocumentByDates(user:User,data:EntrancePacking[]){
        let tmp = os.tmpdir(); // se obtiene el path de la carpeta de tmp del sistema , ya que las cloudfunctions son de solo lecutra y para escribir un archivo solo se puede en la carpeta tmp
        var workbook = new excel.Workbook(); // se inicializa un workbook (archivo de excel)

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
        worksheet.cell(4, 5, 4, 8, true).string(`Nombre:  ${user.name} ${user.firstSurname} ${user.lastSurname}`).style(styleUser);// hereda el estilo de styleUser, añadir otro .style({}) para añadir mas estilos solo para este elemento
        worksheet.cell(5, 5, 5, 8, true).string("Firma:  ").style(styleUser);
        worksheet.cell(6, 5, 6, 8, true).string(`Puesto:  ${user.job}`).style(styleUser);
  
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
            worksheet.cell(row+3, col+4, row+3, col+4, true).string(` ${data[i].observations ? "xxx" : ""} `).style(style);
            
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
    

}