import express from "express"
import dotenv from"dotenv"
import productroutes from "./routes/productroutes.js"
import authrouter from "./routes/authroute.js"
import mongoose from "mongoose"
import morgan from "morgan"
import cors from "cors"
import categoryroute from "./routes/categoryroutes.js"
import connectDB from "./config/db.js";
import path from "path"
connectDB();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

dotenv.config()
const PORT=process.env.PORT||8080
const app=express()

app.use(cors())
app.use(express.json())

app.use(morgan("dev"))
//static file
app.use(express.static(path.join(__dirname,"../client/build")))


app.use("/api/v1/auth",authrouter)
app.use("/api/v1/category",categoryroute)
app.use("/api/v1/products",productroutes)
app.use("*",function(req,res){
res.sendFile(path.join(__dirname,"../client/build/index.html"))
})
app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})
