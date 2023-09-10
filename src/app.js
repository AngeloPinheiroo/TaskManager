const express = require('express');

require('./db/mongoose'); //connect to database

const userRouter = require('./routers/user'); //require the routes for user endpoints
const taskRouter = require('./routers/task'); //require the routes for task endpoints

const app = express();

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app


