const jwt = require("jsonwebtoken")
const User = require("./Models/UserModel")

const AuthMiddleWare = async (req, res, next) => {
    const token = req.header("authorization")

    if (!token) {
        return res.status(401).send("token is not there")
    }

    const jwtToken = token.replace("Bearer", '').trim();
    try {

        const isVerified = jwt.verify(jwtToken, process.env.secretKey)
        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 })
        req.userDetail = userData
        next();

    } catch (error) {
        return res.status(401).send("Invalid token")
    }

}

module.exports = AuthMiddleWare