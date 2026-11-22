import joi from "joi";
import { Types } from "mongoose";
export const generalRules = {
   id:joi.string().custom((value,helper)=>{
    return Types.ObjectId.isValid(value) ? value : helper.message("Invalid Id")
   }),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 2
  }),
  password: joi.string().min(6),
  file: joi.object({
    fieldname: joi.string().valid("attachments").required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string()
      .valid("image/jpeg", "image/png", "image/jpg")
      .required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().max(5 * 1024 * 1024).required()
  }),
 token:joi.object({
      authorization: joi.string().required(),
      connection: joi.string(),
      accept: joi.string(),
      host: joi.string(),
      "user-agent": joi.string(),
      "content-length": joi.string(),
      "postman-token": joi.string(),
      "accept-encoding": joi.string(),
    })
};
