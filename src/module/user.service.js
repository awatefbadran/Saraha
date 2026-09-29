import userModel from "../DB/models/usermodel.js"
import * as dbServices from "../DB/db.service.js"
import { Decrypt, Encrypt } from "../common/security/encrypt.js";
import { compare, hash } from "../common/security/hash.js";
export const signup = async (req, res, next) => {

   const { fname, lname, age, email, password, gender, phone } = req.body;
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
         fname, lname, age, email: email.toLowerCase(),password: await hash(password), gender, phone:Encrypt(phone),
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
         email: email.toLowerCase(),
         provider: "system"
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

   return res.status(200).json({
      message: "signIN successfully"
   })

}


