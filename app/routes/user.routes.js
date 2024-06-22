const authJwt = require("../middleware/authJwt");
const userController = require('../controllers/user.controller');
module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
      app.post("/api/auth/signup", userController.signup);
      app.post("/api/auth/signIn", userController.signIn);
      app.get("/api/user/details",[authJwt.verifyToken,], userController.getDetails);

};