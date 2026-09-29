import express from 'express'
import { connectionDB } from './DB/connectionDB.js'
import userModel from './DB/models/usermodel.js'
import { userRouter } from './module/user.controller.js'
const app =express()
 const port =3000

 const bootstrap =async()=>{
    app.use(express.json())
    app.get("/",(req,res)=>
      res.status(200).json({
        message:"welcome on my app"
      }))
   await connectionDB()
   userModel
   app.use("/user",userRouter)
    app.use("{/*demo}" ,(req,res,next)=>{
     throw new Error(`Url :${req.originalUrl} with method${req.method} NOT Found`);
    })
app.use((err, req, res, next) => {
//   console.error(err);

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

    app.listen(port,()=> console.log(`Example app listhen on port ${port}`))
 }

 export default bootstrap