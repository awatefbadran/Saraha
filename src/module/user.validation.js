import joi from "joi";
import { generalRules } from "../common/utils/generalRules.js";
export const signUpSchema = {
  body: joi.object({
    fname: joi.string().alphanum().min(2).max(10).required(),
    lname: joi.string().required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cpassword: joi.string().min(6).valid(joi.ref("password")).required(),
    age: joi.number().required(),
    gender: joi.string().valid("male", "female").required(),
    role: joi.string().optional(),
    phone: joi.string().required()
  }).required(),

  file: joi.object({
    fieldname: joi.string().valid("attachments").required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().max(5 * 1024 * 1024).required()
  }).optional()
};
export const signInSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }).required()
}
export const refreshTokenSchema = {
  headers: generalRules.token.required()
}
export const shareProfileSchema ={
    params: joi.object({
    id:generalRules.id.required()
  }).required()
}
export const  updateProfileSchema ={
    body: joi.object({
    fname: joi.string().alphanum().min(2).max(10),
    lname: joi.string(),
    age: joi.number(),
    gender: joi.string().valid("male", "female"),
    phone: joi.string()
  }).required(),

}
export const updatePasswordSchema ={
  body:joi.object({
    newpassword:generalRules.password.required(),
    oldpassword:generalRules.password.required(),
    cpassword: joi.string().min(6).valid(joi.ref("newpassword")).required()
  }).required()
}