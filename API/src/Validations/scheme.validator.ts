import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';


const ajv = new Ajv({allErrors:true});
addFormats(ajv);
addErrors(ajv);

interface SchemeStatus {
  isValid: boolean;
  errors: any;
}

export const SchemeValidator = (scheme:object) => {
  const validate = ajv.compile(scheme);
  
  const validator = (data:any) : SchemeStatus => {
    const valid = validate(data);
   
    if(valid){
      return {
        isValid: true,
        errors: ''
      };
    }
    
    return {
      isValid:false,
      errors: validate.errors
    };
  }

  return validator;
}

 