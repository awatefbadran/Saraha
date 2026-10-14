import userModel from "../DB/models/usermodel.js"
import * as dbServices from "../DB/db.service.js"
import { Decrypt, Encrypt } from "../common/security/encrypt.js";
import { compare, hash } from "../common/security/hash.js";
import jwt from "jsonwebtoken"
import { ProviderEnum } from "../common/enum/user.enum.js";

export const signup = async (req, res,next) => {

   const { fname, lname, age, email, password, gender, phone ,role} = req.body;
   const user = await dbServices.findOne({
      model: userModel,
      filter: {
         email: email
      }
   })

   if (user) {
      throw new Error("email already exist");

   }
    const newUser = await dbServices.create({
      model: userModel,
      data: {
         fname, lname, age, email,password: await hash(password), gender, phone:Encrypt(phone),role
      },
   });
   return res.status(200).json({
      message: "signUp successfully",
      phone:Decrypt(newUser.phone)
   })


}
export const signin = async (req, res, next) => {

   const { email, password } = req.body;
   const user = await dbServices.findOne({
      model: userModel,
      filter: {
         email,
         provider: ProviderEnum.system
      }
   })

   if (!user) {
      throw new Error("user not exist");
   }
   if (!await compare(password,user.password)) {
      throw new Error("Invalid password");
   }
   if (user.isconfermed !== true) {

      throw new Error("email not confermed");
   }

   const access_token=jwt.sign({id:user._id },"tata",{
      expiresIn:"15m",
      audience:"http://localhost:4000",
      issuer:"http://localhost:3000",
      noTimestamp:true
   })
   const refrsh_token=jwt.sign({id:user._id },"awatef",{
      expiresIn:60,
      audience:"http://localhost:4000",
      issuer:"http://localhost:3000",
      notBefore:60,
      noTimestamp:true
   })


   return res.status(200).json({
      message: "signIN successfully",
      access_token:access_token,
      refrsh_token:refrsh_token
   })

}
export const getProfile = async (req, res, next) => {
  return res.status(200).json({
    message: "Profile retrieved successfully",
    user: req.user
  });
};