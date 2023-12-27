

import { useWriteLineContext } from '../../context/writeline.context';
import ActiveBar from '../activebar/activebar.component';
import './writeline.app.component.css';



export default function WriteLineApp({children}:any){

  const { userData } = useWriteLineContext();

  return (
    <div className='writeline-app-container'>
      <div className='writeline-app-activebar'>
        <ActiveBar user={userData} />
      </div>
      <div className='writeline-app-content'>
          {children}
      </div>
    </div>
  )
}





