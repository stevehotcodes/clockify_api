
import mssql from 'mssql';
import { poolRequest } from '../utils/sqlDbConnect.js';
import logger from '../utils/logger.js';
import * as uuid from 'uuid';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { schedule } from 'node-cron';

export const registerNewUserService = async (newUser) => {

    try {
        const user_id = uuid.v4();
        const skill_id= uuid.v4();
        const emergency_id = uuid.v4();
        
        

        const { firstname, middlename, lastname, identification_number, marital_status, gender, date_of_birth, email, phone_number, place_of_residence, course_of_study, institution, password, language, technical, emergency_person_name, emergency_phone_number, relationship,schedule_id,position_id } = newUser;
        
        const hashedPassword=await bcrypt.hash(password,10)

        const result1 = await poolRequest()
            .input('user_id', mssql.VarChar, user_id)
            .input('firstname', mssql.VarChar, firstname)
            .input('middlename', mssql.VarChar, middlename)
            .input('lastname', mssql.VarChar, lastname)
            .input('identification_number', mssql.VarChar, identification_number)
            .input('gender', mssql.VarChar, gender)
            .input('marital_status', mssql.VarChar, marital_status)
            .input('date_of_birth', mssql.DateTime, date_of_birth)
            .input('email', mssql.VarChar, email)
            .input('phone_number', mssql.VarChar, phone_number)  
            .input('place_of_residence', mssql.VarChar, place_of_residence)
            .input('course_of_study', mssql.VarChar, course_of_study)
            .input('institution', mssql.VarChar, institution)
            .input('password', mssql.VarChar, hashedPassword)
            .input('skill_id', mssql.VarChar, skill_id)
            .input('language', mssql.VarChar, language)
            .input('technical', mssql.VarChar, technical)
            .input('emergency_id', mssql.VarChar, emergency_id)
            .input('emergency_person_name', mssql.VarChar, emergency_person_name)
            .input('emergency_phone_number', mssql.VarChar, emergency_phone_number)  
            .input('relationship', mssql.VarChar, relationship)
            .input('schedule_id', mssql.VarChar, schedule_id)
            .input('position_id', mssql.VarChar, position_id)
            .query(`
                BEGIN TRANSACTION; -- Start the transaction

                BEGIN TRY
                    -- First INSERT statement
                    INSERT INTO tbl_user(user_id, firstname, middlename, lastname, identification_number, gender, marital_status, date_of_birth, email, phone_number, place_of_residence, course_of_study, institution, password, schedule_id, position_id)
                    VALUES(@user_id, @firstname, @middlename, @lastname, @identification_number, @gender, @marital_status, @date_of_birth, @email, @phone_number, @place_of_residence, @course_of_study, @institution, @password, @schedule_id, @position_id);
                
                    -- Second INSERT statement
                    INSERT INTO employee_skill(id, language, technical, user_id)
                    VALUES(@skill_id, @language, @technical, @user_id);
                
                    -- Third INSERT statement
                    INSERT INTO emergency_contact(id, person_name, phone_number, relationship, user_id)
                    VALUES (@emergency_id, @emergency_person_name, @emergency_phone_number, @relationship, @user_id);
                
                    COMMIT TRANSACTION; -- Commit the transaction if all statements succeed
                    SELECT 'Success' AS [Result]; -- Optionally, return a success message
                END TRY
                BEGIN CATCH
                    ROLLBACK TRANSACTION; -- Roll back the transaction if any error occurs
                    SELECT ERROR_MESSAGE() AS [Error]; -- Optionally, return the error message
                END CATCH;
            `)

return  result1

    } catch (error) {
     
        logger.error(error);
        return error;
    }
};


export const getNewRegisterUsersService=async()=>{
  try {
      const result=await poolRequest()
      .query(`SELECT  firstname , middlename , lastname, email, password FROM tbl_user WHERE  isWelcomed=0`);
      return result.recordset
      
  } catch (error) {
      return error
  }
}

export const setStatusofEmailtoSentService=async(email)=>{
  try {
      const result=await poolRequest()
      .input(`email`,mssql.VarChar,email)
      .query(`UPDATE tbl_user
              SET isWelcomed=1
              WHERE email=@email
          `);
      return result
      
  } catch (error) {
      return error
  }
}


export const getOneEmployeeService=async(user_id)=>{
    try{
        
        const result=await poolRequest()
        .input('user_id',mssql.VarChar,user_id)
        .query(`
                 SELECT tbl_user.*
                 FROM tbl_user
                 WHERE user_id=@user_id`
                 
                 )

        return result.recordset
    }
    catch(error){
        return error
    }
}


export const getAllEmployeesService=async()=>{
    try{
        
        const result=await poolRequest()
        .query(`SELECT tbl_user.*, position.*, schedule.*
        FROM tbl_user
        FULL JOIN position ON tbl_user.position_id=position.position_id
        FULL JOIN schedule ON tbl_user.schedule_id=schedule.schedule_id
        WHERE tbl_user.role='user'
                               
                `)

        return result.recordset
    }
    catch(error){
        return error
    }
}

