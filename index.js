require("dotenv").config();
const express = require("express");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");

const app = express();

app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

app.listen(3000);  