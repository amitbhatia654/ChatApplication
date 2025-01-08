const User = require("../Models/UserModel")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(203).send('Email or Password is Incorrect!')
        }

        token = jwt.sign({ email: user.email }, process.env.secretKey, { expiresIn: "30d" })
        return res.status(200).json({ message: "Log In succesfully", token, user })
    }

    catch (error) {
        console.log('some error in login');

    }
}

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(203).json("Email already exist")
        }

        const saltRounds = 10;
        const hash_password = await bcrypt.hash(password, saltRounds)
        await User.create({ name, email, phone, password: hash_password })
        res.status(200).json("Registered Succesfully")

    } catch (error) {
        console.log(err, 'err')
        res.status(500).send("Internal Server Error")
    }
}

const allUsers = async (req, res) => {
    try {
        let search = req.query.search
        let rowSize = parseInt(req.query.rowSize) || 6;
        let page = parseInt(req.query.currentPage) || 1; // Default to page 1
        let skip = (page - 1) * rowSize;

        const query = {
            ...search ? { name: { $regex: search, $options: "i" } } : {},
            email: { $ne: "admin@gmail.com1" } // Exclude admin@gmail.com
        };


        const response = await User.find(query).skip(skip).limit(rowSize).select("-password")
        const totalCount = await User.countDocuments(query);

        res.status(200).json({ response, totalCount })

    } catch (error) {
        console.log(error)
        res.status(500).send("Some error found")
    }
}


const getProfileDetails = async (req, res) => {
    try {
        const response = await User.findOne({ _id: req.params.id })
        res.status(200).send(response)

    } catch (error) {
        res.status(203).send("Data Not Found")
    }
}


const updateProfileDetails = async (req, res) => {

    try {
        const response = await User.findByIdAndUpdate(req.body._id, req.body)
        if (req.body.markAdmin) {
            res.status(200).send("User Updated Succesfully")
        }
        else
            res.status(200).send({ data: response, message: "Profile updated succesfully" })

    } catch (error) {
        res.status(203).send("user Not Updated")
    }
}



const deleteUser = async (req, res) => {
    try {
        const deletedEmployee = await User.findOneAndDelete({ _id: req.params.id });
        if (!deletedEmployee) {
            return res.status(404).send({ message: 'user not deleted' });
        }
        res.status(200).send({ message: 'User deleted successfully', data: deletedEmployee });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete employee' });
    }
};




module.exports = {
    login, register,
    allUsers, getProfileDetails, updateProfileDetails, deleteUser
}