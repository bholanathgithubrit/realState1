import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utills/error.js"
import jwt from "jsonwebtoken"

export const signup=async (req,res,next)=>{
    // console.log(req.body)
    const {username,email,password}=req.body   
    const hashpassword=bcryptjs.hashSync(password,10)
    const newuser=new User({username,email,password:hashpassword})
    try{
        if(username){ 
            if(email){
                if(hashpassword){
                    await newuser.save()
                    res.status(201).json("user created successfully")
                }
                else{
                    next(errorHandler(500,"Enter password as required"))
                }
            }
            else{
                next(errorHandler(500,"Please enter a valid email"))
            }
        }
        else{
            next(errorHandler(500,"Please provide User-name"))
        }
    } 
    catch(err){ 
        next(errorHandler(500,"User already exists"))
    }
    
}
export const signin=async (req,res,next)=>{
    const {email,password}=req.body   
    try{ 
        if(!email)return next(errorHandler( 404,"enter your email"))
        if(!password)return next(errorHandler( 404,"enter your password"))

                const validUser=await User.findOne({email})
                if(!validUser){
                    return next(errorHandler( 404,"email does not exists"))
                }
                const validpassword=bcryptjs.compareSync(password,validUser.password)
                if(!validpassword)return next(errorHandler( 404,"Password is wrong"))
                const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
                const {password:pass,...rest}=validUser._doc
                res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
                //we can use that ,expires:new Date for expire period of cookie
    }
    catch(err){ 
        next(errorHandler(500,"User Not exists"))
    }
    
}
export const google=async (req,res,next)=>{
    try{
        const user =await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password:pass,...rest}=user._doc
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
        else{
            const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashPassword=bcryptjs.hashSync(generatePassword,10)
            const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashPassword,avatar:req.body.photo})
            await newUser.save()
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password:pass,...rest}=newUser._doc
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
    }
    catch(err){
        next(err)
    }
}

export const signOut=async (req,res,next)=>{
    try{
        res.clearCookie('access_token')
        res.json({ message: 'User has been Logged out' }, 200)
    }
    catch(error){
        nextTick(error)
    }
}