import mongoose from "mongoose";


export default async function TransactionManager(){
  const session = await mongoose.startSession();
  session.startTransaction();
 
  const commitTransaction = async () => {
    await session.commitTransaction(); // Confirma la transacción
    session.endSession(); // Finaliza la sesión
  }

  const rollBack = async () => {
    await session.abortTransaction(); // Revierte la transacción si hay algún error
    session.endSession(); // Finaliza la sesión
  }

  return {
    session,
    commitTransaction,
    rollBack
  }
}