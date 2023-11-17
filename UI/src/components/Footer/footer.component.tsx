

interface IFooter {
  className?: string;
}

export default function Footer(props:IFooter){

  return(
    <footer className={`${props.className}`}>
      <p>
        by 
        <a 
          className="ml-0-5 mr-0-5 text-muted fs-1-4" 
          href="https://gjimenez-portfolio.netlify.app" 
          target="_blank"
        >
          © Gabriel Jiménez
        </a> |
        <small className="ml-0-5">29 / 10 / 2023</small>
      </p>
    </footer>
  )
}