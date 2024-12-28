const express = require('express');
const router = express.Router()

const chatController = require('../Controller/chat-controller');
const AuthMiddleWare = require('../auth-middleware');

router.route("/folders").post(AuthMiddleWare, chatController.addFolder)
router.route("/users").get(AuthMiddleWare, chatController.allUsers)
router.route("/new-chat").post(AuthMiddleWare, chatController.newChat)
router.route("/all-chats").get(AuthMiddleWare, chatController.getAllChats)
router.route("/send-message").post(AuthMiddleWare, chatController.SendMessage)






module.exports = router;