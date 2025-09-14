import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import colors from 'colors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'https://potential-space-halibut-x5q45qwxqqv7cp4v4-5173.app.github.dev',
    allowedHeaders:['Content-Type','Authorization','Origin','X-Requested-With',],
    methods:['HEAD','OPTIONS','GET','POST','DELETE','PUT','PATCH'],
    credentials: true, // Important for cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
.then(() => console.log('MongoDB connected'.cyan.bold.underline))
.catch(err => console.error('MongoDB connection error:'.red.bold, err));
app.get('/',(req,res)=>{
    res.send('hello dev')
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow.bold.underline);
});