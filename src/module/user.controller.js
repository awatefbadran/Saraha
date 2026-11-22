import express from 'express'
import { signup ,signin, getProfile, logout, refreshToken, shareProfile, updateProfile, updatePassword } from './user.service.js'
import { multerLocal } from '../common/middleWare/multer.js';
import { authentication } from '../common/middleWare/authentication.js';
import { authorization } from '../common/middleWare/authorization.js';
import { RoleEnum } from '../common/enum/user.enum.js';
import { Validtion } from '../common/middleWare/validation.js';
import { refreshTokenSchema, signUpSchema ,shareProfileSchema,updateProfileSchema,updatePasswordSchema} from './user.validation.js';
import multer from 'multer';
export const userRouter= express.Router()

userRouter.post("/signUp",multerLocal({customPath: "admins",customTypes: ["image/jpeg"]}).single("attachments"),Validtion(signUpSchema),signup);
userRouter.post("/signin",signin) 
userRouter.get("/profile",authentication,authorization(RoleEnum.user),getProfile)
userRouter.get("/share-profile/:id",authentication,Validtion(shareProfileSchema),shareProfile)
userRouter.patch("/update-profile",Validtion(updateProfileSchema),authentication,updateProfile)
userRouter.patch("/update-password",Validtion(updatePasswordSchema),authentication,updatePassword)
userRouter.post("/refreshToken", Validtion(refreshTokenSchema),refreshToken)
userRouter.patch("/logout",authentication,logout)
