



/**
  se utiliza para hacer coincidir cadenas de texto que comienzan con un patrón específico 
  que suele encontrarse en datos codificados en base64 de imágenes incrustadas 
  en formato de URL de datos (data URL).

  1)  ^: Indica el inicio de la cadena.
  2) data:image\/: Busca la cadena literal "data:image/".
  3) \/: Escapa el carácter "/" para que sea parte del patrón y no se interprete como un delimitador de expresión regular.
  4) \w+: Coincide con uno o más caracteres de palabra, lo que significa letras, dígitos o guiones bajos. Esto representa el tipo de imagen (por ejemplo, "png", "jpeg", "gif", etc.).
  5) ;base64,: Busca la cadena literal ";base64," al final de la declaración del tipo MIME.

  Por ejemplo, una cadena que coincide con este patrón podría ser 
  algo como: data:image/png;base64, seguido de la codificación 
  en base64 de una imagen en particular.
*/
export const IMAGE_BASE64_PATTERN:RegExp = /^data:image\/\w+;base64,/;