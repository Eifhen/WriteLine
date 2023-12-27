




/**  
  RegExp que valida que la contraseña
  La contraseña debe ser de 5-100 caracteres y 
  debe incluir por lo menos 1 letra, 1 número y un caracter especial 
**/
export const PASSWORD_PATTERN: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*$]{5,100}$/;
export const PASSWORD_PATTERN_STR: string = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*$]{5,100}$";
