import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfyzTkEY3Uui9Tnb6aL9XX36iYGrQ_Fiy1KEn98K9ndNPXQCN5t7Tgr-7gl4szcWlhnzU&usqp=CAU"
    },
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User