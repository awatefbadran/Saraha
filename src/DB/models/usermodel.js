import mongoose from "mongoose"

const userSchema =new mongoose.Schema({
    fname:{type:String,
        minlength:2,
        maxlength:10,
        trim:true
    },
      lname:{type:String,
        minlength:2,
        maxlength:10,
        trim:true
    },
      email:{type:String,
     require:true,
        trim:true,
        unique:true,
        toLowerCase:true
        
    },
     password:{type:String,
     require:true,
        trim:true
    },  
    age:{type:Number,
        minlength:2,
        maxlength:10,
        trim:true
    },
      
    gender:{
        type:String,
        enum:["male","female"],
        default:"female"},

        provider:{ 
            type:String,
        enum:["system","google"],
        default:"system"},
    
        isconfermed:{
            type:Boolean,
            default:false
        },
         phone:String,
 


},{
  

})



const userModel = mongoose.model("User",userSchema)
export default userModel