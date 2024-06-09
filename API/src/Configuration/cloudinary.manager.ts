import {v2 as cloudinary} from 'cloudinary';
import { ErrorHandler } from './error.handler.config';
import { CodigoHTTP } from '../Utilis/codigosHttp';

class CloudinaryManager {

  constructor(){}
  
  private initializeCloudinaryConfig() {
    // CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@deeho16gc
    const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME ?? "";
    const CLOUDINARY_API_KEY =  process.env.CLOUDINARY_API_KEY ?? "";
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
    const CLOUDINARY_URL=  `cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_NAME}`;

    const config = {
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
    }

    cloudinary.config(config);
  }

  public UploadImage = async (imageName:string, extension:string, fileBase64:string) => {
    try {
      console.log("Upload Image =>", imageName, extension);
      this.initializeCloudinaryConfig();

      const res = await cloudinary.uploader.upload(`data:image/${extension};base64,${fileBase64}`, {
        public_id: imageName
      });
      return res;
    }
    catch(err:any){
      console.log("Error ClodinaryManager =>", err);
      throw ErrorHandler(
        CodigoHTTP.InternalServerError, 
        `Error al intentar guardar el archivo: ${err.message}`,
        __filename
      );
    }
  }

  public GetImage = async (imageName: string, extension?:string) => {
    try {
      console.log("Get Image =>", imageName, extension);
      this.initializeCloudinaryConfig();
      return cloudinary.url(`${imageName}`, { secure: true });
    }
    catch(err:any){
      throw ErrorHandler(
        CodigoHTTP.InternalServerError, 
        `Error al intentar obtener la imagen: ${err.message}`,
        __filename
      );
    }
  }

  public DeleteImage = async (imageName:string, extension?:string) =>  {
    try {
      console.log("Delete Image =>", imageName, extension);
      this.initializeCloudinaryConfig();
      return cloudinary.uploader.destroy(imageName);
    }
    catch(err:any){
      throw ErrorHandler(
        CodigoHTTP.InternalServerError, 
        `Error al intentar obtener la imagen: ${err.message}`,
        __filename
      );
    }
  }


}


const cloudinaryManager = new CloudinaryManager();
export default cloudinaryManager;