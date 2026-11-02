require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const todoRoutes = require('./routes/tasks');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tasks', todoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});