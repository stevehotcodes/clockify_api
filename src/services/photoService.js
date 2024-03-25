import mssql from 'mssql'
import * as uuid from 'uuid'
import { poolRequest } from '../utils/sqlDbConnect.js'






export const uploadPhotoService=async(photoDetails, user_id)=>{
    const {photo_url}=photoDetails
    try {

         const photo_id=uuid.v4()
         const result=await poolRequest()
         .input('photo_id',mssql.VarChar,photo_id)
         .input('photo_url',mssql.VarChar, photo_url)
         .input('user_id',mssql.VarChar,user_id)
         .query(
            `
                INSERT INTO photo (photo_id,photo_url,user_id)
                VALUES(@photo_id, @photo_url,@user_id)
                `
         )

        return  result
    
        
    } catch (error) {
        return error
    }
}


export const getPhotoOfAuserService=async(user_id)=>{
   try {
        const result=await poolRequest()
        .input('user_id',mssql.VarChar,user_id)
        .query(`
            SELECT * FROM photo WHERE user_id=@user_id
        `)
        return result.recordset
    
   } catch (error) {
        return error
   }
}



