
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
dotenv.config()
const app =express()
const port =process.env.PORT;

app.use(cors({
    origin:'https://laughing-pancake-wrj4rj7xjpv62jw-5173.app.github.dev',
    methods:['POST','GET','PUT','DELETE','OPTIONS','ORIGIN','HEAD',],
    allowedHeaders:['Content-Type','Authorization','X-Requested-With','X-Custom-Head','Cookie'],
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO).then(()=>console.log('MOngoDB Connected!'.cyan.bold.underline)).catch(()=>console.log('Mongo error:'.red.bold, error))


app.get('/', (req,res)=>{
    res.send('Server is Running ...')
})
app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`.yellow.bold)
})