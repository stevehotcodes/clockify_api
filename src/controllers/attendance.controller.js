import { sendBadRequest, sendCreated, sendNotFound, sendServerError } from "../helpers/helper.functions.js";
import { createTimeInService, createTimeOutService, getAttendanceReportByUserService, getAttendanceReportService, getAttendanceforAUserService, getAttendanceforAllUserService, getcheckInService, getcheckoutService } from "../services/attendanceService.js";
import { getUserById } from "../services/userService.js";




export const createTimeIn=async(req,res)=>{
    try {

            const user_id=req.params.user_id
            const user=await getUserById(user_id);
            // console.log("user",user[0])
            const currentDate = new Date()
            currentDate.setUTCHours(currentDate.getUTCHours() + 3);
            // currentDate.toISOString().split('T')[0]
            console.log(currentDate)

            if(user[0]){
                const checkIn=await getcheckInService(user_id)
                console.log("check in exists?",checkIn)
                if(checkIn[0]&&checkIn[0].date.getDate()===currentDate.getDate()){
                   
                    sendBadRequest(res,'You have already checked in ')

                }else{
                    const response=await createTimeInService(user_id)
                
                    if(response.rowsAffected>0){
                        sendCreated(res,`Time for  ${user[0].firstname} ${user[0].lastname} has been recorded successfully`)
                    }

                }
             
            }
            else{
                sendNotFound(res, `The employee does not exist`)
            }
            
        
    } catch (error) {
        sendServerError(res, error.message)
    }


}

export const createTimeOut = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await getUserById(user_id);

        if (!user || user.length === 0) {
            return sendNotFound(res, `The employee with ID ${user_id} does not exist.`);
        }

        const currentDate = new Date()
         currentDate.setUTCHours(currentDate.getUTCHours() + 3);

        console.log("curretn time out",currentDate)
        const checkIn = await getcheckInService(user_id);

        if (checkIn.length === 0 || checkIn[0].date.getDate() !== currentDate.getDate()) {
            return sendBadRequest(res, 'You have not checked in for today, so you cannot check out.');
        }

        const checkOut = await getcheckoutService(user_id);


        console.log("check out ", checkOut)
        if (checkOut.length > 0 && checkOut[0].time_out) {
            return sendBadRequest(res, 'You have already checked out for today.');
        }

        const response = await createTimeOutService(user_id);

        if (response.rowsAffected > 0) {
            return sendCreated(res, `Time out for ${user[0].firstname} ${user[0].lastname} has been recorded successfully.`);
        }

        sendServerError(res, 'Failed to record time out.');
    } catch (error) {
        sendServerError(res, error.message);
    }
};


export const getAttendanceforAUser=async(req,res)=>{
    try {   

            const user_id =req.user.user_id
            const user=await getUserById(user_id);

            if(user.length>0){
                const attendance=await getAttendanceforAUserService(user_id)

                if(attendance.length){
                    return res.status(200).json(attendance)
                }
                else{
                    sendNotFound(res,'attendance records not found')
                }

            }
            else{
                sendNotFound(res,'the employe does not exist')
            }
           
        
    } catch (error) {
        sendServerError(res,error.message)
    }

}


export const getAttendanceforAllUsers=async(req,res)=>{
    try {
            const attendance=await getAttendanceforAllUserService()
            if(attendance.length){
                return res.status(200).json(attendance)
            }
            else{
                sendNotFound(res,'attendance records not found')
            }
            
    } catch (error) {
        sendServerError(res,error.message)
    }
}

export const getAttendanceReport=async(req,res)=>{
    try{
         const attendance=await getAttendanceReportService()
         if(attendance.length){
            return res.status(200).json(attendance)
         }
         else{
            sendNotFound(res,`attendance reports not found`)
         }
    }
    catch(error){
        sendServerError(res, error.message)
    }
}

export const getAttendanceByUserReport=async(req,res)=>{
    try{ 
      
            const user_id =req.params.user_id
            const user=await getUserById(user_id);
            if(user[0]){
                 const attendance=await getAttendanceReportByUserService(user_id)
             if(attendance.length){
                    return res.status(200).json(attendance)
                }
                else{
                    sendNotFound(res,`attendance reports not found`)
                }

            }

            else{
                sendNotFound(res, `employee not found`)
            }
        
    }
    catch(error){
        sendServerError(res, error.message)
    }
}



