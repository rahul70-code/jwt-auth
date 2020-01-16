var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    userRoutes = require('./api/routes/users')

    require('dotenv').config();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongodb
mongoose.connect('mongodb+srv://travelntrek:alliswell@cluster0-blofl.mongodb.net/JWTAuth?retryWrites=true&w=majority',
{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true},(err,done)=>{
    if(err) {
        console.log(err)
    } else {
        console.log('connected to JWTAuth DB!')
    }
})

//ROUTES
app.use('/user', userRoutes);
// app.get('/api', (req,res)=>{
//     res.send({message:"welcome to the api"});
// });

// app.post('/register', (req, res)=> {

// })


// app.post('/api/posts',verifyToken,(req,res)=> {
//     jwt.verify(req.token, 'secretkey', (err, authData)=> {
//         if(err) {
//             res.sendStatus(403);
//         } else {
//             res.json(
//                 {
//                     message: "new posts....",
//                     authData
//                 })
//         }
//     })
    
// });

// app.post('/api/login',(req, res)=>{
//     const user = {
//         username: "rahul",
//         email: "rahul@gmail.com"
//     };
    
//     jwt.sign({user: user}, 'secretkey', (err, token)=> {
//         res.json({
//             token: token
//         });
//     });
// });

// function verifyToken(req, res, next){
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader != undefined) {
//         var bearer = bearerHeader.split(' ');
//         var bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403);
//         // next()
//     }

// }

app.listen(5000, ()=>{
    console.log('server running at 5000!')
})
