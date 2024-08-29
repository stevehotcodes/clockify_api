import { createNewOvertimeService, editOvertimeforAnEmployeeService, getAllOvertimeService } from "../services/overtimeService.js"
import { sendBadRequest, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js"
import { getOneEmployeeService, getUserById } from "../services/userService.js"



export const getAllOvertimeRecord=async(req,res)=>{
    try {
          const response =await getAllOvertimeService()
          
          if(response.length){

            return res.status(200).json(response)
            
          }
          else{
            sendNotFound(res,'no records found for overtime ')
          }
        
    } catch (error) {
        sendServerError(res, error.message)
    }
}

export const  createNewOvertime=async(req,res)=>{
    try {
         const overtime={
            number_of_hours:req.body.number_of_hours,
            rate_per_hours:req.body.rate_per_hours,
            user_id:req.body.user_id
         }

        const user=await getUserById(overtime.user_id)
       
        if(user.length){
            
            const response=await createNewOvertimeService(overtime)
            console.log(response)

                if(response.rowsAffected>0){
                    sendCreated(res, `${user[0].firstname} ${overtime.user_id} cash overtime record has been added successfully`)
                }
                
            }
            else{
                sendNotFound(res,"employee records not found")
            } 
               
        
    } 
    catch (error) {
        sendServerError(res,error.message)
    }
}

export const editOvertimeforAnEmployee=async(req,res)=>{
    try {

          const user_id= req.params.user_id
          const editedDetails={
            number_of_hours:req.body.number_of_hours,
            rate_per_hours:req.body.rate_per_hours
          
          }

        
          
          const response=await editOvertimeforAnEmployeeService(user_id, editedDetails);
          console.log(response)

          if(response>0){
            sendSuccess(res, 'Editing done successfully')
          }
          else{
            sendServerError(res,'Editing overtime for user failed')
          }
        
    } catch (error) {
          sendServerError(res,error.message)
    }
}