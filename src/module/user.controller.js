import express from 'express'
import { signup ,signin, getProfile } from './user.service.js'
import { multerLocal } from '../common/middleWare/multer.js';
import { authentication } from '../common/middleWare/authentication.js';
import { authorization } from '../common/middleWare/authorization.js';
import { RoleEnum } from '../common/enum/user.enum.js';
import { Validtion } from '../common/middleWare/validation.js';
import { signUpSchema } from './user.validation.js';

export const userRouter= express.Router()


userRouter.post("/signUp",Validtion(signUpSchema),multerLocal().single("attachment"),signup);
userRouter.post("/signin",signin) 
userRouter.get("/profile",authentication,authorization(RoleEnum.user),getProfile)