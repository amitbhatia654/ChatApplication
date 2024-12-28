const mongoose = require("mongoose")

const EmployeeSchema = new mongoose.Schema({
    empName: {
        type: String, require: true
    },
    empEmail: {
        type: String, require: true
    },
    empPhone: {
        type: Number, require: true
    },
    empDepartment: {
        type: String, require: true
    },
    empAddress: {
        type: String, require: true
    },
    createdBy: {
        type: String, require: true
    }
})

const Employee = new mongoose.model("Employee", EmployeeSchema)
module.exports = Employee