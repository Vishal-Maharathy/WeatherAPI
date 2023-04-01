const express = require('express')
const app = express();
const process = require('dotenv').config()
const home = require('./routes/home')
const apiRouter = require('./routes/api')
const cron = require('node-cron')
const task = require('./controllers/apis/api')
const mongoose = require('mongoose')

app.use('/', home)
app.use('/api', apiRouter)
mongoose.connect('mongodb://localhost:27017/WEATHER',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err=>{console.log(err)})

cron.schedule('0 * * * *',()=>task.tempTask())
// task.tempTask();
app.listen(8000, ()=>{
    console.log("Server is up and running!")
})
