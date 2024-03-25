import mssql from 'mssql'
import { poolRequest } from '../utils/sqlDbConnect.js'
import * as uuid from 'uuid'


export const createPayrollforanService=async(payrollData)=>{
    console.log("payroll in service", payrollData.totalDeductions)
  
    const payroll_id=uuid.v4()
    try {
        const{totalDeductions,gross_salary,totaloverTime,totalcashAdvances,netPay,user_id}=payrollData
          const response=await poolRequest()
          .input('payroll_id',mssql.VarChar,payroll_id)
          .input('total_deductions',mssql.Decimal,totalDeductions)
          .input('gross_salary',mssql.Decimal,gross_salary)
          .input('total_overtime',mssql.Decimal,totaloverTime)
          .input('total_cash_advances',mssql.Decimal,totalcashAdvances)
          .input('net_pay',mssql.Decimal,netPay)
          .input('user_id',mssql.VarChar,user_id)
          .query(`
                  INSERT INTO payroll(payroll_id,total_deductions,gross_salary,total_overtime,total_cash_advances,net_pay,user_id)
                  VALUES (@payroll_id,@total_deductions,@gross_salary,@total_overtime,@total_cash_advances,@net_pay,@user_id)
           `)
          return response          
        
    } catch (error) {
        return error
    }
}

export const getPayRollRecordsService=async()=>{
    try {

            const result=await poolRequest()
            .query(`SELECT payroll.*, tbl_user.*
                    FROM payroll
                    JOIN tbl_user ON tbl_user.user_id=payroll.user_id
             
             `)

            return result.recordset
        
    } catch (error) {
        return error
    }
}


export const getPayRollRecordsforAUserService=async(user_id, created_on)=>{
    try {
         const result=await poolRequest()
         .input('user_id', mssql.VarChar,user_id)
         .input('created_on', mssql.Date,created_on)
         .query(`SELECT payroll.*, tbl_user.*
                    FROM payroll
                    JOIN tbl_user ON tbl_user.user_id = payroll.user_id
                    WHERE payroll.user_id = @user_id
         
            `)
            return result.recordset
        
    } catch (error) {
        return error
    }
}