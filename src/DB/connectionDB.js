import mongoose from "mongoose";

export const connectionDB= async()=>{
    try
{
    await mongoose.connect("mongodb://localhost:27017/mongoos")
    console.log("DB conected")

}catch(err){
console.log("DB err",err)
}
}