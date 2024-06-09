import fs from 'fs/promises';
import { ErrorHandler } from '../Configuration/error.handler.config';
import { CodigoHTTP } from './codigosHttp';
import IImageManager from '../Interfaces/image.manager.interface';
import { IMAGE_BASE64_PATTERN } from '../Patterns/image.pattern';
import path from 'path';
import cloudinaryManager from '../Configuration/cloudinary.manager';


export default class ImageManager implements IImageManager {
  private _path:string;

  constructor(newPath?:string){
    this._path = newPath || path.join(__dirname, '../Store/UserImages');
  }

  /** Guarda la imagen en el servidor y retorna el nombre del archivo*/
  SaveImage = async (imageBase64:string, fileName:string, extension:string, customPath?:string) => {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const folderPath = customPath || this._path;
    try {
      await fs.access(folderPath);
    }
    catch (err){
      // si el folder no existe lo crea
      await fs.mkdir(folderPath, {recursive: true})
    }

    const imagePath =  path.join(folderPath, `${fileName}.${extension}`); // Ruta donde se guardará la imagen
    await fs.writeFile(imagePath, buffer); // Guarda la imagen en el servidor
    return fileName; 
  }

  /** Elimina la imagen del servidor */
  RemoveImage = async (imageName:string, extension:string, imagePath?:string, ) => {
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
  GetImage = async (fileName:string, extension:string, path?:string) => {
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

  GetImageFormat = (base64:string, extension:string) => {
    const imageBase64 =  base64.replace(IMAGE_BASE64_PATTERN, '');
    return `data:image/${extension};base64,${imageBase64}`;
  }

  setUserImageName = (guid:string) =>{
    return `user_${guid}`;
  }

  SaveImageInCloud = async (fileName: string, extension: string, imageBase64: string): Promise<any> => {
    try {
      return await cloudinaryManager.UploadImage(fileName, extension, imageBase64);
    }
    catch(err:any){
      throw ErrorHandler(
        err.status ?? CodigoHTTP.InternalServerError, 
        err.message,
        err.path ?? __filename
      );
    }
  } 

  GetImageCloudURL = async (fileName: string, extension?: string | undefined): Promise<string> => {
    try {
      return await cloudinaryManager.GetImage(fileName, extension);
    }
    catch(err:any){
      throw ErrorHandler(
        err.status ?? CodigoHTTP.InternalServerError, 
        `Error al intentar guardar el archivo: ${err.message}`,
        err.path ?? __filename
      );
    }
  } 

  DeleteImageFromCloud = async (fileName: string, extension?: string): Promise<any> => {
    try {
      return await cloudinaryManager.DeleteImage(fileName, extension);
    }
    catch(err:any){
      throw ErrorHandler(
        CodigoHTTP.InternalServerError, 
        `Error al intentar eliminar el archivo: ${err.message}`,
        __filename
      );
    }
    
  }


}



