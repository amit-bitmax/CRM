const Task = require('../models/Task');
//------------------< create task >------------------//
exports.createTask = async (req, res) => {
    const adminId=req.user?.id;
    try {
        const { title,description } = req.body;
        const image = req.file ? req.file.filename : "not available";

        const newTask = await Task.create({
            adminId:adminId,
            title,
            description,
            image,
        });

        return res.status(201).json({ message: 'Task created successfully!', status: true, data: newTask });

    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// all task
exports.getAll = async (req, res) => {
    try {
        const tasks = await Task.find({});
        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found', status: false });
        }
        return res.status(200).json({ message: 'tasks fetched successfully', status: true, data: tasks});
    } catch (error) {
        console.error('Error fetching authors:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// update task
exports.singleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params?.id);
        if (!task) {
            return res.status(404).json({ message: 'User not found', status: false });
        }
        return res.status(200).json({ message: 'Task fetched successfully', status: true, data: task });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// update task
exports.updatedTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params?.id);
        if (!task) {
            return res.status(404).json({ message: "User not found", status: false });
        }

        const { title,description } = req.body;
        const image = req.file?.filename;
        task.title = title || task.title;
        task.description = description || task.description;
        if (image) task.image = image;

        await task.save();

        return res.status(200).json({ message: "Task updated successfully", status: true, data: task });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal Server Error', status: false });
    }
};

// delete task
exports.deleteTask = async (req, res) => {
    try {
        // Check if requester is Admin
        if (req.user?.role !== "Admin") {
            return res.status(403).json({ message: "Only Admins can delete authors", status: false });
        }

        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "User not found", status: false });
        }

        return res.status(200).json({ message: "User deleted successfully", status: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal Server Error", status: false });
    }
};
