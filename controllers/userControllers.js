const collection = require('../config/collection');
const {USER_COLLECTION,REGISTER_COLLECTION}=require('../config/collection')
const db =require('../config/connection')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken');
const { ObjectId } = require('mongodb');

module.exports={
    signup:async(req,res)=>{
       const {firstName,lastName,email,password}= req.body
       try {

        let userExist=await db.get().collection(collection.USER_COLLECTION).findOne({email:email})
        console.log(userExist);

        if(userExist) return res.status(400).json({ errors: 'User already exists' })

            hashedPassword=await bcrypt.hash(password,10)

            let result = await db.get().collection(collection.USER_COLLECTION).insertOne({firstName,lastName,email,password:hashedPassword})

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({_id:result.insertedId})

            const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: "1h" })

            return res.status(200).json({ user, token })
            
        
           
       } catch (error) {
           return res.status(500).json({err:error.message})

       }
    },
    login:async(req,res)=>{
        const {email,password}=req.body
        console.log('kkkkkkkkk');
        try {
           let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:email}) 

           if(!user) return res.status(400).json({error:"invalid user"})

           let passwordCheck=await bcrypt.compare(password,user.password)

           if(!passwordCheck) return res.status(400).json({error:"invalid user"})

         
               
            let  token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: "1h" })
           
           res.status(200).json({ user, token })
        } catch (error) {
            console.log(error);
            res.status(500).json({error:error.message})
        }
    },
    applyForm:async(req,res)=>{
        try {
            
            let Exist=await db.get().collection(collection.REGISTER_COLLECTION).findOne({CompanyName:req.body.CompanyName})
            if(Exist)return res.status(400).json({error:"Company already exist"})

            let Data=await db.get().collection(collection.REGISTER_COLLECTION).insertOne({...req.body,Status:"New"})

            let SDAta=await db.get().collection(collection.REGISTER_COLLECTION).findOne({_id:ObjectId(Data.insertedId)})
           
            
            return res.status(200).json({ message:"registration success" ,SDAta})
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    }
}