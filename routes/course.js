const { Router } = require("express");
const { CourseModel } = require("../db");
const courseRouter = Router();

courseRouter.get("/preview", async function(req,res){
    const course = await CourseModel.find({});
    res.json({
        course 
    })
})

module.exports = {
    courseRouter
}