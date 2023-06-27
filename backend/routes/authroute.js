import express from"express"
const authrouter=express.Router()
import { forgetpasswordcontroller, getallordercontroller, logincontroller, registerController, testcontroller } from "../controllers/authcontrollers.js"
import { isAdmin, requireSign } from "../middlewares/authmiddleware.js"
import { updateprofile } from "../controllers/authcontrollers.js"
import { ordercontroller } from "../controllers/authcontrollers.js"
import { updateorderstatus } from "../controllers/authcontrollers.js"
import { getallusersdetail } from "../controllers/authcontrollers.js"
import { deleteuser } from "../controllers/authcontrollers.js"

authrouter.post("/register",registerController)
authrouter.post("/login",logincontroller)
authrouter.post("/forgotpassword",forgetpasswordcontroller)
authrouter.get('/test',requireSign,isAdmin,testcontroller)
authrouter.get('/user-auth',requireSign,(req,res)=>{
    res.status(200).send({ok:true})
})
authrouter.get('/admin-auth',requireSign,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})
//update profile
authrouter.put("/profile",requireSign,updateprofile)
//orders
authrouter.get("/orders",requireSign,ordercontroller)
//
authrouter.get("/getallorders",requireSign,isAdmin,getallordercontroller)
// order status update
authrouter.put("/updateorderstatus/:orderid",requireSign,isAdmin,updateorderstatus)
///get all user
authrouter.get("/allusers",requireSign,isAdmin,getallusersdetail)
///deleteuser
authrouter.delete("/deleteuser/:id",requireSign,isAdmin,deleteuser)
export default authrouter