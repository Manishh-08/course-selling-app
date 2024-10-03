const mongoose = require("mongoose");
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}
main();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User = new Schema({
    email : { type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
    purchases : [ ObjectId ]
})

const Admin = new Schema({
    email : { type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String
})

const Course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    adminId : ObjectId
})

const Purchase = new Schema({
    courseId : ObjectId,
    transactionId : String,
    userId : ObjectId
})

const UserModel = mongoose.model("User",User);
const AdminModel = mongoose.model("Admin",Admin);
const CourseModel = mongoose.model("Course",Course);
const PurchaseModel = mongoose.model("Purchase",Purchase);

module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}