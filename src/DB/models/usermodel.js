import mongoose from "mongoose"
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js"

const userSchema = new mongoose.Schema({
    fname:{
        type: String,
        minlength: 2,
        maxlength: 10,
        trim: true
    },
    lname:{
        type: String,
        minlength: 2,
        maxlength: 10,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    age:{
        type: Number,
        minlength: 2,
        maxlength: 10,
        trim: true
    }, role:{
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user,
    },
    gender:{
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.female
    },
    changecrodentiolAt: Date,
    provider:{
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
    },
    isconfermed:{
        type: Boolean,
        default: true
    },
    phone: String,
}, {
})
const userModel = mongoose.model("User", userSchema)
export default userModel