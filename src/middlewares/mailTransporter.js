import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config()



export const transporter = nodemailer.createTransport({
        pool:true,
        host:"smtp.gmail.com",
        port:465,
        secure:false,
        service:'Gmail',
        auth:{
            user:process.env.EMAIL ||'ondiekistephen00@gmail.com',
            pass:process.env.PASSWORD || 'nhhcqgyvcqslyyvu'
        }
   
});