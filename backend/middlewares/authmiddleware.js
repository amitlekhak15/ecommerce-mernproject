import JWT from "jsonwebtoken"
import usermodels from "../models/usermodels.js"
const JWT_SECRETE="DMOWFNNFNFONEFNWNDFNFNF"
export  const requireSign=async(req,res,next)=>{
    try{
        const decode=JWT.verify(req.headers.authorization,JWT_SECRETE)
        req.user=decode
        next()

    }catch(err){

        console.log(err)
    }

}
export const isAdmin=async(req,res,next)=>{
    try{
const user=await usermodels.findById(req.user._id)
if(user.role!==1){
    return res.status(401).send({success:false,
    message:"Unauthorized Access"})
}else{
    next()
}
    }catch(err){
        res.status(401).send({success:false,
            err,
            message:"err in Admin middleware"
        })
        console.log(err)
    }

}