const express = require("express")
const { EmployeeModel } = require("../model/employee.model")
const mongoose = require("mongoose")
const { auth } = require("../middleware/auth")
const employeeRouter = express.Router()

employeeRouter.post("/add", auth, async (req, res) => {
    // console.log(req.body)

    try {
            const payload = new EmployeeModel(req.body)
            await payload.save()
            res.status(201).send({ "msg": "Successfully Added" })
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd" })
    }
})

employeeRouter.get("/", auth, async (req, res) => {
    // console.log(req.body)

    try {
        let {page, sortBy, department, search} = req.query;
        const pageSize = 5;

        const query = {}
        if(department) query.department = department;
        if(search) query.firstname= {$regex:search, $option:'i'};
        
        let emp = await EmployeeModel.find(query).sort(sortBy=="salary"?{salary:1}:{}).skip(((page-1)*5)).limit(5)
        res.send({emp})
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd" })
    }
})

employeeRouter.patch("/update/:id", auth, async (req, res) => {
    // console.log(req.body)
    try {
            await EmployeeModel.findByIdAndUpdate(req.params.id, req.body)
            res.status(201).send({ "msg": "Successfully updated" })
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd" })
    }
})

employeeRouter.delete("/delete/:id", auth, async (req, res) => {
    // console.log(req.body)
    try {
            await EmployeeModel.findByIdAndDelete(req.params.id)
            res.status(201).send({ "msg": "Successfully deleted" })
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd" })
    }
})


module.exports = {employeeRouter}