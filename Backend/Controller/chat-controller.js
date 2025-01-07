const User = require("../Models/UserModel")
const Subject = require("../Models/SubjectModel");
const Message = require("../Models/MessagesModel");
const conversation = require("../Models/convertsationModel");
const { recieverSocketId, io } = require("../socket/socket");




const addFolder = async (req, res) => {
    try {
        const { subjectName, userId } = req.body
        const folder = await Subject.create({ subjectName, createdBy: userId })
        res.status(200).json({ message: "New Folder Created Succesfully", folder })
    } catch (error) {
        console.log(' error in add folder', error)
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
            email: { $ne: "admin@gmail.com" } // Exclude admin@gmail.com
        };


        const response = await User.find().skip(skip).limit(rowSize).select("-password")

        res.status(200).json(response)

    } catch (error) {
        console.log(error)
        res.status(500).send("Some error found")
    }
}


const newChat = async (req, res) => {
    try {
        console.log(req.body, 'teh post converda')
        const senderId = req.body.senderId;
        const recieverId = req.body.recieverId;

        let chats = await conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        }).populate({
            path: "participants",
            select: "-password -profilePic"
        });

        if (!chats) {
            const result = await conversation.create({
                participants: [senderId, recieverId]
            })
        }
        res.status(200).send("Called")
    } catch (error) {
        console.log(error)
        res.status(205).send(error)
    }

}




const getAllChats = async (req, res) => {
    try {
        const senderId = req.userDetail._id;
        let chats = await conversation.find({
            participants: { $in: [senderId] }
        }).populate({
            path: "participants",
            select: "-password -profilePic"
        }).populate('messages');


        res.status(200).send({ message: "result found", chats })

    } catch (error) {
        console.log(error)
        res.status(205).send(error)
    }

}



const SendMessage = async (req, res) => {
    try {
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        const message = req.body.message

        const m1 = await Message.create({ receiverId, senderId, message })

        let chats = await conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: "participants",
            select: "-password -profilePic"
        }).populate('messages');


        if (m1) {
            chats.messages.push(m1)
            await chats.save();
        }


        const reciSocketId = recieverSocketId(receiverId)
        if (reciSocketId)
            io.to(reciSocketId).emit("new-message", m1)

        res.status(200).send({ message: "message send", m1 })
    } catch (error) {
        console.log(error, 'error')
        res.status(205).send(error)
    }
}



module.exports = {
    addFolder, allUsers, SendMessage, newChat, getAllChats
}