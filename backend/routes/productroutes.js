import express from "express"
import { createproductcontroller, updateproductcontroller } from "../controllers/productcontrollers.js"
import ExpressFormidable from "express-formidable"
import { getallproducts } from "../controllers/productcontrollers.js"
import { getsingleproducts } from "../controllers/productcontrollers.js"
import { productphotocontroller } from "../controllers/productcontrollers.js"
import { deleteproduct } from "../controllers/productcontrollers.js"
import { productfilterroute } from "../controllers/productcontrollers.js"
import { productcount } from "../controllers/productcontrollers.js"
import { productlistcontroller } from "../controllers/productcontrollers.js"
import { productsearchcontroller } from "../controllers/productcontrollers.js"
import { similarproduct } from "../controllers/productcontrollers.js"
import { categoryproductcontroller } from "../controllers/productcontrollers.js"
import { braintreecontroller } from "../controllers/productcontrollers.js"
const router=express.Router()
import { isAdmin, requireSign } from "../middlewares/authmiddleware.js"
import { braintreepaymentcontroller } from "../controllers/productcontrollers.js"
router.post("/create-product",requireSign,isAdmin,ExpressFormidable(),createproductcontroller)
router.get ("/getallproducts",getallproducts)
router.get ("/getallproducts/:slug",getsingleproducts)
router.get("/productphoto/:pid",productphotocontroller)
router.delete("/deleteproduct/:pid",deleteproduct)
router.put("/update-product/:pid",requireSign,isAdmin,ExpressFormidable(),updateproductcontroller)
//filer route
router.post("/product-filters",productfilterroute)
//count product
router.get("/product-count",productcount)
//product by page
router.get("/product-list/:page",productlistcontroller)
//search product 
router .get("/search/:keyword",productsearchcontroller)
//similar product
router.get("/similarproduct/:pid/:cid",similarproduct)
//product by category
router.get("/categoryproduct/:slug",categoryproductcontroller)
//payments route
//token
router.get("/braintree/token",braintreecontroller)
//payments
router.post("/braintree/payment",requireSign,braintreepaymentcontroller)


export default router