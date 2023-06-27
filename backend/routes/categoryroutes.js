import express from"express"
import { isAdmin, requireSign } from "../middlewares/authmiddleware.js"
import { categorycontroller } from "../controllers/categorycontroller.js"
import { updatecategorycontroller } from "../controllers/categorycontroller.js"
import { showcategorycontroller } from "../controllers/categorycontroller.js"
import { showsinglecategory } from "../controllers/categorycontroller.js"
import { deletecategory } from "../controllers/categorycontroller.js"
const categoryroute=express.Router()
categoryroute.post("/create-category",requireSign,isAdmin,categorycontroller)
categoryroute.put("/update-category/:id",requireSign,isAdmin,updatecategorycontroller)
categoryroute.get("/category",showcategorycontroller)
categoryroute.get("/single-category/:slug",showsinglecategory)
categoryroute.delete("/delete/:id",requireSign,isAdmin,deletecategory)
export default categoryroute