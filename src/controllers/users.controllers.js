import logger from "../utils/logger.js";
import generator from 'generate-password'
import { sendBadRequest, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../helpers/helper.functions.js";
import { editPositionforAnEmployeeService, editScheduleforAnEmployeeService, findByCredentialsService, findUserByEmailService, getAllEmployeesService, getAllUsersbyGenderService, getLoggedInUserService, getUserById, registerNewUserService, updateUserService } from "../services/userService.js";
import * as uuid from 'uuid'
import { userLoginValidator } from "../validators/user.validators.js";
import bcrypt from 'bcrypt'
import { sendWelcomeMail } from "../config/mailConfig.js";
import data from '../data/data.json' assert { type: 'json' };



export const registerNewUser=async(req,res)=>{
    try {   

        const em_id = uuid.v4();
        const sk_id=uuid.v4()
        const newUser={
             firstname:req.body.firstname,
             middlename:req.body.middlename,
             lastname:req.body.lastname,
             identification_number:req.body.identification_number,
             gender:req.body.gender,
             marital_status:req.body.marital_status,
             date_of_birth:req.body.date_of_birth,
             email:req.body.email,
             phone_number:req.body.phone_number,
             place_of_residence:req.body.place_of_residence,
             course_of_study:req.body.course_of_study,
             institution:req.body.institutiton,
             password:data.newUserPassword,
             language:req.body.language,
             technical:req.body.technical,
             emergency_person_name:req.body.emergency_person_name,
             emergency_phone_number:req.body.emergency_phone_number,
             relationship:req.body.relationship,
             schedule_id:req.body.schedule_id,
             position_id:req.body.position_id
          }
          
          const registeredEmail=await findUserByEmailService(newUser.email)
          console.log("email form the db", registeredEmail)
        
          if(registeredEmail.length > 0 && registeredEmail[0].email === newUser.email){ 
            sendBadRequest(res,`Email is already registered`) 
           } 
          else{
            const response=await registerNewUserService(newUser, em_id,sk_id)
          
            if(response.recordset[0].Result==='Success'){
      
                 sendCreated(res,`${newUser.firstname} has been registered successfully`)
                 sendWelcomeMail(newUser.email,newUser.password)
            }
            else{
                sendBadRequest(res,`${newUser.firstname} records exists, or email assocaited with the person already exists kindly confirm the email and/or passport number or id no `)
            }
          }
        
    } catch (error) {
        logger.error(error)
        sendServerError(res,error.message)
    }
}


export const getAllEmployees=async(req,res)=>{
    try {
          const  employees=await getAllEmployeesService()
          if(employees.length){
            return res.status(200).json(employees)
          }
          else{
            sendNotFound(res,"no records of employees found")
          }


    } catch (error) {
        sendServerError(res,error.message)
    }
}



export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("login req body",req.body)
    const { error } = userLoginValidator({ email, password });
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        try {
            const userResponse = await findByCredentialsService(req.body);
            console.log("user response form the find user service", userResponse)
            if (userResponse.error) {
                return res.status(400).json(userResponse.error)
            } else {

              console.log(userResponse)
            //   return   res.status(200).send(userResponse);
                console.log(userResponse)
               return  res.status(200).json({user:userResponse.user, token:userResponse.token});

            }
        } catch (error) {
            sendServerError(res, error.message)
        }
    }
};


export const getLoggedInUser=async(req,res)=>{
    try{
           const user_id=req.user.user_id;
           const user=await getLoggedInUserService(user_id)

           console.log(user)
           return  res.status(200).json(user)     


    }
    catch(error){
         return res.status(500).json(error.message)

    }
}



export const updateUser=async(req,res)=>{
    const user_id=req.params.user_id;
    const updateUserDetails={
       firstname:req.body.firstname,
       middlename:req.body.middlename,
       lastname:req.body.lastname,
       marital_status:req.body.marital_status,
       password:req.body.password
       

    }

    console.log(updateUserDetails)

    console.log("user_id",user_id)
    // 
  

    try {
        const salt =await bcrypt.genSalt(10);
        console.log('salt',salt)
        const hashedPassword=await bcrypt.hash(updateUserDetails.password,salt);
        console.log("hashpasswordd",hashedPassword)

        
         

      
         const  formattedUserDetails={
            firstname:req.body.firstname,
            middlename:req.body.middlename,
            lastname:req.body.lastname,
            marital_status:req.body.marital_status,
            password:hashedPassword
         }

         const response=await updateUserService(formattedUserDetails,user_id)
         console.log(response)
         if(response.rowsAffected>0){

            return res.status(200).json({message:`employee updated successfully`})
         }
         else{
            sendServerError(res,'Error in updating the user details')
         }
        // sendSuccess(res,response)
           
        
    } catch (error) {
        console.log(error)
        sendServerError(res,error.message)
    }
}

export const getAllUsersbyGender=async(req, res)=>{
    try{
         const usersByGender=await getAllUsersbyGenderService()
         if(usersByGender.length){
            return res.status(200).json(usersByGender)
         }
         else{
            sendNotFound(res,'No users found')
         }

    }
    catch(error){
        sendServerError(res,error.message)
    }
}

export const editScheduleforAnEmployee=async(req,res)=>{
    try {
             
         const scheduleDetails={
            user_id:req.params.user_id,
            schedule_id:req.body.schedule_id
         }
         const result=await editScheduleforAnEmployeeService(scheduleDetails)
         console.log(result)
         if(result>0){
            console.log(result)
            sendSuccess(res,"update successful")
         }
         else{
            sendServerError(res,"failed to update")
         }
         
        
    } catch (error) {
        console.log(error)
        sendServerError(res,error.message)
    }
}

export const editPositionforAnEmployee=async(req,res)=>{
    try {

         const positionDetails={
            user_id:req.params.user_id,
            position_id:req.body.position_id
         }
      
         const user=await getUserById(positionDetails.user_id)
         
         const result=await editPositionforAnEmployeeService(positionDetails)
        
         if(result>0){
          
            sendSuccess(res,`${user[0].firstname} ${user[0].lastname}'s position has been changed successfully`)
         }
         else{
            sendServerError(res,"failed to update the position of the employee")
         }
         
        
    } catch (error) {
        console.log(error)
        sendServerError(res,error.message)
    }
}