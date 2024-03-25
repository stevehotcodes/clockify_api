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