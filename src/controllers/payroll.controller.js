// import e from "express";
import { sendNotFound, sendServerError } from "../helpers/helper.functions.js";
import { getAllCashAdvancesRecordforAnEmployeeService, getDeductionsforAnEmployeeService, getOvertimeRecordforAnEmployeeService } from "../services/deductionsServices.js";
import { createPayrollforanService, getPayRollRecordsService, getPayRollRecordsforAUserService } from "../services/payrollService.js";
import { getAllEmployeesService, getUserById } from "../services/userService.js"





export  const generatePayRoll=async(req,res)=>{
    try {
            const employees=await getAllEmployeesService();
            let  payroll=[]
        

            for(let employee of employees){
                const deductions=await getDeductionsforAnEmployeeService(employee.user_id);
                const totalDeductions=deductions.reduce((acc,curr)=>acc+curr.amount,0);

                const cashAdvances=await getAllCashAdvancesRecordforAnEmployeeService(employee.user_id);
                const totalcashAdvances=cashAdvances.reduce((acc, curr)=>acc+curr.amount,0);

                const overtime=await getOvertimeRecordforAnEmployeeService(employee.user_id)
                const totaloverTime=overtime.reduce((acc,curr)=>acc+(curr.number_of_hours*curr.rate_per_hours) , 0);

                const netPay = employee.gross_salary + totaloverTime - totalDeductions - totalcashAdvances  ;
        
            
                const payrollData={gross_salary:employee.gross_salary,totalDeductions,totaloverTime,totalcashAdvances,user_id:employee.user_id,netPay}
            

                const employeePayroll=await createPayrollforanService(payrollData)
                console.log("employeePayroll response",employeePayroll)

                payroll.push(netPay)
        

            }
            console.log("this is the payroll", payroll)

            
            // return res.status(200).json(payroll)
        
    } catch (error) {
        // return res.status(500).json("Error in creating the payroll")
        console.log(error)
    }
}

export const getPayRollRecords=async(req,res)=>{
    try {
             const result =await getPayRollRecordsService()   

             result.length?(res.status(200).json(result)):(sendNotFound(res,"no records for payroll"))

            
    } catch (error) {
       return sendServerError(res,error.message) 
    }
}

export const getPayRollRecordsforAUser=async(req,res)=>{
    try {    
             const user_id=req.params.user_id;
             const user=await getUserById(user_id);
             if(user[0]){
                
                const result =await getPayRollRecordsforAUserService(user_id);
                console.log("payroll result", result)
                if(result.length){return res.status(200).json(result)}else{sendNotFound(res,"no records for payroll")}
             }
             else{
                sendNotFound(res, 'User records not found')
             }       
            
    } catch (error) {
       return sendServerError(res,error.message) 
    }
}
