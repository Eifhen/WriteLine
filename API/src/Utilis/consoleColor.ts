import colors from 'colors/safe';

export default function ConsoleError(title:string, msg:any){
  console.error(
    colors.red(`${title} =>`),
    msg
  )
}

export function ConsoleWarning(title:string, msg?:string){
  console.warn(colors.yellow(title), msg ?? '');
}

export function ConsoleBlue(title:string, msg?:any){
  console.warn(colors.cyan(title), msg ?? '');
}