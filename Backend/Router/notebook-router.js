const express = require('express');
const router = express.Router()

const NotebookController = require('../Controller/notebook-controller');
const AuthMiddleWare = require('../auth-middleware');

router.route("/folders").post(AuthMiddleWare, NotebookController.addFolder)
router.route("/folders").get(AuthMiddleWare, NotebookController.getALLFolders)
router.route("/folders/:id").put(AuthMiddleWare, NotebookController.updateFolder)
router.route("/folders/:id").delete(AuthMiddleWare, NotebookController.deleteFolder)
router.route('/topicData').put(AuthMiddleWare, NotebookController.addTopicData)

router.route('/topic').post(AuthMiddleWare, NotebookController.addTopic)
router.route('/topic').delete(AuthMiddleWare, NotebookController.deleteTopic)
router.route('/topic').put(AuthMiddleWare, NotebookController.updateTopic)
router.route('/topicsOrder').put(AuthMiddleWare, NotebookController.updateTopicsOrder)


module.exports = router;