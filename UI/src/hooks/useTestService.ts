import { useEffect } from "react";
import TestService from "../services/TestService/TestService";



export default function useTestService(){
  useEffect(()=> {
    TestService.GetUsers()
    .then((res)=>{
      console.log("data =>", res);
    })
    .catch((err)=>{
      console.log("err =>", err);
      throw err;
    });
  },[]);
}