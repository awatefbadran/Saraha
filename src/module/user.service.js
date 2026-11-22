import userModel from "../DB/models/usermodel.js"
import * as dbServices from "../DB/db.service.js"
import { Decrypt, Encrypt } from "../common/security/encrypt.js";
import { compare,Hash } from "../common/security/hash.js";
import jwt from "jsonwebtoken"
import { ProviderEnum } from "../common/enum/user.enum.js";
import { hashSync } from "bcrypt";
import{randomUUID} from "node:crypto"
import revokeTokenModel from "../DB/models/revokeToken.model.js";
export const signup = async (req, res,next) => {
try{
   const { fname, lname, age, email, password, gender, phone ,role } = req.body;
   const hashPassword =hashSync(password,12)
   const user = await dbServices.create({
      model:userModel,
      data:{fname, lname, age, email, password:hashPassword, gender, phone:Encrypt(phone) ,role, profileImage:req.file.path}
   })
 return res.status(201).json({message:"done"})
}
catch(error){
   if(error?.code==11000){
       return res.status(409).json({message:"email already exist"})
   }
 return res.status(500).json({message:error.message})
 }
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
   const tokenId = randomUUID()
   const access_token=jwt.sign({id:user._id },"tata",{
      expiresIn:"15m",
      audience:"http://localhost:4000",
      issuer:"http://localhost:3000",
      jwtid: tokenId
   })
   const refrsh_token=jwt.sign({id:user._id },"awatef",{
      expiresIn:"15m",
      audience:"http://localhost:4000",
      issuer:"http://localhost:3000",
      jwtid:tokenId
   })
   return res.status(200).json({
      message: "signIN successfully",
      access_token:access_token,
      refrsh_token:refrsh_token
   })
}
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user: {
        ...user.toObject(),
        phone: user.phone ? Decrypt(user.phone) : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const shareProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

   const user = await dbServices.findById({
  model: userModel,
  id,
  options: {}
});

    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }
user.phone=Decrypt(user.phone)
 return res.status(200).json({
  message: "Profile retrieved successfully",
  user: {
    fname: user.fname,
    lname: user.lname,
    age: user.age,
    gender: user.gender,
    profileImage: user.profileImage
  }
});

  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        message: "Token does not exist"
      });
    }
    const decoded = jwt.verify(authorization, "awatef", {
      audience: "http://localhost:4000",
      issuer: "http://localhost:3000"
    });

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    const user = await dbServices.findOne({
      model: userModel,
      filter: { _id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const access_token = jwt.sign(
      { id: user._id },
      "tata",
      {
        expiresIn: "15m",
        audience: "http://localhost:4000",
        issuer: "http://localhost:3000"
      }
    );

    return res.status(200).json({
      message: "Done",
      access_token
    });

  } catch (error) {
    return res.status(401).json({
      message: error.message
    });
  }
}
export const updateProfile = async (req, res, next) => {
  try {
    const { fname, lname, age, gender, phone } = req.body;

    const updatedQuery = {};

    if (fname !== undefined) updatedQuery.fname = fname;
    if (lname !== undefined) updatedQuery.lname = lname;
    if (age !== undefined) updatedQuery.age = age;
    if (gender !== undefined) updatedQuery.gender = gender;
    if (phone !== undefined) updatedQuery.phone = Encrypt(phone);

    if (Object.keys(updatedQuery).length === 0) {
      return res.status(400).json({
        message: "No data provided to update"
      });
    }

    const user = await dbServices.findByIdAndUpdate({
      model: userModel,
      id: req.user._id,
      update: updatedQuery,
    });

      const updatedUser = {
      ...user.toObject(),
      phone: user.phone ? Decrypt(user.phone) : ""
    };
     return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    next(error);
  }
};
export const updatePassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword, cpassword } = req.body;
    if (!oldpassword || !newpassword || !cpassword) {
      throw new Error("All password fields are required");
    }
    if (!req.user || !req.user.password) {
      throw new Error("User password not found");
    }
    if (!compare(oldpassword, req.user.password)) {
      throw new Error("Invalid Old Password");
    }
    if (newpassword !== cpassword) {
      throw new Error("New Password and Confirm Password do not match");
    }
    const hashedPassword = await Hash(newpassword);
    req.user.changecrodentiolAt = new Date();
    await dbServices.findByIdAndUpdate({
      model: userModel,
      id: req.user._id,
      update: {
        password: hashedPassword
      }
    });
    return res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { flag } = req.query;

    if (flag === "all") {

      // Logout from all devices
      req.user.changecrodentiolAt = new Date();

      await req.user.save();

    } else {

      // Logout from current device only
      await dbServices.create({
        model: revokeTokenModel,
        data: {
          userID: req.user._id,
          tokenId: req.decoded.jti,
          expireAt: new Date(req.decoded.exp * 1000),
        },
      });
    }

    return res.status(200).json({
      message: "Logout successfully",
      user: req.user,
    });

  } catch (error) {
    return next(error);
  }
};
