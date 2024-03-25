import mssql from 'mssql'
import * as uuid from 'uuid'
import { poolRequest } from '../utils/sqlDbConnect.js'



export const createTimeInService=async(user_id)=>{
    try {
         const attendance_id=uuid.v4()
         const timeIn=new Date()
         timeIn.setUTCHours(timeIn.getUTCHours() +3)
         console.log("time in generated ", timeIn)
         const result=await poolRequest()
         .input('attendance_id',mssql.VarChar,attendance_id)
         .input('time_in', mssql.DateTime,timeIn)
         .input('user_id',mssql.VarChar,user_id)
         .query(`
                    BEGIN TRANSACTION;
                
                    INSERT INTO attendance (attendance_id, time_in, user_id)
                    VALUES (@attendance_id, @time_in, @user_id);
                
                    UPDATE attendance
                    SET reporting_state = 
                        CASE 
                            WHEN DATEPART(HOUR, @time_in) < 9 THEN 'Early'
                            WHEN DATEPART(HOUR, @time_in) = 9 THEN 'On Time'
                            ELSE 'Late'
                        END
                    WHERE user_id = @user_id;
                
                    COMMIT TRANSACTION;
         `)

         return result


    } catch (error) {
        return error 
    }
}


export const createTimeOutService=async(user_id)=>{ 

   
    try {
         const timeOut=new Date()
         timeOut.setUTCHours(timeOut.getUTCHours() + 3);
         const result=await poolRequest()
         .input('time_out', mssql.DateTime,timeOut)
         .input('user_id',mssql.VarChar,user_id)
         .query(`
                UPDATE attendance
                SET time_out=@time_out
                WHERE user_id=@user_id         
         `)

         return result


    } catch (error) {
        return error 
    }
}

export const getAttendanceforAUserService=async(user_id)=>{
    try{
         const result=await poolRequest()
         .input('user_id',mssql.VarChar,user_id)
         .query(`SELECT * FROM attendance WHERE user_id=@user_id`)

         return result.recordset
    }
    catch(error){
        return error 
    }
}


export const getAttendanceforAllUserService=async()=>{
    try{
         const result=await poolRequest()
        
         .query(`SELECT attendance.*,tbl_user.*
                  FROM attendance 
                  JOIN tbl_user ON tbl_user.user_id=attendance.user_id
                        
                  `)

         return result.recordset
    }
    catch(error){
        return error 
    }
}

export const getcheckInService=async(user_id)=>{
    try {
         const result =await poolRequest()
         .input(`user_id`,mssql.VarChar,user_id)
         .query(`
            SELECT time_in , user_id, date  FROM attendance WHERE user_id=@user_id
         `)
         
         return result.recordset
        
    } catch (error) {
        return error
    }
}


export const getcheckoutService=async(user_id)=>{
    try {
         const result =await poolRequest()
         .input(`user_id`,mssql.VarChar,user_id)
         .query(`
            SELECT time_out , user_id,date FROM attendance WHERE user_id=@user_id
         `)
         
         return result.recordset
        
    } catch (error) {
        return error
    }
}

export const getAttendanceReportService=async()=>{
    try{
         const result=await poolRequest()
            .query(`
            SELECT 
                CAST( time_in AS DATE) AS reporting_day,
                reporting_state,
                COUNT(*) AS count
            FROM 
                attendance
            GROUP BY 
                CAST (time_in AS DATE),
                reporting_state
            ORDER BY 
                reporting_day,
                reporting_state;
         `)

         return result.recordset

    }
    catch(error){
        return error
    }
}

export const getAttendanceReportByUserService=async(user_id)=>{
    
    try{
         const result=await poolRequest()
            .input('user_id', mssql.VarChar,user_id)
            .query(`
            SELECT 
                CAST( time_in AS DATE) AS reporting_day,
                reporting_state,
                COUNT(*) AS count
            FROM 
                attendance
            WHERE 
                user_id=@user_id
            GROUP BY 
                CAST (time_in AS DATE),
                reporting_state
            ORDER BY 
                reporting_day,
                reporting_state;
         `)

         return result.recordset

    }
    catch(error){
        return error
    }
}