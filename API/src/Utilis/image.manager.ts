import fs from 'fs/promises';
import { ErrorHandler } from '../Configuration/error.handler.config';
import { CodigoHTTP } from './codigosHttp';
import IImageManager from '../Interfaces/image.manager.interface';
import { IMAGE_BASE64_PATTERN } from '../Patterns/image.pattern';


export default class ImageManager implements IImageManager {
  private _path:string = `${__dirname}/../Store/UserImages`;

  constructor(path?:string){
    if(path){
      this._path = path;
    }
  }

  /** Guarda la imagen en el servidor y retorna el nombre del archivo*/
  async SaveImage(imageBase64:string, fileName:string, extension:string, path?:string){
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const imagePath = `${path ?? this._path}/${fileName}.${extension}`; // Ruta donde se guardará la imagen
    await fs.writeFile(imagePath, buffer); // Guarda la imagen en el servidor
    return fileName; 
  }

  /** Elimina la imagen del servidor */
  async RemoveImage(imageName:string, extension:string, imagePath?:string, ){
    try {
      const fullFileName = `${imageName}.${extension}`;
      const image = `${imagePath ?? this._path}/${fullFileName}`;
  
      // Verifica si el archivo existe antes de intentar eliminarlo
      await fs.access(image);
  
      // Elimina el archivo
      await fs.unlink(image);
    } catch (err:any) {
      throw ErrorHandler(
        CodigoHTTP.InternalServerError,
        `Error al intentar eliminar el archivo: ${err.message}`,
        __filename
      );
    }
  }
  /** Obtiene la imagen deseada en base64 */
  async GetImage(fileName:string, extension:string, path?:string){
    try {
      const imagePath = `${path ?? this._path}/${fileName}.${extension}`;
      const data = await fs.readFile(imagePath);
      const base64 = Buffer.from(data).toString('base64');
      const imgSrc = `data:image/${extension};base64,${base64}`;
      return imgSrc;
    }
    catch(err:any){
      throw ErrorHandler(
        CodigoHTTP.InternalServerError, 
        `Error al intentar obtener el archivo: ${err.message}`,
        __filename
      );
    }
  }

  GetImageFormat(base64:string, extension:string){
    const imageBase64 =  base64.replace(IMAGE_BASE64_PATTERN, '');
    return `data:image/${extension};base64,${imageBase64}`;
  }

  setUserImageName(guid:string){
    return `user_${guid}`;
  }

}



