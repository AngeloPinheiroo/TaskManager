const express = require('express');

require('./db/mongoose'); //connect to database

const userRouter = require('./routers/user'); //require the routes for user endpoints
const taskRouter = require('./routers/task'); //require the routes for task endpoints

const app = express();
const port = process.env.PORT;

/* app.use(function(req, res, next){
    if(req.method === 'GET'){
        res.send({message: 'Get requests are disabled'})
    }
    else{
        next()
    }
}) */

/* app.use(function(req, res, next){
    res.status(503).send('Site is currently down. Try again later!')
}) */

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, function(){
    console.log("server is listening on port " + port);
})


