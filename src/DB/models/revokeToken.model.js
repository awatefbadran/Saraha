
import mongoose from "mongoose"

const revokeTokenSchema = new mongoose.Schema({
    tokenId:{
        type: String,
        required: true,
    },
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    expireAt: Date,
}, {
    timestamps:true,
    strict:true,
    strictQuery:true
})
revokeTokenSchema.index({expireAt : 1},{expireAfterSeconds:0 })

const revokeTokenModel =mongoose.models.revockeToken|| mongoose.model("revockeToken", revokeTokenSchema)
export default revokeTokenModel