import joi from "joi"

export const signUpSchema =joi.object({
   body:joi.object({
     fName:joi.string().required(),
    lName:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
   })
 }).required()