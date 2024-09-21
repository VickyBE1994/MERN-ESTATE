import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
//import cors from "cors"
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter  from "./routes/listing.route.js"

dotenv.config()


const app = express()
app.use(express.json())
// app.use(cors())
app.use(cookieParser())


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to mongoDb");
    
}).catch((error)=>{
console.log(error);

})

app.listen(8000,()=>{
    console.log('server listning port 8000');
    
})

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        succuss:false,
        statusCode,
        message,
    })
})