import { comparePassword, hashedpassword } from "../helpers/authhelper.js"
import usermodels from "../models/usermodels.js"
import ordermodel from "../models/ordermodel.js"
import JWT from "jsonwebtoken"
const JWT_SECRETE="DMOWFNNFNFONEFNWNDFNFNF"
export const registerController=async(req,res)=>{
    try{
const{name,email,password,phone,address,answer}=req.body
if(!name){
    return res.send({error:"Name is required"})
}
if(!email){
    return res.send({error:"Email is required"})

}
if(!password){
    return res.send({error:"password is required"})

}
if(!phone){
    return res.send({error:"Phone no is required"})

}
if(!address){
    return res.send({error:"address is required"})

}
const existinguser=await usermodels.findOne({email})
if(existinguser){
    return res.status(200).send({
        success:true,
        maessage:"User already exist please login"
    })
}
const hashpassword =await hashedpassword(password)
const user= await new usermodels({name,email,phone,address,password:hashpassword,answer}).save()
res.status(201).send({
    success:true,
    message:"user registered successfully",
    user
})




    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Error in registration",
            err
        })

    }


}
export const logincontroller=async(req,res)=>{
try{
    const {email,password}=req.body
    if(!email ||!password){
        return res.status(404).send({
            success:false,
            message:"Invalid email or password"
        })
    }
    const user=await usermodels.findOne({email})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"User not Registerd"
        })
    }
    const match=await comparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:"Invalid Password"
        })
    }
    const token=await JWT.sign({_id:user._id},JWT_SECRETE,{expiresIn:"7d"})
    res.status(200).send({
        success:true,
        message:"login successfull",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role
        },token
    })

}catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        message:"err in login",err
    })
}
     
}
export  const forgetpasswordcontroller=async(req,res )=>{
    try{
        const {email,answer,newpassword}=req.body
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"answer is required"})
        }
        if(!newpassword){
            res.status(400).send({message:"password is required"})
        }

    const user= await usermodels.findOne({email,answer})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"wrong email or answer"
        })
    }
    
    const hashpassword =await hashedpassword(newpassword)
    await usermodels.findByIdAndUpdate(user._id,{password:hashpassword})
    res.status(200).send({
        success:true,
        message:"password reset successfully"
    })

    }catch(err){
        res.status(500).send({
            success:false,
            message:"something went wrong",
            err
        })
    }



}
export const testcontroller=(req,res)=>{
    res.send("protected routes")
}
//update profile
export  const updateprofile=async(req,res)=>{
    try{
        const{name ,password,address,phone}=req.body
        const user=await usermodels.findById(req.user._id)
        //password
        if(!password&&password.length<6){
            return res.json({error:"Password is required and 6charcter long"})
        }
        const hashpassword =password?await hashedpassword(password):undefined

      const updateduser=await usermodels.findByIdAndUpdate(req.user._id,{
        name:name||user.name,
        password:hashpassword||user.password,
        address:address||user.address,
        phone:phone||user.phone

      },{new:true})
      res.status(200).send({success:true,
        message:"profile updated",updateduser

      })

    }catch(err){
        console.log(err)
        res.status(400).send({
            success:false,
            message:"failed to update profile",err
            
        })
    }
}
//orders
export const ordercontroller=async(req,res)=>{
    try{
        const orders=await ordermodel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders);
    

}catch(err){
        console.log(err)
        res.status(500).send({success:false,
        message:"failed to fetch your orders",err})
    }

}
export const getallordercontroller=async(req,res)=>{
    try{
        const orders=await ordermodel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"})
        res.json(orders);
    

}catch(err){
        console.log(err)
        res.status(500).send({success:false,
        message:"failed to fetch all orders",err})
    }

}
//updateorder status
export const updateorderstatus=async(req,res)=>{
    try{
        const {orderid}=req.params
        const{status}=req.body
        const orders=await ordermodel.findByIdAndUpdate(orderid,{status},{new:true})
        res.json(orders)

    }catch(err){
        console.log(err)
        res.status(500).send({success:false,
        message:"failed to update status of orders orders",err})

    }
}
//get allusers
export const getallusersdetail=async(req,res)=>{
    try{
        const users=await usermodels.find({})
        res.status(201).send({
            success:true,
            meassage:"all user detail",users
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            meaasage:"err in fetching user detail",
            err
        })
    }
}
//deleteuser
export const deleteuser=async(req,res)=>{
    try{
        const{id}=req.params
        const user=await usermodels.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"  user deleted ",
            user
        })

    }catch(err){
        console.log(err) 
        res.status(500).send({
            success:false,
            err,
            message:'Error while deleting user'
        })
    }

}
    
