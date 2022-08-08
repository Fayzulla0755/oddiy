const express=require('express')
const User=require('../models/user')
const bcrypt=require('bcryptjs')
const {check,validationResult}=require('express-validator')
const config=require('../config/default.json')
const jwt=require('jsonwebtoken')
const router=express.Router()


// /api/auth/register
router.post(
    '/register',
[
    check('email','Hato email').isEmail(),
    check('password','Minimla parol uzunligi 6ta simvoldan iborat').isLength({min:6})
]
, async (req,res)=>{
    try{
        const error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({
                errors:error.array(),
                massage:'Malumotlarni hato kiritingiz'
            })
        }

        const {email, password}=req.body
        const condidate= await User.findOne({email})

        if(condidate){
           return res.status(400).json( {massage:'Bunday foydalanuvchi mavjud !!'})
        }

        const hashPassword=await bcrypt.hash(password,12)
        const userdb=new User({email,password:hashPassword})
        await userdb.save()
        res.status(201).json({massage:'Foydalanuchi yaratildi '})


    }catch (e){
        res.status(500).json({massage:'nimadur hatto qaytadan uruning'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email','Emaiulni hato kiritingiz').normalizeEmail().isEmail(),
        check('password', "parolni hato kiritingiz").exists()
    ],
    async (req,res)=>{
        try{
            const error=validationResult(req)
            if(!error.isEmpty()){
                return res.status(400).json({
                    errors:error.array(),
                    massage:'Login yoki parolni hato kiritingiz'
                })
            }

            const{email,password}=req.body
            const user= await User.findOne({email})
            if(!user){
                return res.status(400).json({massage:' Bunday foydalanuvchi mavjud emas'})
            }

            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({massage:'parolni notogri kiritingiz, boshqattan urinib koring'})
            }
             
            const token=jwt.sign(
                { user:user.id},
                config.get('jwtSecret'),
                {expiresIn:'1h'}

            )
                res.json({token,userId:user.id})
            


        }catch (e){
            res.status(500).json({massage:'nimadur hatto qaytadan uruning'})
        }


})

module.exports=router