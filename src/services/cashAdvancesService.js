import mssql from 'mssql'
import { poolRequest } from '../utils/sqlDbConnect.js'
import  * as uuid from 'uuid'





export const createCashAdvancesService=async(cashAdvances)=>{
    const {user_id,amount}=cashAdvances
    try{
        const cash_advance_id=uuid.v4()
        const response=await poolRequest()
        .input('cash_advance_id',mssql.VarChar,cash_advance_id)
        .input('user_id', mssql.VarChar,user_id)
        .input('amount', mssql.Decimal,amount)
        .query(`
                INSERT INTO cash_advances(cash_advance_id,user_id,amount)
                VALUES(@cash_advance_id, @user_id,@amount)
        `)
         return response

    }
    catch(error){
        return error
    }
}


export const getAllCashAdvancesServices=async()=>{
    try {
         const response=await poolRequest()
         .query(`SELECT cash_advances.*, tbl_user.firstname, tbl_user.lastname, tbl_user.user_id, tbl_user.identification_number
                FROM cash_advances 
                JOIN tbl_user ON tbl_user.user_id=cash_advances.user_id

         
         
         `)
         return response.recordset
        
    } catch (error) {
        return error
    }
}


export const editcashAdvanceService=async(amount,user_id)=>{
    

    try {
    
        const response=await poolRequest()
        
        .input('user_id', mssql.VarChar,user_id)
        .input('amount', mssql.Decimal,amount)
        .query(`
            UPDATE cash_advances
            SET amount=@amount
            WHERE user_id=@user_id 
        `)


         return response
        
    } catch (error) {
        return error
    }
}