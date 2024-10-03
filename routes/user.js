const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middlewares/user");
const { JWT_SECRET_USER } = require("../config");

const userRouter = Router();

userRouter.post("/signup", async function(req,res){
    const requiredBody = z.object({
        email : z.string().min(8).max(100).email(),
        password : z.string().min(8).max(100),
        firstName : z.string().min(3).max(15),
        lastName : z.string().min(3).max(15)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success) {
        res.json({
            message : "Invalid email or passseord format",
            error : parsedDataWithSuccess.error
        })
        return;
    }

    const { email, password, firstName , lastName} = req.body;
    
    const foundUser = await UserModel.findOne({
        email
    })
    if(foundUser){
        res.json({
            message : "User already exists :("
        })
        return;
    } else {
        const hashedPassword = await bcrypt.hash(password,5);
        await UserModel.create({
            email,
            password : hashedPassword,
            firstName,
            lastName
        })
        res.json({
            meessage : "User created succeessfully!!"
        })
    }
})

userRouter.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await UserModel.findOne({
        email
    })

    if(foundUser) {
        const matchedPassword = await bcrypt.compare(password,foundUser.password);
        if(matchedPassword) {
            const token = jwt.sign({
                email
            },JWT_SECRET_USER)

            res.json({
                token,
                message : "you are logged in :)"
            })
        } else {
            res.json({
                message : "Invalid password :("
            })
        }
        
    } else {
        res.json({
            message : "Invalid email :("
        })
    }
})

userRouter.get("/purchases", userMiddleware, async function(req,res){
    const userId = req.userId;
    const userEmail = userId.email;
     
    const user = await UserModel.findOne({
        email : userEmail
    })

    const course = await CourseModel.find({
        _id : {
            $in : user.purchases
        }
    })

    res.json({
        course
    })
})

userRouter.post("/purchase", userMiddleware, async function(req,res){
    const userId = req.userId;
    const title = req.body.title;
    const userEmail = userId.email;

    const course = await CourseModel.findOne({
        title : title
    })
    
    const user = await UserModel.updateOne({
        email : userEmail
    }, {
        $push : {
            purchases : course._id
        }
    })
    
    res.json({
        message : "Course purchased successfully :)"
    })
})

module.exports = {
    userRouter
}