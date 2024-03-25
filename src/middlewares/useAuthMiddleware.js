import jwt from "jsonwebtoken";
import { notAuthorized } from "../helpers/helper.functions.js";
import dotenv from 'dotenv'
dotenv.config()

export const verifyUserIdentity = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, (err, decode) =>  {
            if (err) {
                
                return notAuthorized(res, 'Please Login  ');
            } else {
                req.user = decode;
                console.log(req.user)
                
                next();
            }
        });
    } else {
        return notAuthorized(res, 'Access denied');
    }

} 

export const verifyAdmin = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, (err, decode) =>  {
            if (err) {
                
                return notAuthorized(res, 'Please login or create an account ');
            } else {
                req.user = decode;
                console.log(req.user)
                if(req.user&&req.user.role==='admin'){
                    next();
                }
                else{
                  return  res.status(403).send('Access denied. You are not an admin.');
                }
                
               
            }
        });
    } else {
        return notAuthorized(res, 'Access denied');
    }

} 