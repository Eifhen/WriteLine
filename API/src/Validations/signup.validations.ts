import IUserModel from "../Models/user.model";

const PASSWORD_REGEX:RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[·!@#%^&*])[a-zA-Z0-9·!@#%^&*]{5,20}$/;
const NOMBRE_AND_APELLIDO_REGEX: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚ]{3,16}$/;
const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

export function validarNombreApellido(nombre: string, apellido: string): boolean {
  return NOMBRE_AND_APELLIDO_REGEX.test(nombre) && NOMBRE_AND_APELLIDO_REGEX.test(apellido);
}

export function validarEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}


class SignUpValidations {
  Validation(data: IUserModel) : string|true {
    const { password, nombre, apellido, email } = data;

    if (!validarPassword(password)) {
      return "Password Invalido";
    }

    if (!validarNombreApellido(nombre, apellido)) {
      return "Nombre o Apellido Invalido";
    }

    if (!validarEmail(email)) {
      return "Email invalido";
    }

    return true;
  }
}

const SignUpValidation = new SignUpValidations();
export default SignUpValidation;