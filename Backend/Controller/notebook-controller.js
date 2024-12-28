const User = require("../Models/UserModel")
const Subject = require("../Models/SubjectModel");
const Topic = require("../Models/topicModel");




const addFolder = async (req, res) => {
    try {
        const { subjectName, userId } = req.body
        const folder = await Subject.create({ subjectName, createdBy: userId })
        res.status(200).json({ message: "New Folder Created Succesfully", folder })
    } catch (error) {
        console.log(' error in add folder', error)
    }
}


const getALLFolders = async (req, res) => {
    try {
        let search = req.query.search
        const createdBy = req.query.userId

        const query = search
            ? { createdBy, subjectName: { $regex: search, $options: "i" } }
            : { createdBy };

        const response = await Subject.find(query)

        res.status(200).json({ response })

    } catch (error) {
        res.status(205).send("data not found")
    }
}


const updateFolder = async (req, res) => {
    try {
        const response = await Subject.findByIdAndUpdate(req.body._id, req.body)
        res.status(200).json({ message: "folder updated succesfully" })

    } catch (error) {
        res.status(203).send("folder Not Updated")
    }
}



const deleteFolder = async (req, res) => {
    try {
        const deletedSubject = await Subject.findOneAndDelete({ _id: req.params.id });
        if (!deletedSubject) {
            return res.status(404).send({ message: 'Employee not deleted' });
        }
        res.status(200).send({ message: 'folder deleted successfully', data: deletedSubject });

    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).send({ message: 'Failed to delete folder' });
    }
}





const addTopic = async (req, res) => {
    try {
        const subject = await Subject.findById(req.body.selectedFolder._id);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }
        const newTopic = {
            title: req.body.title,

        };
        subject.topics.push(newTopic);

        // Save the updated subject
        await subject.save();

        res.status(200).json({
            message: "Topic added successfully",
            subject,
        });
    } catch (error) {
        console.log(' error in add subject', error)
    }
}


const deleteTopic = async (req, res) => {
    try {
        const { folderId, topicId } = req.body;


        // Find the folder by ID
        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Find the index of the topic to delete
        const topicIndex = subject.topics.findIndex((topic) => topic._id.toString() === topicId);
        if (topicIndex === -1) {
            return res.status(404).json({ message: "Topic not found in the folder" });
        }

        // Remove the topic from the array
        subject.topics.splice(topicIndex, 1);

        // Save the updated subject
        await subject.save();

        res.status(200).json({
            message: "Topic deleted successfully",
            subject,
        });
    } catch (error) {
        res.status(205).json({ message: "Topic Not Deleted" })
    }
}





const addTopicData = async (req, res) => {
    try {
        const { description, topicId, folderId } = req.body; // Destructure request body

        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const topic = subject.topics.find((t) => t._id.toString() == topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        topic.description = description;
        await subject.save();

        res.status(200).json({
            message: "Topic description updated successfully",
            updatedTopic: topic,
        });
    } catch (error) {
        console.log(' error in add subject', error)
    }
}

const updateTopic = async (req, res) => {
    try {
        const { title, topicId, folderId } = req.body; // Destructure request body

        const subject = await Subject.findById(folderId);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const topic = subject.topics.find((t) => t._id.toString() == topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        topic.title = title;
        await subject.save();

        res.status(200).json({
            message: "Topic updated successfully",
            subject: subject,
        });

    } catch (error) {
        res.status(205).send("Topic Not Updated")
    }
}


const updateTopicsOrder = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate({ _id: req.body._id }, req.body);
        if (!subject) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.status(200).json({
            message: "Topics Order Updated successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Order Not Updated",
        });
    }
}


module.exports = {
    addFolder, getALLFolders,
    deleteFolder, updateFolder, addTopic, addTopicData,
    deleteTopic, updateTopic, updateTopicsOrder
}