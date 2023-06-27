import slugify from "slugify"
import categorymodels from "../models/categorymodels.js"

export const categorycontroller=async(req,res)=>{
    try{
        const{name}=req.body
        if(!name){
             return res.status(401).send({
                message:"Name is required"
             })
        }
        const existingcategory=await categorymodels.findOne({name})
        if(existingcategory){
            return res.status(200).send({
                success:true,
                message:"Category already exist"
            })
        }
        const category=await  new categorymodels({name,slug:slugify(name)}).save()
    res.status(201).send({success:true,
    meassage:"new category created",
    category
})
        
    }catch(err){
        console.log(err)
        req.status(500).send({
            success:false,
            message:"error in category",
            err
        })

    }
}
export const updatecategorycontroller=async(req,res)=>{
    try{
        const{name}=req.body
        const{id}=req.params
        const category=await categorymodels.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:" updated category",
            category
        })

       
    }catch(err){
        console.log(err)
        res.status(err).send({success:false,err,
            message:"error while updatig category "
        })

    }
}
export const showcategorycontroller=async(req,res)=>{
    try{
        const category=await categorymodels.find({})
        res.status(200).send({
            success:true,
            message:"All categories list",
            category
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            meassage:'Error while getting all categories'
        })
    }

}
export const showsinglecategory=async(req,res)=>{
    try{
        const category=await categorymodels.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"got  categories ",
            category
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:'Error while getting current category'
        })
    }

}
export const deletecategory=async(req,res)=>{
    try{
        const{id}=req.params
        const category=await categorymodels.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"  delete categories ",
            category
        })

    }catch(err){
        console.log(err) 
        res.status(500).send({
            success:false,
            err,
            message:'Error while deleting current category'
        })
    }

}
