





interface Objeto {
  [key:string]:any;
}

/** 
  @returns retorna los elementoss del primer arreglo que no están en el segundo arreglo
 */ 
export function Difference<T extends Objeto>(array1:T[], array2:T[], key:string){
  return  array1.filter((item) => !array2.some((otherItem) => item[key] === otherItem[key]));
}

/**
  @returns retorna los elementos que están tanto en el array 1 como en el array 2
 */
export function Conjunction<T extends Objeto>(array1:T[], array2:T[], key:string){
  return array1.filter((item) => array2.some((otherItem) => item[key] === otherItem[key]));
}