export const findByCredentialsService = async (user) => {
    console.log("this is the user details from the req body passed from the controller", user)
    
    try {
        const {email,password}=user
        console.log("user email", email)
        const userFoundResponse = await poolRequest()
                    .input('email', mssql.VarChar, email)
                    .query(`SELECT *
                     FROM tbl_user                                       
                     WHERE email = @email`);
            console.log("these are user's details",userFoundResponse)
        if (userFoundResponse.recordset.length>0) {


            const userFound = userFoundResponse.recordset[0];
            const hashedPassword = userFound.password;

            const isPasswordMatch = await bcrypt.compare(password, hashedPassword)
        

            if (!isPasswordMatch) {
                return { error: 'Password Mismatch' };
            }
     

           if (await bcrypt.compare(user.password, userFoundResponse.recordset[0].password)) {

                let token = jwt.sign(
                    {
                        user_id: userFoundResponse.recordset[0].user_id,
                        firstname: userFoundResponse.recordset[0].firstname,
                        email: userFoundResponse.recordset[0].email
                    },

                    process.env.SECRET || 'jeyeydgyd', { expiresIn: "12h" } 
                );
                const { password, phone_number,email,marital_status,technical,emergency_person_name,relationship,identification_number,course_of_study,...user } = userFoundResponse.recordset[0];
                console.log('user details:',user)
                return { user, token: `JWT ${token}` };
            } 



        } else {
            return { error: 'Invalid Credentials' };
        }

    } catch (error) {
        return error;
    }

}


export const findUserByEmailService=async(email)=>{
    try {
        const result=await poolRequest()
        .input(`email`,mssql.VarChar,email)
        .query(`
               SELECT email
               FROM tbl_user  
               WHERE email=@email

             `)

        return result.recordset
        
    } catch (error) {
        return error
    }

}



export const getUserById=async(user_id)=>{
    try {
         const response=await poolRequest()
         .input('user_id', mssql.VarChar, user_id)
         .query(`
                SELECT * FROM tbl_user WHERE user_id=@user_id
         `)

         return response.recordset
        
    } catch (error) {
        return error 
    }

}


export const getLoggedInUserService=async(user_id)=>{
    try{
        
        const result=await poolRequest()
        .input('user_id',mssql.VarChar,user_id)
        .query(`SELECT * FROM tbl_user WHERE user_id=@user_id`)

        return result.recordset
    }
    catch(error){
        return error
    }
}


export const updateUserService=async(updatedUserDetail,user_id)=>{
    try {
       const  {
            firstname,
            middlename,
            lastname,
            marital_status,
            password,
         }=updatedUserDetail

        console.log(firstname,user_id)
         const response=await poolRequest()
         .input(`firstname`, mssql.VarChar, firstname)
         .input(`middlename`, mssql.VarChar,middlename)
         .input(`lastname`, mssql.VarChar,lastname)
         .input(`marital_status`, mssql.VarChar,marital_status)
         .input(`password`,mssql.VarChar,password)
         .input(`user_id`,mssql.VarChar,user_id)

         .query(
            `UPDATE tbl_user
             SET firstname=@firstname, middlename=@middlename,lastname=@lastname,marital_status=@marital_status, password=@password, isPasswordChange=1
             WHERE user_id=@user_id
            
            `
         )

         return response

        
    } catch (error) {
        return error
    }
}

 
export const getAllUsersbyGenderService=async()=>{
    try { 
            const request=await poolRequest()
            .query(`SELECT gender, COUNT(*) as count 
                    FROM  tbl_user
                    WHERE role='user'
                    GROUP BY gender
                    
                    `)
                     
            return request.recordset
        
    } catch (error) {
        return response
    }
}

export const editScheduleforAnEmployeeService=async(scheduleDetails)=>{
    try {    
           const response=await poolRequest()
           .input('schedule_id',mssql.VarChar, scheduleDetails.schedule_id)
          
           .input('user_id', mssql.VarChar,scheduleDetails.user_id)
           .query(`
                UPDATE tbl_user
                SET schedule_id=@schedule_id 
                WHERE user_id=@user_id
        
           `)

           return response.rowsAffected
        
    } catch (error) {
        return error
    }
}

export const editPositionforAnEmployeeService=async(updatedPositionDetails)=>{
    try {    
           const response=await poolRequest()
           .input('position_id',mssql.VarChar, updatedPositionDetails.position_id)
           .input('user_id', mssql.VarChar,updatedPositionDetails.user_id)
           .query(`
                UPDATE tbl_user
                SET position_id=@position_id
                WHERE user_id=@user_id 
        
           `)

           return response.rowsAffected
        
    } catch (error) {
        return error
    }
}