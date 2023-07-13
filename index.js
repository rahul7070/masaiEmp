const express = require("express");
const {connection} = require("./db");
const cors = require("cors")
const { userRouter } = require("./routes/user.route");
const { employeeRouter } = require("./routes/employee.route");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res)=>{
    res.send("hello world")
})

app.use(express.json())
app.use(cors())
app.use("/users", userRouter)
app.use("/employee", employeeRouter)

app.listen(7600, async ()=>{
    try {
        await connection;
        console.log(`connection established with 7600`)
    } catch (error) {
        console.log(error)
    }
})