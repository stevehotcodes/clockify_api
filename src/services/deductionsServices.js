import mssql from 'mssql'
import { poolRequest } from '../utils/sqlDbConnect.js'
import  * as uuid from 'uuid'



export const createNewDeductionService=async(deductions)=>{
    try{
         const deduction_id=uuid.v4()
        const {  description, amount, user_id } =deductions
         const response=await poolRequest()
         .input('deduction_id',mssql.VarChar,deduction_id)
         .input('description',mssql.VarChar,description)
         .input('amount',mssql.Decimal,amount)
         .input('user_id',mssql.VarChar,user_id)
         .query(`INSERT INTO deductions (deduction_id,description,amount,user_id) 
                 VALUES(@deduction_id,@description,@amount,@user_id)
         
         `)
         return response
         
    }
    catch(error){
        return error 

    }
}

export const getAllDeductionService=async()=>{
    try {
         const response=await poolRequest()
         .query(`
            	SELECT deductions.*,  tbl_user.firstname, tbl_user.lastname
                FROM deductions
                JOIN tbl_user ON tbl_user.user_id=deductions.user_id
         
         `)
         return response.recordset
        
    } catch (error) {
        return error
    }
}

export const getDeductionsforAnEmployeeService=async(user_id)=>{
    try {
            const response=await poolRequest()
            .input('user_id',mssql.VarChar,user_id)
            .query(`SELECT description, amount FROM deductions WHERE user_id=@user_id`)
            return response.recordset
        
    } catch (error) {
        return error
    }
}

export const getOvertimeRecordforAnEmployeeService=async(user_id)=>{
    try{
        const response=await poolRequest()
        .input('user_id',mssql.VarChar,user_id)
        .query(`SELECT * FROM overtime WHERE user_id=@user_id`)
        return response.recordset  

    }
    catch(error){
        return error
    }
}

export const getAllCashAdvancesRecordforAnEmployeeService=async(user_id)=>{
    try {
         const response=await poolRequest()
         .input('user_id', mssql.VarChar,user_id)
         .query(`SELECT amount FROM cash_advances WHERE user_id=@user_id`)
         return response.recordset  
    } catch (error) {
        return error
    }


}

export const editDeductionforAnEmployeeService=async(user_id, deductions)=>{
    try {
        
         const { description, amount } =deductions
         const response=await poolRequest()
         .input('description',mssql.VarChar,description)
         .input('amount',mssql.Decimal,amount)
         .input('user_id',mssql.VarChar,user_id)
         .query(`UPDATE deductions
                 SET description=@description,
                    amount=@amount                    
                 WHERE user_id=@user_id 
         `)
         return response.rowsAffected
        
    } catch (error) {
        return error
    }
}