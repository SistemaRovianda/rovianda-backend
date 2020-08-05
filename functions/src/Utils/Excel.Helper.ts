import * as excel from "excel4node";
import Logo from "../Models/Logo";
import * as fs from "fs";
import * as os from "os";
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
}