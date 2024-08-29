import { sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js"
import { createCashAdvancesService, editcashAdvanceService, getAllCashAdvancesServices } from "../services/cashAdvancesService.js"
import { getOneEmployeeService, getUserById } from "../services/userService.js"
import logger from "../utils/logger.js"

export const createCashAdvances=async(req,res)=>{
    try{
         const cashAdvances={
             user_id:req.body.user_id,
             amount:req.body.amount

         }
        
         const user=await getOneEmployeeService(cashAdvances.user_id)
       
         if(user.length){
            const response=await createCashAdvancesService(cashAdvances)
         
            if(response.rowsAffected>0){
                sendCreated(res, `Cash advance for employee id${cashAdvances.user_id} has been created successfully`)
            }
            
         }
         else{
            sendNotFound(res,"employee records not found")
         }    
    }

    catch(error){
        sendServerError(res,error.message)
    }
}

export const getAllCashAdvances=async(req,res)=>{
    try {
         const cashAdvances=await getAllCashAdvancesServices()
         if(cashAdvances.length){
            return res.status(200).json(cashAdvances)
         }
         else{
            sendNotFound(res,"records of the cash advances not found")
         }
        
    } catch (error) {
        sendServerError(res, error.message)
        
    }
}

export const editcashAdvances=async(req,res)=>{
    try {
        const user_id=req.params.user_id;
        const {amount}=req.body
        
        const user=await getUserById(user_id);
        
        if(user[0]){   
            const response=await editcashAdvanceService(amount, user_id);
            if(response.rowsAffected>0){
                
                sendSuccess(res,`cash advance for ${user[0].firstname} ${user[0].lastname} has been edited successfully`)
            }

        }
        else{
            sendNotFound(res,`records of the employee not found`)
        }
        
    } catch (error) {
        sendServerError(res,error.message)
    }
}