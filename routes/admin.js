const { Router } = require("express");
const { AdminModel, CourseModel } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middlewares/admin");
const { JWT_SECRET_ADMIN } = require("../config");

const adminRouter = Router();

adminRouter.post("/signup", async function(req,res){
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

    const foundAdmin = await AdminModel.findOne({
        email
    })
    if(foundAdmin){
        res.json({
            message : "Admin already exists :("
        })
        return;
    } else {
        const hashedPassword = await bcrypt.hash(password,5);
        await AdminModel.create({
            email,
            password : hashedPassword,
            firstName,
            lastName
        })
        res.json({
            meessage : "Admin created succeessfully!!"
        })
    }

})

adminRouter.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const foundAdmin = await AdminModel.findOne({
        email
    })

    if(foundAdmin) {
        const matchedPassword = await bcrypt.compare(password,foundAdmin.password);
        if(matchedPassword) {
            const token = jwt.sign({
                email
            },JWT_SECRET_ADMIN)

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

adminRouter.post("/course", adminMiddleware , async function(req,res){
    const adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    const adminEmail = adminId.email;

    const creator = await AdminModel.findOne({
        email : adminEmail
    })
    console.log(creator._id);
    const course = await CourseModel.create({
        title,
        description,
        price,
        imageUrl,
        adminId : creator._id
    })

    res.json({
        message : " Course created successfully :)",
        courseId : course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const adminEmail = adminId.email;

    const creator = await AdminModel.findOne({
        email : adminEmail
    })
    try {
        const course = await CourseModel.updateOne({
            _id: courseId,
            adminId : creator._id
        }, {
            title,
            description,
            price,
            imageUrl
        })
        res.json({
            message : " Course details updated successfully :)"
        })
    } catch(e){
         res.json({
            message : "you are not admin of the course :("
        })
        return;
    }
    
    
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req,res){
    const course = await CourseModel.find({});
    res.json({
        course 
    })
})

module.exports = {
    adminRouter,
}