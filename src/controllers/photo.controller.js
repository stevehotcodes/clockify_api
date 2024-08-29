import { sendCreated, sendNotFound, sendServerError } from "../helpers/helper.functions.js"
import { getPhotoOfAuserService, uploadPhotoService } from "../services/photoService.js"





export const uploadPhoto=async(req,res)=>{
    try{
          const user_id=req.params.user_id
          const photoDetails={
               photo_url:req.body.photo_url
          }

          const uploadResponse=await uploadPhotoService(photoDetails, user_id)
          
         if(uploadResponse.rowsAffected>0){ sendCreated(res, 'photo uploaded successfully')}

    }
    catch(error){
         console.log(error)
         sendServerError(res,error.message)
    }

}

export const getPhoto=async(req,res)=>{
    try {
         const user_id=req.params.user_id
         const photo=await getPhotoOfAuserService(user_id)
         if(photo[0]){
            return res.status(200).json(photo)
         }
         else{
            sendNotFound(res,'no profile picture')
         }
        
    } catch (error) {
        sendServerError(res,error.message)
    }
}