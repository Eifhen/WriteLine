import { MutableRefObject, useEffect } from "react";

export default function useOnOutsideClick(
  elementRef: MutableRefObject<HTMLDivElement | null>,
  openerRefs: Array<MutableRefObject<HTMLDivElement | null>>, 
  callback: () => void,
  dependencies: any[]
){
  
  useEffect(()=> {

    function manejarClick(event:any){
      const clicEnElemento = elementRef.current && elementRef.current.contains(event.target);
      const clicEnBotones = openerRefs.some((openerRef) => openerRef.current && openerRef.current.contains(event.target));

      if (!clicEnBotones && !clicEnElemento) {
        // El clic ocurrió fuera del elemento y fuera del botón de apertura entonces, 
        // llamar al callback
        callback();
      }
     
    }
  
    // Agregar un event listener al documento
    document.addEventListener('click', manejarClick);
    return ()=> {
      // cleanup function para eliminar el event listener cuando sea necesario
      document.removeEventListener('click', manejarClick);
    }
  },[dependencies]);
}