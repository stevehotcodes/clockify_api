import { sendBadRequest, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js"
import { createNewPositionService, editPositionService, getAllPositionsService, getPositionByIdService, getPositionByNameService } from "../services/positionsService.js"
import logger from "../utils/logger.js"






export const createNewPosition=async(req, res)=>{
    try {
           const positionDetails={
               position_description:req.body.position_description,
               gross_salary:req.body.gross_salary
           } 

          console.log(positionDetails)
           const position=await getPositionByNameService(positionDetails.position_description)
                    
           if(position.length>0){
                    if( position[0].position_description===positionDetails.position_description){
                        sendBadRequest(res,`${positionDetails.position_description} position already exists `)
                    }
           }  
           else{
            
                if(positionDetails.position_description=='' || positionDetails.gross_salary==''){
                        sendBadRequest(res,'input for all fields is required')  //validators
                    
                    }
                else{
                        const response=await createNewPositionService(positionDetails)
                       
                        if(response.rowsAffected>0){
                            sendCreated(res,`${req.body.position_description} created successfully`)
                        }
                    
                }

           }       
             
           
           

 

          
        
    } catch (error) {
        console.log(error)
        sendServerError(res,error)
    }
}

export const getAllPositions=async(req,res)=>{
    try {
         const result=await getAllPositionsService()

         if(result.length>0){
            return res.status(200).json(result)
         }
         else{
            sendNotFound(res, 'no records of positions found')
         }
            
        
    } catch (error) {
        sendServerError(res,error.messsage)
        
    }
}


export const getOnePosition=async(req,res)=>{
    try {
        const  position_id=req.params.position_id
        const position=await getPositionByIdService(position_id);

        if(position.length){
            
            console.log("position", position);
            return res.status(200).json(position)

        }
        else{
            sendNotFound(res,'position not found')
        }

        
    } catch (error) {
        sendServerError(res,error.message)
    }
}


export const editPosition=async(req, res)=>{
    try {
           
         const  position_id=req.params.position_id
            let editedPositionDetails={
                position_description:req.body.position_description,
                gross_salary:req.body.gross_salary
            }
            console.log("edited position details", editedPositionDetails)


            console.log("position id",position_id)
            const position=await getPositionByIdService(position_id);
            console.log("position", position)

            if(position[0]){
                const response=await editPositionService(position_id,editedPositionDetails)
                console.log(response)
                if(response.rowsAffected>0){
                    sendSuccess(res,"position updated successfully")
                }
               
            }
            else{
                sendNotFound(res,'Cannot edit a non existing position')
            }     
        
    } catch (error) {
        sendServerError(res,error.messsage)
    }
}
