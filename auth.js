var jwt = require('jsonwebtoken');

let checkToken = function(req, res, next){
    let token = req.query.access_token;
    
      if (token) {
        //   console.log(token)
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            console.log(decoded)
          if (err) {
            return res.json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.json({
          success: false,
          message: 'Auth token is not supplied'
        });
      }
      
}

module.exports = {
    checkToken: checkToken
  }

