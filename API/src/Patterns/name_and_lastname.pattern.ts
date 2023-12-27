

/** 
  Patrón RegExp que garantiza que el nombre y apellido de usuario 
  deban tener entre 3-16 caracteres y no deban poseer números ni ningún caracter especial 
**/
export const NAME_AND_LASTNAME_PATTERN: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$/;
export const NAME_AND_LASTNAME_PATTERN_STR:string = "^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$";