


/**
 *  Convierte un archivo de tipo File a un string Base64
 *  y ejecuta un callback al cual pasa por parámetro el 
 *  archivo convertido
    @param {File} file - Archivo de tipo File
    @param {function} callback - Función a ser ejecutada tras convertir el archivo,
    esta función recibe el archivo convertido como parámetro
*/

import notify from "./notify";

export default function ToBase64(
  file: File,
  callback: (resultbase64: string, name:string, extension:string) => void
) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const filebase64 = reader.result?.toString().split(',')[1];
    const fileExtension = `${(file.name.split('.').pop() || '').toLowerCase()}`;
    const fileName = file.name.split(".")[0];
    const resultbase64 = reader.result?.toString();
   
    if (filebase64 && resultbase64) {
      callback(resultbase64, fileName, fileExtension);
    }
  };
  reader.onerror = function (error) {
    notify('error-ocurrido al convertir a base64', 'error');
    throw error;
  };
}
