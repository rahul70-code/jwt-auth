var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    userRoutes = require('./api/routes/users'),
    postRoutes = require('./api/routes/posts'),
    checkToken = require('./auth');

    require('dotenv').config();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// mongodb
mongoose.connect(process.env.MONGO_URL,
{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true},(err,done)=>{
    if(err) {
        console.log(err)
    } else {
        console.log('connected to JWTAuthDB!')
    }
})

//ROUTES

app.get('/', (req,res)=> {
    res.send('hello world!')
})

app.use('/api/users', userRoutes);
app.use('/api',checkToken,postRoutes);


app.listen(process.env.PORT, ()=>{
    console.log(`server running at ${process.env.PORT}`)
})
