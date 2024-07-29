import express from "express"
import {createListing,deleteListing,editListing,getListing,getListings} from "../controllers/listing.controller.js"
import {verifyToken} from "../utills/verifyUser.js" 
const router=express.Router()

router.post("/create",verifyToken,createListing)
router.post("/update/:id",verifyToken,editListing)
router.delete("/delete/:id",verifyToken,deleteListing)
router.get("/get/:id",getListing)
router.get('/get',getListings)
export default router  