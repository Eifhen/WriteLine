import colors from 'colors/safe';

export default function ConsoleError(title:string, msg:any){
  console.error(
    colors.red(`${title} =>`),
    msg
  )
}

export function ConsoleWarning(msg:string){
  console.warn(colors.yellow(msg));
}
