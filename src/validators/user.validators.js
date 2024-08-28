import joi from 'joi'

export const userLoginValidator=({email,password})=>{

    const userSchema=joi.object({
        
        email:joi.string().required(),
        password:joi.string().required(),
           
    })
    return userSchema.validate({email,password});
}
