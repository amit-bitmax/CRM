require('dotenv').config();
const express = require('express');
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes=require("./src/routes/taskRoutes");
const connectDB=require('./src/config/connect');

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/task',taskRoutes);

app.get('/', (req, res) => {
        res.send("server is live !");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
