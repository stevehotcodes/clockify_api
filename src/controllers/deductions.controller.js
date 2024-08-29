
import { sendBadRequest, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js"
import { createNewDeductionService, editDeductionforAnEmployeeService, getAllDeductionService } from "../services/deductionsServices.js"
import { getOneEmployeeService } from "../services/userService.js"




export const createNewDeduction=async(req,res)=>{
    try {
         const deduction={
            description:req.body.description,
            amount:req.body.amount,
            user_id:req.body.user_id
         }

       

         const user=await getOneEmployeeService(deduction.user_id)
         
         if(user.length){
            const response=await createNewDeductionService(deduction)
            console.log(response)
            if(response.rowsAffected>0){
                sendCreated(res, `Deductions for employee id${deduction.user_id}`)
            }
            
         }
         else{
            sendNotFound(res,"employee records not found")
         }
        
    } catch (error) {
       
        sendServerError(res,error.message)
    }
}

export const getAlllDeductions=async(req,res)=>{
    try {
        const result =await getAllDeductionService()
        if(result.length){
            return res.status(200).json(result)
        }
        else{
            sendNotFound(res,'No deductions records found')
        }
        
    } catch (error) {
        sendServerError(res,error.message)
    }
}


export const editDeductionforAnEmployee=async(req,res)=>{
    try {
         const user_id=req.params.user_id;

         const editedDeductionsDetails={
                description:req.body.description,
                amount:req.body.amount          
            
         }

         const response=await editDeductionforAnEmployeeService(user_id,editedDeductionsDetails);
        

         if(response>0)
         {
            sendSuccess(res,'deductions for the user was successful')
         }
         else{
            sendServerError(res,"editing operation failed")
         }

        
    } catch (error) {
        sendServerError(res, error.message)
    }
}