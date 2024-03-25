
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
        
        console.log('Generated sk_id:', skill_id);
        console.log('Generated emergency_id:', emergency_id);
     

        const { firstname, middlename, lastname, identification_number, marital_status, gender, date_of_birth, email, phone_number, place_of_residence, course_of_study, institution, password, language, technical, emergency_person_name, emergency_phone_number, relationship,schedule_id,position_id } = newUser;
        
      
        // Insert user into tbl_user
        const result1 = await poolRequest()
            .input('user_id', mssql.VarChar, user_id)
            .input('firstname', mssql.VarChar, firstname)
            .input('middlename',mssql.VarChar,middlename)
            .input('lastname',mssql.VarChar,lastname)
            .input('identification_number', mssql.VarChar,identification_number)
            .input('gender',mssql.VarChar,gender)
            .input('marital_status',mssql.VarChar,marital_status)
            .input('date_of_birth',mssql.DateTime,date_of_birth)
            .input('email', mssql.VarChar,email)
            .input('phone_number', mssql.Int,phone_number)
            .input('place_of_residence',mssql.VarChar, place_of_residence)
            .input('course_of_study',mssql.VarChar,course_of_study)
            .input('institution', mssql.VarChar,institution)
            .input('password',mssql.VarChar,password)
            .input('skill_id', mssql.VarChar,skill_id)            
            .input('language',mssql.VarChar,language)
            .input('technical',mssql.VarChar,technical)
            .input('emergency_id', mssql.VarChar, emergency_id)
            .input('emergency_person_name', mssql.VarChar, emergency_person_name)
            .input('emergency_phone_number',mssql.VarChar,emergency_phone_number)
            .input('relationship',mssql.VarChar,relationship)
            .input ('schedule_id', mssql.VarChar,schedule_id)
            .input('position_id',mssql.VarChar,position_id)
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
            
            `

           )


        return { result1};
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
        .query(`SELECT * FROM tbl_user WHERE user_id=@user_id`)

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
        JOIN position ON tbl_user.position_id=position.position_id
        JOIN schedule ON tbl_user.schedule_id=schedule.schedule_id
        WHERE tbl_user.role='user'
                               
                `)

        return result.recordset
    }
    catch(error){
        return error
    }
}

export const findByCredentialsService = async (user) => {
    try {
        const userFoundResponse = await poolRequest()
            .input('email', mssql.VarChar, user.email)
            .query(` SELECT tbl_user.*, position.*, schedule.*
                     FROM tbl_user
                     JOIN position ON position.position_id=tbl_user.position_id
                     JOIN schedule ON schedule.schedule_id=tbl_user.schedule_id                    
                     WHERE tbl_user.email = @email`);
            console.log(userFoundResponse)
        if (userFoundResponse.recordset[0]) {


            if (await bcrypt.compare(user.password, userFoundResponse.recordset[0].password)) {

                let token = jwt.sign(
                    {
                        user_id: userFoundResponse.recordset[0].user_id,
                        firstname: userFoundResponse.recordset[0].firstname,
                        email: userFoundResponse.recordset[0].email
                    },

                    process.env.SECRET, { expiresIn: "12h" } 
                );
                const { password, ...user } = userFoundResponse.recordset[0];
                console.log('user deatails:',user)
                return { user, token: `JWT ${token}` };
            } else{
              
                // if the use is new  user is new 

                let token = jwt.sign(
                    {
                        user_id: userFoundResponse.recordset[0].user_id,
                        firstname: userFoundResponse.recordset[0].firstname,
                        email: userFoundResponse.recordset[0].email
                    },

                    process.env.SECRET, { expiresIn: "12h" } 
                );
                const { password,graduation_date, ...user } = userFoundResponse.recordset[0];
                console.log('user deatails:',user)
                return { user, token: `JWT ${token}`  };

            }
        } else {
            return { error: 'Invalid Credentials' };
        }

    } catch (error) {
        return error;
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

