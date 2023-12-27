export default interface IImageManager {
  /** Guarda la imagen en el servidor */
  SaveImage(imageBase64: string, fileName:string, extension:string, path?: string): Promise<string>;

  /** Elimina la imagen del servidor */
  RemoveImage(imageName: string, imagePath?: string): Promise<void>;

  /** Obtiene la imagen deseada en base64 */
  GetImage(fileName: string, path?: string): Promise<string>;
}
