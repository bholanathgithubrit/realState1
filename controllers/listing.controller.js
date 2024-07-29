import {Listing} from "../models/listing.model.js"
import { errorHandler } from "../utills/error.js"
export const createListing=async (req,res,next)=>{
    try{
        const listing=await Listing.create(req.body)
        return res.status(201).json(listing)
    }
    catch(error){
        next(error)
    }
}
export const deleteListing=async (req,res,next)=>{
    
        const delete_listing=await Listing.findById(req.params.id)
        if(!delete_listing){
            return next(errorHandler(404,"Listing not found"))
        }
        if(req.user.id!==delete_listing.userRef){
            return next(errorHandler(401,"Unauthorize User"))
        }
    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(201).json("Listing has been deleted")
    }
    catch(error){
        next(errorHandler(401,"Delete Operation Can not Performed"))
    }
}

export const editListing= async (req,res,next)=>{
    const edit_listing=await Listing.findById(req.params.id)
    if(!edit_listing){
        return next(errorHandler(401,"Listing Does not found"))
    }
    if(req.user.id!==edit_listing.userRef){
        return next(errorHandler(401,"You can not edit Other Listing"))
    }
    try{
        const updateListing=await Listing.findByIdAndUpdate(req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json(updateListing)
    }
    catch(error){
        next(errorHandler(401,"Listing does not delete"))
    }
}
export const getListing=async (req,res,next)=>{
    try{
        const listing=await Listing.findById(req.params.id)
        if(!listing){
            return next(401,"Listing does not found")
        }
        res.status(200).json(listing)
    }
    catch(error){
        next(error)
    }
}
export const getListings=async (req,res,next)=>{
    try{
         const limit=parseInt(req.query.limit)||4
         const startIndex=parseInt(req.query.startIndex) || 0
         let offer=req.query.offer 
         if(offer===undefined ||offer==='false'){
            offer={$in:[false,true]}
         }
         let furnished=req.query.furnished
         if(furnished===undefined || furnished==='false'){
            furnished={$in:[false,true]}
         }
        let parking=req.query.parking
        if(parking===undefined || parking==='false'){
            parking={$in:[true,false]}
        } 
        let type=req.query.type 
        if(type==='all' ||type===undefined){
            type={$in:['sale','rent']}
        }
        const searchTerm=req.query.searchTerm || ""
        const sort=req.query.sort || 'createdAt'
        const order=req.query.order || 'desc'
        const listings=await Listing.find({
            name:{$regex:searchTerm,$options:'i'},
            offer,
            furnished,
            parking,
            type
        }).sort({[sort]:order}).limit(limit).skip(startIndex)
        console.log(req.query,listings)
        return res.status(200).json(listings)
    }
    catch(error){
        next(error)
    }  
}