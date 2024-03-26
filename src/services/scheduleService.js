import mssql from 'mssql'
import { poolRequest } from '../utils/sqlDbConnect.js'
import * as uuid from 'uuid'
import { schedule } from 'node-cron'



export const  createNewScheduleService=async(schedule)=>{
    try {
            const schedule_id=uuid.v4()
            const result =await poolRequest()
            .input('schedule_id', mssql.VarChar,schedule_id)
            .input('in_time',mssql.VarChar,schedule.in_time)
            .input('out_time',mssql.VarChar, schedule.out_time)
            .input('schedule_description',mssql.VarChar,schedule.schedule_description)
            .query(`INSERT INTO schedule (schedule_id,in_time,out_time,schedule_description)
                    VALUES (@schedule_id, @in_time,@out_time,@schedule_description)
            `)
            return result
        
    } catch (error) {
        return error 
    }
}


export const getAllScheduleService=async()=>{
    try {
            const result=await poolRequest()
            .query(`SELECT * FROM schedule`)
            return result.recordset
    } catch (error) {
        return error 
    }
}


export const getAShiftByDescriptionService=async(schedule_description)=>{
    try {
            const result =await poolRequest()
            .input('schedule_description', mssql.VarChar,schedule_description)
            .query(`SELECT * FROM schedule WHERE schedule_description=@schedule_description`)
            return result.recordset
        
    } catch (error) {
        return error
    }
}

export const getEmployeeByScheduleService=async(schedule_id)=>{
    try {
         const result=await poolRequest()
         .input('schedule_id', mssql.VarChar,schedule_id)
         .query(`
         SELECT 
         u.user_id,
         u.firstname,
         u.lastname,
         s.schedule_id as schedule_id,
         s.in_time AS schedule_in_time,
         s.out_time AS schedule_out_time,
         last_clock_in.time_in AS last_clock_in_time,
         last_clock_out.time_out AS last_clock_out_time
         
     FROM 
         tbl_user u
     JOIN 
         schedule s ON u.schedule_id = s.schedule_id
     LEFT JOIN 
         (
             SELECT 
                 user_id,
                 MAX(time_in) AS time_in
     
             FROM 
                 attendance a
             
             GROUP BY 
                 user_id
         ) AS last_clock_in ON u.user_id = last_clock_in.user_id
     LEFT JOIN 
         (
             SELECT 
                 user_id,
                 MAX(time_out) AS time_out
             FROM 
                 attendance
             GROUP BY 
                 user_id
         ) AS last_clock_out ON u.user_id = last_clock_out.user_id
     
     WHERE 
         u.schedule_id = @schedule_id     
     
     
     
         `)

         return result.recordset
        
    } catch (error) {
        return error
    }
}
