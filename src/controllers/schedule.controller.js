import { sendBadRequest, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js"
import { createNewScheduleService, getAShiftByDescriptionService, getAllScheduleService, getEmployeeByScheduleService } from "../services/scheduleService.js"
import logger from "../utils/logger.js"




export const createNewSchedule=async(req,res)=>{
    try {
           const newSchedule={
                in_time:req.body.in_time,
                out_time:req.body.out_time,
                schedule_description:req.body.schedule_description
           }

           const schedule=await getAShiftByDescriptionService(newSchedule.schedule_description)
          
           if(schedule.length>0){
              sendBadRequest(res, `${newSchedule.schedule_description} already exists`)
           }
           else{
              const response=await createNewScheduleService(newSchedule)
              
              if(response.rowsAffected>0){
              sendCreated(res,`${newSchedule.schedule_description} has been created successfully`)
              }

           }
        
    } catch (error) {
          sendServerError(res,error)
    }
}

export const getAllSchedule=async(req,res)=>{
    try {
          const schedules=await getAllScheduleService()
          if(schedules.length>0){
            return res.status(200).json(schedules)
          }
          else{
            sendNotFound(res,'no records of schedules found')
          }
    } catch (error) {
        sendServerError(res,error)
    }
}

export const getEmployeesBySchedule=async(req,res)=>{
  try {
         const {schedule_id}=req.params
         console.log(schedule_id)
         const employeesList=await getEmployeeByScheduleService(schedule_id)
         console.log(employeesList)
         if(employeesList.length){
            return res.status(200).json(employeesList)
         }
         else{
          sendNotFound(res, 'records for your selection not found')
         }

    
  } catch (error) {
       sendServerError(res, error.message)
  }
}