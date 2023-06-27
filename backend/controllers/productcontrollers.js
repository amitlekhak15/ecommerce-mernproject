import slugify from "slugify"
import fs from "fs"
import productmodels from "../models/productmodels.js"
import categorymodels from "../models/categorymodels.js"
import ordermodel  from "../models/ordermodel.js"
import braintree from "braintree"
import dotenv from "dotenv";

dotenv.config();


var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "g6bp3tcryjbrz6vw",
  publicKey: "67c2dwsqcd7zpfp4",
  privateKey: "b094ec9ed3072680faeaf923fb4f5a6f",
});

export const createproductcontroller=async(req,res)=>{
    try{
        const{name,slug,description,price,category,quantity,shipping}=req.fields
        const {photo}=req.files
        switch(true){
            case !name:
                return res.status(500).send({err:"Name is Required"})
            case !description:
                return res.status(500).send({err:"Description is Required"})
            case !price:
                return res.status(500).send({err:"Price is Required"})
            case !category:
                return res.status(500).send({err:"category is Required"})
            case !quantity:
                return res.status(500).send({err:"quantity is Required"})
            case photo && photo.size>1000000:
                return res.status(500).send({err:"Photo is Required and should be less then 1mb"})

        }
        const product=new productmodels({...req.fields,slug:slugify(name)})
        if(photo){
            product.photo.data=fs.readFileSync(photo.path)
            product.photo.contentType=photo.type
        }
        await product.save()
        res.status(201).send({succes:true,
        message:"Product created successfully",product})

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"error in creating product",err
        })
    }

}
export const getallproducts=async(req,res)=>{
    try{
        const product=await productmodels.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({success:true,
            message:"All Products",
            product
        })

    }catch(err){
        console.log(err)
        res.status(500).send({success:false,
            message:"error in displaying all products",err:err.message
        })
    }


}
export const getsingleproducts=async(req,res)=>{
    try{
        
        const product=await productmodels.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({success:true,
            message:" Product",
            product
        })

    }catch(err){
        console.log(err)
        res.status(500).send({success:false,
            message:"error in displaying  product",err:err.message
        })
    }


}
export const productphotocontroller=async(req,res)=>{
    try{
        const product=await productmodels.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set("Content-type",product.photo.contentType)
            res.status(200).send(product.photo.data)

        }
       
        

    }catch(err){
        console.log(err)
        res.status(500).send({success:false,
            message:"error in displaying  product photo",err:err.message
        })
    }
}
export const deleteproduct=async(req,res)=>{
        try{
            const product=await productmodels.findByIdAndDelete(req.params.pid).select("-photo")
           
                res.status(200).send({success:true,
                    message:"product deleted",product

                })
    
            
           
            
    
        }catch(err){
            console.log(err)
            res.status(500).send({success:false,
                message:"error in displaying  product photo",err:err.message
            })
        }
    }
    export const updateproductcontroller=async(req,res)=>{
        try{
            const{name,slug,description,price,category,quantity,shipping}=req.fields
            const {photo}=req.files
            switch(true){
                case !name:
                    return res.status(500).send({err:"Name is Required"})
                case !description:
                    return res.status(500).send({err:"Description is Required"})
                case !price:
                    return res.status(500).send({err:"Price is Required"})
                case !category:
                    return res.status(500).send({err:"category is Required"})
                case !quantity:
                    return res.status(500).send({err:"quantity is Required"})
                case photo && photo.size>1000000:
                    return res.status(500).send({err:"Photo is Required and should be less then 1mb"})
    
            }
            const product=await productmodels.findByIdAndUpdate(req.params.pid,{
                ...req.fields,slug:slugify(name)
            },{new :true})
            if(photo){
                product.photo.data=fs.readFileSync(photo.path)
                product.photo.contentType=photo.type
            }
            await product.save()
            res.status(201).send({succes:true,
            message:"Product updated successfully",product})
    
        }catch(err){
            console.log(err)
            res.status(500).send({
                success:false,
                message:"error in updating product",err
            })
        }
    
    }
export const productfilterroute=async(req,res)=>{
    try{
        const {checked,radio}=req.body
        let args={}
        if(checked.length>0) args.category=checked
        if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
        const product=await productmodels.find(args)
        res.status(200).send({success:true,product})

    }catch(err){
        console.log(err)
        res.status(400).send({success:true,
            message:"error while filtering products",err
        })
    }

}
export const productcount=async(req,res)=>{
    try{
        const total=await productmodels.find({}).estimatedDocumentCount()
        res.status(200).send({success:true,total})
    }catch(err){
        console.log(err)
        res.status(400).send({success:true,
            message:"error while filtering products",err
        })


    }

}
//product based on list and page
export const productlistcontroller=async(req,res)=>{
    try{
        const perpage=6
        const page=req.params.page?req.params.page:1
        const products=await productmodels.find({}).select("-photo").skip((page-1)*perpage).limit(perpage).sort({createdAt:-1})
        res.status(200).send({success:true,products})

    }catch(err){
    console.log(err)
        res.status(400).send({success:false,
            message:"error in per page ctrl",err
        })
    }

}
//search product
export const  productsearchcontroller=async(req,res)=>{
    try{
            const{keyword}=req.params
        
        const result=await productmodels.find(
            {$or:[
            {name:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}}

        ]}).select("-photo")
        res.json(result)


    }catch(err){
        console.log(err)
        res.status(400).send({success:false,
            message:"error in search controller",err})

    }

}
//get similar product
export const similarproduct=async(req,res)=>{
    try{
        const{pid,cid}=req.params
        const products=await productmodels.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success:true,products
        })

    }catch(err){

        console.meaasage(err)
        res.status(400).send({success:false,
            message:"failed to load similar product"})

    }
    

}
//category wise product
export const categoryproductcontroller=async(req,res)=>{
    try{
        const category=await categorymodels.findOne({slug:req.params.slug })
        const products=await productmodels.find({category}).populate("category")
        res.status(200).send({
            success:true,category,products
        })

    }catch(err){

        console.meaasage(err)
        res.status(400).send({success:false,
            message:"failed to load category product"})

    }
    

}
///payment//token
export const braintreecontroller=async(req,res)=>{
    try{
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })

    }catch(err){
        console.log(err)
    }

}
export const braintreepaymentcontroller=async(req,res)=>{
    try{
        const{cart,nonce}=req.body
        let total=0
        cart.map((i)=>{total+=i.price})
        let newtransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement:true
            } 
        }
        ,function(err,result){
            if(result){
                const order=new ordermodel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id

                }).save()
                res.json({ok:true})
            }
            else{
                res.status(500).send(err)
            }

        })
        

    }catch(err){
        console.log(error)
    }

}


