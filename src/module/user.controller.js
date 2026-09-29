import express from 'express'
import { signup ,signin } from './user.service.js'

export const userRouter= express.Router()


userRouter.post("/signup",signup)
userRouter.post("/signin",signin) 