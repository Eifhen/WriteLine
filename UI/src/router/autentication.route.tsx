import { Navigate, Outlet } from "react-router-dom";
import AutenticationService from "../services/AutenticationService/AutenticationService";




export default function AutenticationRoute(props:any){
  return (
    AutenticationService.VerifyToken() ? (
      <Outlet/>
    ) : (
      <Navigate to="home"/>
    )
  )
}