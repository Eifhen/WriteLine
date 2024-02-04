

export function isEmpty(value:any){
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
  }

  if (typeof value === 'object') {
      return Object.keys(value).length === 0;
  }

  return false;
}

export function isNotEmpty(value: any): boolean {
  if (value === null || value === undefined) {
      return false;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
      return value.length > 0;
  }

  if (typeof value === 'object') {
      return Object.keys(value).length > 0;
  }

  return true;
}

export function ifEmpty(value:any, orValue:any){
  if(isNotEmpty(value)){
    return value;
  }
  return orValue;
}

export function objectIsNotEmpty(object:any){
  return Object.keys(object).length > 0;
}