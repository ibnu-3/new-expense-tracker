import express from "express";
import cors from "cors";
import 'dotenv/config'
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import colors from 'colors'

const app =express()
app.use(cors({
    origin:'',
    methods:['POST','GET','PUT','DELETE','OPTIONS','HEAD'],
    allowedHeaders:['Content-Type','Authorization','Origin'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO).then(()=>console.log('MongoDB Connected!'.cyan.bold.underline)).catch(()=>console.log("MongoDB error:".red, error))
const port = process.env.PORT
app.get('/',(req,res)=>{
    res.send('Server running')
})
app.listen(port, ()=>{
    console.log(`Server is running on port:${port}`.yellow.bold)
})