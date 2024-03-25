import mssql from 'mssql'
import * as uuid from 'uuid'
import { poolRequest } from '../utils/sqlDbConnect.js'




export const createNewOvertimeService=async(overtime)=>{
    const overtime_id=uuid.v4()
    const{number_of_hours,rate_per_hours,user_id}=overtime
    try {
          
          

          const result=await poolRequest()
          .input('overtime_id' , mssql.VarChar,overtime_id)
          .input('number_of_hours',mssql.Int, number_of_hours)
          .input('rate_per_hours',mssql.Decimal,rate_per_hours)
          .input('user_id',mssql.VarChar,user_id)
          .query(
            `INSERT INTO overtime(overtime_id,number_of_hours,rate_per_hours,user_id)
             VALUES(@overtime_id,@number_of_hours,@rate_per_hours,@user_id)
            `
          )
          
          return result
        
    } catch (error) {
        return error 
    }
}


export const getAllOvertimeService=async()=>{
    try {
        const result=await poolRequest()
        .query(`SELECT overtime.*,tbl_user.firstname,tbl_user.lastname
                FROM overtime
                INNER JOIN tbl_user ON tbl_user.user_id=overtime.user_id
         `)

        return result.recordset
        
    } catch (error) {
        return error
    }
}

export const editOvertimeforAnEmployeeService=async(user_id,editedDetails)=>{
    try {  
            const{number_of_hours,rate_per_hours}=editedDetails
            const result=await poolRequest()
            .input(`user_id`, mssql.VarChar, user_id)
            .input(`number_of_hours`, mssql.Int, number_of_hours)
            .input(`rate_per_hours`, mssql.Decimal, rate_per_hours)
            .query(`
                    UPDATE overtime
                    SET number_of_hours=@number_of_hours, rate_per_hours=@rate_per_hours
                    WHERE user_id=@user_id
                        
            `)
            return result.rowsAffected
    } catch (error) {
        return error
    }
}


 